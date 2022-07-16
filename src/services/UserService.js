import db from "../models/index";
import bcrypt from 'bcryptjs';
require('dotenv').config();
var salt = bcrypt.genSaltSync(10);
var cloudinary = require('cloudinary').v2;
var jwt = require('jsonwebtoken');
import emailService from '../services/emailService';
import moment from 'moment';
const Sequelize = require('sequelize');
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
                    public_id: `image/avatar/${fName}`,
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



let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }

    })
}


let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: { email: email }
            })
            if (user)
                resolve(true);
            else
                resolve(false);
        } catch (e) {
            reject(e);
        }
    })
}

let handleUserLogin = async (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {

            let userData = {};
            let isExist = await checkUserEmail(email);


            if (isExist) {
                let user = await db.Users.findOne({
                    where: { email: email, roleId: 4 },
                    attributes: ['id', 'email', 'roleId', 'password', 'fullName', 'avatar', 'externalid', 'phone', 'isActive'],
                    raw: true
                })

                if (user) {
                    // compare pass //
                    let check = bcrypt.compareSync(password, user.password);


                    console.log("Check user password: ", check);

                    if (check) {
                        console.log('user: ', user)
                        if (!user.isActive) {
                            resolve({
                                errCode: -1,
                                errMessage: "User is not active"
                            })
                            return
                        }

                        userData.errorCode = 0;
                        userData.errMessage = `Ok`;

                        let cus = await db.Customer.findOne({
                            where: { externalId: user.externalid }
                        })

                        console.log('cus: ', cus);

                        delete user.password; // ko lay password cua user //
                        delete user.id;

                        user.id = cus.id;

                        console.log('user: ', user);
                        userData.user = user;

                        // // Add token code //
                        userData.user.accessToken = jwt.sign({ email: user.email, fullName: user.fullName, _id: user.id, roleId: user.roleId }, 'dkcinema', {
                            expiresIn: "1h" // it will be expired after 1 hours
                        });

                    } else {
                        userData.errorCode = 3;
                        userData.errMessage = `Wrong pass`;
                    }
                } else {
                    userData.errorCode = 2;
                    userData.errMessage = `User isn't exist`;
                }
            } else {
                userData.errorCode = 1;
                userData.errMessage = `Your's email isn't exist in our system`

            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

let handleAdminLogin = async (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.Users.findOne({
                    where: { email: email },
                    attributes: ['id', 'email', 'roleId', 'password', 'fullName', 'avatar', 'movietheaterid'],
                    raw: true
                })
                if (user) {
                    // compare pass //
                    let check = bcrypt.compareSync(password, user.password);

                    if (check) {
                        // Check có thuộc rạp //
                        if (user.roleId === 2) {


                            // let dataRes = await getMovieTheaterByUser(user.id);

                            if (!user.movietheaterid) {
                                console.log("Ok");
                                userData.errorCode = 4;
                                userData.errMessage = `Unmanaged users cinema`;
                                resolve(userData);
                                return;
                            }

                            userData.errorCode = 0;
                            userData.errMessage = `Ok`;

                            delete user.password; // ko lay password cua user //
                            userData.user = user;

                            // Add token code //
                            userData.user.accessToken = jwt.sign({ email: user.email, fullName: user.fullName, _id: user.id, roleId: user.roleId }, 'dkcinema');
                            userData.user.movietheaterid = user.movietheaterid;

                        } else {
                            userData.errorCode = 0;
                            userData.errMessage = `Ok`;

                            delete user.password; // ko lay password cua user //
                            userData.user = user;

                            // Add token code //
                            userData.user.accessToken = jwt.sign({ email: user.email, fullName: user.fullName, _id: user.id, roleId: user.roleId }, 'dkcinema');
                        }


                    } else {
                        userData.errorCode = 3;
                        userData.errMessage = `Wrong pass`;
                    }
                } else {
                    userData.errorCode = 2;
                    userData.errMessage = `User isn't exist`;
                }
            } else {
                userData.errorCode = 1;
                userData.errMessage = `Your's email isn't exist in our system`

            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}


let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.Users.findAll({
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Roles, as: 'UserRoles' },
                    { model: db.MovieTheater, as: 'UserMovieTheater' },
                ],
                raw: true,
                nest: true
            });

            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let getUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.Users.findOne({
                where: { id: userId },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Roles, as: 'UserRoles' },
                    { model: db.MovieTheater, as: 'UserMovieTheater' },
                ],
                raw: true,
                nest: true
            });

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: users
            });
        } catch (e) {
            reject(e);
        }
    })
}

let getUserByExternalId = (externalId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.Users.findOne({
                where: { externalid: externalId },
                attributes: {
                    exclude: ['password']
                },
                raw: true,
                nest: true
            });

            console.log('users: ', users)

            let customer = await db.Customer.findOne({
                where: { externalId: externalId },
                raw: true,
                nest: true
            });

            if (!users || !customer) {
                resolve({
                    errCode: -1,
                    errMessage: 'Users not found',
                });
            }

            users.id = customer.id
            users.point = customer.point;
            users.rankId = customer.rankId


            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: users
            });
        } catch (e) {
            reject(e);
        }
    })
}

// let getMovieTheaterByUser = (userId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let movieTheater = await db.MovieTheater.findOne({
//                 where: { userId: userId },
//                 raw: true,
//                 nest: true
//             })

//             resolve({
//                 errCode: 0,
//                 errMessage: 'OK',
//                 data: movieTheater
//             });
//         } catch (e) {
//             reject(e);
//         }
//     })
// }


let getUserByRole = (roleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.Users.findAll({
                where: { roleId: roleId },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Roles, as: 'UserRoles' },
                ],
                raw: true,
                nest: true
            });

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: users
            });
        } catch (e) {
            reject(e);
        }
    })
}

let makeid = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email //

            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: "Email da ton tai"
                })
            } else {
                let hashPass = await hashUserPassword(data.password);
                let result = {};
                let avatar = '';
                if (data.avatar && data.fileName) {
                    // upload cloud //
                    result = await uploadCloud(data.avatar, data.fileName);
                } else {
                    avatar = 'https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png';
                }

                let externalId = null;

                if (data.roleId === 4) {
                    externalId = makeid(16);

                    await db.Customer.create({
                        email: data.email,
                        phone: data.phone,
                        fullName: data.fullName,
                        point: null,
                        rankId: 1,
                        externalId: externalId
                    })
                }

                console.log('data: ', data);

                await db.Users.create({
                    email: data.email,
                    password: hashPass,
                    fullName: data.fullName,
                    isActive: true,
                    gender: data.gender,
                    birthday: data.birthday,
                    phone: data.phone,
                    address: data.address,
                    userName: data.userName,
                    roleId: data.roleId,
                    avatar: (result && result.secure_url) ? result.secure_url : avatar,
                    public_id_image: (result && result.public_id) ? result.public_id : '',
                    cityCode: data.cityCode,
                    districtCode: data.districtCode,
                    wardCode: data.wardCode,
                    externalid: (data.roleId === 4) ? externalId : null,
                    movietheaterid: (data.movietheaterid) ? data.movietheaterid : null
                })

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                }); // return 
            }


        } catch (e) {
            reject(e);
        }
    })
}

let userVerifyEmail = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('data: ', data);
            if (data.userId && data.userToken) {
                let user = await db.Users.findOne({
                    where: { id: data.userId, userToken: data.userToken },
                    raw: false
                })

                if (user) {
                    user.isActive = 1;
                    await user.save();

                    resolve({
                        errCode: 0,
                        message: "Active User Success"
                    });
                }
            }

        } catch (e) {
            reject(e);
        }
    })
}

let sendMailResetPass = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.email) {
                let user = await db.Users.findOne({
                    where: { email: data.email },
                    raw: false
                })

                if (!user) {
                    resolve({
                        errCode: -1,
                        errMessage: "User not found"
                    });
                    return;
                }

                let m_token = makeid(32);


                await db.Reset_pass.create({
                    m_email: data.email,
                    m_numcheck: 0,
                    m_token: m_token
                })

                // // send mail reset pass //
                let obj = {};
                obj.email = Buffer.from(data.email).toString('base64');
                obj.m_token = m_token;
                obj.reciverEmail = data.email;
                emailService.sendEmailResetPass(obj);


                resolve({
                    errCode: 0,
                    errMessage: "Send mail Success"
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}


let requiredResetPass = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.email && data.token) {
                let user = await db.Reset_pass.findOne({
                    where: { m_email: data.email },
                    raw: true
                })

                if (!user) {
                    resolve({
                        errCode: -1,
                        errMessage: "User not found"
                    });
                    return;
                }


                let numCheck = user.m_numcheck;


                if (data.token !== user.m_token) {
                    numCheck += 1;

                    if (numCheck > 3) {
                        await db.Reset_pass.destroy({
                            where: { m_email: data.email }
                        })
                    }
                    resolve({
                        errCode: -1,
                        errMessage: "Dữ liệu không hợp lệ"
                    });
                    return;
                } else {
                    var start = moment(user.createdAt, "YYYY-MM-DD");
                    var end = moment(new Date(), "YYYY-MM-DD");

                    let checkDay = moment.duration(start.diff(end)).asDays();

                    if (checkDay > 1) {
                        await db.Reset_pass.destroy({
                            where: { m_email: data.email }
                        })
                        resolve({
                            errCode: -1,
                            errMessage: "Link reset password hết hạn"
                        });
                        return;
                    }
                }


                resolve({
                    errCode: 0,
                    errMessage: "OK"
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}



let resetNewPass = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.email) {
                let userRequired = await db.Reset_pass.findOne({
                    where: { m_email: data.email },
                    raw: false
                })

                if (!userRequired) {
                    resolve({
                        errCode: -1,
                        errMessage: "User not found"
                    });
                    return;
                }

                let userData = await db.Users.findOne({
                    where: { email: data.email },
                    raw: false
                })

                if (!userData) {
                    resolve({
                        errCode: -1,
                        errMessage: "User not found"
                    });
                    return;
                }

                let hashPass = await hashUserPassword(data.password);

                userData.password = hashPass;

                userData.save();

                await db.Reset_pass.destroy({
                    where: { m_email: data.email }
                })


                resolve({
                    errCode: 0,
                    errMessage: "OK"
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}


let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email //
            if (!data.id && !data.externalid) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let user = {};
                if (data.id) {
                    user = await db.Users.findOne({
                        where: { id: data.id },
                        raw: false
                    })
                }
                if (data.externalid) {
                    user = await db.Users.findOne({
                        where: { externalid: data.externalid },
                        raw: false
                    })
                }

                if (user) {
                    let result = {};
                    // Có truyền image //
                    if (data.avatar && data.fileName) {
                        if (user.avatar && user.public_id_image) // có lưu trong db //
                        {
                            // Xóa hình cũ //
                            await cloudinary.uploader.destroy(user.public_id_image, { invalidate: true, resource_type: "raw" },
                                function (err, result) { console.log(result) });

                        }
                        // upload cloud //
                        result = await uploadCloud(data.avatar, data.fileName);
                    }


                    user.fullName = data.fullName;
                    user.birthday = data.birthday;
                    user.gender = data.gender;
                    // user.roleId = data.roleId;
                    user.phone = data.phone;
                    user.cityCode = data.cityCode;
                    user.districtCode = data.districtCode;
                    user.wardCode = data.wardCode;
                    user.address = data.address;
                    user.movietheaterid = (data.movietheaterid) ? data.movietheaterid : null

                    if (data.avatar && data.fileName) {
                        user.avatar = result.secure_url;
                        user.public_id_image = result.public_id;
                    }

                    await user.save();

                    resolve({
                        errCode: 0,
                        message: "Update User Success"
                    });

                } else {
                    resolve({
                        errorCode: 1,
                        errMessage: "User not found"
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                }); // return 
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getAllStaff = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {
                let listUsers = [];
                if (data.movieTheaterId) {
                    listUsers = await db.Users.findAll({
                        where: {
                            [Op.and]: [

                                data.movieTheaterId &&
                                {
                                    movietheaterid: data.movieTheaterId
                                },
                                {
                                    roleId: {
                                        [Op.or]: [3, 5]
                                    }
                                }
                            ]
                        },

                        attributes: {
                            exclude: ['password']
                        },
                        include: [
                            { model: db.Roles, as: 'UserRoles' },
                            { model: db.MovieTheater, as: 'UserMovieTheater' },
                        ],
                        raw: true,
                        nest: true
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: listUsers
                }); // return 
            }

            resolve({
                errCode: 2,
                errMessage: 'Missing data'
            }); // return 

        } catch (e) {
            reject(e);
        }
    })
}



let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.Users.findOne({
            where: { id: id }
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: 'User ko ton tai'
            })
        }

        if (user.avatar && user.public_id_image) {
            // Xóa hình cũ //
            await cloudinary.uploader.destroy(user.public_id_image, { invalidate: true, resource_type: "raw" },
                function (err, result) { console.log(result) });
        }

        await db.Users.destroy({
            where: { id: id }
        });

        if (user.roleId === 4) {
            await db.Customer.destroy({
                where: { externalId: user.externalid }
            });
        }

        resolve({
            errCode: 0,
            errMessage: "Delete user ok"
        })
    })
}


let getAllRoles = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataRoles = await db.Roles.findAll();

            if (dataRoles) {
                resolve({
                    errCode: 0,
                    dataRoles: dataRoles
                })
            } else {
                resolve({
                    errCode: 1,
                    dataRoles: []
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}



let signUpNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email //
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: "Email da ton tai"
                })
            } else {
                let hashPass = await hashUserPassword(data.password);

                let avatar = 'https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png';

                // Create external Id

                let externalId = makeid(16);
                let userToken = makeid(30);

                await db.Customer.create({
                    email: data.email,
                    phone: data.phone,
                    fullName: data.fullName,
                    point: null,
                    rankId: null,
                    externalId: externalId
                })


                await db.Users.create({
                    email: data.email,
                    password: hashPass,
                    fullName: data.fullName,
                    phone: data.phone,
                    isActive: false,
                    gender: data.gender,
                    birthday: data.birthday,
                    roleId: 4,
                    avatar: avatar,
                    public_id_image: '',
                    cityCode: data.cityCode || null,
                    districtCode: data.districtCode || null,
                    wardCode: data.wardCode || null,
                    address: data.address || null,
                    externalid: externalId,
                    userToken: userToken
                }).then(function (x) {
                    if (x.id) {

                        // send mail //
                        let obj = {};
                        obj.userId = x.id;
                        obj.userToken = userToken;
                        obj.reciverEmail = data.email;

                        emailService.sendEmailActive(obj);


                        resolve({
                            errCode: 0,
                            errMessage: 'OK',
                            result: x.id
                        });
                        return

                    }
                })

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                })

            }

        } catch (e) {
            reject(e);
        }
    })
}



let feedbackCustomer = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing data',
                })
            }

            await db.Feedback.create({
                email: data.email,
                fullName: data.fullName,
                phone: data.phoneNumber,
                content: data.content,
                cusId: data.cusId || null
            })

            resolve({
                errCode: 0,
                errMessage: 'OK',
            })



        } catch (e) {
            reject(e);
        }
    })
}



module.exports = {
    handleUserLogin,
    getAllUser,
    createNewUser,
    getUserById,
    updateUser,
    deleteUser,
    getAllRoles,
    signUpNewUser,
    getUserByRole,
    // getMovieTheaterByUser,
    handleAdminLogin,
    getUserByExternalId,
    userVerifyEmail,
    sendMailResetPass,
    requiredResetPass,
    resetNewPass,
    getAllStaff,
    feedbackCustomer
}