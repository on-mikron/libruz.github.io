<!DOCTYPE html>
<html lang="pl" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔐 LIBRUZ - Logowanie Systemu</title>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        /* ====== RESET & BASE ====== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #4361ee;
            --primary-dark: #3a56d4;
            --secondary: #7209b7;
            --success: #4cc9f0;
            --warning: #f8961e;
            --danger: #f94144;
            --light: #f8f9fa;
            --dark: #212529;
            --gray: #6c757d;
            --gray-light: #e9ecef;
            
            --shadow: 0 4px 6px rgba(0,0,0,0.1);
            --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
            --shadow-xl: 0 20px 25px rgba(0,0,0,0.1);
            
            --radius: 8px;
            --radius-lg: 12px;
            --radius-xl: 20px;
            
            --transition: all 0.3s ease;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            color: var(--dark);
        }

        .container {
            width: 100%;
            max-width: 400px;
        }

        /* ====== LOGIN CARD ====== */
        .login-card {
            background: white;
            border-radius: var(--radius-xl);
            padding: 40px;
            box-shadow: var(--shadow-xl);
            animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* ====== HEADER ====== */
        .login-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
        }

        .logo-icon {
            font-size: 2.5rem;
            color: var(--primary);
        }

        .logo-text h1 {
            font-size: 2rem;
            color: var(--primary);
            margin-bottom: 5px;
        }

        .logo-text p {
            color: var(--gray);
            font-size: 0.9rem;
        }

        /* ====== FORM ====== */
        .form-group {
            margin-bottom: 25px;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--dark);
        }

        .input-group {
            position: relative;
        }

        .input-group i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray);
        }

        .form-control {
            width: 100%;
            padding: 15px 15px 15px 45px;
            border: 2px solid var(--gray-light);
            border-radius: var(--radius);
            font-size: 1rem;
            font-family: 'Poppins', sans-serif;
            transition: var(--transition);
        }

        .form-control:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
        }

        .password-toggle {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--gray);
            cursor: pointer;
            font-size: 1.1rem;
        }

        /* ====== OPTIONS ====== */
        .login-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            font-size: 0.9rem;
        }

        .remember-me {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .forgot-password {
            color: var(--primary);
            text-decoration: none;
        }

        .forgot-password:hover {
            text-decoration: underline;
        }

        /* ====== BUTTONS ====== */
        .btn {
            width: 100%;
            padding: 17px;
            border: none;
            border-radius: var(--radius);
            font-size: 1.1rem;
            font-weight: 600;
            font-family: 'Poppins', sans-serif;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            margin-bottom: 20px;
        }

        .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }

        .btn-primary:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        /* ====== MESSAGES ====== */
        .alert {
            padding: 15px;
            border-radius: var(--radius);
            margin-bottom: 20px;
            display: none;
            align-items: center;
            gap: 10px;
            animation: shake 0.5s ease;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        .alert-error {
            background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
            color: white;
        }

        .alert-success {
            background: linear-gradient(135deg, #4cc9f0 0%, #4361ee 100%);
            color: white;
        }

        /* ====== LOADING ====== */
        .loading {
            display: none;
            justify-content: center;
            margin: 20px 0;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--gray-light);
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* ====== FOOTER ====== */
        .login-footer {
            margin-top: 30px;
            text-align: center;
            color: var(--gray);
            font-size: 0.9rem;
            padding-top: 20px;
            border-top: 1px solid var(--gray-light);
        }

        .version {
            background: var(--light);
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-top: 5px;
            display: inline-block;
        }

        /* ====== RESPONSIVE ====== */
        @media (max-width: 576px) {
            .login-card {
                padding: 30px 20px;
            }
            
            .logo-text h1 {
                font-size: 1.8rem;
            }
            
            .login-options {
                flex-direction: column;
                gap: 10px;
                align-items: flex-start;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="login-card">
            <!-- Logo i nagłówek -->
            <div class="login-header">
                <div class="logo">
                    <i class="fas fa-book-open logo-icon"></i>
                    <div class="logo-text">
                        <h1>LIBRUZ</h1>
                        <p>System Zarządzania Szkołą</p>
                    </div>
                </div>
                <p>Wprowadź swoje dane logowania</p>
            </div>

            <!-- Komunikat o błędzie -->
            <div class="alert alert-error" id="errorMessage">
                <i class="fas fa-exclamation-circle"></i>
                <span id="errorText"></span>
            </div>

            <!-- Formularz logowania -->
            <form id="loginForm">
                <div class="form-group">
                    <label class="form-label" for="email">
                        <i class="fas fa-envelope"></i> Adres email
                    </label>
                    <div class="input-group">
                        <i class="fas fa-user"></i>
                        <input 
                            type="email" 
                            id="email" 
                            class="form-control" 
                            placeholder="admin@twoja-szkola.pl"
                            required
                            autocomplete="username"
                        >
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="password">
                        <i class="fas fa-key"></i> Hasło
                    </label>
                    <div class="input-group">
                        <i class="fas fa-lock"></i>
                        <input 
                            type="password" 
                            id="password" 
                            class="form-control" 
                            placeholder="••••••••"
                            required
                            autocomplete="current-password"
                        >
                        <button type="button" class="password-toggle" id="togglePassword">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <div class="login-options">
                    <label class="remember-me">
                        <input type="checkbox" id="rememberMe">
                        <span>Zapamiętaj mnie</span>
                    </label>
                    <a href="#" class="forgot-password" id="forgotPassword">
                        Zapomniałeś hasła?
                    </a>
                </div>

                <button type="submit" class="btn btn-primary" id="loginButton">
                    <i class="fas fa-sign-in-alt"></i> Zaloguj się
                </button>

                <div class="loading" id="loading">
                    <div class="spinner"></div>
                </div>
            </form>

            <div class="login-footer">
                <p>© 2024 LIBRUZ System</p>
                <div class="version">Wersja 2.0.0</div>
                <p style="margin-top: 10px; font-size: 0.8rem;">
                    <i class="fas fa-shield-alt"></i> Bezpieczne połączenie SSL
                </p>
            </div>
        </div>
    </div>

    <!-- Supabase -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    
    <script>
        // ============================================
        // KONFIGURACJA SUPABASE
        // ============================================
        const SUPABASE_URL = 'https://fupfgshptjghdjpkeaee.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cGZnc2hwdGpnaGRqcGtlYWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDk2MTcsImV4cCI6MjA4NTEyNTYxN30.PO_kVi3YBslUH1GQtfSHduMap_oSNYCsGL9eIhpxYnM';

        // Inicjalizacja Supabase
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('✅ Supabase zainicjalizowany');

        // ============================================
        // ELEMENTY DOM
        // ============================================
        const loginForm = document.getElementById('loginForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const loginButton = document.getElementById('loginButton');
        const togglePassword = document.getElementById('togglePassword');
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const loading = document.getElementById('loading');
        const forgotPassword = document.getElementById('forgotPassword');

        // ============================================
        // POKAŻ/UKRYJ HASŁO
        // ============================================
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = togglePassword.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });

        // ============================================
        // ZAPOMNIANE HASŁO
        // ============================================
        forgotPassword.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (!email) {
                showError('Wprowadź email do resetu hasła');
                emailInput.focus();
                return;
            }
            
            if (!validateEmail(email)) {
                showError('Wprowadź poprawny adres email');
                return;
            }
            
            try {
                loginButton.disabled = true;
                loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';
                
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + '/reset-password.html',
                });
                
                if (error) throw error;
                
                showSuccess('Email resetujący hasło został wysłany! Sprawdź skrzynkę.');
                
            } catch (error) {
                showError('Błąd podczas wysyłania emaila: ' + error.message);
            } finally {
                loginButton.disabled = false;
                loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Zaloguj się';
            }
        });

        // ============================================
        // WALIDACJA
        // ============================================
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function showError(message) {
            errorText.textContent = message;
            errorMessage.className = 'alert alert-error';
            errorMessage.style.display = 'flex';
            
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }

        function showSuccess(message) {
            errorText.textContent = message;
            errorMessage.className = 'alert alert-success';
            errorMessage.style.display = 'flex';
            
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }

        // ============================================
        // LOGOWANIE
        // ============================================
        async function handleLogin(event) {
            event.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            // Walidacja
            if (!email || !password) {
                showError('Wprowadź email i hasło');
                return;
            }
            
            if (!validateEmail(email)) {
                showError('Wprowadź poprawny adres email');
                return;
            }
            
            if (password.length < 6) {
                showError('Hasło musi mieć co najmniej 6 znaków');
                return;
            }
            
            // Ustaw stan ładowania
            loginButton.disabled = true;
            loading.style.display = 'flex';
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logowanie...';
            
            try {
                console.log('🔐 Logowanie:', email);
                
                // 1. Logowanie przez Supabase Auth
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                
                if (error) {
                    console.error('❌ Błąd:', error.message);
                    
                    if (error.message.includes('Invalid login credentials')) {
                        throw new Error('Nieprawidłowy email lub hasło');
                    } else if (error.message.includes('Email not confirmed')) {
                        throw new Error('Potwierdź email przed logowaniem');
                    } else {
                        throw new Error('Błąd logowania: ' + error.message);
                    }
                }
                
                console.log('✅ Zalogowano:', data.user.email);
                
                // 2. Pobierz profil z bazy
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('email', email)
                    .single();
                
                if (profileError) {
                    console.error('❌ Błąd profilu:', profileError);
                    throw new Error('Błąd pobierania danych użytkownika');
                }
                
                if (!profile) {
                    throw new Error('Profil użytkownika nie znaleziony');
                }
                
                console.log('👤 Profil:', profile);
                
                // 3. Sprawdź czy konto aktywne
                if (!profile.is_active) {
                    throw new Error('Konto jest nieaktywne. Skontaktuj się z administratorem.');
                }
                
                // 4. Sprawdź czy pierwsze logowanie
                if (profile.temporary_password === true) {
                    console.log('🔐 Pierwsze logowanie - zmiana hasła');
                    
                    localStorage.setItem('libruz_temp_user', JSON.stringify(profile));
                    localStorage.setItem('libruz_user_id', profile.id);
                    
                    showSuccess('Ustaw swoje hasło...');
                    
                    setTimeout(() => {
                        window.location.href = 'change-password.html';
                    }, 1500);
                    
                    return;
                }
                
                // 5. Normalne logowanie - zapisz dane
                localStorage.setItem('libruz_user', JSON.stringify(profile));
                localStorage.setItem('libruz_session', JSON.stringify(data.session));
                localStorage.setItem('libruz_auth', JSON.stringify({
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token
                }));
                
                // Zapamiętaj email
                if (document.getElementById('rememberMe').checked) {
                    localStorage.setItem('libruz_remember_email', email);
                } else {
                    localStorage.removeItem('libruz_remember_email');
                }
                
                showSuccess('Logowanie udane! Przekierowuję...');
                
                // 6. Przekieruj według roli
                setTimeout(() => {
                    redirectByRole(profile);
                }, 1000);
                
            } catch (error) {
                console.error('💥 Błąd:', error);
                showError(error.message);
                
                // Animacja błędu
                loginForm.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    loginForm.style.animation = '';
                }, 500);
                
            } finally {
                // Przywróć przycisk
                loginButton.disabled = false;
                loading.style.display = 'none';
                loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Zaloguj się';
            }
        }

        // ============================================
        // PRZEKIEROWANIE
        // ============================================
        function redirectByRole(profile) {
            let dashboardUrl = 'dashboard.html';
            
            switch(profile.role) {
                case 'admin':
                    dashboardUrl = 'admin-dashboard.html';
                    break;
                case 'director':
                case 'vice_director':
                    dashboardUrl = 'director-dashboard.html';
                    break;
                case 'teacher':
                    dashboardUrl = 'teacher-dashboard.html';
                    break;
                case 'student':
                    dashboardUrl = 'student-dashboard.html';
                    break;
                case 'parent':
                    dashboardUrl = 'parent-dashboard.html';
                    break;
                default:
                    console.warn('Nieznana rola:', profile.role);
            }
            
            console.log('📍 Przekierowanie do:', dashboardUrl);
            window.location.href = dashboardUrl;
        }

        // ============================================
        // SPRAWDŹ SESJĘ
        // ============================================
        async function checkExistingSession() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session) {
                    console.log('📱 Znaleziono sesję:', session.user.email);
                    
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('email', session.user.email)
                        .single();
                    
                    if (profile) {
                        console.log('🔄 Auto-login:', profile.email);
                        
                        localStorage.setItem('libruz_user', JSON.stringify(profile));
                        localStorage.setItem('libruz_session', JSON.stringify(session));
                        
                        redirectByRole(profile);
                    }
                }
            } catch (error) {
                console.log('ℹ️ Brak sesji');
            }
        }

        // ============================================
        // ZAŁADUJ ZAPAMIĘTANY EMAIL
        // ============================================
        function loadRememberedEmail() {
            const rememberedEmail = localStorage.getItem('libruz_remember_email');
            if (rememberedEmail) {
                emailInput.value = rememberedEmail;
                document.getElementById('rememberMe').checked = true;
            }
        }

        // ============================================
        // EVENT LISTENERS
        // ============================================
        loginForm.addEventListener('submit', handleLogin);

        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                passwordInput.focus();
            }
        });

        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleLogin(e);
            }
        });

        // ============================================
        // INICJALIZACJA
        // ============================================
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 LIBRUZ zainicjalizowany');
            
            loadRememberedEmail();
            setTimeout(checkExistingSession, 500);
            emailInput.focus();
            
            // Test połączenia
            testConnection();
        });

        // ============================================
        // TEST POŁĄCZENIA
        // ============================================
        async function testConnection() {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('count')
                    .limit(1);
                
                if (error) throw error;
                console.log('✅ Połączenie z bazą OK');
                
            } catch (error) {
                console.error('❌ Błąd połączenia:', error);
                showError('Błąd połączenia z bazą danych. Odśwież stronę.');
            }
        }
    </script>
</body>
</html>
