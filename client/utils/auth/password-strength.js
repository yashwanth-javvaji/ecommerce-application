// Other Dependencies
import zxcvbn from 'zxcvbn';


export const specialCharacters = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '\\', '/', "'", '?', ':', ',', '{', '}', '[', ']', '.'];

const hasNumber = (value) => {
  return new RegExp(/[0-9]/).test(value);
};

const hasMixedCase = (value) => {
  return new RegExp(/[a-z]/).test(value) && new RegExp(/[A-Z]/).test(value);
};

const hasSpecialCharacter = (value) => {
  return new RegExp(/[~!@#$%^&*()-_=+\\/'?:,{}[\].]/).test(value);
};

const getLabelAndColor = (score) => {
  switch (score) {
    case 0:
      return ['Bad', '#9e9e9e'];
    case 1:
      return ['Weak', '#f44336'];
    case 2:
      return ['Fair', '#ff9800'];
    case 3:
      return ['Good', '#2196f3'];
    case 4:
      return ['Strong', '#4caf50'];
    default:
      return ['Weak', '#f44336'];
  }
};

export const validateStrength = (password) => {
  const result = zxcvbn(password);
  const [label, color] = getLabelAndColor(result.score);

  return {
    score: result.score,
    label,
    color,
    attributes: {
      'should be atleast 8 characters in length': password.length >= 8,
      'must include numbers': hasNumber(password),
      'must include both lowercase and uppercase letters': hasMixedCase(password),
      'must include special characters': hasSpecialCharacter(password)
    },
    warning: result.feedback.warning
  };
};