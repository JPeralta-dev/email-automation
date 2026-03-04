"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveEmail = moveEmail;
const auth_1 = require("../auth/auth");
const axios_1 = __importDefault(require("axios"));
async function getOrCreateFolder(accessToken, folderName) {
    const res = await axios_1.default.get(`https://graph.microsoft.com/v1.0/me/mailFolders`, { headers: { Authorization: `Bearer ${accessToken}` } });
    const existing = res.data.value.find((f) => f.displayName === folderName);
    if (existing)
        return existing.id;
    const created = await axios_1.default.post(`https://graph.microsoft.com/v1.0/me/mailFolders`, { displayName: folderName }, { headers: { Authorization: `Bearer ${accessToken}` } });
    return created.data.id;
}
async function moveEmail(messageId) {
    const accessToken = await (0, auth_1.getValidAccessToken)();
    const folderId = await getOrCreateFolder(accessToken, "Procesados");
    await axios_1.default.post(`https://graph.microsoft.com/v1.0/me/messages/${messageId}/move`, { destinationId: folderId }, { headers: { Authorization: `Bearer ${accessToken}` } });
    console.log("Correo movido a Procesados");
}
