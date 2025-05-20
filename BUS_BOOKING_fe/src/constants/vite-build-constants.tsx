type BuildConstantsType = {
  VITE_APP_API_URL: string;
};

export function getBuildConstant(constName: keyof BuildConstantsType) {
  const BuildConstant = {
    VITE_APP_API_URL: import.meta.env.VITE_APP_API_URL,
    VITE_APP_STRIPE_PK: import.meta.env.VITE_APP_STRIPE_PK,
  };

  if (!BuildConstant[constName]) {
    throw Error(
      `Invalid configuration: the constant '${constName}' is not set`
    );
  }
  return BuildConstant[constName];
}
