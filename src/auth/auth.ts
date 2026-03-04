import { env } from "../config/env";
import fs from "fs";
import { PublicClientApplication } from "@azure/msal-node";
import { loadToken, saveToken, TOKEN_PATH } from "../utils/tokenStorage";
import { TokenData } from "../utils/types/type";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

const config = {
  auth: {
    clientId: env.CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${env.TENANT_ID}`,
  },
};
const pca = new PublicClientApplication(config);

const TokenEndpoint = `https://login.microsoftonline.com/${env.TENANT_ID}/oauth2/v2.0/token`;
export const ReplaceTokens = async (code: string) => {
  const params = new URLSearchParams();

  params.append("client_id", env.CLIENT_ID!);
  params.append("client_secret", env.CLIENT_SECRET!);
  params.append("code", code);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", env.REDIRECT_URI!);

  const response = await axios.post<TokenResponse>(TokenEndpoint, params);

  const tokenData: TokenData = {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
    expires_at: Date.now() + response.data.expires_in * 1000,
  };

  saveToken(tokenData);
};

export async function getValidAccessToken(): Promise<string> {
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error("Token no encontrado. Ejecuta login primero.");
  }

  const stored = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));

  const silentRequest = {
    account: stored.account,
    scopes: ["Mail.Read", "Mail.Send"],
  };

  const response = await pca.acquireTokenSilent(silentRequest);

  // 🔥 IMPORTANTE: guardar siempre la nueva respuesta
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(response, null, 2));

  return response.accessToken;
}

async function refreshAccessToken(): Promise<string> {
  const saved = loadToken();

  const params = new URLSearchParams();
  params.append("client_id", process.env.CLIENT_ID!);
  params.append("client_secret", process.env.CLIENT_SECRET!);
  params.append("refresh_token", saved.refresh_token);
  params.append("grant_type", "refresh_token");

  const response = await axios.post<TokenResponse>(TokenEndpoint, params);

  const tokenData: TokenData = {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token || saved.refresh_token,
    expires_at: Date.now() + response.data.expires_in * 1000,
  };

  saveToken(tokenData);

  console.log("🔄 Token renovado");

  return tokenData.access_token;
}
