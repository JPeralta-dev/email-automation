"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplaceTokens = exports.pca = void 0;
exports.getValidAccessToken = getValidAccessToken;
const env_1 = require("../config/env");
const fs_1 = __importDefault(require("fs"));
const msal_node_1 = require("@azure/msal-node");
const tokenStorage_1 = require("../utils/tokenStorage");
// en auth.ts - corrige el cachePlugin
const cachePlugin = {
    beforeCacheAccess: async (cacheContext) => {
        if (fs_1.default.existsSync(tokenStorage_1.TOKEN_PATH)) {
            const raw = fs_1.default.readFileSync(tokenStorage_1.TOKEN_PATH, "utf-8");
            try {
                const parsed = JSON.parse(raw);
                // Si tiene la estructura del cache de MSAL directamente
                const cacheData = parsed.Account ? raw : parsed.msalCache;
                if (cacheData) {
                    cacheContext.tokenCache.deserialize(typeof cacheData === "string"
                        ? cacheData
                        : JSON.stringify(cacheData));
                }
            }
            catch (e) {
                console.error("Error leyendo cache:", e);
            }
        }
    },
    afterCacheAccess: async (cacheContext) => {
        if (cacheContext.cacheHasChanged) {
            fs_1.default.writeFileSync(tokenStorage_1.TOKEN_PATH, cacheContext.tokenCache.serialize());
        }
    },
};
const config = {
    auth: {
        clientId: env_1.env.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${env_1.env.TENANT_ID}`,
    },
    cache: {
        cachePlugin,
    },
};
exports.pca = new msal_node_1.PublicClientApplication(config);
const TokenEndpoint = `https://login.microsoftonline.com/${env_1.env.TENANT_ID}/oauth2/v2.0/token`;
const ReplaceTokens = async (code) => {
    const params = new URLSearchParams();
    params.append("client_id", env_1.env.CLIENT_ID);
    params.append("client_secret", env_1.env.CLIENT_SECRET);
    params.append("code", code);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", env_1.env.REDIRECT_URI);
    const response = await axios.post(TokenEndpoint, params);
    const tokenData = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_at: Date.now() + response.data.expires_in * 1000,
    };
    (0, tokenStorage_1.saveToken)(tokenData);
};
exports.ReplaceTokens = ReplaceTokens;
async function getValidAccessToken() {
    const accounts = await exports.pca.getAllAccounts();
    //console.log(accounts);
    if (accounts.length === 0) {
        throw new Error("No hay cuenta logueada.");
    }
    const response = await exports.pca.acquireTokenSilent({
        account: accounts[0],
        scopes: ["Mail.Read", "Mail.Send", "Mail.ReadWrite", "offline_access"],
    });
    console.log("Token obtenido correctamente");
    //console.log(response);
    return response.accessToken;
}
