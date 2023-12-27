import { IDBCollection, SearchCondition, UpdateData } from "@app/adapters/IDB";
import { accountCollection } from "@app/db";
import { Account } from "@app/stores";
import { NewAccount } from "./types";

class AccountService {
  constructor (private collection: IDBCollection<Account>) { }

  create(account: NewAccount) {
    return this.collection.create(account);
  }

  getUserAccounts(user: number) {
    return this.collection.queryAll({ user });
  }

  update(id: SearchCondition<Account>, data: UpdateData<Account>) {
    return this.collection.update(id, data);
  }

  delete(id: number) {
    return this.collection.delete(id);
  }

  getById(id: number, user: number) {
    return this.collection.queryOne({ id, user });
  }
}

export const accountService = new AccountService(accountCollection);
