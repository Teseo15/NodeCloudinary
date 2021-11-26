const { Router } = require("express");
const Photo = require("../models/photo");
const Cloudinary = require('cloudinary');
const User = require("../models/user");

Cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

});
const fs = require('fs-extra');
const user = require("../models/user");

const  router =Router();

//GALERIA
router.get('/',async (req,res)=>{
    const photos =  await Photo.find();
    console.log("ARREGLO",photos);
    res.render('image',{photos});
});

router.get('/images/add',async (req,res)=>{
    const photos =  await Photo.find();
    res.render('image_form',{photos});
});

router.post('/images/add', async(req,res)=>{
    const {title, description} = req.body;
    console.log("FILE:",req.file);
    const result = await Cloudinary.v2.uploader.upload(req.file.path);
    console.log("RESULT:",result);
    const newPhoto= new Photo({
        title,
        description,
        imageURL:result.url,
        public_id:result.public_id
    });
    
    await newPhoto.save();
    await fs.unlink(req.file.path);
    res.redirect('/');
});

router.get('/images/delete/:photo_id', async(req,res) =>{
    const { photo_id} = req.params;
    const photo = await Photo.findByIdAndDelete(photo_id);
    const result = await Cloudinary.v2.uploader.destroy(photo.public_id);
    console.log(result);
    res.redirect('/images/add');
})

//Contactos

router.get('/contactos',async (req,res)=>{
    const users =  await User.find();
    console.log("ARREGLO",users);
    res.render('contacto',{users});
});

//Listar
router.get('/contactos/add',async (req,res)=>{
    const users =  await User.find();
   
    res.render('contacto_form',{users});
});

//Agregar

router.post('/contactos/add', async(req,res)=>{
    const {name, lastname, email} = req.body;
    console.log("FILE:",req.file);
    const result = await Cloudinary.v2.uploader.upload(req.file.path);
    console.log("RESULT:",result);
    const newUser= new User({
        name,
        lastname,
        email,
        imageURL:result.url,
        public_id:result.public_id
    });
    
    await newUser.save();
    await fs.unlink(req.file.path);
    res.redirect('/contactos');
});

//Eliminar
router.get('/contactos/delete/:user_id', async(req,res) =>{
    const { user_id} = req.params;
    const user = await User.findByIdAndDelete(user_id);
    const result = await Cloudinary.v2.uploader.destroy(user.public_id);
    console.log(result);
    res.redirect('/contactos/add');
})

module.exports = router;