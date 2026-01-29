// System logowania LIBRUZ
console.log('🔐 Inicjalizacja systemu logowania...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM załadowany');
    
    // Elementy DOM
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = document.getElementById('btnText');
    const alertDiv = document.getElementById('alert');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const rememberMe = document.getElementById('rememberMe');
    
    // Sprawdź czy elementy istnieją
    if (!loginForm || !emailInput || !passwordInput || !loginBtn) {
        console.error('❌ Nie znaleziono elementów formularza!');
        showAlert('Błąd systemu: Brak formularza', 'error');
        return;
    }
    
    console.log('✅ Elementy formularza znalezione');
    
    // 1. Sprawdź istniejącą sesję
    checkExistingSession();
    
    // 2. Obsługa formularza
    loginForm.addEventListener('submit', handleLogin);
    
    // 3. Zapomniane hasło
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }
    
    // 4. Zapamiętany email
    loadRememberedEmail();
    
    // Funkcje
    async function handleLogin(event) {
        event.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Walidacja
        if (!email || !password) {
            showAlert('Wprowadź email i hasło', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showAlert('Wprowadź poprawny adres email', 'error');
            return;
        }
        
        // Zmień stan przycisku
        loginBtn.disabled = true;
        btnText.textContent = '⌛ Logowanie...';
        
        try {
            console.log(`🔐 Próba logowania: ${email}`);
            
            // Logowanie przez Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) {
                console.error('❌ Błąd logowania:', error.message);
                
                if (error.message.includes('Invalid login credentials')) {
                    throw new Error('Nieprawidłowy email lub hasło');
                } else if (error.message.includes('Email not confirmed')) {
                    throw new Error('Potwierdź email przed logowaniem');
                } else {
                    throw new Error('Błąd logowania: ' + error.message);
                }
            }
            
            console.log('✅ Logowanie udane:', data.user.email);
            
            // Pobierz profil użytkownika
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
            
            console.log('👤 Profil:', profile);
            
            // Sprawdź czy konto aktywne
            if (!profile.is_active) {
                throw new Error('Konto jest nieaktywne. Skontaktuj się z administratorem.');
            }
            
            // Sprawdź czy pierwsze logowanie
            if (profile.temporary_password === true) {
                console.log('🔐 Pierwsze logowanie - zmiana hasła wymagana');
                
                // Zapisz tymczasowe dane
                localStorage.setItem('libruz_temp_user', JSON.stringify(profile));
                localStorage.setItem('libruz_user_id', profile.id);
                
                showAlert('Pierwsze logowanie! Ustaw swoje hasło...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'change-password.html';
                }, 1500);
                
                return;
            }
            
            // Normalne logowanie
            console.log('✅ Normalne logowanie - zapisywanie danych...');
            
            // Zapisz dane
            localStorage.setItem('libruz_user', JSON.stringify(profile));
            localStorage.setItem('libruz_session', JSON.stringify(data.session));
            localStorage.setItem('libruz_auth', JSON.stringify({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token
            }));
            
            // Zapamiętaj email
            if (rememberMe && rememberMe.checked) {
                localStorage.setItem('libruz_remember_email', email);
            } else {
                localStorage.removeItem('libruz_remember_email');
            }
            
            showAlert('Logowanie udane! Przekierowuję...', 'success');
            
            // Przekieruj według roli
            setTimeout(() => {
                redirectByRole(profile);
            }, 1000);
            
        } catch (error) {
            console.error('💥 Błąd logowania:', error);
            showAlert('❌ ' + error.message, 'error');
            
            // Animacja błędu
            loginForm.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
            
        } finally {
            // Przywróć przycisk
            loginBtn.disabled = false;
            btnText.textContent = '🔐 Zaloguj się';
        }
    }
    
    async function handleForgotPassword(event) {
        event.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
            showAlert('Wprowadź email do resetu hasła', 'error');
            emailInput.focus();
            return;
        }
        
        if (!validateEmail(email)) {
            showAlert('Wprowadź poprawny adres email', 'error');
            return;
        }
        
        try {
            loginBtn.disabled = true;
            btnText.textContent = '⌛ Wysyłanie...';
            
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password.html',
            });
            
            if (error) throw error;
            
            showAlert('Email resetujący hasło został wysłany! Sprawdź skrzynkę.', 'success');
            
        } catch (error) {
            showAlert('Błąd: ' + error.message, 'error');
        } finally {
            loginBtn.disabled = false;
            btnText.textContent = '🔐 Zaloguj się';
        }
    }
    
    async function checkExistingSession() {
        try {
            console.log('🔍 Sprawdzam istniejącą sesję...');
            
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
                    console.log('🔄 Auto-login:', profile.email);
                    
                    // Zapisz dane
                    localStorage.setItem('libruz_user', JSON.stringify(profile));
                    localStorage.setItem('libruz_session', JSON.stringify(session));
                    
                    // Przekieruj
                    redirectByRole(profile);
                }
            }
        } catch (error) {
            console.log('ℹ️ Brak sesji:', error.message);
        }
    }
    
    function loadRememberedEmail() {
        const rememberedEmail = localStorage.getItem('libruz_remember_email');
        if (rememberedEmail && emailInput) {
            emailInput.value = rememberedEmail;
            if (rememberMe) rememberMe.checked = true;
        }
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showAlert(message, type) {
        if (!alertDiv) return;
        
        alertDiv.textContent = message;
        alertDiv.className = 'alert alert-' + type;
        alertDiv.style.display = 'flex';
        
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, type === 'success' ? 3000 : 5000);
    }
    
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
    
    // Dodaj animację shake jeśli nie istnieje
    if (!document.querySelector('#shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    console.log('✅ System logowania gotowy');
});
