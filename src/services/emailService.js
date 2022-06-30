require('dotenv').config();

import nodemailer from "nodemailer";



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

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"TestMailReactjs 👻" <khoadido@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt vé", // Subject line
        html: getBodyEmailHTML(dataSend), // html body
    });
}

let getBodyEmailHTML = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Thông tin đặt lịch khám bệnh</p>
        <div>Thời gian: ${dataSend.time}</div>
        <div>Bác sĩ: ${dataSend.doctorName}</div>

        <p>Click để xác nhận: </p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>

        `
    }

    return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
            <!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style type="text/css">
                    @media screen {
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 400;
                            src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 700;
                            src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 400;
                            src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 700;
                            src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                        }
                    }
            
                    body,
                    table,
                    td,
                    a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
            
                    table,
                    td {
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                    }
            
                    body {
                        height: 100% !important;
                        margin: 0 auto;
                        padding: 0 !important;
                        width: 50% !important;
                    }
            
                    .form-main {
                        width: 70%;
                        height: 500px;
                        border-radius: 10px;
                        border: 1px solid orange;
            
                    }
            
                    .form-header {
                        background-color: orange;
                        padding: 3px 2px;
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                    }
            
                    .form-header h3 {
                        padding-left: 10px;
                    }
            
                    .form-body p {
                        padding-left: 10px;
                    }
            
                    .form-body span {
                        font-weight: bold;
                    }
            
                    .form-body table {
                        width: 100%;
                    }
            
                    .form-body table tr .text-left {
                        text-transform: capitalize;
                        padding-left: 30px;
                        font-weight: 800;
                    }
            
                    .form-body table tr .text-right {
                        text-transform: capitalize;
                        color: rgb(20, 128, 216);
                        font-weight: 700;
                    }
            
                    .form-body table tr .text-last {
                        text-transform: uppercase;
                    }
            
                    .form-body table tr .link a {
                        text-decoration: none;
                        color: rgb(31, 136, 168);
                    }
            
                    .form-body table tr .image {
                        padding-top: 20px;
                    }
            
                    .form-body table tr .image img {
                        width: 50%;
                        object-fit: contain;
                    }
                </style>
            </head>
            
            <body>
                <div class="form-main">
                    <div class="form-header">
                        <h3>Mã đặt vé của bạn: 257492</h3>
                    </div>
                    <div class="form-body">
                        <p>Xin chào <span>Phan Châu Đức</span> </p>
                        <p>Chúc mừng bạn đã thanh toán thành công tại DKCINEMAS</p>
                        <p>Đây là thông tin đặt vé của bạn:</p>
            
                        <table>
                            <tr>
                                <td class="text-left">Mã đặt vé</td>
                                <td class="text-right">257492</td>
                            </tr>
                            <tr>
                                <td class="text-left">Phim</td>
                                <td class="text-right">Doreamon</td>
                            </tr>
                            <tr>
                                <td class="text-left">ngày và giờ chiếu</td>
                                <td class="text-right">05/06/2022 - 22:00</td>
                            </tr>
                            <tr>
                                <td class="text-left">loại vé và số ghế</td>
                                <td class="text-right">1 - VIP (F1) - 55.000 VND</td>
                            </tr>
                            <tr>
                                <td class="text-left">rạp và phòng chiếu</td>
                                <td class="text-right"> DK landmark - 4</td>
                            </tr>
                            <tr>
                                <td class="text-left">hình thức thanh toán</td>
                                <td class="text-right">ví điện tử momo</td>
                            </tr>
                            <tr>
                                <td class="text-left">tổng tiền</td>
                                <td class="text-right">55.000 VND</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr align="center">
                                <td colspan="2" class="text-last">cảm ơn bạn và hẹn gặp bạn tại DK Cinemas</td>
                            </tr>
                            <tr align="center">
                                <td colspan="2" class="link">
                                    <a href="https://www.megagscinemas.vn/">https://www.dkcinemas.vn/</a>
                                </td>
                            </tr>
                            <tr align="center">
                                <td colspan="2" class="image">
                                    <img src="./logo.png" alt="">
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </body>
            
            </html>
        

        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>Remedy infor in below attachment</p>
        

        `
    }
    return result;
}

let sendAttachment = async (dataSend) => {

    return new Promise(async (resolve, reject) => {
        try {
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
                from: '"TestMailRemedyReactjs 👻" <khoadido@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Kết quả đặt lịch khám bệnh", // Subject line
                html: getBodyHTMLEmailRemedy(dataSend), // html body
                attachments: [
                    {
                        filename: `${dataSend.patientName} .png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    }
                ]
            });

            resolve(true);

        } catch (e) {
            reject(e)
        }
    })

}


module.exports = {
    sendSimpleEmail,
    sendAttachment
}