import { CreatedRecord, Structure, SearchCondition, UpdateData } from "./types";

/** Wrapper for IndexedDB */
export class IDBAdapter {
  constructor(private structure: Structure) { }

  async queryAll<T>(
    collection: string,
    condition?: SearchCondition
  ): Promise<T[]> {
    const db = await this.openDbConnection();
    const transaction = db.transaction(collection, "readonly");
    const objectStore = transaction.objectStore(collection);

    return new Promise((resolve, reject) => {
      let getRequest: IDBRequest<T[]>;
      if (Array.isArray(condition)) {
        const accessor = Array.isArray(condition[0]) ? condition[0].join(', ') : condition[0];
        getRequest = objectStore.index(accessor).getAll(condition[1]);
      } else {
        getRequest = objectStore.getAll(condition ? IDBKeyRange.only(condition) : undefined);
      }

      getRequest.onsuccess = () => {
        const result = getRequest.result as T[];
        db.close();
        resolve(result);
      }

      getRequest.onerror = () => {
        const error = getRequest.error;
        db.close();
        reject(error);
      }
    });
  }

  async queryOne<T>(collection: string, condition: SearchCondition): Promise<T | null> {
    const result = await this.queryAll<T>(collection, condition);
    return result[0] ?? null;
  }
  
  async update<T>(
    collection: string,
    condition: SearchCondition,
    updateData: UpdateData<T>
  ) {
    const db = await this.openDbConnection();
    const transaction = db.transaction(collection, "readwrite");
    const objectStore = transaction.objectStore(collection);

    return new Promise((resolve, reject) => {
      let getRequest: IDBRequest<T[]>;
      if (Array.isArray(condition)) {
        const accessor = Array.isArray(condition[0]) ? condition[0].join(', ') : condition[0];
        getRequest = objectStore.index(accessor).getAll(condition[1]);
      } else {
        getRequest = objectStore.getAll(condition ? IDBKeyRange.only(condition) : undefined);
      }

      getRequest.onsuccess = () => {
        const result = getRequest.result as T[];

        const promises = result.reduce((acc, val) => {
          const updatedData = typeof updateData === "function"
            ? updateData(val)
            : { ...val, ...updateData };
          return acc.then(() => this.updateRecord(objectStore, updatedData))
        }, Promise.resolve() as Promise<any>);
        
        promises.then(() => {
          db.close();
          resolve("Affected rows: " + result.length);
        });
      }

      getRequest.onerror = () => {
        const error = getRequest.error;
        db.close();
        reject(error);
      }
    });
  }

  async create<T>(collection: string, data: T): CreatedRecord<T> {
    const db = await this.openDbConnection();
    const transaction = db.transaction(collection, "readwrite");
    const objectStore = transaction.objectStore(collection);

    return new Promise((resolve, reject) => {
      const request = objectStore.add(data);

      request.addEventListener("success", () => {
        const id = request.result as number;
        db.close();
        resolve({ id, ...data });
      });

      request.addEventListener("error", () => {
        const error = request.error;
        db.close();
        reject(error);
      });
    })
  }

  private async openDbConnection(): Promise<IDBDatabase> {
    const openOrCreateDB = window.indexedDB.open(this.structure.name, this.structure.version);

    return new Promise((res, rej) => {
      openOrCreateDB.addEventListener("success", () => {
        const db = openOrCreateDB.result;
        res(db);
      });
      
      openOrCreateDB.addEventListener("upgradeneeded", (event) => {
        const db = openOrCreateDB.result;
      
        db.onerror = () => {
          rej("Error loading database.")
        };
      
        this.structure.collections.forEach(tableData => {
          let table: IDBObjectStore
          if (tableData.version > event.oldVersion) {
            table = db.createObjectStore(tableData.name, tableData.config);
          } else {
            const target = event.target as IDBOpenDBRequest;
            table = target!.transaction!.objectStore(tableData.name) as IDBObjectStore;
          }
          tableData.fields.forEach(field => {
            if (field.version > event.oldVersion) {
              table.createIndex(field.key, field.key, { unique: field.unique });
            }
          });
          tableData.complexIndices?.forEach(({ fields, unique, version }) => {
            if (version > event.oldVersion) {
              table.createIndex(fields.join(", "), fields, { unique })
            }
          });
        });
      });
    })
  }

  public async delete(collection: string, id: number | string) {
    const db = await this.openDbConnection();
    const transaction = db.transaction(collection, "readwrite");

    return new Promise((resolve) => {
      transaction.objectStore(collection).delete(id);
  
      transaction.addEventListener("complete", () => {
        db.close();
        resolve("Deleted successfully")
      });

      transaction.addEventListener("error", () => {
        db.close();
        console.error("Can not delete record #", id);
      });
    });
  }

  private async updateRecord<T>(objectStore: IDBObjectStore, data: T): Promise<T> {
    return new Promise((resolve) => {
      const updateRequest = objectStore.put(data);

      updateRequest.addEventListener("success", () => {
        resolve(data);
      });

      updateRequest.addEventListener("error", () => {
        // TODO: Prettify error message
        console.error("Can not update record");
      });
    });
  }
}
