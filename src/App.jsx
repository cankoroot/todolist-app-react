import { useEffect, useRef, useState } from 'react'
import './App.css'
import Login from './components/Login';
import Register from './components/Register';
import ToDoCreate from './components/ToDoCreate'
import ToDoList from './components/ToDoList'

function App() {

  const [authMode, setAuthMode] = useState('register');
  const [currentUser, setCurrentUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState({ message: '', type: 'success' });
  const menuRef = useRef(null);

  useEffect(() => {
    if (!notice.message) return;

    const timeoutId = setTimeout(() => {
      setNotice({ message: '', type: 'success' });
    }, 2800);

    return () => clearTimeout(timeoutId);
  }, [notice]);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedTheme = localStorage.getItem('appTheme');

    if (savedTheme) {
      setTheme(savedTheme);
    }

    if (!savedUser) return;

    const parsedUser = JSON.parse(savedUser);
    setCurrentUser(parsedUser);
    setTodos(parsedUser.todos || []);
    setAuthMode('register');
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const saveUserToStorage = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  const clearUserFromStorage = () => {
    localStorage.removeItem('currentUser');
  }

  const saveThemeToStorage = (nextTheme) => {
    localStorage.setItem('appTheme', nextTheme);
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveThemeToStorage(nextTheme);
    setMenuOpen(false);
  }

  const refreshCurrentUser = async (updatedTodos) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      todos: updatedTodos,
    };

    setCurrentUser(updatedUser);
    setTodos(updatedTodos);
    saveUserToStorage(updatedUser);

    await fetch(`https://todolistapp-fakerestapi.onrender.com//users/${currentUser.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        todos: updatedTodos,
      }),
    });
  }

  const createTodo = async (newTodo) => {
    const updatedTodos = [...todos, newTodo];
    await refreshCurrentUser(updatedTodos);
  }

  const removeTodo = async (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    await refreshCurrentUser(updatedTodos);
  }

  const updateTodo = async (updatedTodo) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id !== updatedTodo.id) {
        return todo;
      }
      return updatedTodo;
    })

    await refreshCurrentUser(updatedTodos);
  }

  const handleAuthSuccess = (user, rememberMe) => {
    const safeUser = {
      ...user,
      todos: user.todos || [],
    };

    setCurrentUser(safeUser);
    setTodos(safeUser.todos);

    if (rememberMe) {
      saveUserToStorage(safeUser);
    }

    setAuthMode('register');
  }

  const handleLogout = () => {
    clearUserFromStorage();
    setCurrentUser(null);
    setTodos([]);
    setAuthMode('login');
    setMenuOpen(false);
  }

  const handleAvatarClick = () => {
    setMenuOpen((previous) => !previous);
  }

  const showNotice = (message, type = 'success') => {
    setNotice({ message, type });
  }

  const getUserInitials = (username) => {
    if (!username) return '?';

    return username
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  return (
    <div className={`app-shell theme-${theme} ${currentUser ? 'has-user' : ''}`}>
      {notice.message ? (
        <div className={`app-notice ${notice.type === 'error' ? 'error' : 'success'}`} role='status' aria-live='polite'>
          {notice.message}
        </div>
      ) : null}

      {currentUser ? (
        <div className='avatar-menu-anchor' ref={menuRef}>
          <button
            type='button'
            className='user-avatar'
            onClick={handleAvatarClick}
            aria-label='Kullanıcı menüsünü aç'
            aria-expanded={menuOpen}
            title='Kullanıcı menüsü'
          >
            {getUserInitials(currentUser.username)}
          </button>

          {menuOpen ? (
            <div className='user-dropdown' role='menu' aria-label='Kullanıcı menüsü'>
              <button type='button' className='user-dropdown-item' onClick={handleLogout} role='menuitem'>
                Çıkış Yap
              </button>
              <button type='button' className='user-dropdown-item' onClick={toggleTheme} role='menuitem'>
                {theme === 'dark' ? 'Aydınlık temaya geç' : 'Karanlık temaya geç'}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {currentUser ? (
        <section className='todo-shell'>
          <ToDoCreate onCreateTodo={createTodo} />
          <ToDoList todos={todos} onRemoveTodo={removeTodo} onUpdateTodo={updateTodo} />
        </section>
      ) : (
        <section className='auth-shell'>
          <div className='auth-switcher' role='tablist' aria-label='Authentication modes'>
            <button
              type='button'
              className={`auth-switcher-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => setAuthMode('register')}
            >
              Kayıt Ol
            </button>
            <button
              type='button'
              className={`auth-switcher-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => setAuthMode('login')}
            >
              Giriş Yap
            </button>
          </div>

          <div key={authMode} className={`auth-panel ${authMode === 'register' ? 'register-mode' : 'login-mode'}`}>
            {authMode === 'register' ? (
              <Register onRegisterSuccess={handleAuthSuccess} onNotify={showNotice} />
            ) : (
              <Login onLoginSuccess={handleAuthSuccess} onNotify={showNotice} />
            )}
          </div>
        </section>
      )}

    </div>
  )
}

export default App
