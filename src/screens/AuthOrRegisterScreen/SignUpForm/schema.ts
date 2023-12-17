import * as yup from 'yup';
import { SignUpForm } from './types';
import { t } from '@app/i18n';
import { MIN_FIRST_NAME_LENGTH, MIN_LAST_NAME_LENGTH, MIN_PASSWORD_LENGTH } from './constants';
import { userService } from '@app/services';


export const signUpFormSchema: yup.Schema<SignUpForm> = yup.object({
  firstName: yup.string()
    .required(t("AuthScreen.FormFields.common.required"))
    .min(MIN_FIRST_NAME_LENGTH, t("AuthScreen.FormFields.common.tooShort", undefined, { count: MIN_FIRST_NAME_LENGTH })),
  lastName: yup.string()
    .required(t("AuthScreen.FormFields.common.required"))
    .min(MIN_LAST_NAME_LENGTH, t("AuthScreen.FormFields.common.tooShort", undefined, { count: MIN_LAST_NAME_LENGTH })),
  email: yup.string()
    .required(t("AuthScreen.FormFields.common.required"))
    .email(t("AuthScreen.FormFields.Email.invalidFormat"))
    .test("unique", t("AuthScreen.FormFields.Email.notUnique"), async (value) => {
      return !(await userService.userExist(value))
    }),
  password: yup.string()
    .required(t("AuthScreen.FormFields.common.required"))
    .min(MIN_PASSWORD_LENGTH, t("AuthScreen.FormFields.common.tooShort", undefined, { count: MIN_PASSWORD_LENGTH }))
});