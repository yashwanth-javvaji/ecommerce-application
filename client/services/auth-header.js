// Other Dependencies
import Cookies from 'js-cookie';


const getAuthHeader = (token) => {
  const tokenValue = Cookies.get(token);
  if (tokenValue) {
    return { Authorization: 'Bearer ' + tokenValue };
  } else {
    return null;
  }
};

export default getAuthHeader;