import React from 'react';
import "../styles/index.css";
import axios from "axios";
import { useState } from 'react';


function RegisterForm(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [message, setMessage] = useState('');

    return (
        <div className="register-container">
            <input value={username} type="text" placeholder="Nazwa użytkownika" onChange={usernameChange} />
            <input value={password} type="password" placeholder="Hasło" onChange={passwordChange} />
            <input value={repeatPassword} type="password" placeholder="Powtórz hasło" onChange={repeatPasswordChange} />
            <div className="error">{message}</div>
            <button onClick={register}>Wyślij</button>
        </div>
    );

    function passwordChange(e) {
        setPassword(e.target.value);
    }

    function repeatPasswordChange(e) {
        setRepeatPassword(e.target.value);
    }

    function usernameChange(e) {
        setUsername(e.target.value);
    }

    function register(e) {
        e.preventDefault();

        if (!username || !password || !repeatPassword) {
            setMessage('Pola nie mogą być puste');
        } else if (password !== repeatPassword) {
            setMessage('Hasła muszą być identyczne');
        } else {

            const user = {
                username: username,
                password: password
            }

            axios
                .post(process.env.REACT_APP_API_URL + '/api/users/register', user)
                .then(res => {
                    props.onSubmit();
                    setUsername('');
                    setPassword('');
                    setRepeatPassword('');
                })
                .catch(error => {
                    console.log(error);
                    setMessage(error.response.data);
                });
        }

    }
}

export default RegisterForm;
