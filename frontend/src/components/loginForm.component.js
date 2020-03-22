import React from 'react';
import "../styles/index.css";
import axios from "axios";
import { useState } from 'react';
import { setInStorage, getFromStorage } from '../utils/storage';
import { Redirect } from "react-router-dom";

function LoginForm() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [redirect, setRedirect] = useState(false);
    const localStorage = getFromStorage('mirror-token');

    return (
        <div className="login-container">
            {(localStorage || redirect) ? <Redirect to="/config" /> : ''}
            <input value={username} type="text" placeholder="nazwa użytkownika" onChange={usernameChange} />
            <input value={password} type="password" placeholder="hasło" onChange={passwordChange} />
            <div className="error">{message}</div>
            <button onClick={login}>Wyślij</button>
        </div>
    );

    function passwordChange(e) {
        setPassword(e.target.value);
    }

    function usernameChange(e) {
        setUsername(e.target.value);
    }

    function login(e) {
        e.preventDefault();

        if (!username || !password) {
            setMessage('Pola nie mogą być puste');
        } else {

            const user = {
                username: username,
                password: password
            }

            axios.post(process.env.REACT_APP_API_URL + '/api/users/login', user)
                .then(res => {
                    setUsername('');
                    setPassword('');
                    if (res.data.success) {
                        setInStorage("mirror-token", {
                            user: res.data.user
                        });
                        setRedirect(true);
                    }
                })
                .catch(error => {
                    setMessage(error.response.data);
                });
        }
    }
}

export default LoginForm;
