const express = require('express');
const Tasks = require('../models/tasks');
const auth = require ('../middleware/auth')
const router = express.Router();

router.post('/tasks',auth,async (req,res) =>{
    //const tasks = new Tasks(req.body);
    const tasks = new Tasks({
        ...req.body,
        owner : req.user._id
    })

    try {
        await tasks.save();
        res.status(201).send(tasks)
    } catch(error){
        res.status(400).send(error)
    }
  

})
// GET /tasks?completed=true
// GET /tasks?limit = 2 $ skip = 0
// GET /tasks?sortBy=createdAt:desc


router.get('/tasks',auth,async(req,res)=>{
    const match = {};
    const sort = {};


    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1]==='desc'? -1 : 1 
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks)
    } catch (error) {
            res.status(404).send()
    }

});

router.get('/tasks/:id',auth, async (req,res) =>{

    const _id = req.params.id;
    try{
       const task = await Tasks.findOne({_id, owner:req.user._id})
       console.log(task)
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(error){
        res.status(500).send(error);
    };
    
   
});


router.patch('/tasks/:id',auth, async (req,res) =>{
    const taskUpdates = Object.keys(req.body);

    const allowedTaskUpdates = ['description','completed'];
    const isValid = taskUpdates.every(el=>allowedTaskUpdates.includes(el));
  
    if(!isValid){
        return res.status(400).send('Invalid updates for task3');
    }
    try{
        const task = await Tasks.findOne({_id: req.params.id, owner: req.user._id});

        if(!task){
         return res.status(404).send()
        }
        taskUpdates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.send(task)
    } catch(error){
        res.status(500).send(error)
    }
    
});


router.delete('/tasks/:id', auth, async (req,res) =>{
    const _id = req.params.id;
    try{
        const task = await Tasks.findOneAndDelete({_id , owner: req.user._id});
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(error){
        res.status(500).send()
    };

});

module.exports = router;
