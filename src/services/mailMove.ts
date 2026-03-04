import { getValidAccessToken } from "../auth/auth";
import axios from "axios";

interface MailFolder {}
//**
// auto necesito urgenciasas
// Necesita vigilancia en tiempor real, esta pendiente revaloar que salgan lo laboratorios que salga la
// alerta inmediatamente, 11204,  */

interface MailFolder {
  id: string;
  displayName: string;
}

interface MailFolderListResponse {
  value: MailFolder[];
}

async function getOrCreateFolder(
  accessToken: string,
  folderName: string,
): Promise<string> {
  const res = await axios.get<MailFolderListResponse>(
    `https://graph.microsoft.com/v1.0/me/mailFolders`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  const existing = res.data.value.find(
    (f: any) => f.displayName === folderName,
  );
  if (existing) return existing.id;

  const created = await axios.post<MailFolder>(
    `https://graph.microsoft.com/v1.0/me/mailFolders`,
    { displayName: folderName },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  return created.data.id;
}

export async function moveEmail(messageId: string) {
  const accessToken = await getValidAccessToken();
  const folderId = await getOrCreateFolder(accessToken, "Procesados");

  await axios.post(
    `https://graph.microsoft.com/v1.0/me/messages/${messageId}/move`,
    { destinationId: folderId },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  console.log("Correo movido a Procesados");
}
