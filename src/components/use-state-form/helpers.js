export const callValidators = (validators, value) => {
  const validatorPredicate = validator => {
    if (typeof validator !== 'function') {
      throw new Error('USE-FORM-STATE: validator must be a function');
    }
    const result = validator(value);
    return result;
  };
  return validators
          .map(validatorPredicate)
          .filter(val => !!val);
};

export const getManager = (fields) => {
  const reducerFields = (data, key) => (
    {
      ...data,
      state: {
        ...data.state,
        isValid: data.state.isValid ? callValidators(fields[key].validators || [], fields[key].defaultValue || '').length === 0 : false,
        values: {
          ...data.state.values,
          [key]: fields[key].defaultValue || ''
        }
      },
      validators: {
        ...data.validators,
        [key]: fields[key].validators || []
      },
      formatters: {
        ...data.formatters,
        [key]: fields[key].formatters || []
      },
      takeRealValue: {
        ...data.takeRealValue,
        [key]: fields[key].takeRealValue || false
      }
    }
  );
  return Object
          .keys(fields)
          .reduce(
            reducerFields,
            {
              state: {
                isDirty: false,
                isValid: true,
                isValidating: false,
                isSubmitting: false,
                isSubmitted: false,
                values: {},
                errors: {}
              },
              validators: {},
              formatters: {},
              takeRealValue: {}
            }
          );
};

export const isValidState = (errors) => {
  return Object.keys(errors).reduce((isValid, errorKey) => {
    return isValid && errors[errorKey].length === 0;
  }, true);
};
