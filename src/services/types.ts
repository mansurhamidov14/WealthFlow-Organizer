import type { Currency, CurrencyCode } from "@app/entities";
import { Task, Transaction, User } from "@app/stores";
import { IconTypes } from "solid-icons";

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
}

export type AuthResponse = TokenResponse & {
  user: User;
}

export type CreationRequestData<T> = Omit<T, "id" | "createdAt" | "updatedAt">;
export type NewTransaction = CreationRequestData<Transaction>;
export type NewTask = CreationRequestData<Task>;

export type Currencies = Record<CurrencyCode, Currency>;

export type CurrencyRates = Record<CurrencyCode, number>;
export type OptionalCurrencyRates = Partial<CurrencyRates>;

export type CachedCurrencyRates = {
  [key: string]: OptionalCurrencyRates;
}

export type CurrencyRatesResponse = {
  from: CurrencyCode;
  to: CurrencyCode;
  result: number;
}[];

export type CachedData = {
  currencyRates: CachedCurrencyRates;
}

export type ClientDataResponse = {
  ip: string;
  currency: CurrencyCode;
  country_code: string;
  country_name: string;
  city: string;
  timezone: string;
}

export type CategoryId =
  | "market"
  | "utility"
  | "education"
  | "entertainment"
  | "health"
  | "beauty"
  | "clothing"
  | "electronics"
  | "restaurant"
  | "transfer"
  | "transport"
  | "travel"
  | "gift"
  | "transferBetweenAccounts"
  | "other";

export type Category = {
  id: CategoryId,
  icon: IconTypes,
  colors: {
    accent: string;
    icon: string;
  }
}

export type Skin = {
  id: string;
  image: string;
}

export type HttpParseMode = keyof Pick<Response, 'arrayBuffer' | 'blob' | 'text' | 'json'>;
export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "OPTIONS";
export type HttpRequestBody = BodyInit | null | undefined;
export type HttpResponse<T> = { status: number; data: T};
export type HttpError = { status: number, message: string; };
export type HttpRequestOptions = {
  headers?: HeadersInit;
  parseMode: HttpParseMode;
}

export type ClientServiceEvent = "connectionSuccess" | "connectionError";
export type ClientServiceEventHandler = () => void;
