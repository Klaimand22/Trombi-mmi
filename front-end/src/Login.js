import React, { useState } from 'react';
import axios from 'axios';

function Login () {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    function handleSumbit (event) {
        event.preventDefault()
        axios.post('http://localhost:3001/login', {
            email: email,
            password: password
        }).then(response => {
            console.log(response)
        })
    }

    return (
        <div>
            <h1>Connexion</h1>
            <form onSubmit={handleSumbit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" id="password" name="password" onChange={e => setPassword(e.target.value)} />
                </div>
                <button>Se connecter</button>
            </form>
        </div>
    );

}

export default Login;