require('dotenv').config()
const nodemailer = require('nodemailer');

// Replace these values with your actual email configuration
const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: emailConfig.auth.user,
    to:to,
    subject:subject,
    html:text,
  };

 try {
  await  transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
 } catch (error) {
    throw(error)
 }
}
const MailerSendConfirmationCode= async(email  , code)=>{
    const html =`<!doctype html>
    <html>
    <head>
    <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
    </head>

    <body>
        <div style="display :flex;
        justify-content:center;
        align-items:center;

        flex-direction:column;" class="app font-sans min-w-screen min-h-screen bg-grey-lighter pb-8 px-4">
    
            <div class="mail__wrapper max-w-md mx-auto">
          
              <div class="mail__content bg-white p-8 shadow-md">
          
                <div   style="width:100%; display:block; justify-content:center; align-items:center">
                    <img style="width:200px; hight:200px" src="https://t3.ftcdn.net/jpg/02/41/39/06/360_F_241390620_hihddCG15N7I8HyPWUiv1eUH85D2SN9z.jpg" alt="">
         
                </div>
          
                <div  style="display:block ;text-align: center; justify-content: center; align-items: center; width:100%;flex-direction: column;" class="content__body py-8 border-b">
                  <p style="text-align: left; padding-bottom: 20px;">
                    Hey, <br><br>It looks that you signed up recently , That\`s  great !  ,   Just copy  the code bellow to confirm your email.
                  </p>
              
                  <p class="text-sm " style="display:block ;text-align: center; justify-content: center; align-items: center; width:100%">
                    <h1  onclick="async()=>{   try {
                        await navigator.clipboard.writeText(${code});

                      } catch (err) {
                        console.error('Failed to copy: ', err);
                      }}" style="max-width:300px; padding: 10px 20px; background-color :#8b17bd;
                      color:white;
                      border-radius:12px; text-align:center">${code}</h1>
                    Keep Rockin'!<br> Your The App team
                  </p>
                </div>
          
                <div class="content__footer mt-8 text-center text-grey-darker">
                  <h3 class="text-base sm:text-lg mb-4">Thanks for using The App!</h3>
               
                </div>
          
              </div>
          
              <div class="mail__meta text-center text-sm text-grey-darker mt-8">
          
              
          
                <div class="meta__help">
         
                </div>
          
              </div>
          
            </div>
          
          </div>
    
    </body>
    </html>`
    sendEmail(email , 'email confirmation code ', html)
}
const passwordRestoreCodeSending= async(email  , code)=>{
    const html =`<!doctype html>
    <html>
    <head>
    <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

    </head>

    <body style="display:block; max-width:350px;
    justify-content:center;
    align-items:center;
    flex-direction:column !important;">
        <div style="display:block;
        justify-content:center;
        align-items:center;
        flex-direction:column !important;" class="app font-sans min-w-screen min-h-screen bg-grey-lighter pb-8 px-4">
    
            <div  style="display:block;
            justify-content:center;
            align-items:center;
            flex-direction:column !important;"  class="mail__wrapper max-w-md mx-auto">
          
              <div  style="display:block;
              justify-content:center;
              align-items:center;
              flex-direction:column !important;"class="mail__content bg-white p-8 shadow-md">
          
                <div   style="width:100%; display:block; justify-content:center; align-items:center">
                    <img style="width:200px; height:200px" src="https://t3.ftcdn.net/jpg/02/41/39/06/360_F_241390620_hihddCG15N7I8HyPWUiv1eUH85D2SN9z.jpg" alt="">
         
                </div>
          
                <div  style="display:block;text-align: center; justify-content: center; align-items: center; width:100%;flex-direction: column;" class="content__body py-8 border-b">
                  <p style="text-align: left; padding-bottom: 20px;">
                    Hey, <br><br>It looks like you lost your password   ,  Can we ask you for new password ? Just copy  the code bellow.
                  </p>
              
                  <p class="text-sm " style="display:block ;text-align: center; justify-content: center; align-items: center; width:100%">
                    <h1  onclick="async()=>{   try {
                        await navigator.clipboard.writeText(${code});

                      } catch (err) {
                        console.error('Failed to copy: ', err);
                      }}" style="max-width:300px; padding: 10px 20px; background-color :#8b17bd;
                      color:white;
                      border-radius:12px; text-align:center">${code}</h1>
                    Keep Rockin'!<br> Your The App team
                  </p>
                </div>
          
                <div class="content__footer mt-8 text-center text-grey-darker">
                  <h3 class="text-base sm:text-lg mb-4">Thanks for using The App!</h3>
               
                </div>
          
              </div>
          
              <div class="mail__meta text-center text-sm text-grey-darker mt-8">
          
              
          
                <div class="meta__help">
         
                </div>
          
              </div>
          
            </div>
          
          </div>
    
    </body>
    </html>`
    sendEmail(email , 'password resetting code  ', html)
}

module.exports = {
    sendEmail,
    MailerSendConfirmationCode,
    passwordRestoreCodeSending
}

