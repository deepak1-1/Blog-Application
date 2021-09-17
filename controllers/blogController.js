
const jwt = require('jsonwebtoken');
const loginDataModel = require('../models/signModel.ejs');
const userDataModel = require('../models/userDataModel.ejs');
const requestModel = require('../models/requestModel.ejs');
const notificationModel = require('../models/notificationModel.ejs');
const blogDataModel = require('../models/blogDataModel.ejs')





const create_blog = async (req, res)=>{

    const imagesPath = [];
    req.files.forEach( data=>{
        data.destination = data.destination.replace('./public', '');
        imagesPath.push( `${data.destination}${data.filename}` )
    })

    let private, title, data, tags;
    
    if(req.body.publicPrivate === 'public'){
        private = false;
    } else {
        private = true 
    }

    const blogSave = blogDataModel({
        private,
        imagesPath,
        likesUsername: [],
        title: req.body.title,
        data: req.body.blog,
        tags: req.body.tags,
        createdTimestamp: Date.now(),
        createdBy: req.data,
        username: req.data.username
    })

    blogSave.save()
        .then(result=>{

            if(private){
                userDataModel.updateOne({username: req.data.username},
                                        {$addToSet: {privatePosts: result.id}},
                                        {upsert: false},
                                        (err, data)=>{
                                            if(err){
                                                console.log(err);
                                            } else {
                                                res.send({created: true});
                                            }
                                        })
            } else {

                userDataModel.updateOne({username: req.data.username},
                                        {$addToSet: {posts: result.id}},
                                        {upsert: false},
                                        (err, data)=>{
                                            if(err){
                                                console.log(err);
                                            } else {
                                                res.send({created: true});
                                            }
                                        })

            }
        })
        .catch(err=>{
            console.log(err);
            res.send({created: false})
        })
}


module.exports = {
    create_blog
};