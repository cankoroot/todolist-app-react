import React from 'react'
import { useState } from 'react'

function Register({ onRegisterSuccess }) {


    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const registerUser = async () => {

        if (username === "" || email === "" || password === "") {
            alert("Lütfen tüm alanları doldurun")
            return;
        }

        const emailControl = await fetch(
            `http://localhost:3001/users?email=${email.toLowerCase()}`
        )
        const currentUsers = await emailControl.json()

        if (currentUsers.length > 0) {
            alert("Bu email zaten kayıtlı")
            return;
        }

        const response = await fetch("http://localhost:3001/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                email: email.toLowerCase(),
                password: password,
                todos: []
            })
        })

        const createdUser = await response.json()

        onRegisterSuccess?.(createdUser, true);
        alert("Kayıt başarılı!")
    }



    return (
        <div>

            <div className='register-container'>
                <h3 className='auth-hero'>Kayıt ol ve görevlerini düzenlemeye başla!</h3>
                <p>Kullanıcı Adı. *</p>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder='Kullanıcı Adın.' required />
                <p>Email Adresi. *</p>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email Adresin.' required />
                <p>Şifre. *</p>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Şifren.' required />
                <p>* ile belirtilen alanlar zorunlu olarak doldurulmalıdır.</p>
                <label>
                    <input type="checkbox" name="remember" value="remember" defaultChecked />
                    Beni Hatırla
                </label>
                <button className='btn-register' onClick={registerUser}>
                    Kayıt Ol
                </button>
                <a href="https://github.com/cankoroot" target="_blank" rel="noopener noreferrer">
                    <p style={{ marginLeft: '255px', fontSize: '10px', textDecoration: 'none', color: 'white' }}>cankoroot</p>
                </a>
            </div>

        </div>
    )
}


export default Register