import db from "../models/index";
require('dotenv').config();
var cloudinary = require('cloudinary').v2;
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



let createNewPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let result = {};
            if (data.thumbnail && data.fileName) {
                // upload cloud //
                result = await uploadCloud(data.thumbnail, data.fileName);
            } else {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing thumbnail'
                }); // return 
            }


            await db.News.create({
                title: data.title,
                noiDung: data.noiDung,
                tomTat: data.tomTat,
                userId: data.userId,
                type: data.type,
                rating: 0,
                status: true,
                thumbnail: (result && result.secure_url) ? result.secure_url : '',
                public_id_url: (result && result.public_id) ? result.public_id : '',
            })

            resolve({
                errCode: 0,
                errMessage: 'OK'
            }); // return 


        } catch (e) {
            reject(e);
        }
    })
}



let postComment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (data.rating) {
                await db.Comment.create({
                    comment: data.comment,
                    rating: +data.rating,
                    cusId: data.cusId,
                    newsId: data.newsId,
                })

                let check = await db.Vote_News.findOne({
                    where: { cusId: data.cusId }
                })
                console.log(check);
                if (!check) {
                    await db.Vote_News.create({
                        rating: +data.rating,
                        cusId: data.cusId,
                        newsId: data.newsId,
                    });
                    // update rating news //
                    let voteFive = await db.Vote_News.count({ where: { rating: 5, newsId: data.newsId } });
                    let voteFour = await db.Vote_News.count({ where: { rating: 4, newsId: data.newsId } });
                    let voteThree = await db.Vote_News.count({ where: { rating: 3, newsId: data.newsId } });
                    let voteTwo = await db.Vote_News.count({ where: { rating: 2, newsId: data.newsId } });
                    let voteOne = await db.Vote_News.count({ where: { rating: 1, newsId: data.newsId } });

                    // console.log('voteFive: ', voteFive);
                    // console.log('voteFour: ', voteFour);
                    // console.log('voteThree: ', voteThree);
                    // console.log('voteTwo: ', voteTwo);
                    // console.log('voteOne: ', voteOne);

                    // (5*252 + 4*124 + 3*40 + 2*29 + 1*33) / (252+124+40+29+33) = 4.11 and change

                    let calRating = (5 * voteFive + 4 * voteFour + 3 * voteThree + 2 * voteTwo + 1 * voteOne) / (voteFive + voteFour + voteThree + voteTwo + voteOne);

                    console.log('calRating: ', calRating);

                    let newsData = await db.News.findOne({
                        where: { id: data.newsId },
                        raw: false
                    })

                    if (newsData) {
                        newsData.rating = calRating;
                        newsData.save();
                    }
                }


                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                }); // return 
                return;

            } else {
                await db.Comment.create({
                    comment: data.comment,
                    cusId: data.cusId,
                    newsId: data.newsId,
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


let voteNewsRating = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (data.rating) {

                let check = await db.Vote_News.findOne({
                    where: { cusId: data.cusId, newsId: data.newsId }
                })
                console.log(check);
                if (!check) {
                    await db.Vote_News.create({
                        rating: +data.rating,
                        cusId: data.cusId,
                        newsId: data.newsId,
                    });
                    // update rating news //
                    let voteFive = await db.Vote_News.count({ where: { rating: 5, newsId: data.newsId } });
                    let voteFour = await db.Vote_News.count({ where: { rating: 4, newsId: data.newsId } });
                    let voteThree = await db.Vote_News.count({ where: { rating: 3, newsId: data.newsId } });
                    let voteTwo = await db.Vote_News.count({ where: { rating: 2, newsId: data.newsId } });
                    let voteOne = await db.Vote_News.count({ where: { rating: 1, newsId: data.newsId } });

                    // console.log('voteFive: ', voteFive);
                    // console.log('voteFour: ', voteFour);
                    // console.log('voteThree: ', voteThree);
                    // console.log('voteTwo: ', voteTwo);
                    // console.log('voteOne: ', voteOne);

                    // (5*252 + 4*124 + 3*40 + 2*29 + 1*33) / (252+124+40+29+33) = 4.11 and change

                    let calRating = (5 * voteFive + 4 * voteFour + 3 * voteThree + 2 * voteTwo + 1 * voteOne) / (voteFive + voteFour + voteThree + voteTwo + voteOne);

                    console.log('calRating: ', calRating);

                    let newsData = await db.News.findOne({
                        where: { id: data.newsId },
                        raw: false
                    })

                    if (newsData) {
                        newsData.rating = calRating;
                        newsData.save();
                    }
                } else {
                    resolve({
                        errCode: -1,
                        errMessage: 'You has already vote'
                    }); // return 
                    return;
                }


                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                }); // return 
                return;

            } else {

                resolve({
                    errCode: -1,
                    errMessage: 'Missing rating'
                }); // return 
            }


        } catch (e) {
            reject(e);
        }
    })
}



let getListNews = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let status = '';

            (+data.status === 1 || data.status === true) ? status = true : status = false

            let listPost = await db.News.findAll({
                where: {
                    [Op.and]: [
                        data.status &&
                        {
                            status: {
                                [Op.or]: [(data.status) ? status : null, null]
                            }
                        },
                        data.type &&
                        {
                            type: {
                                [Op.or]: [(+data.type) ? +data.type : null, null]
                            }
                        },

                    ]
                },
                include: [
                    {
                        model: db.Users, as: 'UserNews', attributes: ['id', 'fullName'],
                    },
                    {
                        model: db.Comment, as: 'CommentNews', include: { model: db.Customer, as: 'CustomerComment', attributes: ['id', 'fullName'] },
                    },
                ],

                order: [
                    ['id', 'DESC'],
                ],
                raw: false,
                nest: true
            })

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: listPost
            }); // return 


        } catch (e) {
            reject(e);
        }
    })
}


let getDetailComment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {


            let listComment = await db.Comment.findAll({
                where: {
                    newsId: data.newsId
                },
                include: [
                    {
                        model: db.Customer, as: 'CustomerComment', attributes: ['id', 'fullName'],
                    },
                ],

                order: [
                    ['id', 'DESC'],
                ],
                raw: false,
                nest: true
            })

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: listComment
            }); // return 


        } catch (e) {
            reject(e);
        }
    })
}



let getDetailNews = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataPost = await db.News.findOne({

                where: { id: id },
                include: [
                    { model: db.Comment, as: 'CommentNews', include: [{ model: db.Customer, as: 'CustomerComment', attributes: ['fullName'] }] },
                ],

                raw: false,
                nest: true
            });

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: dataPost
            });
        } catch (e) {
            reject(e);
        }
    })
}



let updateStatusNews = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let news = await db.News.findOne({
                    where: { id: data.id },
                    raw: false
                })

                let status = '';
                (+data.status === 1 || data.status === true) ? status = true : status = false


                news.status = status;
                await news.save();

                resolve({
                    errCode: 0,
                    message: "Update Status news Success"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}


let updateNews = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email //
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let news = await db.News.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (news) {
                    let result = {};

                    // Có truyền image //
                    if (data.thumbnail && data.fileName) {
                        if (news.thumbnail && news.public_id_url) // có lưu trong db //
                        {
                            // Xóa hình cũ //
                            await cloudinary.uploader.destroy(news.public_id_url, { invalidate: true, resource_type: "raw" },
                                function (err, result) { console.log(result) });

                        }
                        // upload cloud //
                        result = await uploadCloud(data.thumbnail, data.fileName);


                    }

                    news.title = data.title;
                    news.noiDung = data.noiDung;
                    news.tomTat = data.tomTat;
                    news.type = data.type;


                    if (data.thumbnail && data.fileName) {
                        news.thumbnail = result.secure_url;
                        news.public_id_url = result.public_id;
                    }

                    await news.save();

                    resolve({
                        errCode: 0,
                        message: "Update News Success"
                    });

                } else {
                    resolve({
                        errorCode: 1,
                        errMessage: "News not found"
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



let deleteNews = (id) => {
    return new Promise(async (resolve, reject) => {
        let news = await db.News.findOne({
            where: { id: id }
        })
        if (!news) {
            resolve({
                errCode: 2,
                errMessage: 'News not found'
            })
        }

        if (news.thumbnail && news.public_id_url) {
            // Xóa hình cũ //
            await cloudinary.uploader.destroy(news.public_id_url, { invalidate: true, resource_type: "raw" },
                function (err, result) { console.log(result) });
        }

        await db.Comment.destroy({
            where: { newsId: id }
        });
        await db.Vote_News.destroy({
            where: { newsId: id }
        });

        await db.News.destroy({
            where: { id: id }
        });
        resolve({
            errCode: 0,
            errMessage: "Delete news ok"
        })
    })
}


let deleteComment = (id) => {
    return new Promise(async (resolve, reject) => {
        let comments = await db.Comment.findOne({
            where: { id: id }
        })
        if (!comments) {
            resolve({
                errCode: 2,
                errMessage: 'Comments not found'
            })
        }


        await db.Comment.destroy({
            where: { id: id }
        });
        resolve({
            errCode: 0,
            errMessage: "Delete comments ok"
        })
    })
}





module.exports = {
    createNewPost,
    getListNews,
    getDetailNews,
    updateStatusNews,
    updateNews,
    deleteNews,
    postComment,
    voteNewsRating,
    getDetailComment,
    deleteComment
}