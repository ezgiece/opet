import i18n from "@/plugins/i18n";

export const int32MaxLimit = 2147483647;
export const int32MinLimit = -2147483648;
export const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {

  rules: {
    required: value => {
      if (value == undefined || value == null || value === "") {
        return i18n.t('validationMessages.requiredField').toString();
      }
      return true;
    },
    minChars(value, min: number) {
      if (!value) return true;
      if (value.length >= min) return true;
      return i18n.t('validationMessages.minChars', { limit: min }).toString();
    },
    maxChars(value, max: number) {
      if (!value) return true;
      if (value.length <= max) return true;
      return i18n.t('validationMessages.maxChars', { limit: max }).toString();
    },
    number: value => {
      if (!value) return true;
      if (!isNaN(Number(value))) return true;
      return i18n.t('validationMessages.mustBeNumber').toString();
    },
    alphanumeric: value => {
      const pattern = /^\w+$/
      return pattern.test(value) || i18n.t('validationMessages.mustBeAlphanumeric').toString();
    },
    integer: value => {
      if (!value) return true;
      if (!Number.isInteger(Number(value))) {
        return i18n.t('validationMessages.mustBeWholeNumber').toString();
      }
      // min max limit control for int32
      const num = Number(value);
      if (num < int32MinLimit || num > int32MaxLimit) {
        return i18n.t('validationMessages.mustBeBetween', { fromLimit: int32MinLimit, toLimit: int32MaxLimit }).toString();
      }
      return true;
    },
    int32Range: value => {
      if (!value) return true;
      const num = Number(value);
      if (num < int32MinLimit || num > int32MaxLimit) {
        return i18n.t('validationMessages.mustBeBetween', { fromLimit: int32MinLimit, toLimit: int32MaxLimit }).toString();
      }
      return true;
    },
    positive: value => {
      if (!value) return true;
      if (Number(value) >= 0) return true;
      return i18n.t('validationMessages.minValueIncluded', { limit: 0 }).toString();
    },
    minValue(value, minLimit: number) {
      if (!value) return true;
      if (Number(value) >= minLimit) return true;
      return i18n.t('validationMessages.minValue', { limit: minLimit }).toString();
    },
    maxValue(value, maxLimit: number) {
      if (!value) return true;
      if (Number(value) <= maxLimit) return true;
      return i18n.t('validationMessages.maxValue', { limit: maxLimit }).toString();
    },
    minArrayLength(value, min: number) {
      if (value.length >= min) return true;
      return i18n.t('validationMessages.minArrayLength', { limit: min }).toString();
    },
    maxArrayLength(value, max: number) {
      if (value.length <= max) return true;
      return i18n.t('validationMessages.maxArrayLength', { limit: max }).toString();
    },
    hasSameValue(array, value, index) {
      if (!value) return true;
      for (let i = 0; i < array.length; i++) {
        if (i != index && array[i][0] == value)
          return i18n.t('validationMessages.alreadyIncludes', { value: value }).toString();
      }
      return true;
    },

    // :error-messages
    minMaxCheck(minValue, maxValue): string {
      const numMax = Number(maxValue);
      const numMin = Number(minValue);
      if (numMax <= numMin) {
        return i18n.t('validationMessages.minMaxError').toString();
      }
      return '';
    },

    dateMinMaxCheck(startDate: Date, endDate: Date): string {
      if (endDate <= startDate) {
        return i18n.t('validationMessages.dateMinMaxError').toString();
      }
      return '';
    },

    confirmPasswordCheck(pass1, pass2) {
      if (pass2 === pass1) {
        return true;
      }
      return i18n.t('validationMessages.passwordConfirmation').toString();
    },
    validEmail(email) {
      if (emailRe.test(email)) {
        return true;
      }
      return i18n.t('validationMessages.invalidUsername').toString();
    }
  }
}
