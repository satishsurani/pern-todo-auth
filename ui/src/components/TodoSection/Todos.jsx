import React, { useEffect, useState } from 'react'
import { deleteTodosByUserId, getTodosByUserId, updateTodosByUserId } from '../../service/todo.service';
import { toast } from 'react-toastify';
import ListTodos from './ListTodos';

const Todos = () => {
  const [todos, SetTodos] = useState([]);

  useEffect(()=>{
    const getTodos = async () => {
      try {
        const result = await getTodosByUserId()
        if (result?.data) {
          SetTodos(result.data);
        } else {
          console.error("Unexpected response format:", result);
          SetTodos([]);
        }
      } catch (error) {
        console.log('failed to get todos', error)
        SetTodos([]);
      }
    }
    getTodos()
  },[])
  
  const handleUpdateTodo = async(id, data) => {
    try {
      await updateTodosByUserId(id,data)
      SetTodos(prevTodos => prevTodos.map(todo =>todo.id === id ? {...todo, ...data}: todo)) 
    } catch (error) {
      console.log('failed updated successfully');
      toast.error('Failed to update todo')
    }
  }

  const handleDeleteTodo = async(id) => {
    try {
      await deleteTodosByUserId(id)
      SetTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      toast.success('todo deleted successfully')
    } catch (error) {
      console.log('failed to delete todo')
      toast.error('faile to delete todo')
    }
  }

  return (
    <div className='container mx-auto p-6'>
      <ListTodos
          todos={todos}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
      />
    </div>
  )
}

export default Todos