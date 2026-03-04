"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailMove_1 = require("./services/mailMove");
const mailReader_1 = require("./services/mailReader");
const mailSender_1 = require("./services/mailSender");
const TimeRange_1 = require("./utils/TimeRange");
const tokenStorage_1 = require("./utils/tokenStorage");
const deviceLogin_1 = require("./auth/deviceLogin");
const KEYWORD = [
    "573234802743",
    "573107241341",
    "573135841053",
    "573124144099",
    "573173645711",
    "573183363756",
    "573183363767",
    "573157167788",
    "573233052259",
    "573165278214",
];
const DESTINATION_EMAIL = "boottic@gmail.com";
async function main() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const emails = await (0, mailReader_1.getEmailsFromTimeRange)(todayStart.toISOString()); // obtenemos emails totales en ese rango
    if (emails === false || emails === true) {
        return;
    }
    for (const email of emails) {
        const reviced = new Date(email.receivedDateTime);
        if ((0, TimeRange_1.isWithinTimeRange)(reviced) &&
            KEYWORD.some((k) => email.subject.includes(k))) {
            await (0, mailSender_1.forwardMail)(`Fw: ${email.subject}`, email.body.content, DESTINATION_EMAIL, email.id);
            await (0, mailMove_1.moveEmail)(email.id);
        }
    }
}
async function start() {
    console.log("estoy pasando por aca");
    console.log((0, tokenStorage_1.tokenExists)());
    if (!(0, tokenStorage_1.tokenExists)()) {
        console.log("No hay sesión, iniciando login...");
        await (0, deviceLogin_1.deviceLogin)();
    }
    main();
    setInterval(main, 60000);
}
start();
