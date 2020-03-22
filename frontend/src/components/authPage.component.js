import React from 'react';
import "../styles/index.css";
import axios from "axios";
import { getFromStorage } from '../utils/storage';
import { Redirect } from "react-router-dom";

function AuthPage() {

    const localStorage = getFromStorage('mirror-token');

    return (
        <div className="config-container">
            {setCode()}
        </div>
    );

    function setCode() {

        const queryString = window.location.search;

        if (queryString.includes('code')) {
            const urlParams = new URLSearchParams(queryString);
            const code = urlParams.get('code')
            const scope = urlParams.get('scope')

            const data = {
                user: localStorage.user,
                code: code,
                scope: scope
            }

            axios.post(process.env.REACT_APP_API_URL + '/api/users/code', data)
                .then(res => {
                    window.close();
                })
                .catch(error => {
                    console.log(error.response);
                });
        }

        if (queryString.includes('token')) {

        }
        // const data = {
        //     user: localStorage.user,
        //     code: code
        // }

        // axios.post(process.env.REACT_APP_API_URL + '/api/users/code', data)
        //     .then(res => {
        //         window.close();
        //     })
        //     .catch(error => {
        //         console.log(error.response);
        //     });
    }
}

export default AuthPage;
