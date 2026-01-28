<!DOCTYPE html>
<html lang="pl" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📚 LIBRUZ - System Zarządzania Szkołą</title>
    
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
            --accent: #f72585;
            --success: #4cc9f0;
            --warning: #f8961e;
            --danger: #f94144;
            --light: #f8f9fa;
            --dark: #212529;
            --gray: #6c757d;
            --gray-light: #e9ecef;
            
            --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
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
            line-height: 1.6;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
        }

        /* ====== LOGIN CONTAINER ====== */
        .login-container {
            display: flex;
            min-height: 80vh;
            background: white;
            border-radius: var(--radius-xl);
            overflow: hidden;
            box-shadow: var(--shadow-xl);
            animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* ====== LEFT PANEL ====== */
        .login-left {
            flex: 1;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            padding: 60px 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }

        .login-left::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: float 20s linear infinite;
        }

        @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(-50px, -50px) rotate(360deg); }
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 40px;
            z-index: 1;
            position: relative;
        }

        .logo-icon {
            font-size: 3rem;
            background: rgba(255,255,255,0.2);
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
        }

        .logo-text h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .logo-text p {
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .features {
            margin-top: 40px;
            z-index: 1;
            position: relative;
        }

        .feature-item {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: var(--radius);
            backdrop-filter: blur(5px);
            transition: var(--transition);
        }

        .feature-item:hover {
            background: rgba(255,255,255,0.2);
            transform: translateX(5px);
        }

        .feature-icon {
            font-size: 1.5rem;
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* ====== RIGHT PANEL ====== */
        .login-right {
            flex: 1;
            padding: 60px 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .login-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .login-header h2 {
            font-size: 2rem;
            color: var(--primary);
            margin-bottom: 10px;
        }

        .login-header p {
            color: var(--gray);
        }

        /* ====== FORM STYLES ====== */
        .login-form {
            width: 100%;
        }

        .form-group {
            margin-bottom: 25px;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--dark);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .form-control {
            width: 100%;
            padding: 15px;
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

        .input-with-icon {
            position: relative;
        }

        .input-with-icon i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray);
            pointer-events: none;
        }

        .input-with-icon input {
            padding-left: 45px;
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

        /* ====== LOGIN OPTIONS ====== */
        .login-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .remember-me {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
        }

        .forgot-password {
            color: var(--primary);
            text-decoration: none;
            font-size: 0.9rem;
            transition: var(--transition);
        }

        .forgot-password:hover {
            color: var(--primary-dark);
            text-decoration: underline;
        }

        /* ====== BUTTONS ====== */
        .btn {
            display: inline-block;
            padding: 15px 30px;
            border: none;
            border-radius: var(--radius);
            font-size: 1rem;
            font-weight: 600;
            font-family: 'Poppins', sans-serif;
            cursor: pointer;
            transition: var(--transition);
            text-align: center;
            text-decoration: none;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            width: 100%;
            padding: 17px;
            font-size: 1.1rem;
            margin-bottom: 20px;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }

        .btn-google {
            background: white;
            color: var(--dark);
            border: 2px solid var(--gray-light);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
        }

        .btn-google:hover {
            border-color: var(--primary);
            background: var(--light);
        }

        /* ====== DEMO ACCOUNTS ====== */
        .demo-accounts {
            margin-top: 30px;
            padding: 20px;
            background: var(--light);
            border-radius: var(--radius);
            border-left: 4px solid var(--primary);
        }

        .demo-accounts h4 {
            color: var(--primary);
            margin-bottom: 15px;
            font-size: 1rem;
        }

        .demo-account {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 10px;
            background: white;
            border-radius: var(--radius);
            margin-bottom: 10px;
            cursor: pointer;
            transition: var(--transition);
            border: 1px solid transparent;
        }

        .demo-account:hover {
            border-color: var(--primary);
            background: rgba(67, 97, 238, 0.05);
        }

        .demo-account:last-child {
            margin-bottom: 0;
        }

        .demo-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
        }

        .demo-icon.admin { background: var(--danger); }
        .demo-icon.director { background: var(--primary); }
        .demo-icon.teacher { background: var(--success); }
        .demo-icon.student { background: var(--secondary); }

        .demo-info h5 {
            font-size: 0.9rem;
            margin-bottom: 3px;
        }

        .demo-info p {
            font-size: 0.8rem;
            color: var(--gray);
        }

        /* ====== FOOTER ====== */
        .login-footer {
            margin-top: 40px;
            text-align: center;
            color: var(--gray);
            font-size: 0.9rem;
        }

        /* ====== ERROR MESSAGE ====== */
        .error-message {
            background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
            color: white;
            padding: 15px;
            border-radius: var(--radius);
            margin-bottom: 20px;
            display: none;
            animation: shake 0.5s ease;
            align-items: center;
            gap: 10px;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        /* ====== LOADING ====== */
        .loading {
            display: none;
            justify-content: center;
            margin-top: 20px;
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

        /* ====== RESPONSIVE ====== */
        @media (max-width: 992px) {
            .login-container {
                flex-direction: column;
                min-height: auto;
            }
            
            .login-left, .login-right {
                padding: 40px 20px;
            }
            
            .logo-text h1 {
                font-size: 2rem;
            }
            
            .feature-item {
                padding: 12px;
            }
        }

        @media (max-width: 576px) {
            body {
                padding: 10px;
            }
            
            .login-container {
                border-radius: var(--radius-lg);
            }
            
            .logo {
                flex-direction: column;
                text-align: center;
            }
            
            .login-options {
                flex-direction: column;
                gap: 10px;
                align-items: flex-start;
            }
        }

        /* ====== THEME SWITCHER ====== */
        .theme-switcher {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }

        .theme-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: white;
            border: none;
            box-shadow: var(--shadow);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            color: var(--primary);
            transition: var(--transition);
        }

        .theme-btn:hover {
            transform: rotate(30deg);
            box-shadow: var(--shadow-lg);
        }

        /* Dark theme */
        body.dark-theme {
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
        }

        body.dark-theme .login-container {
            background: #2d3748;
            color: #e2e8f0;
        }

        body.dark-theme .form-control {
            background: #4a5568;
            border-color: #4a5568;
            color: white;
        }

        body.dark-theme .form-control:focus {
            border-color: var(--primary);
            background: #4a5568;
        }

        body.dark-theme .form-label {
            color: #e2e8f0;
        }

        body.dark-theme .demo-accounts {
            background: #4a5568;
        }

        body.dark-theme .demo-account {
            background: #2d3748;
            color: #e2e8f0;
        }

        body.dark-theme .login-header p {
            color: #cbd5e0;
        }
    </style>
</head>
<body>
    <!-- Theme Switcher -->
    <div class="theme-switcher">
        <button class="theme-btn" id="themeToggle">
            <i class="fas fa-moon"></i>
        </button>
    </div>

    <div class="container">
        <div class="login-container">
            <!-- Left Panel -->
            <div class="login-left">
                <div class="logo">
                    <div class="logo-icon">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <div class="logo-text">
                        <h1>LIBRUZ</h1>
                        <p>Inteligentny System Zarządzania Szkołą</p>
                    </div>
                </div>

                <div class="features">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-comments"></i>
                        </div>
                        <div>
                            <h4>Komunikacja wielojęzyczna</h4>
                            <p>Wiadomości w 4 językach: PL, EN, UA, RU</p>
                        </div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-chalkboard-teacher"></i>
                        </div>
                        <div>
                            <h4>Dziennik elektroniczny</h4>
                            <p>Pełna obsługa lekcji, ocen i frekwencji</p>
                        </div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <div>
                            <h4>Terminarz i zastępstwa</h4>
                            <p>Automatyczne zarządzanie planem lekcji</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Panel -->
            <div class="login-right">
                <div class="login-header">
                    <h2>Zaloguj się</h2>
                    <p>Witamy w systemie LIBRUZ. Wprowadź swoje dane.</p>
                </div>

                <!-- Error Message -->
                <div class="error-message" id="errorMessage">
                    <i class="fas fa-exclamation-circle"></i>
                    <span id="errorText"></span>
                </div>

                <!-- Login Form -->
                <form class="login-form" id="loginForm">
                    <div class="form-group">
                        <label class="form-label" for="email">
                            <i class="fas fa-envelope"></i> Adres email
                        </label>
                        <div class="input-with-icon">
                            <i class="fas fa-user"></i>
                            <input 
                                type="email" 
                                id="email" 
                                class="form-control" 
                                placeholder="wpisz@adres.email"
                                required
                                autocomplete="username"
                            >
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="password">
                            <i class="fas fa-key"></i> Hasło
                        </label>
                        <div class="input-with-icon">
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
                        <a href="#" class="forgot-password">Zapomniałeś hasła?</a>
                    </div>

                    <button type="submit" class="btn btn-primary" id="loginButton">
                        <i class="fas fa-sign-in-alt"></i> Zaloguj się
                    </button>

                    <!-- Loading Spinner -->
                    <div class="loading" id="loading">
                        <div class="spinner"></div>
                    </div>
                </form>

                <!-- Demo Accounts -->
                <div class="demo-accounts">
                    <h4><i class="fas fa-user-shield"></i> Konta demonstracyjne</h4>
                    
                    <div class="demo-account" data-email="admin@libruz.pl" data-password="Grahamka321@##">
                        <div class="demo-icon admin">
                            <i class="fas fa-crown"></i>
                        </div>
                        <div class="demo-info">
                            <h5>Administrator</h5>
                            <p>Pełny dostęp do systemu</p>
                        </div>
                    </div>
                    
                    <div class="demo-account" data-email="dyrektor@sp1.pl" data-password="dyrektor123">
                        <div class="demo-icon director">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="demo-info">
                            <h5>Dyrektor</h5>
                            <p>Zarządzanie szkołą</p>
                        </div>
                    </div>
                    
                    <div class="demo-account" data-email="nauczyciel.matematyka@sp1.pl" data-password="nauczyciel123">
                        <div class="demo-icon teacher">
                            <i class="fas fa-chalkboard-teacher"></i>
                        </div>
                        <div class="demo-info">
                            <h5>Nauczyciel</h5>
                            <p>Dziennik, oceny, lekcje</p>
                        </div>
                    </div>
                    
                    <div class="demo-account" data-email="uczen.janek@sp1.pl" data-password="uczen123">
                        <div class="demo-icon student">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div class="demo-info">
                            <h5>Uczeń</h5>
                            <p>Plan lekcji, oceny, zadania</p>
                        </div>
                    </div>
                </div>

                <div class="login-footer">
                    <p>© 2024 LIBRUZ System. Wersja 2.0.0</p>
                    <p>Wszelkie prawa zastrzeżone</p>
                </div>
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
        // DOM ELEMENTS
        // ============================================
        const loginForm = document.getElementById('loginForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const loginButton = document.getElementById('loginButton');
        const togglePassword = document.getElementById('togglePassword');
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const loading = document.getElementById('loading');
        const themeToggle = document.getElementById('themeToggle');
        const demoAccounts = document.querySelectorAll('.demo-account');

        // ============================================
        // THEME SWITCHER
        // ============================================
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });

        // ============================================
        // PASSWORD TOGGLE
        // ============================================
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = togglePassword.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });

        // ============================================
        // DEMO ACCOUNTS
        // ============================================
        demoAccounts.forEach(account => {
            account.addEventListener('click', () => {
                const email = account.dataset.email;
                const password = account.dataset.password;
                
                emailInput.value = email;
                passwordInput.value = password;
                
                // Pokazujemy który konto zostało wybrane
                demoAccounts.forEach(a => a.style.borderColor = 'transparent');
                account.style.borderColor = 'var(--primary)';
                
                // Automatycznie logujemy
                setTimeout(() => {
                    loginForm.dispatchEvent(new Event('submit'));
                }, 500);
            });
        });

        // ============================================
        // FORM VALIDATION
        // ============================================
        function showError(message) {
            errorText.textContent = message;
            errorMessage.style.display = 'flex';
            errorMessage.style.animation = 'shake 0.5s ease';
            
            setTimeout(() => {
                errorMessage.style.animation = '';
            }, 500);
            
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }

        function showSuccess(message) {
            errorText.textContent = message;
            errorMessage.style.background = 'linear-gradient(135deg, #4cc9f0 0%, #4361ee 100%)';
            errorMessage.style.display = 'flex';
            
            setTimeout(() => {
                errorMessage.style.display = 'none';
                errorMessage.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)';
            }, 3000);
        }

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        // ============================================
        // LOGIN FUNCTION
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
                console.log('🔐 Próba logowania:', email);
                
                // 1. Logowanie przez Supabase Auth
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                
                if (error) {
                    console.error('❌ Błąd logowania:', error.message);
                    
                    // Specjalne komunikaty dla różnych błędów
                    if (error.message.includes('Invalid login credentials')) {
                        throw new Error('Nieprawidłowy email lub hasło');
                    } else if (error.message.includes('Email not confirmed')) {
                        throw new Error('Email niepotwierdzony - sprawdź skrzynkę');
                    } else if (error.message.includes('User not found')) {
                        throw new Error('Użytkownik nie istnieje');
                    } else {
                        throw new Error('Błąd logowania: ' + error.message);
                    }
                }
                
                console.log('✅ Logowanie udane:', data.user.email);
                
                // 2. Pobierz profil użytkownika z naszej tabeli profiles
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('email', email)
                    .single();
                
                if (profileError) {
                    console.error('❌ Błąd pobierania profilu:', profileError);
                    throw new Error('Błąd pobierania danych użytkownika');
                }
                
                if (!profile) {
                    throw new Error('Profil użytkownika nie znaleziony');
                }
                
                console.log('👤 Profil pobrany:', profile);
                
                // 3. Sprawdź czy to pierwsze logowanie
                if (profile.temporary_password === true) {
                    console.log('🔐 Pierwsze logowanie - zmiana hasła wymagana');
                    
                    // Zapisz w localStorage
                    localStorage.setItem('libruz_temp_user', JSON.stringify(profile));
                    localStorage.setItem('libruz_user_id', profile.id);
                    
                    // Przekieruj do zmiany hasła
                    showSuccess('Pierwsze logowanie! Przekierowuję...');
                    setTimeout(() => {
                        window.location.href = 'change-password.html';
                    }, 1500);
                    
                } else {
                    // Normalne logowanie
                    console.log('✅ Normalne logowanie - zapisuję dane...');
                    
                    // Zapisz dane użytkownika
                    localStorage.setItem('libruz_user', JSON.stringify(profile));
                    localStorage.setItem('libruz_session', JSON.stringify(data.session));
                    localStorage.setItem('libruz_auth', JSON.stringify({
                        access_token: data.session.access_token,
                        refresh_token: data.session.refresh_token
                    }));
                    
                    // Zapamiętaj mnie
                    const rememberMe = document.getElementById('rememberMe').checked;
                    if (rememberMe) {
                        localStorage.setItem('libruz_remember_email', email);
                    } else {
                        localStorage.removeItem('libruz_remember_email');
                    }
                    
                    showSuccess('Zalogowano pomyślnie! Przekierowuję...');
                    
                    // 4. Przekieruj według roli
                    setTimeout(() => {
                        redirectByRole(profile);
                    }, 1000);
                }
                
            } catch (error) {
                console.error('💥 Błąd podczas logowania:', error);
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
        // REDIRECT BY ROLE
        // ============================================
        function redirectByRole(profile) {
            console.log('🎯 Przekierowuję dla roli:', profile.role);
            
            let dashboardUrl = 'dashboard.html'; // domyślny
            
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
        // CHECK EXISTING SESSION
        // ============================================
        async function checkExistingSession() {
            try {
                console.log('🔍 Sprawdzam istniejącą sesję...');
                
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.log('ℹ️ Błąd sesji:', error.message);
                    return;
                }
                
                if (session) {
                    console.log('📱 Znaleziono aktywną sesję:', session.user.email);
                    
                    // Pobierz profil
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('email', session.user.email)
                        .single();
                    
                    if (profile) {
                        console.log('🔄 Automatyczne logowanie:', profile.email);
                        showSuccess('Witamy z powrotem! Przekierowuję...');
                        
                        // Zapisz dane
                        localStorage.setItem('libruz_user', JSON.stringify(profile));
                        localStorage.setItem('libruz_session', JSON.stringify(session));
                        
                        // Przekieruj
                        setTimeout(() => {
                            redirectByRole(profile);
                        }, 1000);
                    }
                }
            } catch (error) {
                console.log('ℹ️ Brak sesji:', error.message);
            }
        }

        // ============================================
        // LOAD REMEMBERED EMAIL
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

        // Enter key support
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
        // INITIALIZATION
        // ============================================
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 System LIBRUZ zainicjalizowany');
            
            // Załaduj zapamiętany email
            loadRememberedEmail();
            
            // Sprawdź sesję po załadowaniu
            setTimeout(checkExistingSession, 500);
            
            // Autofocus na email
            emailInput.focus();
        });

        // ============================================
        // TEST CONNECTION
        // ============================================
        async function testConnection() {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('count')
                    .limit(1);
                
                if (error) {
                    console.error('❌ Błąd połączenia z Supabase:', error);
                } else {
                    console.log('✅ Połączenie z Supabase OK');
                }
            } catch (error) {
                console.error('💥 Błąd testu połączenia:', error);
            }
        }

        // Testuj połączenie przy starcie
        setTimeout(testConnection, 1000);
    </script>
</body>
</html>
