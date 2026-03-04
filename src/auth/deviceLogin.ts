import { PublicClientApplication } from "@azure/msal-node";
import fs from "fs";
import dotenv from "dotenv";
import { env } from "../config/env";

dotenv.config();

const TOKEN_PATH = "./storage/token.json";

const config = {
  auth: {
    clientId: process.env.CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${env.TENANT_ID}`,
  },
};

const pca = new PublicClientApplication(config);

export async function deviceLogin() {
  const deviceCodeRequest = {
    scopes: ["Mail.Read", "Mail.Send", "offline_access"],
    deviceCodeCallback: (response: any) => {
      console.log("\n🔐 AUTORIZACIÓN REQUERIDA");
      console.log(response.message);
    },
  };

  const response = await pca.acquireTokenByDeviceCode(deviceCodeRequest);

  if (!response) throw new Error("No se pudo obtener token");

  if (!fs.existsSync("./storage")) {
    fs.mkdirSync("./storage");
  }

  fs.writeFileSync(TOKEN_PATH, JSON.stringify(response, null, 2));

  console.log("✅ Token guardado correctamente");
}
