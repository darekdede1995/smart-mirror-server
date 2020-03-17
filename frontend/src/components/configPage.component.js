import React from 'react';
import "../styles/index.css";
import axios from "axios";
import { useState } from 'react';
import { getFromStorage, clearStorage, setInStorage } from '../utils/storage';
import { Redirect } from "react-router-dom";
import { storage } from '../firebase';

function ConfigPage() {

    const localStorage = getFromStorage('mirror-token');
    const [redirect, setRedirect] = useState(false);
    const [photo, setPhoto] = useState('');
    const [progress, setProgress] = useState(0);
    const [key, setKey] = useState('');


    return (
        <div className="config-container">
            {(!localStorage || redirect) ? <Redirect to="/" /> : ''}


            <div className="config-field">
                <div className="key">Photo:</div>
                <div className="photo-input value">
                    <div className="field upload">
                        <label><em>File</em></label>
                        <input type="file" onChange={onChangePhoto} />
                    </div>
                    <progress hidden={progress === 0 ? true : false} value={progress} max="100" />

                </div>
            </div>
            <div className="config-field">
                <div className="key">Connection key:</div>
                <div className="connection-key value">{(localStorage && !key) ? localStorage.user.connection_key : ''}{key}</div>
            </div>
            <div className="config-field">
                <div className="key">Calendar API:</div>
                <div className="value"><input type="text" /></div>

            </div>
            <div className="button-group">
                <button onClick={save}>save</button>
                <button onClick={logout}>logout</button>
            </div>
        </div>
    );

    function save(e) {
        e.preventDefault();
        if (photo) {
            uploadPhoto();
        }
    }

    function uploadPhoto() {
        const uploadTask = storage.ref(`images/${localStorage.user.number}`).put(photo);
        uploadTask.on('state_changed', (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progress);
        }, (error) => {
            console.log(error);
        }, () => {
            storage.ref('images').child(`${localStorage.user.number}`).getDownloadURL().then(url => {
                axios.post(process.env.REACT_APP_API_URL + '/api/users/uploadPhoto/' + localStorage.user._id, { url: url })
                    .then(res => {
                        setInStorage("mirror-token", {
                            user: res.data
                        })
                        setKey(res.data.connection_key);
                    })
                    .catch(error => {
                        console.log(error);
                    });

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
