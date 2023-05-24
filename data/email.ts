import nodemailer from 'nodemailer';

type EmailPayload = {
  from: string
  to: string
  subject: string
  html: string
}

const smtpOptions = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "tranbaoworking@gmail.com",
    pass: process.env.SMTP_PASSWORD || "aidyegvgmivopcox",
  },
}

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  })

  return await transporter.sendMail({
    ...data,
  })
}