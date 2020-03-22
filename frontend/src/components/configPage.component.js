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
                <div className="key">Zdjęcie:</div>
                <div className="photo-input value">
                    <div className="field upload">
                        <label><em>Plik</em></label>
                        <input type="file" onChange={onChangePhoto} />
                    </div>
                    <progress hidden={progress === 0 ? true : false} value={progress} max="100" />
                </div>
            </div>
            <div className="config-field">
                <div className="key">Identyfikator:</div>
                <div className="value">{(localStorage && key) ? localStorage.user.number : ''}</div>
            </div>
            <div className="config-field">
                <div className="key">Klucz:</div>
                <div className="connection-key value">{(localStorage && !key) ? localStorage.user.connection_key : ''}{key}</div>
            </div>
            <div className="config-field">
                <div className="key">Aktywuj kalendarz</div>
                <div className="value" onClick={activateCalendar} style={{ color: 'green', cursor: 'pointer' }}> Aktywuj</div>
            </div>
            <div className="button-group">
                <button onClick={save}>Zapisz</button>
                <button onClick={logout}>Wyloguj</button>
            </div>
        </div>
    );

    function save(e) {
        e.preventDefault();
        if (photo) {
            uploadPhoto();
        }
    }

    function logout() {
        clearStorage('mirror-token');
        setRedirect(true);
    }

    function onChangePhoto(e) {
        setPhoto(e.target.files[0]);
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

    function activateCalendar() {
        let link = "https://accounts.google.com/signin/oauth?redirect_uri=http://localhost:3000/auth&prompt=consent&response_type=code&client_id=527412466936-olnlnldh0janlsde613nvqfmbpu4rgte.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/calendar.events.readonly&access_type=offline"
        window.open(link, '_blank')
    }
}

export default ConfigPage;
