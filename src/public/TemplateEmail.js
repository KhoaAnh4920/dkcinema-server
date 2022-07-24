import db from "../models/index";
require('dotenv').config();
var cloudinary = require('cloudinary').v2;
const Sequelize = require('sequelize');
import moment from 'moment';
const Op = Sequelize.Op;



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

let uploadCloud = (image, fName) => {
    return new Promise(async (resolve, reject) => {
        try {
            await cloudinary.uploader.upload(
                image,
                {
                    resource_type: "raw",
                    public_id: `image/News/${fName}`,
                },
                // Send cloudinary response or catch error
                (err, result) => {
                    if (err) console.log(err);
                    if (result) {
                        resolve(result)
                    }

                }
            );
        } catch (e) {
            reject(e);
        }
    })

}




let templateResetPass = (dataSend) => {

    let result = `
    <!doctype html>
    <html lang="en-US">
    
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Reset Password Email Template</title>
        <meta name="description" content="Reset Password Email Template.">
        <style type="text/css">
            a:hover {text-decoration: underline !important;}
        </style>
    </head>
    
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                              <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                <img width="300" src="https://res.cloudinary.com/dpo9d3otr/image/upload/v1656596213/Image/Logo/DKCinema_wx0dza.png" title="logo" alt="logo">
                              </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Bạn đã yêu cầu đặt lại mật khẩu của mình</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                Để đặt lại mật khẩu của bạn, hãy nhấp vào liên kết sau và làm theo hướng dẫn.
                                            </p>
                                            <a href="http://localhost:3000/reset-password?email=${dataSend.email}&token=${dataSend.m_token}"
                                                style="background:#FCAF17;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                Password</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.dkcinema.vn</strong></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    
    </html>
    
    `;

    return result;
}


let templateActiveAccount = (dataSend) => {
    let result =
        `
        <!DOCTYPE html>
        <html>
        
        <head>
            <title></title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
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
        
                /* CLIENT-SPECIFIC STYLES */
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
        
                img {
                    -ms-interpolation-mode: bicubic;
                }
        
                /* RESET STYLES */
                img {
                    border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
                }
        
                table {
                    border-collapse: collapse !important;
                }
        
                body {
                    height: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                }
        
                /* iOS BLUE LINKS */
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }
        
                /* MOBILE STYLES */
                @media screen and (max-width:600px) {
                    h1 {
                        font-size: 32px !important;
                        line-height: 32px !important;
                    }
                }
        
                /* ANDROID CENTER FIX */
                div[style*="margin: 16px 0;"] {
                    margin: 0 !important;
                }
            </style>
        </head>
        
        <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
            <!-- HIDDEN PREHEADER TEXT -->
            <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account.
            </div>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <!-- LOGO -->
                <tr>
                    <td bgcolor="#FFA73B" align="center">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                    <h1 style="font-size: 30px; font-weight: 400; margin: 2;">KÍCH HOẠT TÀI KHOẢN</h1>
                                    <img src="https://res.cloudinary.com/dpo9d3otr/image/upload/v1656596213/Image/Logo/DKCinema_wx0dza.png" width="250" height="250" style="display: block; border: 0px;" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Chúc mừng bạn trở thành thành viên <b>DK Cinema</b> - Tích điểm ngay nhận quà liền tay.</p>
<p style="margin: 0;">Bạn có thể đăng nhập dễ dàng vào tài khoản DK Cinema để cập nhập các chương trình ưu đãi đặc biệt dành riêng cho bạn.</p>
                        </td>
                    </tr>
                            <tr>
                                <td bgcolor="#ffffff" align="left">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                <table border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="http://localhost:3000?userId=${dataSend.userId}&userToken=${dataSend.userToken}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr> <!-- COPY -->
                        </table>
                    </td>
                </tr>
        
            </table>
        </body>
        
        </html>
        

        `
    return result;
}


let templateBooking = (dataSend) => {
    let result = '';
    if (dataSend.combo) {
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
                        border: 1px solid #ffb42b;

                    }

                    .form-header {
                        background-color: #ffb42b;
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
                    .qr-booking{
                        width: 100%;
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                </style>
            </head>

            <body>
                <div class="form-main">
                    <div class="form-header">
                        <h3>Mã đặt vé của bạn: ${dataSend.bookingId}</h3>
                    </div>
                    <div class="form-body">
                        <p>Xin chào <span>${dataSend.name}</span> </p>
                        <p>Chúc mừng bạn đã thanh toán thành công tại DKCINEMAS</p>
                        <p>Đây là thông tin đặt vé của bạn:</p>
                        <div class="qr-booking"> 
	<img style="width: 200px" src=${dataSend.QRcode} cid: 'unique@cid' />
</div>
                        <table>
                            <tr>
                                <td class="text-left">Mã đặt vé</td>
                                <td class="text-right">${dataSend.bookingId}</td>
                            </tr>
                            <tr>
                                <td class="text-left">Phim</td>
                                <td class="text-right">${dataSend.nameMovie}</td>
                            </tr>
                            <tr>
                                <td class="text-left">ngày và giờ chiếu</td>
                                <td class="text-right">${dataSend.time}</td>
                            </tr>
                            <tr>
                                <td class="text-left">loại vé và số ghế</td>
                                <td class="text-right">${dataSend.seet}</td>
                            </tr>
                            <tr>
                                <td class="text-left">Combo</td>
                                <td class="text-right">${dataSend.combo}</td>
                            </tr>
                            <tr>
                                <td class="text-left">rạp và phòng chiếu</td>
                                <td class="text-right">${dataSend.room}</td>
                            </tr>
                            <tr>
                                <td class="text-left">hình thức thanh toán</td>
                                <td class="text-right">${dataSend.paymentMethod}</td>
                            </tr>
                            <tr>
                                <td class="text-left">tổng tiền</td>
                                <td class="text-right">${dataSend.price} VND</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr align="center">
                                <td colspan="2" class="text-last">cảm ơn bạn và hẹn gặp bạn tại DK Cinemas</td>
                            </tr>
                            <tr align="center">
                                <td colspan="2" class="link">
                                    <a href="https://www.dkcinemas.vn/">https://www.dkcinemas.vn/</a>
                                </td>
                            </tr>
                            <tr align="center">
                                <td colspan="2" class="image">
                                    <img style="width: 150px" src="https://res.cloudinary.com/dpo9d3otr/image/upload/v1656596213/Image/Logo/DKCinema_wx0dza.png" alt="">
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </body>

            </html>


        `
    } else {
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
                        border: 1px solid #ffb42b;

                    }

                    .form-header {
                        background-color: #ffb42b;
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
                    .qr-booking{
                        width: 100%;
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                </style>
            </head>

            <body>
                <div class="form-main">
                    <div class="form-header">
                        <h3>Mã đặt vé của bạn: ${dataSend.bookingId}</h3>
                    </div>
                    <div class="form-body">
                        <p>Xin chào <span>${dataSend.name}</span> </p>
                        <p>Chúc mừng bạn đã thanh toán thành công tại DKCINEMAS</p>
                        <p>Đây là thông tin đặt vé của bạn:</p>
                        <div class="qr-booking"> 
	<img style="width: 200px" src=${dataSend.QRcode} cid: 'unique@cid' />
</div>
                        <table>
                            <tr>
                                <td class="text-left">Mã đặt vé</td>
                                <td class="text-right">${dataSend.bookingId}</td>
                            </tr>
                            <tr>
                                <td class="text-left">Phim</td>
                                <td class="text-right">${dataSend.nameMovie}</td>
                            </tr>
                            <tr>
                                <td class="text-left">ngày và giờ chiếu</td>
                                <td class="text-right">${dataSend.time}</td>
                            </tr>
                            <tr>
                                <td class="text-left">loại vé và số ghế</td>
                                <td class="text-right">${dataSend.seet}</td>
                            </tr>
                            <tr>
                                <td class="text-left">rạp và phòng chiếu</td>
                                <td class="text-right">${dataSend.room}</td>
                            </tr>
                            <tr>
                                <td class="text-left">hình thức thanh toán</td>
                                <td class="text-right">${dataSend.paymentMethod}</td>
                            </tr>
                            <tr>
                                <td class="text-left">tổng tiền</td>
                                <td class="text-right">${dataSend.price} VND</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr align="center">
                                <td colspan="2" class="text-last">cảm ơn bạn và hẹn gặp bạn tại DK Cinemas</td>
                            </tr>
                            <tr align="center">
                                <td colspan="2" class="link">
                                    <a href="https://www.dkcinemas.vn/">https://www.dkcinemas.vn/</a>
                                </td>
                            </tr>
                            <tr align="center">
                                <td colspan="2" class="image">
                                    <img style="width: 150px" src="https://res.cloudinary.com/dpo9d3otr/image/upload/v1656596213/Image/Logo/DKCinema_wx0dza.png" alt="">
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </body>

            </html>


        `
    }
    return result;
}






module.exports = {
    templateResetPass,
    templateActiveAccount,
    templateBooking
}

