export const addStateAttribute = (setState, attribute, message) => {
  setState(prevState => ({
    ...prevState,
    [attribute]: message
  }));
};

export const deleteStateAttribute = (state, setState, attribute) => {
  if (attribute in state) {
    const { [attribute]: value, ...rest } = state;
    setState(rest);
  }
};