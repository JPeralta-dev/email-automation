"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceLogin = deviceLogin;
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("./auth");
const dotenv_1 = __importDefault(require("dotenv"));
const tokenStorage_1 = require("../utils/tokenStorage");
dotenv_1.default.config();
async function deviceLogin() {
    const deviceCodeRequest = {
        scopes: ["Mail.Read", "Mail.Send", "Mail.ReadWrite", "offline_access"],
        deviceCodeCallback: (response) => {
            console.log("\n🔐 AUTORIZACIÓN REQUERIDA");
            console.log(response.message);
        },
    };
    await auth_1.pca.acquireTokenByDeviceCode(deviceCodeRequest);
    if (fs_1.default.existsSync(tokenStorage_1.TOKEN_PATH)) {
        console.log("✅ Sesión guardada correctamente");
    }
    else {
        console.log("❌ No se guardó el cache");
    }
}
