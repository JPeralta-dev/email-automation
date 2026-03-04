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
// en auth.ts - corrige el cachePlugin
const cachePlugin = {
  beforeCacheAccess: async (cacheContext: any) => {
    if (fs.existsSync(TOKEN_PATH)) {
      const raw = fs.readFileSync(TOKEN_PATH, "utf-8");
      try {
        const parsed = JSON.parse(raw);
        // Si tiene la estructura del cache de MSAL directamente
        const cacheData = parsed.Account ? raw : parsed.msalCache;
        if (cacheData) {
          cacheContext.tokenCache.deserialize(
            typeof cacheData === "string"
              ? cacheData
              : JSON.stringify(cacheData),
          );
        }
      } catch (e) {
        console.error("Error leyendo cache:", e);
      }
    }
  },
  afterCacheAccess: async (cacheContext: any) => {
    if (cacheContext.cacheHasChanged) {
      fs.writeFileSync(TOKEN_PATH, cacheContext.tokenCache.serialize());
    }
  },
};
const config = {
  auth: {
    clientId: env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/common`,
  },
  cache: {
    cachePlugin,
  },
};

export const pca = new PublicClientApplication(config);

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

// export async function getValidAccessToken(): Promise<string> {
//   if (!fs.existsSync(TOKEN_PATH)) {
//     throw new Error("Token no encontrado. Ejecuta login primero.");
//   }

//   const accounts = await pca.getTokenCache().getAllAccounts();
//   console.log("Accounts:", accounts);
//   if (accounts.length === 0) {
//     console.log("⚠ No hay sesión. Iniciando Device Login...");

//     const deviceCodeRequest = {
//       scopes: ["Mail.Read", "Mail.Send", "offline_access"],
//       deviceCodeCallback: (response: any) => {
//         console.log(response.message);
//       },
//     };

//     const response = await pca.acquireTokenByDeviceCode(deviceCodeRequest);
//     if (response?.accessToken === undefined) {
//       console.log("⚠ No hay token.");
//       return "";
//     }

//     return response.accessToken;
//   }

//   const silentRequest = {
//     account: accounts[0],
//     scopes: ["Mail.Read", "Mail.Send"],
//   };

//   const response = await pca.acquireTokenSilent(silentRequest);

//   // 🔥 IMPORTANTE: guardar siempre la nueva respuesta
//   fs.writeFileSync(TOKEN_PATH, JSON.stringify(response, null, 2));

//   return response.accessToken;
// }

export async function getValidAccessToken() {
  const accounts = await pca.getAllAccounts();

  if (accounts.length === 0) {
    throw new Error("No hay cuenta logueada.");
  }

  const response = await pca.acquireTokenSilent({
    account: accounts[0],
    scopes: ["Mail.Read", "Mail.Send", "Mail.ReadWrite", "offline_access"],
  });

  console.log("Token obtenido correctamente");

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
