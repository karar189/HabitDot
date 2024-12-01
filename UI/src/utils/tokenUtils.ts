// utils/tokenUtils.js
export const setTokens = (tokens) => {
  const now = new Date();

  const accessTokenExpiry = new Date(now.getTime() + 4 * 60 * 1000); // 4 minutes
  const refreshTokenExpiry = new Date(now.getTime() + 80 * 24 * 60 * 60 * 1000); // 80 days

  const googleIdTokenExpiry = new Date(
    now.getTime() + 30 * 24 * 60 * 60 * 1000
  ); // 30 days

  localStorage.setItem("authToken", tokens.access_token);
  localStorage.setItem("authTokenExpiry", accessTokenExpiry.toISOString());

  localStorage.setItem("refreshToken", tokens.refresh_token);
  localStorage.setItem("refreshTokenExpiry", refreshTokenExpiry.toISOString());

  localStorage.setItem("googleIdToken", tokens.google_id_token);
  localStorage.setItem(
    "googleIdTokenExpiry",
    googleIdTokenExpiry.toISOString()
  );
};
