import { getBuildConstant} from 'src/constants/vite-build-constants'

const getBaseURL = () => {
  const protocol = getBuildConstant('VITE_APP_API_PROTOCOL');
  const host = getBuildConstant('VITE_APP_API_HOST');
  const port = getBuildConstant('VITE_APP_API_PORT');
    
    return `${protocol}://${host}:${port}`;
  };

  export {getBaseURL};