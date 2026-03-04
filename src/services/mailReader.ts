import axios from "axios";
import { getValidAccessToken } from "../auth/auth";
import { GraphResponse, Mail } from "../utils/types/type";

//import AxiosError from "axios";

export async function getEmailsFromTimeRange(
  startISO: string,
): Promise<Mail[] | boolean> {
  const accessToken = await getValidAccessToken();
  const filter = encodeURIComponent(`receivedDateTime ge ${startISO}`);

  const url = `https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$filter=${filter}&$select=id,subject,receivedDateTime,from,body&$orderby=receivedDateTime desc&$top=50`;

  const response = await axios.get<GraphResponse<Mail>>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log(new Date(startISO));
  //console.log(response);

  return response.data.value; // 🔥 IMPORTANTE
}
