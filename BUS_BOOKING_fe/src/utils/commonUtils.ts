import axios from 'axios';
import { getBuildConstant } from 'src/constants/vite-build-constants'

const getBaseURL = () => {
  const url = getBuildConstant('VITE_APP_API_URL');

  return url;

};


const fetchwhoAmI = async (email: string) => {
  try {
    const response = await axios.get(`/user/whoami?email=${email}`);
    return response.data;
  } catch (error) {
    console.log("error: ", error);
  }
}

const setAuthDataInLocalStorage = (key: string, value: string) => {

}

export { getBaseURL, fetchwhoAmI };