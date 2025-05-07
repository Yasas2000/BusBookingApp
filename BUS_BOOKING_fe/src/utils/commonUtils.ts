import axios from 'axios';
import { getBuildConstant} from 'src/constants/vite-build-constants'

const getBaseURL = () => {
  const protocol = getBuildConstant('VITE_APP_API_PROTOCOL');
  const host = getBuildConstant('VITE_APP_API_HOST');
  const port = getBuildConstant('VITE_APP_API_PORT');
    
    return `${protocol}://${host}:${port}`;
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

  export {getBaseURL, fetchwhoAmI};