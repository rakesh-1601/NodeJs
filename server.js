var mongoose = require('mongoose')
var bodyParser=require('body-parser');
var express=require('express')
var Users=require('./users')
var jwt=require('jsonwebtoken')
var jsonpatch=require('fast-json-patch')
const imageThumbnail = require('image-thumbnail');
const fs=require('fs')
mongoose.connect('mongodb+srv://rakesh:rakesh123@cluster0.2euvh.mongodb.net/d1?retryWrites=true&w=majority',{ useUnifiedTopology: true, useNewUrlParser: true}).catch(err=>
{
if(err)
console.log(err)
})
var app=express()
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.post('/login',async (req,res)=>{
    name=req.body.username
    pass=req.body.password
try{
   const user=await Users.findOne({username:name,password:pass}) 
   console.log(name,pass,user)
  if(user)
  {
    const token = jwt.sign({username:name}, 'secret')
    user.token=token
    await user.save()
    return res.status(200).json(token)
  }
  else
  return res.status(500).json('Login fail')
}
catch(err){
    return res.status(500).json('something wrong')
}
})
var checkToken=async (req,res,next)=>{
    const user=await Users.findOne({token:req.body.token})
    //console.log(user)
    if(!user)
    {
        return res.status('500').json('unauthorized');
    }
   next();
}
app.patch('/applypatch',checkToken,async(req,res)=>{
    try{    
    var document = req.body.object
    var patch = req.body.patch
console.log(document,patch)
 var target = jsonpatch.applyPatch(document, patch);
 console.log(target)
    return res.status(200).json(target);
    }
    catch(err){
        console.log(err)
        return res.status(500).json('something wrong')
    }
})
app.post('/thumbnail',async (req,res)=>{
    let options = { width: 50, height: 50, responseType: 'buffer',jpegOption: { force:true, quality:100 } }
    try {
        const thumbnail = await imageThumbnail(req.body.link, options);
        fs.writeFileSync('./thumbnail.jpeg', thumbnail)
        return res.status(200).json('find thumbnail.jpeg file in current folder')
    } catch (err) {
        console.error(err);
        return res.status(500).json('something wrong')
    }
})
app.listen(5000,()=>{
    console.log('server running')
})