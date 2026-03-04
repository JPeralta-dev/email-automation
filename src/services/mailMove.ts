import { getValidAccessToken } from "../auth/auth";

export async function moveEmail(messageId: string) {
  const accessToken = await getValidAccessToken();

  await axios.post(
    `https://graph.microsoft.com/v1.0/me/messages/${messageId}/move`,
    {
      destinationId: "Procesados",
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  console.log("Correo Movido a Procesados");
}
