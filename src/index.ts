import { boolean } from "zod";
import { ReplaceTokens } from "./auth/auth";
import { moveEmail } from "./services/mailMove";
import { getEmailsFromTimeRange } from "./services/mailReader";
import { forwardMail } from "./services/mailSender";
import { isWithinTimeRange } from "./utils/TimeRange";
import { tokenExists } from "./utils/tokenStorage";
import { deviceLogin } from "./auth/deviceLogin";

const KEYWORD = [
  "573234802743",
  "573107241341",
  "573135841053",
  "573124144099",
  "573173645711",
  "573183363756 ,573183363767, 573157167788, 573233052259, 573165278214",
];
const DESTINATION_EMAIL = "boottic@gmail.com";

async function main() {
  const todayStart = new Date();

  todayStart.setHours(0, 0, 0, 0);

  const emails = await getEmailsFromTimeRange(todayStart.toISOString()); // obtenemos emails totales en ese rango

  if (emails === false || emails === true) {
    return;
  }
  for (const email of emails) {
    const reviced = new Date(email.receivedDateTime);

    if (
      isWithinTimeRange(reviced) &&
      KEYWORD.some((k) => email.subject.includes(k))
    ) {
      await forwardMail(
        `Reenvío: ${email.subject}`,
        "Correo reenviado automáticamente",
        `${DESTINATION_EMAIL}`,
      );

      await moveEmail(email.id);
    }
  }
}

async function start() {
  console.log("estoy pasando por aca");
  console.log(tokenExists());

  if (!tokenExists()) {
    console.log("No hay sesión, iniciando login...");
    await deviceLogin();
  }
  main();
  setInterval(main, 60000);
}

start();
