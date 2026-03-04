import axios from "axios";
import { getValidAccessToken } from "../auth/auth";
export async function forwardMail(subject, content, to) {
    const accessToken = await getValidAccessToken();
    await axios.post("https://graph.microsoft.com/v1.0/me/sendMail", {
        message: {
            subject,
            body: {
                contentType: "Text",
                content,
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: to,
                    },
                },
            ],
        },
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    console.log("📤 Correo enviado");
}
