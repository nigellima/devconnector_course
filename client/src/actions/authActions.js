import { GET_ERRORS, SET_CURRENT_USER  } from './types'
import  setAuthToken  from '../utils/setAuthToken'
import axios from 'axios';
import jwt_decode from 'jwt-decode';

//Regiister user
export const registeruser = (userData, history) => dispatch =>  {
    axios.post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(error => 
            dispatch({
                type: GET_ERRORS,
                payload: error.response.data
            })
        );
}


//Login user
export const login = userData => dispatch =>  {
    axios.post('/api/users/login', userData)
        .then(res => {
            console.log(res);

            //save token to localStorage
            const { token } = res.data;

            localStorage.setItem('jwtToken', token);

            //Set token to auth header
            setAuthToken(token);

            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));
        })
        .catch(error => 
            dispatch({
                type: GET_ERRORS,
                payload: error.response.data
            })
        );
}


//Set logged in user
export const setCurrentUser = decoded =>  {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}



//Log out user
export const logout = () => dispatch =>  {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
}