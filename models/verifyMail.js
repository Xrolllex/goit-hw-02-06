const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailSend = (to, token, isMailWasSent) => {
  const from = 'karolekkaczanowski@gmail.com'; 
  const subject = 'Test';
  const html = `<form action="http://localhost:3000/api/auth/verify/${token}" method="get">
  <p>To verified your mail, please click the button.</p>
  <button type="submit">Verify</button>
  ${isMailWasSent ? "<p>This message has been resent</p>" : "<br />"}
  </form>`;

  const msg = {
    to,     
    from,   
    subject, 
    html,   
  };

  
  return sgMail.send(msg);
}

module.exports = { mailSend };
