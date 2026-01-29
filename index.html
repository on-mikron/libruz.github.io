<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📚 LIBRUZ - System Szkolny</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .login-box {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 400px;
        }
        h1 {
            color: #4361ee;
            text-align: center;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            text-align: center;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
        }
        input {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
        }
        input:focus {
            outline: none;
            border-color: #4361ee;
        }
        .btn {
            width: 100%;
            padding: 15px;
            background: #4361ee;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 10px;
        }
        .btn:hover {
            background: #3a56d4;
        }
        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .alert {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }
        .alert-error {
            background: #ffeaea;
            color: #ff3b30;
            border-left: 4px solid #ff3b30;
        }
        .alert-success {
            background: #e8f5e9;
            color: #2e7d32;
            border-left: 4px solid #2e7d32;
        }
        .system-info {
            margin-top: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="login-box">
        <h1>📚 LIBRUZ</h1>
        <p class="subtitle">System Zarządzania Szkołą</p>
        
        <div class="alert" id="alert"></div>
        
        <form id="loginForm">
            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="email" required>
            </div>
            
            <div class="form-group">
                <label>Hasło:</label>
                <input type="password" id="password" required>
            </div>
            
            <button type="submit" class="btn" id="loginBtn">
                <span>🔐 Zaloguj się</span>
            </button>
        </form>
        
        <div class="system-info">
            <p>© 2024 LIBRUZ System</p>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 LIBRUZ - System logowania');
            
            // 1. SPRAWDŹ CZY JUŻ ZALOGOWANY
            checkIfAlreadyLoggedIn();
            
            // 2. OBSŁUGA FORMULARZA
            const loginForm = document.getElementById('loginForm');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const loginBtn = document.getElementById('loginBtn');
            const alertDiv = document.getElementById('alert');
            
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const email = emailInput.value.trim();
                const password = passwordInput.value;
                
                if (!email || !password) {
                    showAlert('Wprowadź email i hasło', 'error');
                    return;
                }
                
                loginBtn.disabled = true;
                loginBtn.innerHTML = '<span>⌛ Logowanie...</span>';
                
                try {
                    // Symulacja logowania (w prawdziwym systemie byłoby połączenie z bazą)
                    const user = await simulateLogin(email, password);
                    
                    if (!user) {
                        showAlert('Nieprawidłowy email lub hasło', 'error');
                        return;
                    }
                    
                    // ZAPISZ DANE UŻYTKOWNIKA
                    localStorage.setItem('libruz_user', JSON.stringify(user));
                    localStorage.setItem('libruz_is_logged_in', 'true');
                    
                    console.log('✅ Zalogowano:', user.email);
                    
                    showAlert('Zalogowano pomyślnie! Przekierowuję...', 'success');
                    
                    // PRZEKIERUJ
                    setTimeout(() => {
                        redirectToDashboard(user.role);
                    }, 1000);
                    
                } catch (error) {
                    console.error('Błąd:', error);
                    showAlert('Błąd systemu', 'error');
                } finally {
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '<span>🔐 Zaloguj się</span>';
                }
            });
            
            async function simulateLogin(email, password) {
                // Dane testowe - w prawdziwym systemie pobierasz z bazy
                const testUsers = {
                    'admin@libruz.pl': {
                        email: 'admin@libruz.pl',
                        username: 'admin',
                        first_name: 'Adam',
                        last_name: 'Administrator',
                        role: 'admin',
                        password: 'admin123'
                    },
                    'dyrektor@sp1.pl': {
                        email: 'dyrektor@sp1.pl',
                        username: 'dyrektor',
                        first_name: 'Jan',
                        last_name: 'Kowalski',
                        role: 'director',
                        password: 'dyrektor123'
                    },
                    'nauczyciel@sp1.pl': {
                        email: 'nauczyciel@sp1.pl',
                        username: 'nauczyciel',
                        first_name: 'Anna',
                        last_name: 'Nowak',
                        role: 'teacher',
                        password: 'nauczyciel123'
                    }
                };
                
                // Symulacja opóźnienia sieci
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const user = testUsers[email];
                if (user && user.password === password) {
                    // Usuń hasło z obiektu użytkownika
                    const { password: _, ...userWithoutPassword } = user;
                    return userWithoutPassword;
                }
                
                return null;
            }
            
            function checkIfAlreadyLoggedIn() {
                const isLoggedIn = localStorage.getItem('libruz_is_logged_in');
                const userData = localStorage.getItem('libruz_user');
                
                if (isLoggedIn === 'true' && userData) {
                    try {
                        const user = JSON.parse(userData);
                        console.log('🔄 Użytkownik już zalogowany:', user.email);
                        redirectToDashboard(user.role);
                    } catch (e) {
                        localStorage.clear();
                    }
                }
            }
            
            function redirectToDashboard(role) {
                let dashboard = 'dashboard.html';
                
                if (role === 'admin') {
                    dashboard = 'admin-dashboard.html';
                } else if (role === 'director') {
                    dashboard = 'director-dashboard.html';
                } else if (role === 'teacher') {
                    dashboard = 'teacher-dashboard.html';
                }
                
                console.log('📍 Przekierowanie do:', dashboard);
                window.location.href = dashboard;
            }
            
            function showAlert(message, type) {
                alertDiv.textContent = message;
                alertDiv.className = 'alert alert-' + type;
                alertDiv.style.display = 'block';
                
                setTimeout(() => {
                    alertDiv.style.display = 'none';
                }, 5000);
            }
            
            // Auto-focus
            emailInput.focus();
        });
    </script>
</body>
</html>
