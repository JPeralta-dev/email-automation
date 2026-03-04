import fs from "fs";
import { pca } from "./auth";
import dotenv from "dotenv";
import { TOKEN_PATH } from "../utils/tokenStorage";
dotenv.config();
export async function deviceLogin() {
    const deviceCodeRequest = {
        scopes: ["Mail.Read", "Mail.Send", "Mail.ReadWrite", "offline_access"],
        deviceCodeCallback: (response) => {
            console.log("\n🔐 AUTORIZACIÓN REQUERIDA");
            console.log(response.message);
        },
    };
    await pca.acquireTokenByDeviceCode(deviceCodeRequest);
    if (fs.existsSync(TOKEN_PATH)) {
        console.log("✅ Sesión guardada correctamente");
    }
    else {
        console.log("❌ No se guardó el cache");
    }
}
