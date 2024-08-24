import mail from "@sendgrid/mail";
mail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendForgotEmail = async (to, token) => {
  const data = {
    from: "kapoorgourav23@gmail.com",
    subject: `Forgot Password`,
    to,
    text: `<a href="http://localhost:3000/updatePassword/${token}>Reset Password</>`,
  };

  mail.send(data);
};