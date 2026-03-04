import axios from "axios";
import { getValidAccessToken } from "../auth/auth";
export interface Mail {
  id: string;
  subject: string;
  receivedDateTime: string;
  from: {
    emailAddress: {
      address: string;
      name: string;
    };
  };
}

export async function getEmailsFromTimeRange(
  startISO: string,
): Promise<Mail[]> {
  const accessToken = await getValidAccessToken();

  const url = `https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$filter=receivedDateTime ge ${startISO}&$select=id,subject,receivedDateTime,from`;

  const response = await axios.get<Mail[]>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log(response.data);

  return response.data;
}
