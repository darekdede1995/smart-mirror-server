import React from 'react';
import "../styles/index.css";
import axios from "axios";
import { useState } from 'react';
import { getFromStorage, clearStorage } from '../utils/storage';
import { Redirect } from "react-router-dom";
import { storage } from '../firebase';

function ConfigPage() {

    const localStorage = getFromStorage('mirror-token');
    const [redirect, setRedirect] = useState(false);
    const [photo, setPhoto] = useState('');
    const [progress, setProgress] = useState(0);


    return (
        <div className="config-container">
            <progress hidden={progress === 0 ? true : false} value={progress} max="100" />
            {(!localStorage || redirect) ? <Redirect to="/" /> : ''}
            <input type="file" onChange={onChangePhoto} />
            <button onClick={uploadPhoto}>upload photo</button>
            <button onClick={logout}>logout</button>
        </div>
    );

    function uploadPhoto(e) {
        e.preventDefault();

        const uploadTask = storage.ref(`images/${localStorage.user.number}`).put(photo);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progress);
        }, (error) => {
            console.log(error);
        }, () => {
            storage.ref('images').child(`${localStorage.user.number}`).getDownloadURL().then(url => {
                console.log(url);
            })
        });
    }

    function onChangePhoto(e) {
        setPhoto(e.target.files[0]);
    }

    function logout() {
        clearStorage('mirror-token');
        setRedirect(true);
    }

}

export default ConfigPage;
