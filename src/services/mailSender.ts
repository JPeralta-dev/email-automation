import axios from "axios";
import { getValidAccessToken } from "../auth/auth";

interface Attachment {
  "@data.type": string;
  name: string;
  contentType: string;
  contentBytes: string;
}

export async function forwardMail(
  subject: string,
  body: string,
  to: string,
  messageId: string,
) {
  const accessToken = await getValidAccessToken();

  // Obtener adjuntos del mensaje original
  const attachmentsRes = await axios.get<{ value: Attachment[] }>(
    `https://graph.microsoft.com/v1.0/me/messages/${messageId}/attachments`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  const attachments = attachmentsRes.data.value.map((a) => ({
    "@odata.type": "#microsoft.graph.fileAttachment",
    name: a.name,
    contentType: a.contentType,
    contentBytes: a.contentBytes,
  }));

  await axios.post(
    "https://graph.microsoft.com/v1.0/me/sendMail",
    {
      message: {
        subject,
        body: {
          contentType: "HTML",
          content: body,
        },
        toRecipients: [
          {
            emailAddress: { address: to },
          },
        ],
        attachments,
      },
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  console.log("📤 Correo enviado con adjuntos");
}
