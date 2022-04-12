import validator from 'validator';
import { addStateAttribute, deleteStateAttribute } from '../use-state';


const updateErrorsState = (isError, field, errors, setErrors, message) => {
    isError ? addStateAttribute(setErrors, field, message) : deleteStateAttribute(errors, setErrors, field);
};

export const checkIsEmpty = (value, field, errors, setErrors) => {
    const isError = validator.isEmpty(value);
    updateErrorsState(isError, field, errors, setErrors, "required");
    return isError;
};

export const checkIsEmail = (email, field, errors, setErrors) => {
    let isError = true;
    let message;
    if (validator.isEmpty(email)) {
        message = "required";
    } else if (!validator.isEmail(email)) {
        message = "invalid email";
    } else {
        isError = false;
    }
    updateErrorsState(isError, field, errors, setErrors, message);
    return isError;
};

export const checkPassword = (password, confirmPassword, field, errors, setErrors) => {
    let isPasswordError = true, isConfirmPasswordError = true;
    let passwordErrorMessage, confirmPasswordErrorMessage;
    if (field === "password") {
        if (validator.isEmpty(password)) {
            passwordErrorMessage = "required";
        } else {
            isPasswordError = false;
            if (!isPasswordError && !validator.isEmpty(confirmPassword) && !validator.equals(password, confirmPassword)) {
                confirmPasswordErrorMessage = "please make sure your passwords match";
            } else {
                isConfirmPasswordError = false;
            }
        }
        updateErrorsState(isPasswordError, "password", errors, setErrors, passwordErrorMessage);
    } else if (field === "confirmPassword") {
        isPasswordError = false;
        if (validator.isEmpty(confirmPassword)) {
            confirmPasswordErrorMessage = "required";
        } else {
            if (!validator.equals(password, confirmPassword)) {
                confirmPasswordErrorMessage = "please make sure your passwords match";
            } else {
                isConfirmPasswordError = false;
            }
        }
    }
    updateErrorsState(isConfirmPasswordError, "confirmPassword", errors, setErrors, confirmPasswordErrorMessage);
    return isPasswordError || isConfirmPasswordError;
};

export const checkIntRange = (value, options, field, errors, setErrors) => {
    const isError = !validator.isInt(value, options);
    if (options.hasOwnProperty("min") && options.hasOwnProperty("max")) {
        updateErrorsState(isError, field, errors, setErrors, `should be between ${options.min} and ${options.max}`);
    } else if (options.hasOwnProperty("min")) {
        updateErrorsState(isError, field, errors, setErrors, `should be greater than ${options.min}`);
    } else if (options.hasOwnProperty("max")) {
        updateErrorsState(isError, field, errors, setErrors, `should be less than ${options.max}`);
    }
    return isError;
}

export const checkFloatRange = (value, options, field, errors, setErrors) => {
    const isError = !validator.isFloat(value, options);
    if (options.hasOwnProperty("min") && options.hasOwnProperty("max")) {
        updateErrorsState(isError, field, errors, setErrors, `should be between ${options.min} and ${options.max}`);
    } else if (options.hasOwnProperty("min")) {
        updateErrorsState(isError, field, errors, setErrors, `should be greater than ${options.min}`);
    } else if (options.hasOwnProperty("max")) {
        updateErrorsState(isError, field, errors, setErrors, `should be less than ${options.max}`);
    }
    return isError;
}