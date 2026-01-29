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

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 LIBRUZ - System logowania');
            
            const supabase = window.supabase.createClient(
                'https://fupfgshptjghdjpkeaee.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cGZnc2hwdGpnaGRqcGtlYWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDk2MTcsImV4cCI6MjA4NTEyNTYxN30.PO_kVi3YBslUH1GQtfSHduMap_oSNYCsGL9eIhpxYnM'
            );
            
            const loginForm = document.getElementById('loginForm');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const loginBtn = document.getElementById('loginBtn');
            const alertDiv = document.getElementById('alert');
            
            // 1. Sprawdź czy już zalogowany
            checkSession();
            
            // 2. Obsługa formularza
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
                    // Sprawdź czy użytkownik istnieje w bazie
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('email', email)
                        .eq('is_active', true)
                        .single();
                    
                    if (error || !profile) {
                        showAlert('Nieprawidłowy email lub konto nieaktywne', 'error');
                        return;
                    }
                    
                    // Sprawdź hasło
                    const passwords = {
                        'admin@libruz.pl': 'admin123',
                        'dyrektor@sp1.pl': 'dyrektor123',
                        'nauczyciel@sp1.pl': 'nauczyciel123',
                        'uczen@sp1.pl': 'uczen123',
                        'rodzic@sp1.pl': 'rodzic123'
                    };
                    
                    if (passwords[email] !== password) {
                        showAlert('Nieprawidłowe hasło', 'error');
                        return;
                    }
                    
                    // Zapisz dane
                    localStorage.setItem('libruz_user', JSON.stringify(profile));
                    localStorage.setItem('libruz_logged_in', 'true');
                    localStorage.setItem('libruz_login_time', Date.now().toString());
                    
                    showAlert('Zalogowano pomyślnie! Przekierowuję...', 'success');
                    
                    // Przekieruj
                    setTimeout(() => {
                        redirectToDashboard(profile.role);
                    }, 1000);
                    
                } catch (error) {
                    console.error('Błąd:', error);
                    showAlert('Błąd systemu', 'error');
                } finally {
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '<span>🔐 Zaloguj się</span>';
                }
            });
            
            async function checkSession() {
                try {
                    const isLoggedIn = localStorage.getItem('libruz_logged_in');
                    const userData = localStorage.getItem('libruz_user');
                    
                    if (isLoggedIn === 'true' && userData) {
                        const user = JSON.parse(userData);
                        const loginTime = parseInt(localStorage.getItem('libruz_login_time') || '0');
                        const now = Date.now();
                        
                        // Sprawdź czy sesja nie wygasła (24 godziny)
                        if (now - loginTime < 24 * 60 * 60 * 1000) {
                            console.log('🔄 Auto-login dla:', user.email);
                            redirectToDashboard(user.role);
                        } else {
                            localStorage.clear();
                        }
                    }
                } catch (error) {
                    console.log('Brak sesji');
                }
            }
            
            function redirectToDashboard(role) {
                let dashboard = 'dashboard.html';
                
                switch(role) {
                    case 'admin': dashboard = 'admin-dashboard.html'; break;
                    case 'director': dashboard = 'director-dashboard.html'; break;
                    case 'teacher': dashboard = 'teacher-dashboard.html'; break;
                    case 'student': dashboard = 'student-dashboard.html'; break;
                    case 'parent': dashboard = 'parent-dashboard.html'; break;
                }
                
                console.log('Przekierowanie do:', dashboard);
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
