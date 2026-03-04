"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forwardMail = forwardMail;
const axios_1 = __importDefault(require("axios"));
const auth_1 = require("../auth/auth");
async function forwardMail(subject, body, to, messageId) {
    const accessToken = await (0, auth_1.getValidAccessToken)();
    // Obtener adjuntos del mensaje original
    const attachmentsRes = await axios_1.default.get(`https://graph.microsoft.com/v1.0/me/messages/${messageId}/attachments`, { headers: { Authorization: `Bearer ${accessToken}` } });
    const attachments = attachmentsRes.data.value.map((a) => ({
        "@odata.type": "#microsoft.graph.fileAttachment",
        name: a.name,
        contentType: a.contentType,
        contentBytes: a.contentBytes,
    }));
    await axios_1.default.post("https://graph.microsoft.com/v1.0/me/sendMail", {
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
    }, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("📤 Correo enviado con adjuntos");
}
