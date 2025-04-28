type BuildConstantsType = {
  VITE_APP_API_PROTOCOL: string;
  VITE_APP_API_HOST: string;
  VITE_APP_API_PORT: string;
};

export function getBuildConstant(constName: keyof BuildConstantsType) {
    const BuildConstant = {
      VITE_APP_API_PROTOCOL: import.meta.env.VITE_APP_API_PROTOCOL,
      VITE_APP_API_HOST: import.meta.env.VITE_APP_API_HOST,
      VITE_APP_API_PORT: import.meta.env.VITE_APP_API_PORT,
    };
  
    if (!BuildConstant[constName]) {
      throw Error(`Invalid configuration: the constant '${constName}' is not set`);
    }
    return BuildConstant[constName];
  }
  