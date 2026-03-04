"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forwardMail = forwardMail;
const axios_1 = __importDefault(require("axios"));
const auth_1 = require("../auth/auth");
async function forwardMail(subject, content, to) {
    const accessToken = await (0, auth_1.getValidAccessToken)();
    await axios_1.default.post("https://graph.microsoft.com/v1.0/me/sendMail", {
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
