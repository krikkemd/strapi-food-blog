let accessToken = ''; // in memory access token eigenlijk gewoon een global variable

// functie om de accessToken die we krijgen na successvolle login, in memory te storen.
export const setAccessTokenInMemory = token => {
  accessToken = token;
};

// functie die de accessToken ophaalt, of de accesstoken nu defined is of niet.
export const getAccessTokenFromMemory = () => accessToken;
