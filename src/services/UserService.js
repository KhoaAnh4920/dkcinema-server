import db from "../models/index";
import bcrypt from 'bcryptjs';
require('dotenv').config();
var salt = bcrypt.genSaltSync(10);
var cloudinary = require('cloudinary').v2;
var jwt = require('jsonwebtoken');



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
                    where: { email: email },
                    attributes: ['id', 'email', 'roleId', 'password', 'fullName', 'avatar'],
                    raw: true
                })
                if (user) {
                    // compare pass //
                    let check = bcrypt.compareSync(password, user.password);


                    console.log("Check user password: ", check);

                    if (check) {
                        userData.errorCode = 0;
                        userData.errMessage = `Ok`;

                        delete user.password; // ko lay password cua user //
                        userData.user = user;

                        // Add token code //
                        userData.user.accessToken = jwt.sign({ email: user.email, fullName: user.fullName, _id: user.id, roleId: user.roleId }, 'dkcinema');

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
                    attributes: ['id', 'email', 'roleId', 'password', 'fullName', 'avatar'],
                    raw: true
                })
                if (user) {
                    // compare pass //
                    let check = bcrypt.compareSync(password, user.password);

                    if (check) {

                        if (user.roleId === 2) {
                            // Check có quản lý rạp ko //
                            let dataRes = await getMovieTheaterByUser(user.id);
                            console.log("Check dataRes: ", dataRes);
                            if (dataRes.data === null) {
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
                            userData.user.movieTheaterId = dataRes.data.id

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

let getMovieTheaterByUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let movieTheater = await db.MovieTheater.findOne({
                where: { userId: userId },
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: movieTheater
            });
        } catch (e) {
            reject(e);
        }
    })
}


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
                    wardCode: data.wardCode
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

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email //
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let user = await db.Users.findOne({
                    where: { id: data.id },
                    raw: false
                })
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
                    user.roleId = data.roleId;
                    user.phone = data.phone;
                    user.cityCode = data.cityCode;
                    user.districtCode = data.districtCode;
                    user.wardCode = data.wardCode;
                    user.address = data.address;

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

                await db.Users.create({
                    email: data.email,
                    password: hashPass,
                    fullName: data.fullName,
                    isActive: false,
                    gender: data.gender,
                    birthday: data.birthday,
                    roleId: 1,
                    avatar: avatar,
                    public_id_image: '',
                    cityCode: data.cityCode,
                    districtCode: data.districtCode,
                    wardCode: data.wardCode,
                    address: data.addres
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
    getMovieTheaterByUser,
    handleAdminLogin
}