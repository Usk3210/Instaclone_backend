const express = require("express")
const router = express.Router()
const app = express()
const mongoose = require("mongoose")
const PostModel = require("../model/postmodel")

//Get all the posts
router.get("/allposts", async(req,res)=>{
    try{
        const posts = await PostModel.find().populate("author","_id fullname",)
        if(posts){
            return res.json({posts:posts})
        }
        return res.json({ message:"no posts available"})
    }
    catch(err){
        res.json({
            error:err.message
        })

    }
})

//get all posts of current-logged in user 
router.get("/myposts", async(req,res)=>{
//    console.log(req.user)    
    try{
        const posts = await PostModel.find({author:req.user}).populate("author", "_id fullname")
      
        if(posts){
            return res.json({posts:posts})
        }
        return res.json({ message:"no posts available"})
    }
    catch(err){
        res.json({
            error:err.message
        })

    }
})
//create post by user
router.post("/createpost", async (req, res) => {
    console.log(req.user)
    try {
        const { title, body } = req.body
     
        if (!title || !body) {
            return res.status(400).json({ error: "one or more mandatory fields empty" })
        }
        const post = await PostModel.create({
            title: title,
            body: body,
            author: req.user
        })
        post.save()
        res.json({
            status:"success",
            post

        })
        console.log(post)

    }
    catch (err) {
        return res.json({
            message: err.message
        })

    }

})


//comment route
router.put("/comment", (req, res) => {
    const comment = {
        commentText: req.body.commentText,
        commentBy: req.user._id,
    }
    try {
        const CommentUpdate = PostModel.findByIdAndUpdate(req.body._id,
            { $pull: { comment: comment } },
            { new: true }           // return updated record 
        ).populate("comments.commentBy", "_id fullname")
        if (CommentUpdate) {
            res.json(CommentUpdate)
        }
    }
    catch (err) {
        res.status(400).json({
            error:err
        })

    }


})


module.exports = router