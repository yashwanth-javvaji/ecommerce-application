// Other Dependencies
import Cookies from 'js-cookie';


const getAuthHeader = (token) => {
  const tokens = Cookies.get('tokens');
  if (tokens) {
    return { Authorization: 'Bearer ' + JSON.parse(tokens)[token] };
  } else {
    return null;
  }
}

export default getAuthHeader;