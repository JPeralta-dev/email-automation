import fs from "fs";
import { pca } from "./auth";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_PATH = "./storage/token.json";

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
