const express = require('express');
const Model = require("../model/sample")
const router = express.Router()

//POST
router.post('/postNew',async (req,res)=>{
    const data = new Model({
        name:req.body.name,
        age:req.body.age
    })
    try{
        const dataSave = await data.save();
        res.status(200).json(dataSave)
    }catch(error){
        res.status(400).json({message:error.message})
    }
})

//GetAll
router.get('/getAll', async (req,res)=>{
    try{
        const data = await Model.find();
        res.json(data)
    }catch(e){
        res.status(500).json({message: e.message})
    }
})

//Get by ID Method
router.get('/getOne', async (req, res) => {
    try{
        const data = await Model.findById(req.query.id);//req.params.id ->/getone/:id
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;