export const formatErrorMessage = (message) => {
  const errors = {};
  if (typeof message === "string") {
    errors["message"] = message;
  } else {
    message.forEach((message) => {
      const [key, ...value] = message.split(" ");
      if (!(key in errors)) {
        errors[key] = value.join(" ");
      }
    });
  }
  return errors;
};