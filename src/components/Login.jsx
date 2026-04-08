import React from 'react'
import { useState } from 'react'

function Login({ onLoginSuccess, onNotify }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    const loginUser = async () => {
        if (username === "" || password === "") {
            onNotify?.("Lütfen tüm alanları doldurun", "error")
            return;
        }

        const response = await fetch(
            `http://localhost:3001/users?username=${encodeURIComponent(username.trim())}`
        )
        const currentUsers = await response.json()

        if (currentUsers.length === 0) {
            onNotify?.("Bu kullanıcı adıyla kayıtlı hesap bulunamadı", "error")
            return;
        }

        if (currentUsers[0].password !== password) {
            onNotify?.("Şifre yanlış", "error")
            return;
        }

        onLoginSuccess?.(currentUsers[0], rememberMe);
        onNotify?.("Giriş başarılı!", "success")
    }

    return (
        <div>
            <div className='login-container'>
                <h3 className='auth-hero'>Giriş yap ve görevlerini düzenlemeye başla!</h3>
                <p>Kullanıcı Adı. *</p>
                <input
                    type="text"
                    placeholder='Kullanıcı Adın.'
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <p>Şifre. *</p>
                <input
                    type="password"
                    placeholder='Şifren.'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p>* ile belirtilen alanlar zorunlu olarak doldurulmalıdır.</p>
                <label>
                    <input
                        type="checkbox"
                        name="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Beni Hatırla
                </label>
                <button className='btn-login' onClick={loginUser}>
                    Giris Yap
                </button>
                <a href="https://github.com/cankoroot" target="_blank" rel="noopener noreferrer">
                    <p style={{ marginLeft: '255px', fontSize: '10px', textDecoration: 'none', color: 'white' }}>cankoroot</p>
                </a>
            </div>
        </div>
    )
}

export default Login