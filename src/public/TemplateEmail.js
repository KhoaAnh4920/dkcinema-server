import db from "../models/index";
require('dotenv').config();
var cloudinary = require('cloudinary').v2;
const Sequelize = require('sequelize');
import moment from 'moment';
const Op = Sequelize.Op;






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


let templateMovieIncoming = (dataSend) => {
    const result = `
    
    <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8"> <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
    <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->

    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" rel="stylesheet">

    <!-- CSS Reset : BEGIN -->
<style>
html,
body {
    margin: 0 auto !important;
    padding: 0 !important;
    height: 100% !important;
    width: 100% !important;
    background: #f1f1f1;
}

/* What it does: Stops email clients resizing small text. */
* {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}

/* What it does: Centers email on Android 4.4 */
div[style*="margin: 16px 0"] {
    margin: 0 !important;
}

/* What it does: Stops Outlook from adding extra spacing to tables. */
table,
td {
    mso-table-lspace: 0pt !important;
    mso-table-rspace: 0pt !important;
}

/* What it does: Fixes webkit padding issue. */
table {
    border-spacing: 0 !important;
    border-collapse: collapse !important;
    table-layout: fixed !important;
    margin: 0 auto !important;
}

/* What it does: Uses a better rendering method when resizing images in IE. */
img {
    -ms-interpolation-mode:bicubic;
}

/* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
a {
    text-decoration: none;
}

/* What it does: A work-around for email clients meddling in triggered links. */
*[x-apple-data-detectors],  /* iOS */
.unstyle-auto-detected-links *,
.aBn {
    border-bottom: 0 !important;
    cursor: default !important;
    color: inherit !important;
    text-decoration: none !important;
    font-size: inherit !important;
    font-family: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
}

/* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
.a6S {
    display: none !important;
    opacity: 0.01 !important;
}

/* What it does: Prevents Gmail from changing the text color in conversation threads. */
.im {
    color: inherit !important;
}

/* If the above doesn't work, add a .g-img class to any image in question. */
img.g-img + div {
    display: none !important;
}

/* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
/* Create one of these media queries for each additional viewport size you'd like to fix */

/* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
@media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
    u ~ div .email-container {
        min-width: 320px !important;
    }
}
/* iPhone 6, 6S, 7, 8, and X */
@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
    u ~ div .email-container {
        min-width: 375px !important;
    }
}
/* iPhone 6+, 7+, and 8+ */
@media only screen and (min-device-width: 414px) {
    u ~ div .email-container {
        min-width: 414px !important;
    }
}

</style>

<!-- CSS Reset : END -->

<!-- Progressive Enhancements : BEGIN -->
<style>

  .primary{
	background: #0d0cb5;
}
.bg_white{
	background: #ffffff;
}
.bg_light{
	background: #fafafa;
}
.bg_black{
	background: #000000;
}
.bg_dark{
	background: rgba(0,0,0,.8);
}
.email-section{
	padding:2.5em;
}

/*BUTTON*/
.btn{
	padding: 5px 15px;
	display: inline-block;
}
.btn.btn-primary{
	border-radius: 5px;
	background: #0d0cb5;
	color: #ffffff;
}
.btn.btn-white{
	border-radius: 5px;
	background: #ffffff;
	color: #000000;
}
.btn.btn-white-outline{
	border-radius: 5px;
	background: transparent;
	border: 1px solid #fff;
	color: #fff;
}

h1,h2,h3,h4,h5,h6{
	font-family: 'Poppins', sans-serif;
	color: #000000;
	margin-top: 0;
}

body{
	font-family: 'Poppins', sans-serif;
	font-weight: 400;
	font-size: 15px;
	line-height: 1.8;
	color: rgba(0,0,0,.4);
}

a{
	color: #0d0cb5;
}

table{
}
/*LOGO*/

.logo h1{
	margin: 0;
}
.logo h1 a{
	color: #000000;
	font-size: 20px;
	font-weight: 700;
	text-transform: uppercase;
	font-family: 'Poppins', sans-serif;
}

.navigation{
	padding: 0;
}
.navigation li{
	list-style: none;
	display: inline-block;;
	margin-left: 5px;
	font-size: 13px;
	font-weight: 500;
}
.navigation li a{
	color: rgba(0,0,0,.4);
}

/*HERO*/
.hero{
	position: relative;
	z-index: 0;
}
.hero .overlay{
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	content: '';
	width: 100%;
	background: #000000;
	z-index: -1;
	opacity: 0.7;
}
.hero .icon{
}
.hero .icon a{
	display: block;
	width: 60px;
	margin: 0 auto;
}
.hero .text{
	color: rgba(255,255,255,.8);
}
.hero .text h2{
	color: #ffffff;
	font-size: 30px;
	margin-bottom: 0;
}


/*HEADING SECTION*/
.heading-section{
margin-top: 20px;
}
.heading-section h2{
	color: #000000;
	font-size: 20px;
	margin-top: 0;
	line-height: 1.4;
	font-weight: 700;
	text-transform: uppercase;
}
.heading-section .subheading{
	margin-bottom: 20px !important;
	display: inline-block;
	font-size: 13px;
	text-transform: uppercase;
	letter-spacing: 2px;
	color: rgba(0,0,0,.4);
	position: relative;
}
.heading-section .subheading::after{
	position: absolute;
	left: 0;
	right: 0;
	bottom: -10px;
	content: '';
	width: 100%;
	height: 2px;
	background: #0d0cb5;
	margin: 0 auto;
}

.heading-section-white{
	color: rgba(255,255,255,.8);
}
.heading-section-white h2{
	line-height: 1;
	padding-bottom: 0;
}
.heading-section-white h2{
	color: #ffffff;
}
.heading-section-white .subheading{
	margin-bottom: 0;
	display: inline-block;
	font-size: 13px;
	text-transform: uppercase;
	letter-spacing: 2px;
	color: rgba(255,255,255,.4);
}


.icon{
	text-align: center;
}
.icon img{
}


/*SERVICES*/
.services{
	background: rgba(0,0,0,.03);
}
.text-services{
	padding: 10px 10px 0; 
	text-align: center;
}
.text-services h3{
	font-size: 16px;
	font-weight: 600;
}

.services-list{
	padding: 0;
	margin: 0 0 20px 0;
	width: 100%;
	float: left;
}

.services-list img{
	float: left;
}
.services-list .text{
	width: calc(100% - 60px);
	float: right;
}
.services-list h3{
	margin-top: 0;
	margin-bottom: 0;
}
.services-list p{
	margin: 0;
}

/*BLOG*/
.text-services .meta{
	text-transform: uppercase;
	font-size: 14px;
}

/*TESTIMONY*/
.text-testimony .name{
	margin: 0;
}
.text-testimony .position{
	color: rgba(0,0,0,.3);

}


/*VIDEO*/
.img{
	width: 100%;
	height: auto;
	position: relative;
}
.img .icon{
	position: absolute;
	top: 50%;
	left: 0;
	right: 0;
	bottom: 0;
	margin-top: -25px;
}
.img .icon a{
	display: block;
	width: 60px;
	position: absolute;
	top: 0;
	left: 50%;
	margin-left: -25px;
}



/*COUNTER*/
.counter{
	width: 100%;
	position: relative;
	z-index: 0;
}
.counter .overlay{
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	content: '';
	width: 100%;
	background: #000000;
	z-index: -1;
	opacity: .3;
}
.counter-text{
	text-align: center;
}
.counter-text .num{
	display: block;
	color: #ffffff;
	font-size: 34px;
	font-weight: 700;
}

.btn-ticket{
background-color: orange;
    padding: 10px;
    width: 100px;
    margin: 0 auto;
    display: block;
    text-align: center;
    border-radius: 50px;
color: #fff !important
}

.counter-text .name{
	display: block;
	color: rgba(255,255,255,.9);
	font-size: 13px;
}

.info-movie-main {
      display: flex;
      gap: 30px;
      margin-top: 30px;
    }

.info-directed {
      width: 40%;
    }

    .info-cast {
      width: 31%;
    }


/*FOOTER*/

.footer{
	color: rgba(255,255,255,.5);

}
.footer .heading{
	color: #ffffff;
	font-size: 20px;
}
.footer ul{
	margin: 0;
	padding: 0;
}
.footer ul li{
	list-style: none;
	margin-bottom: 10px;
}
.footer ul li a{
	color: rgba(255,255,255,1);
}


@media screen and (max-width: 500px) {

	.icon{
		text-align: left;
	}

	.text-services{
		padding-left: 0;
		padding-right: 20px;
		text-align: left;
	}

}
</style>


</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
	<center style="width: 100%; background-color: #f1f1f1;">
    <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
    </div>
    <div style="max-width: 600px; margin: 0 auto;" class="email-container">
    	<!-- BEGIN BODY -->
      <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">

				<tr>
          <td valign="middle" class="hero bg_white" style="background-image: url(${dataSend.poster[0].url}); background-size: cover; height: 400px;">
          
            <table>
            	<tr>
            		<td>
        
            		</td>
            	</tr>
            </table>
          </td>
	      </tr><!-- end tr -->
	      <tr>
          <td class="bg_white">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td class="bg_dark email-section">
<div class="text" style="padding: 0 3em; text-align: center;">
            				<h2 style="color: #fff"></h2>
            				
            			</div>
<a class="btn-ticket" href="http://localhost:3000/lich-chieu"> Đặt vé</a>
                  <div class="heading-section heading-section-white">
                    <h1 style="margin-top: 50px; color: #fff; margin-bottom: 0;">${dataSend.name}</h1>
                    <span>${dataSend.typeMovie}</span>
                    <p style="margin-bottom: 0; color: #fff; ">TÓM TẮT</p>
                    <p style="margin: 0; color: rgba(255,255,255,.8);">
                      ${dataSend.description}</p>
                    <div class="info-movie-main">
                      <div class="info-directed">
                        <h6 style="color: #fff">ĐẠO DIỄN</h6>
                        <p>${dataSend.director}</p>
                      </div>
                      <div class="info-cast">
                        <h6 style="color: #fff">DIỄN VIÊN</h6>
                        <p>${dataSend.cast}</p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>


            </table>

          </td>
        </tr><!-- end:tr -->
      <!-- 1 Column Text + Button : END -->
      </table>


    </div>
  </center>
</body>
</html>
    
    `;

    return result;
}






module.exports = {
    templateResetPass,
    templateActiveAccount,
    templateBooking,
    templateMovieIncoming
}

