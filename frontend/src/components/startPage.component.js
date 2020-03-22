import React from 'react';
import "../styles/index.css";
import { useState } from 'react';
import LoginForm from "./loginForm.component";
import RegisterForm from "./registerForm.component";
import { Link } from 'react-router-dom';

function StartPage() {

    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);

    return (
        <div className="start-container">
            <div className="button-group">
                <button className={login ? 'selected-button' : ''} onClick={loginToggle} >Zaloguj</button>
                <button className={register ? 'selected-button' : ''} onClick={registerToggle}>Rejestracja</button>
            </div>
            <div hidden={!login}>
                <LoginForm />
            </div>
            <div hidden={!register}>
                <RegisterForm onSubmit={loginToggle} />
            </div>
        </div>
    );

    function loginToggle(e) {
        if (e) {
            e.preventDefault();
        }
        setLogin(!login);
        setRegister(false);
    }

    function registerToggle(e) {
        e.preventDefault();
        setRegister(!register);
        setLogin(false);
    }
}

export default StartPage;
