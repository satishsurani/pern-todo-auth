const model = require('../models');
const {generateUUID} = require('../utils/generateUUID')
const {responde} = require('../utils/responseHandler')

const createTodos = async (req, res) => {
    try {
        const id = generateUUID();
        const userId = req.user.userId;
        const {title,description,dueDate} = req.body;

        const newTodos = await model.Todo.create({
            id, 
            title, 
            description, 
            dueDate,
            userId
        })

        return responde(res,201,"Todos created successfully",newTodos)
    } catch (error) {
        console.error('error creating todos:', error)
        return responde(res,500,'Internal server error')
    }
}

const getTodosByUserId = async(req,res) => {
    try {
        const userId = req.user.userId;
        const todos = await model.Todo.findAll({where:{userId}})
        return responde(res,200,"todos get successfully",todos)
    } catch (error) {
        console.error("error getting todos", error)
        return responde(res,500,"something went wrong")
    }
}

const updateTodos = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {id} = req.params;
        const {title, description, dueDate, isCompleted} = req.body;
        
        const todo = await model.Todo.findOne({where:{id,userId}})
        if(!todo) return responde(res,400,"todos not found by this id")

        todo.title = title || todo.title
        todo.description= description || todo.description
        todo.dueDate= dueDate || todo.dueDate
        todo.isCompleted= isCompleted || todo.isCompleted

        await todo.save();
        return responde(res,200,"todo saved successfully", todo)

    } catch (error) {
        console.error("Error updating todos: ", error)
        return responde(res,500,"something went wrong")
    }
}

const deleteTodoByUserId = async(req,res) => {
    try {
        const userId = req.user.userId;
        const {id} = req.params;

        const todo = await model.Todo.findOne({where:{id,userId}})
        if(!todo) return responde(res,400,"todos not found by this id")
        
        await todo.destroy();
        return responde(res,200,"todo delete successfully", todo)
    } catch (error) {
        console.error("Error deleting todos: ", error)
        return responde(res,500,"something went wrong")
    }
}


module.exports = {
    createTodos,
    getTodosByUserId,
    updateTodos,
    deleteTodoByUserId   
}