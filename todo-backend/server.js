const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')

const app = express();
app.use(express.json())
app.use(cors())

//Create in-memory storage
//let todos = [];

//Creating Schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
});

const todosModel = mongoose.model('todos', todoSchema);

//COnnection to MongoDB
mongoose.connect('mongodb://localhost:27017/todo')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

//Create item
app.post('/todos', async (req, res) => {
    const {title, description} = req.body;
    try{
        const newTodo = new todosModel({title, description})
        await newTodo.save()
        res.status(201).json(newTodo);
    }catch(err){
        console.log(err)
        res.status(500).json({message: err.message})

    }
});

//get all items
app.get('/todos', async (req, res) => {
    try{
        const todos = await todosModel.find()
        res.json(todos);
    }catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }

});

//Update a todo item
app.put("/todos/:id", async (req, res) => {
    try{

        const {title, description} = req.body;
        const id = req.params.id
        const updatedTodo = await todosModel.findByIdAndUpdate(
            id,
            {title, description},
            { new: true, runValidators: true }
        )

        if(!updatedTodo){
            return res.status(404).json({message: "Todo not found"})
        }
        res.json(updatedTodo);
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
})

//Delete a TODO item
app.delete('/todos/:id', async (req,res) => {
    try{
        const id = req.params.id;
        await todosModel.findByIdAndDelete(id)
        res.status(204).send();
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: err.message})
    }  
})

//start to server
const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});