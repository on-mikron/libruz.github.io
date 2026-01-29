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
        .test-accounts {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .test-accounts h3 {
            color: #4361ee;
            margin-bottom: 10px;
        }
        .account {
            margin: 5px 0;
            font-size: 14px;
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
                <input type="email" id="email" placeholder="admin@libruz.pl" required>
            </div>
            
            <div class="form-group">
                <label>Hasło:</label>
                <input type="password" id="password" placeholder="••••••••" required>
            </div>
            
            <button type="submit" class="btn" id="loginBtn">
                <span>🔐 Zaloguj się</span>
            </button>
        </form>
        
        <div class="test-accounts">
            <h3>📋 Konta testowe:</h3>
            <div class="account"><strong>Admin:</strong> admin@libruz.pl / admin123</div>
            <div class="account"><strong>Dyrektor:</strong> dyrektor@sp1.pl / dyrektor123</div>
            <div class="account"><strong>Nauczyciel:</strong> nauczyciel@sp1.pl / nauczyciel123</div>
            <div class="account"><strong>Uczeń:</strong> uczen@sp1.pl / uczen123</div>
            <div class="account"><strong>Rodzic:</strong> rodzic@sp1.pl / rodzic123</div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script>
        // auth.js wbudowany bezpośrednio w HTML
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
                    // 1. Sprawdź czy użytkownik istnieje
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('email', email)
                        .single();
                    
                    if (error || !profile) {
                        showAlert('❌ Nieprawidłowy email', 'error');
                        return;
                    }
                    
                    // 2. Sprawdź hasło (demo - proste sprawdzenie)
                    const passwords = {
                        'admin@libruz.pl': 'admin123',
                        'dyrektor@sp1.pl': 'dyrektor123',
                        'nauczyciel@sp1.pl': 'nauczyciel123',
                        'uczen@sp1.pl': 'uczen123',
                        'rodzic@sp1.pl': 'rodzic123'
                    };
                    
                    if (passwords[email] !== password) {
                        showAlert('❌ Nieprawidłowe hasło', 'error');
                        return;
                    }
                    
                    // 3. Zaloguj
                    localStorage.setItem('libruz_user', JSON.stringify(profile));
                    showAlert('✅ Zalogowano! Przekierowuję...', 'success');
                    
                    setTimeout(() => {
                        if (profile.role === 'admin') {
                            window.location.href = 'admin-dashboard.html';
                        } else if (profile.role === 'director') {
                            window.location.href = 'director-dashboard.html';
                        } else {
                            window.location.href = 'dashboard.html';
                        }
                    }, 1000);
                    
                } catch (error) {
                    console.error('💥 Błąd:', error);
                    showAlert('❌ Błąd systemu', 'error');
                } finally {
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '<span>🔐 Zaloguj się</span>';
                }
            });
            
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
