require('dotenv').config();

import nodemailer from "nodemailer";
import TemplateEmail from '../public/TemplateEmail';




let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });


    if (dataSend.price)
        dataSend.price = dataSend.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"DK Cinemas Booking Ticket" <khoadido@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt vé", // Subject line
        html: TemplateEmail.templateBooking(dataSend),
        attachments: [
            {
                filename: `${dataSend.bookingId}QR.png`,
                content: dataSend.QRcode.split("base64,")[1],
                encoding: 'base64'
            }
        ]
    });
}

let sendEmailActive = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"DK Cinemas" <khoadido@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Xác thực email", // Subject line
        html: TemplateEmail.templateActiveAccount(dataSend), // html body
    });
}

let sendEmailResetPass = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"DK Cinemas" <khoadido@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Reset Password", // Subject line
        html: TemplateEmail.templateResetPass(dataSend), // html body
    });
}

let sendEmailVoucherFree = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"DK Cinemas" <khoadido@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Voucher free ticket", // Subject line
        html: `
        <p>DKCinema xin gửi voucher miễn phí 1 vé (Áp dụng cho 1 lần đặt): ${dataSend.voucherCode}</p>
        <p>Trân trọng cám ơn quý khách đã luôn đồng hành cùng với DKCinema.</p>
        `, // html body
    });
}


let sendEmailVoucherGif = (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            // create reusable transporter object using the default SMTP transport
            //  console.log('dataSend: ', dataSend);
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });

            if (dataSend && dataSend.length > 0) {

                await Promise.all(dataSend.map(async (item, index) => {

                    // send mail with defined transport object
                    await transporter.sendMail({
                        from: '"DK Cinemas" <khoadido@gmail.com>', // sender address
                        to: item.mail, // list of receivers
                        subject: "Voucher happy birthday", // Subject line
                        html: `
                            <p>Mừng sinh nhật quý khách. DKCinema xin gửi voucher giảm giá ${item.data.discountVoucher}% giá vé (Áp dụng cho 1 lần đặt): ${item.data.voucherCode}</p>
                            <p>DKCinema kính chúc quý khách ngày sinh nhật vui vẻ, đầm ấm bên người thân và gia đình.</p>
                            <p>Trân trọng cám ơn quý khách đã luôn đồng hành cùng với DKCinema.</p>
                            `, // html body
                    });
                }))
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}


let sendEmailTypeMovie = (maiList, dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            // create reusable transporter object using the default SMTP transport
            console.log('maiList: ', maiList);
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });
            let info = await transporter.sendMail({
                from: '"DK Cinemas" <khoadido@gmail.com>', // sender address
                to: maiList, // list of receivers
                subject: "Phim mới ra mắt !!!", // Subject line
                html: TemplateEmail.templateMovieIncoming(dataSend), // html body
            });


        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}



// let getBodyEmailHTML = (dataSend) => {
//     let result = ''

//     console.log("Check datasend: ", dataSend);
//     result =
//         `
//             <!DOCTYPE html>
//             <html lang="en">

//             <head>
//                 <meta charset="UTF-8">
//                 <meta http-equiv="X-UA-Compatible" content="IE=edge">
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <title>Document</title>
//                 <style type="text/css">
//                     @media screen {
//                         @font-face {
//                             font-family: 'Lato';
//                             font-style: normal;
//                             font-weight: 400;
//                             src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
//                         }

//                         @font-face {
//                             font-family: 'Lato';
//                             font-style: normal;
//                             font-weight: 700;
//                             src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
//                         }

//                         @font-face {
//                             font-family: 'Lato';
//                             font-style: italic;
//                             font-weight: 400;
//                             src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
//                         }

//                         @font-face {
//                             font-family: 'Lato';
//                             font-style: italic;
//                             font-weight: 700;
//                             src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
//                         }
//                     }

//                     body,
//                     table,
//                     td,
//                     a {
//                         -webkit-text-size-adjust: 100%;
//                         -ms-text-size-adjust: 100%;
//                     }

//                     table,
//                     td {
//                         mso-table-lspace: 0pt;
//                         mso-table-rspace: 0pt;
//                     }

//                     body {
//                         height: 100% !important;
//                         margin: 0 auto;
//                         padding: 0 !important;
//                         width: 50% !important;
//                     }

//                     .form-main {
//                         width: 70%;
//                         height: 500px;
//                         border-radius: 10px;
//                         border: 1px solid #ffb42b;

//                     }

//                     .form-header {
//                         background-color: #ffb42b;
//                         padding: 3px 2px;
//                         border-top-left-radius: 10px;
//                         border-top-right-radius: 10px;
//                     }

//                     .form-header h3 {
//                         padding-left: 10px;
//                     }

//                     .form-body p {
//                         padding-left: 10px;
//                     }

//                     .form-body span {
//                         font-weight: bold;
//                     }

//                     .form-body table {
//                         width: 100%;
//                     }

//                     .form-body table tr .text-left {
//                         text-transform: capitalize;
//                         padding-left: 30px;
//                         font-weight: 800;
//                     }

//                     .form-body table tr .text-right {
//                         text-transform: capitalize;
//                         color: rgb(20, 128, 216);
//                         font-weight: 700;
//                     }

//                     .form-body table tr .text-last {
//                         text-transform: uppercase;
//                     }

//                     .form-body table tr .link a {
//                         text-decoration: none;
//                         color: rgb(31, 136, 168);
//                     }

//                     .form-body table tr .image {
//                         padding-top: 20px;
//                     }

//                     .form-body table tr .image img {
//                         width: 50%;
//                         object-fit: contain;
//                     }
//                     .qr-booking{
//                         width: 100%;
//                     display: flex;
//                     justify-content: center;
//                     margin-bottom: 20px;
//                 }
//                 </style>
//             </head>

//             <body>
//                 <div class="form-main">
//                     <div class="form-header">
//                         <h3>Mã đặt vé của bạn: ${dataSend.bookingId}</h3>
//                     </div>
//                     <div class="form-body">
//                         <p>Xin chào <span>${dataSend.name}</span> </p>
//                         <p>Chúc mừng bạn đã thanh toán thành công tại DKCINEMAS</p>
//                         <p>Đây là thông tin đặt vé của bạn:</p>
//                         <div class="qr-booking"> 
// 	<img style="width: 200px" src=${dataSend.QRcode} cid: 'unique@cid' />
// </div>
//                         <table>
//                             <tr>
//                                 <td class="text-left">Mã đặt vé</td>
//                                 <td class="text-right">${dataSend.bookingId}</td>
//                             </tr>
//                             <tr>
//                                 <td class="text-left">Phim</td>
//                                 <td class="text-right">${dataSend.nameMovie}</td>
//                             </tr>
//                             <tr>
//                                 <td class="text-left">ngày và giờ chiếu</td>
//                                 <td class="text-right">${dataSend.time}</td>
//                             </tr>
//                             <tr>
//                                 <td class="text-left">loại vé và số ghế</td>
//                                 <td class="text-right">${dataSend.seet}</td>
//                             </tr>

//                             ${dataSend.combo &&
//         `<tr>
//                                 <td class="text-left">Combo</td>
//                                 <td class="text-right">${dataSend.combo}</td>
//                             </tr>`
//         }
//                             <tr>
//                                 <td class="text-left">rạp và phòng chiếu</td>
//                                 <td class="text-right">${dataSend.room}</td>
//                             </tr>
//                             <tr>
//                                 <td class="text-left">hình thức thanh toán</td>
//                                 <td class="text-right">${dataSend.paymentMethod}</td>
//                             </tr>
//                             <tr>
//                                 <td class="text-left">tổng tiền</td>
//                                 <td class="text-right">${dataSend.price} VND</td>
//                             </tr>
//                             <tr>
//                                 <td>&nbsp;</td>
//                             </tr>
//                             <tr align="center">
//                                 <td colspan="2" class="text-last">cảm ơn bạn và hẹn gặp bạn tại DK Cinemas</td>
//                             </tr>
//                             <tr align="center">
//                                 <td colspan="2" class="link">
//                                     <a href="https://www.dkcinemas.vn/">https://www.dkcinemas.vn/</a>
//                                 </td>
//                             </tr>
//                             <tr align="center">
//                                 <td colspan="2" class="image">
//                                     <img style="width: 150px" src="https://res.cloudinary.com/dpo9d3otr/image/upload/v1656596213/Image/Logo/DKCinema_wx0dza.png" alt="">
//                                 </td>
//                             </tr>
//                         </table>
//                     </div>
//                 </div>
//             </body>

//             </html>


//         `
//     return result;
// }

// let getBodyEmailActiveHTML = (dataSend) => {
//     let result = ''

//     console.log("Check datasend: ", dataSend);
//     result =
//         `
//         <!DOCTYPE html>
//         <html>

//         <head>
//             <title></title>
//             <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
//             <meta name="viewport" content="width=device-width, initial-scale=1">
//             <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//             <style type="text/css">
//                 @media screen {
//                     @font-face {
//                         font-family: 'Lato';
//                         font-style: normal;
//                         font-weight: 400;
//                         src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
//                     }

//                     @font-face {
//                         font-family: 'Lato';
//                         font-style: normal;
//                         font-weight: 700;
//                         src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
//                     }

//                     @font-face {
//                         font-family: 'Lato';
//                         font-style: italic;
//                         font-weight: 400;
//                         src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
//                     }

//                     @font-face {
//                         font-family: 'Lato';
//                         font-style: italic;
//                         font-weight: 700;
//                         src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
//                     }
//                 }

//                 /* CLIENT-SPECIFIC STYLES */
//                 body,
//                 table,
//                 td,
//                 a {
//                     -webkit-text-size-adjust: 100%;
//                     -ms-text-size-adjust: 100%;
//                 }

//                 table,
//                 td {
//                     mso-table-lspace: 0pt;
//                     mso-table-rspace: 0pt;
//                 }

//                 img {
//                     -ms-interpolation-mode: bicubic;
//                 }

//                 /* RESET STYLES */
//                 img {
//                     border: 0;
//                     height: auto;
//                     line-height: 100%;
//                     outline: none;
//                     text-decoration: none;
//                 }

//                 table {
//                     border-collapse: collapse !important;
//                 }

//                 body {
//                     height: 100% !important;
//                     margin: 0 !important;
//                     padding: 0 !important;
//                     width: 100% !important;
//                 }

//                 /* iOS BLUE LINKS */
//                 a[x-apple-data-detectors] {
//                     color: inherit !important;
//                     text-decoration: none !important;
//                     font-size: inherit !important;
//                     font-family: inherit !important;
//                     font-weight: inherit !important;
//                     line-height: inherit !important;
//                 }

//                 /* MOBILE STYLES */
//                 @media screen and (max-width:600px) {
//                     h1 {
//                         font-size: 32px !important;
//                         line-height: 32px !important;
//                     }
//                 }

//                 /* ANDROID CENTER FIX */
//                 div[style*="margin: 16px 0;"] {
//                     margin: 0 !important;
//                 }
//             </style>
//         </head>

//         <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
//             <!-- HIDDEN PREHEADER TEXT -->
//             <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account.
//             </div>
//             <table border="0" cellpadding="0" cellspacing="0" width="100%">
//                 <!-- LOGO -->
//                 <tr>
//                     <td bgcolor="#FFA73B" align="center">
//                         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//                             <tr>
//                                 <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
//                             </tr>
//                         </table>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
//                         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//                             <tr>
//                                 <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
//                                     <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src="https://res.cloudinary.com/dpo9d3otr/image/upload/v1656596213/Image/Logo/DKCinema_wx0dza.png" width="250" height="250" style="display: block; border: 0px;" />
//                                 </td>
//                             </tr>
//                         </table>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
//                         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//                             <tr>
//                                 <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
//                                     <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td bgcolor="#ffffff" align="left">
//                                     <table width="100%" border="0" cellspacing="0" cellpadding="0">
//                                         <tr>
//                                             <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
//                                                 <table border="0" cellspacing="0" cellpadding="0">
//                                                     <tr>
//                                                         <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="http://localhost:3000?userId=${dataSend.userId}&userToken=${dataSend.userToken}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td>
//                                                     </tr>
//                                                 </table>
//                                             </td>
//                                         </tr>
//                                     </table>
//                                 </td>
//                             </tr> <!-- COPY -->
//                             <tr>
//                                 <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
//                                     <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
//                                 </td>
//                             </tr> <!-- COPY -->
//                             <tr>
//                                 <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
//                                     <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">https://bit.li.utlddssdstueincx</a></p>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
//                                     <p style="margin: 0;">If you have any questions, just reply to this email&mdash;we're always happy to help out.</p>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
//                                     <p style="margin: 0;">Cheers,<br>BBB Team</p>
//                                 </td>
//                             </tr>
//                         </table>
//                     </td>
//                 </tr>

//             </table>
//         </body>

//         </html>


//         `
//     return result;
// }





module.exports = {
    sendSimpleEmail,
    sendEmailActive,
    sendEmailResetPass,
    sendEmailVoucherGif,
    sendEmailTypeMovie,
    sendEmailVoucherFree
}