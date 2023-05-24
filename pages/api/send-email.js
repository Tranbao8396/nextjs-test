import { sendEmail } from "../../data/email";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const body = req.body;
    const from_email = body.email;
    const subject = body.subject;
    const message = body.message;

    if (!from_email || !subject || !message) {
      return res.status(400).json({ message: "Bad request" });
    }

    try {
      await sendEmail({
        from: from_email,
        to: "tranbaoworking@gmail.com",
        subject: subject,
        html: `<p>${message}</p>`,
      });
      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  return res.status(400).json({ message: "Bad request" });
}
