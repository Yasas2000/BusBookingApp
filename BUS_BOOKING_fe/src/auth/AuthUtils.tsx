interface JWTPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const decodeJWTToken = (token: string): JWTPayload => {
  const payload = token.split('.')[1];
  const decodedPayload = atob(payload);
  return JSON.parse(decodedPayload);
}

const setAuthDetails = (loginResponse: any) => {
  if (loginResponse?.accessToken) {
    localStorage.setItem("access_token", loginResponse.accessToken);
  }
  if (loginResponse?.refreshToken) {
    localStorage.setItem("refresh_token", loginResponse.refreshToken);
  }
};

const removeAuthDetails = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return;
  }
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

const checkTokenExpiration = (): boolean => {
  const { exp } = getTokenPayload();
  const expiresInMs = exp * 1000;
  const currentTime = Date.now();

  if (expiresInMs < currentTime) {
    return true;
  }

  return false;
}

const isAccessTokenAvailable = (): boolean => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return false;
  }

  return true;
}

const getTokenPayload = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found while getting payload");
  }

  const decodedPayload: JWTPayload = decodeJWTToken(token);
  return decodedPayload;
}

const getUserEmailFromToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found while getting email from payload");
  }

  const decodedPayload = decodeJWTToken(token);
  return decodedPayload.email;
}

const getRoleFromToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found while getting role from payload");
  }

  const decodedPayload = decodeJWTToken(token);
  return decodedPayload.role;
}

export { decodeJWTToken, setAuthDetails, getUserEmailFromToken, removeAuthDetails, checkTokenExpiration, isAccessTokenAvailable, getRoleFromToken };