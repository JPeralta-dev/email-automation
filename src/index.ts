import { ReplaceTokens } from "./auth/auth";
import { moveEmail } from "./services/mailMove";
import { getEmailsFromTimeRange } from "./services/mailReader";
import { forwardMail } from "./services/mailSender";
import { isWithinTimeRange } from "./utils/TimeRange";

const KEYWORD = "573024115812";
const DESTINATION_EMAIL = "legromanuel29@gmail.com";

async function main() {
  const todayStart = new Date();

  todayStart.setHours(0, 0, 0, 0);

  const emails = await getEmailsFromTimeRange(todayStart.toISOString()); // obtenemos emails totales en ese rango

  for (const email of emails) {
    const reviced = new Date(email.receivedDateTime);

    if (isWithinTimeRange(reviced) && email.subject.includes(KEYWORD)) {
      await forwardMail(
        `Reenvío: ${email.subject}`,
        "Correo reenviado automáticamente",
        `${DESTINATION_EMAIL}`,
      );

      await moveEmail(email.id);
    }
  }
}

setInterval(main, 60000);
