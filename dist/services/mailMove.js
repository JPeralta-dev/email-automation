import { getValidAccessToken } from "../auth/auth";
import axios from "axios";
async function getOrCreateFolder(accessToken, folderName) {
    const res = await axios.get(`https://graph.microsoft.com/v1.0/me/mailFolders`, { headers: { Authorization: `Bearer ${accessToken}` } });
    const existing = res.data.value.find((f) => f.displayName === folderName);
    if (existing)
        return existing.id;
    const created = await axios.post(`https://graph.microsoft.com/v1.0/me/mailFolders`, { displayName: folderName }, { headers: { Authorization: `Bearer ${accessToken}` } });
    return created.data.id;
}
export async function moveEmail(messageId) {
    const accessToken = await getValidAccessToken();
    const folderId = await getOrCreateFolder(accessToken, "Procesados");
    await axios.post(`https://graph.microsoft.com/v1.0/me/messages/${messageId}/move`, { destinationId: folderId }, { headers: { Authorization: `Bearer ${accessToken}` } });
    console.log("Correo movido a Procesados");
}
