import axiosInstance from './url.service';

export const createTodo = async(todoData) => {
    try {
        const response = await axiosInstance.post('/user/todos', todoData);
        return response.data;
    } catch (error) {
        console.log('createTodo error:',error);
        throw error.response.message;
    }
}

export const getTodosByUserId = async() => {
    try {
        const response = await axiosInstance.get('/user/todos');
        return response.data;
    } catch (error) {
        console.log('createTodo error:',error);
        throw error.response.message;
    }
}
export const updateTodosByUserId = async(id,updateTodoData) => {
    try {
        const response = await axiosInstance.put(`/user/todos/${id}`, updateTodoData);
        return response.data;
    } catch (error) {
        console.log('createTodo error:',error);
        throw error.response.message;
    }
}
export const deleteTodosByUserId = async(id) => {
    try {
        const response = await axiosInstance.delete(`/user/todos/${id}`);
        return response.data;
    } catch (error) {
        console.log('createTodo error:',error);
        throw error.response.message;
    }
}