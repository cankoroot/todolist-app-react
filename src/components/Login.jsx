import React from 'react'
import { useState } from 'react'

function Login({ onLoginSuccess, onNotify }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    const loginUser = async () => {
        const normalizedUsername = username.trim();
        const normalizedPassword = password.trim();

        if (normalizedUsername === "" || normalizedPassword === "") {
            onNotify?.("Lütfen tüm alanları doldurun", "error")
            return;
        }

        try {
            const response = await fetch(
                `https://todolistapp-fakerestapi.onrender.com//users?username=${encodeURIComponent(normalizedUsername)}`
            )

            if (!response.ok) {
                throw new Error("Giriş isteği başarısız")
            }

            const currentUsersResponse = await response.json()
            const currentUsers = Array.isArray(currentUsersResponse) ? currentUsersResponse : []

            if (currentUsers.length === 0) {
                onNotify?.("Bu kullanıcı adıyla kayıtlı hesap bulunamadı", "error")
                return;
            }

            if (currentUsers[0].password !== normalizedPassword) {
                onNotify?.("Şifre yanlış", "error")
                return;
            }

            onLoginSuccess?.(currentUsers[0], rememberMe);
            onNotify?.("Giriş başarılı!", "success")
        } catch (error) {
            onNotify?.("Sunucuya bağlanılamadı. JSON Server çalışıyor mu kontrol et.", "error")
        }
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