import axios from "axios";
import { getValidAccessToken } from "../auth/auth";
import { GraphResponse, Mail } from "../utils/types/type";
//import AxiosError from "axios";

export async function getEmailsFromTimeRange(
  startISO: string,
): Promise<Mail[] | boolean> {
  const accessToken = await getValidAccessToken();
  console.log(startISO);
  const url =
    `https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages` +
    `?$filter=receivedDateTime ge '${startISO}'` +
    `&$select=id,subject,receivedDateTime,from`;

  // const response = await axios.get<GraphResponse<Mail>>(
  //   "https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages",
  //   {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //     params: {
  //       $filter: `receivedDateTime ge ${startISO}`,
  //       $select: "id,subject,receivedDateTime,from",
  //       $orderby: "receivedDateTime desc",
  //     },
  //   },
  // );
  const response = await axios.get<GraphResponse<Mail>>(
    "https://graph.microsoft.com/v1.0/me/messages?$top=5",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  console.log(startISO);
  console.log(response);

  return response.data.value; // 🔥 IMPORTANTE
}
