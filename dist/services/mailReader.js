import axios from "axios";
import { getValidAccessToken } from "../auth/auth";
//import AxiosError from "axios";
export async function getEmailsFromTimeRange(startISO) {
    const accessToken = await getValidAccessToken();
    console.log(startISO);
    const filter = encodeURIComponent(`receivedDateTime ge ${startISO}`);
    const url = `https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$filter=${filter}&$select=id,subject,receivedDateTime,from,body&$orderby=receivedDateTime desc&$top=50`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    console.log(startISO);
    //console.log(response);
    return response.data.value; // 🔥 IMPORTANTE
}
