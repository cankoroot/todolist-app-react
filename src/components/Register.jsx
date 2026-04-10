import React from 'react'
import { useState } from 'react'

function Register({ onRegisterSuccess, onNotify }) {


    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const registerUser = async () => {

        const normalizedUsername = username.trim();
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (normalizedUsername === "" || normalizedEmail === "" || normalizedPassword === "") {
            onNotify?.("Lütfen tüm alanları doldurun", "error")
            return;
        }

        try {
            const emailControl = await fetch(
                `https://todolistapp-fakerestapi.onrender.com/users?email=${encodeURIComponent(normalizedEmail)}`
            )

            if (!emailControl.ok) {
                throw new Error("Email kontrol isteği başarısız")
            }

            const currentUsersResponse = await emailControl.json()
            const currentUsers = Array.isArray(currentUsersResponse) ? currentUsersResponse : []

            if (currentUsers.length > 0) {
                onNotify?.("Bu email zaten kayıtlı", "error")
                return;
            }

            const response = await fetch("https://todolistapp-fakerestapi.onrender.com/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: normalizedUsername,
                    email: normalizedEmail,
                    password: normalizedPassword,
                    todos: []
                })
            })

            if (!response.ok) {
                throw new Error("Kayıt isteği başarısız")
            }

            const createdUser = await response.json()

            onRegisterSuccess?.(createdUser, true);
            onNotify?.("Kayıt başarılı!", "success")
        } catch (error) {
            onNotify?.("Kayıt sırasında bir hata oluştu. JSON Server çalışıyor mu kontrol et.", "error")
        }
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