export const formatErrorMessage = (message) => {
  const errors = {};
  if (typeof message === "string") {
    errors["message"] = message;
  } else {
    message.forEach((message) => {
      const [key, value] = message.split(/(?<=^\S+)\s/);
      if (!(key in errors)) {
        errors[key] = value;
      }
    });
  }
  return errors;
}