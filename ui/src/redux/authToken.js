import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const isTokenPresent = () => {
    // Retrieve the 'token' cookie from the browser's cookies (if any).
    const token = cookies.get('token');
    return token;

}