import * as yup from "yup";
import { CurrencyCode } from "@app/entities";
import { t } from "@app/i18n";
import { authService, currencyService } from "@app/services";
import {
  MIN_FIRST_NAME_LENGTH,
  MIN_LAST_NAME_LENGTH,
  MIN_PASSWORD_LENGTH
} from "./constants";

export type SignUpForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  primaryCurrency: CurrencyCode;
}

export function getSignUpFormSchema(): yup.Schema<SignUpForm> {
  return yup.object({
    firstName: yup.string()
      .required(t("common.FormFields.required"))
      .min(MIN_FIRST_NAME_LENGTH, t("common.FormFields.tooShort", undefined, { count: MIN_FIRST_NAME_LENGTH })),
    lastName: yup.string()
      .required(t("common.FormFields.required"))
      .min(MIN_LAST_NAME_LENGTH, t("common.FormFields.tooShort", undefined, { count: MIN_LAST_NAME_LENGTH })),
    email: yup.string()
      .required(t("common.FormFields.required"))
      .email(t("AuthScreen.FormFields.Email.invalidFormat"))
      .test("unique", t("AuthScreen.FormFields.Email.notUnique"), async (value) => {
        if (!value) return true;
        return !(await authService.userExist(value))
      }),
    password: yup.string()
      .required(t("common.FormFields.required"))
      .min(MIN_PASSWORD_LENGTH, t("common.FormFields.tooShort", undefined, { count: MIN_PASSWORD_LENGTH })),
    primaryCurrency: yup.string()
      .oneOf(currencyService.availableCurrencyCodes)
      .default(currencyService.defaultCurrency)
  });
}
