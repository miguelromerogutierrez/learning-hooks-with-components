import React from 'react';
import { getManager, callValidators, isValidState } from './helpers';

const reducer = (stateReducer) => (state, { type, payload }) => {
  switch (type) {
    case 'value':
      const { errors, values } = stateReducer(state, payload);
      return {
        ...state,
        isDirty: true,
        isValid: isValidState(errors),
        values,
        errors
      };
    case 'error':
      break;
    case 'reset':
      return payload;
    default:
      return state;
  }
};

function useFormState(fields, stateReducer) {
  const manager = React.useMemo(() => getManager(fields), [fields]);

  const getErrorsField = (keyState, value) => {
    const errors = callValidators(manager.validators[keyState], value);
    return errors;
  };

  const ownStateReducer = (state, payload) => {
    const keyValue = Object.keys(payload)[0];
    const errorsField = getErrorsField(keyValue, payload[keyValue]);

    let errors = state.errors;
    let values = {
      ...state.values,
      ...payload
    };

    if (typeof stateReducer === 'function') {
      values = stateReducer(state.values, values, keyValue);
    }

    if (errorsField.length > 0) {
      errors = {
        ...state.errors,
        [keyValue]: errorsField
      };
    } else if (Object.prototype.hasOwnProperty.call(errors, keyValue)) {
      delete errors[keyValue];
    }
    return { values, errors };
  };

  const [state, setState] = React.useReducer(reducer(ownStateReducer), manager.state);

  const validateForm = () => {
    const stateKeys = Object.keys(fields);
    let formErrors = {};
    for (let key in stateKeys) {
      if (Object.prototype.hasOwnProperty.call(stateKeys, key)) {
        const keyErrors = callValidators(manager.validators[key], state.values[key]);
        formErrors = Object.assign({}, formErrors, { [key]: keyErrors });
      }
    }
  };

  const formatValue = (keyField, value) => {
    const formatters = manager.formatters[keyField];
    if (!formatters) return value;
    if (Array.isArray(formatters)) {
      return formatters.reduce((formatedValue, formater) => {
        if (typeof formater !== 'function') {
          throw new Error('USE-FORM-STATE: formater must be a function');
        }
        return formater(formatedValue, value);
      }, value);
    }
    if (typeof formatters === 'function') return formatters(value);
    throw new Error('USE-FORM-STATE: formater must be a function');
  };

  const getTakeRealValueByKey = (keyState) => {
    const identity = (v) => v;
    return manager.takeRealValue[keyState] || identity;
  };

  const getFieldProps = (keyState) => {
    debugger;
    if (state.values[keyState] === null || state.values[keyState] === undefined) {
      throw new Error(`USE-FORM-STATE: Prop name "${keyState}" doesn't exist inside the state`);
    }
    const takeRealValue = getTakeRealValueByKey(keyState);
    return {
      id: keyState,
      name: keyState,
      value: formatValue(keyState, state.values[keyState]),
      error: state.errors[keyState] || '',
      onChange: (e) => {
        return setState({
          type: 'value',
          payload: {[keyState]: takeRealValue(e.target.value)}
        });
      }
    };
  };

  const change = (keyState, value) => {
    return setState({
      type: 'value',
      payload: { [keyState]: value }
    });
  };

  const reset = () => {
    const {state} = getManager(fields);
    setState({
      type: 'reset',
      payload: state
    });
  };

  return {
    ...state,
    change,
    getFieldProps,
    validateForm,
    getErrorsField,
    reset
  };
}

export default useFormState;
