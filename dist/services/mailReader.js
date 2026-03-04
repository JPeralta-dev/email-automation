"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailsFromTimeRange = getEmailsFromTimeRange;
const axios_1 = __importDefault(require("axios"));
const auth_1 = require("../auth/auth");
//import AxiosError from "axios";
async function getEmailsFromTimeRange(startISO) {
    const accessToken = await (0, auth_1.getValidAccessToken)();
    const filter = encodeURIComponent(`receivedDateTime ge ${startISO}`);
    const url = `https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$filter=${filter}&$select=id,subject,receivedDateTime,from,body&$orderby=receivedDateTime desc&$top=50`;
    const response = await axios_1.default.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    console.log(new Date(startISO));
    //console.log(response);
    return response.data.value; // 🔥 IMPORTANTE
}
