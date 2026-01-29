<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔐 LIBRUZ - Logowanie</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }
        
        body {
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
            color: #333;
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
            transition: 0.3s;
        }
        
        .btn:hover {
            background: #3a56d4;
            transform: translateY(-2px);
        }
        
        .error {
            background: #ffeaea;
            color: #ff3b30;
            padding: 12px;
            border-radius: 8px;
            margin-top: 20px;
            display: none;
        }
        
        .success {
            background: #e8f5e9;
            color: #2e7d32;
            padding: 12px;
            border-radius: 8px;
            margin-top: 20px;
            display: none;
        }
        
        .demo-buttons {
            margin-top: 20px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        
        .demo-btn {
            padding: 10px;
            background: #f0f4ff;
            border: 2px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: 0.3s;
        }
        
        .demo-btn:hover {
            border-color: #4361ee;
            background: #e3e9ff;
        }
    </style>
</head>
<body>
    <div class="login-box">
        <h1>📚 LIBRUZ</h1>
        <p class="subtitle">System Szkolny - Logowanie</p>
        
        <div class="error" id="errorMessage"></div>
        <div class="success" id="successMessage"></div>
        
        <form id="loginForm">
            <div class="form-group">
                <label>Login / Email:</label>
                <input type="text" id="identifier" placeholder="login lub email" required>
            </div>
            
            <div class="form-group">
                <label>Hasło:</label>
                <input type="password" id="password" placeholder="••••••••" required>
            </div>
            
            <button type="submit" class="btn" id="loginBtn">
                🔐 Zaloguj się
            </button>
        </form>
        
        <div class="demo-buttons">
            <button class="demo-btn" onclick="fillCredentials('admin', 'Admin123!@#')">
                👑 Admin
            </button>
            <button class="demo-btn" onclick="fillCredentials('nauczyciel', 'Nauczyciel123')">
                👩‍🏫 Nauczyciel
            </button>
            <button class="demo-btn" onclick="fillCredentials('uczen', 'Uczen123')">
                👨‍🎓 Uczeń
            </button>
            <button class="demo-btn" onclick="fillCredentials('admin@libruz.pl', 'Admin123!@#')">
                📧 Admin (email)
            </button>
        </div>
    </div>

    <!-- Supabase -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    
    <script>
        // ============================================
        // PROSTA WERSJA - 100% DZIAŁAJĄCE PRZYCISKI
        // ============================================
        
        // Konfiguracja Supabase
        const SUPABASE_URL = 'https://fupfgshptjghdjpkeaee.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cGZnc2hwdGpnaGRqcGtlYWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDk2MTcsImV4cCI6MjA4NTEyNTYxN30.PO_kVi3YBslUH1GQtfSHduMap_oSNYCsGL9eIhpxYnM';
        
        // Inicjalizacja Supabase
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('✅ Supabase gotowy');
        
        // ============================================
        // FUNKCJE POMOCNICZE
        // ============================================
        
        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            const successDiv = document.getElementById('successMessage');
            
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
        
        function showSuccess(message) {
            const errorDiv = document.getElementById('errorMessage');
            const successDiv = document.getElementById('successMessage');
            
            successDiv.textContent = message;
            successDiv.style.display = 'block';
            errorDiv.style.display = 'none';
            
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 3000);
        }
        
        function fillCredentials(login, password) {
            document.getElementById('identifier').value = login;
            document.getElementById('password').value = password;
            showSuccess(`Wprowadzono: ${login}`);
        }
        
        // ============================================
        // FUNKCJA LOGOWANIA
        // ============================================
        
        async function handleLogin(event) {
            event.preventDefault();
            
            const identifier = document.getElementById('identifier').value.trim();
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');
            
            if (!identifier || !password) {
                showError('Wprowadź login i hasło');
                return;
            }
            
            // Zmień stan przycisku
            loginBtn.disabled = true;
            loginBtn.innerHTML = '⌛ Logowanie...';
            
            try {
                console.log('🔐 Próba logowania:', identifier);
                
                // 1. Sprawdź czy to email czy login
                let email = identifier;
                if (!identifier.includes('@')) {
                    // To jest login - znajdź email
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('email')
                        .or(`username.eq.${identifier},student_code.eq.${identifier},teacher_code.eq.${identifier}`)
                        .single();
                    
                    if (profile && profile.email) {
                        email = profile.email;
                        console.log('✅ Znaleziono email:', email);
                    }
                }
                
                // 2. Logowanie przez Supabase
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                
                if (error) {
                    if (error.message.includes('Invalid login credentials')) {
                        throw new Error('Nieprawidłowy login lub hasło');
                    } else {
                        throw new Error('Błąd: ' + error.message);
                    }
                }
                
                console.log('✅ Zalogowano:', data.user.email);
                
                // 3. Pobierz profil użytkownika
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('email', email)
                    .single();
                
                if (!profile) {
                    throw new Error('Profil nie znaleziony');
                }
                
                // 4. Zapisz dane
                localStorage.setItem('libruz_user', JSON.stringify(profile));
                localStorage.setItem('libruz_session', JSON.stringify(data.session));
                
                showSuccess('✅ Zalogowano! Przekierowuję...');
                
                // 5. Przekieruj według roli
                setTimeout(() => {
                    if (profile.role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else if (profile.role === 'teacher') {
                        window.location.href = 'teacher-dashboard.html';
                    } else if (profile.role === 'student') {
                        window.location.href = 'student-dashboard.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 1500);
                
            } catch (error) {
                console.error('💥 Błąd:', error);
                showError('❌ ' + error.message);
                
                // Animacja błędu
                const form = document.getElementById('loginForm');
                form.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    form.style.animation = '';
                }, 500);
                
            } finally {
                // Przywróć przycisk
                loginBtn.disabled = false;
                loginBtn.innerHTML = '🔐 Zaloguj się';
            }
        }
        
        // ============================================
        // FUNKCJA TWORZENIA ADMINA (jeśli go nie ma)
        // ============================================
        
        async function createAdminIfNotExists() {
            try {
                // Sprawdź czy admin istnieje
                const { data: existingAdmin } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'admin')
                    .single();
                
                if (existingAdmin) {
                    console.log('✅ Admin już istnieje:', existingAdmin.email);
                    return;
                }
                
                console.log('🛠️ Tworzę admina...');
                
                // Stwórz szkołę jeśli nie ma
                const { data: schools } = await supabase
                    .from('schools')
                    .select('id')
                    .limit(1);
                
                let schoolId = null;
                if (!schools || schools.length === 0) {
                    const { data: newSchool } = await supabase
                        .from('schools')
                        .insert([{ name: 'Szkoła Demo' }])
                        .select()
                        .single();
                    schoolId = newSchool.id;
                } else {
                    schoolId = schools[0].id;
                }
                
                // Dodaj profil admina
                const { error } = await supabase
                    .from('profiles')
                    .insert([{
                        email: 'admin@libruz.pl',
                        username: 'admin',
                        first_name: 'Admin',
                        last_name: 'System',
                        role: 'admin',
                        temporary_password: false,
                        is_active: true,
                        school_id: schoolId
                    }]);
                
                if (error) {
                    console.error('❌ Błąd tworzenia admina:', error);
                } else {
                    console.log('✅ Admin stworzony!');
                    console.log('📋 DANE LOGOWANIA:');
                    console.log('   Login: admin');
                    console.log('   Email: admin@libruz.pl');
                    console.log('   Hasło: Admin123!@# (ustaw w Supabase Auth)');
                }
                
            } catch (error) {
                console.error('💥 Błąd:', error);
            }
        }
        
        // ============================================
        // INICJALIZACJA
        // ============================================
        
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 LIBRUZ - System gotowy');
            
            // Podłącz formularz
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', handleLogin);
                console.log('✅ Formularz podłączony');
            } else {
                console.error('❌ Nie znaleziono formularza!');
            }
            
            // Stwórz admina jeśli nie istnieje
            setTimeout(createAdminIfNotExists, 1000);
            
            // Sprawdź czy już zalogowany
            checkExistingSession();
        });
        
        // ============================================
        // SPRAWDŹ ISTNIEJĄCĄ SESJĘ
        // ============================================
        
        async function checkExistingSession() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session) {
                    console.log('📱 Znaleziono sesję:', session.user.email);
                    
                    // Pobierz profil
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('email', session.user.email)
                        .single();
                    
                    if (profile) {
                        localStorage.setItem('libruz_user', JSON.stringify(profile));
                        
                        // Automatyczne przekierowanie
                        if (profile.role === 'admin') {
                            window.location.href = 'admin-dashboard.html';
                        }
                    }
                }
            } catch (error) {
                console.log('ℹ️ Brak sesji');
            }
        }
        
        // ============================================
        // DODAJ STYL ANIMACJI SHAKE
        // ============================================
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
        
    </script>
</body>
</html>
