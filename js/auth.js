// ============================================
// SYSTEM LOGOWANIA LIBRUZ - POPRAWIONA WERSJA
// ============================================

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
let loginForm, identifierInput, passwordInput, loginButton, togglePassword;
let errorMessage, errorText, loading, forgotPassword;
let identifierLabel, identifierIcon, codeInfo;
let btnUsername, btnEmail, btnCode;
let quickButtons;

// ============================================
// ZMIENNE GLOBALNE
// ============================================
let loginType = 'username'; // username, email, code
let isInitialized = false;

// ============================================
// INICJALIZACJA DOM
// ============================================
function initDOM() {
    if (isInitialized) return;
    
    loginForm = document.getElementById('loginForm');
    identifierInput = document.getElementById('identifier');
    passwordInput = document.getElementById('password');
    loginButton = document.getElementById('loginButton');
    togglePassword = document.getElementById('togglePassword');
    errorMessage = document.getElementById('errorMessage');
    errorText = document.getElementById('errorText');
    loading = document.getElementById('loading');
    forgotPassword = document.getElementById('forgotPassword');
    identifierLabel = document.getElementById('identifierLabel');
    identifierIcon = document.getElementById('identifierIcon');
    codeInfo = document.getElementById('codeInfo');
    btnUsername = document.getElementById('btnUsername');
    btnEmail = document.getElementById('btnEmail');
    btnCode = document.getElementById('btnCode');
    quickButtons = document.querySelectorAll('.quick-btn');
    
    if (!loginForm || !identifierInput || !passwordInput) {
        console.error('❌ Nie znaleziono elementów formularza!');
        setTimeout(initDOM, 100);
        return;
    }
    
    console.log('✅ DOM zainicjalizowany');
    isInitialized = true;
    setupEventListeners();
}

// ============================================
// KONFIGURACJA EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Pokaż/ukryj hasło
    if (togglePassword) {
        togglePassword.addEventListener('click', handleTogglePassword);
    }
    
    // Typ logowania
    if (btnUsername) {
        btnUsername.addEventListener('click', () => setLoginType('username'));
    }
    if (btnEmail) {
        btnEmail.addEventListener('click', () => setLoginType('email'));
    }
    if (btnCode) {
        btnCode.addEventListener('click', () => setLoginType('code'));
    }
    
    // Szybkie logowanie
    if (quickButtons && quickButtons.length > 0) {
        quickButtons.forEach(button => {
            button.addEventListener('click', handleQuickLogin);
        });
    }
    
    // Formularz
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Enter key support
    if (identifierInput) {
        identifierInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (passwordInput) passwordInput.focus();
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin(e);
            }
        });
    }
    
    // Zapomniane hasło
    if (forgotPassword) {
        forgotPassword.addEventListener('click', handleForgotPassword);
    }
    
    // Automatyczne wykrywanie typu logowania
    if (identifierInput) {
        identifierInput.addEventListener('input', handleIdentifierInput);
    }
}

// ============================================
// OBSŁUGA ZDARZEŃ
// ============================================
function handleTogglePassword() {
    if (!passwordInput || !togglePassword) return;
    
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    const icon = togglePassword.querySelector('i');
    if (icon) {
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }
}

function handleQuickLogin(e) {
    e.preventDefault();
    const button = e.currentTarget;
    const login = button.getAttribute('data-login');
    const pass = button.getAttribute('data-pass');
    
    if (!login || !pass) {
        showError('Brak danych logowania');
        return;
    }
    
    // Automatycznie wykryj typ logowania
    if (login.includes('@')) {
        setLoginType('email');
    } else if (/^\d/.test(login) || login.toUpperCase().startsWith('NAUCZ')) {
        setLoginType('code');
    } else {
        setLoginType('username');
    }
    
    // Ustaw wartości
    if (identifierInput) identifierInput.value = login;
    if (passwordInput) passwordInput.value = pass;
    
    // Zaznacz przycisk
    quickButtons.forEach(btn => btn.style.borderColor = 'transparent');
    button.style.borderColor = '#4361ee';
    button.style.backgroundColor = '#f0f4ff';
    
    // Automatycznie zaloguj
    setTimeout(() => {
        if (loginForm) {
            const submitEvent = new Event('submit');
            loginForm.dispatchEvent(submitEvent);
        }
    }, 800);
}

function handleIdentifierInput() {
    if (!identifierInput) return;
    
    const value = identifierInput.value;
    if (!value) return;
    
    // Automatycznie wykryj typ
    if (value.includes('@')) {
        setLoginType('email');
    } else if (/^\d/.test(value) || value.toUpperCase().startsWith('NAUCZ')) {
        setLoginType('code');
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    
    if (!identifierInput) return;
    
    const identifier = identifierInput.value.trim();
    
    if (!identifier) {
        showError('Wprowadź login/email/kod do resetu hasła');
        identifierInput.focus();
        return;
    }
    
    // Znajdź email na podstawie identyfikatora
    const userEmail = await findEmailByIdentifier(identifier);
    
    if (!userEmail) {
        showError('Nie znaleziono użytkownika');
        return;
    }
    
    try {
        if (loginButton) {
            loginButton.disabled = true;
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';
        }
        
        const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
            redirectTo: window.location.origin + '/reset-password.html',
        });
        
        if (error) throw error;
        
        showSuccess('Email resetujący hasło został wysłany! Sprawdź skrzynkę.');
        
    } catch (error) {
        showError('Błąd podczas wysyłania emaila: ' + error.message);
    } finally {
        if (loginButton) {
            loginButton.disabled = false;
            loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Zaloguj się';
        }
    }
}

// ============================================
// USTAWIENIE TYPU LOGOWANIA
// ============================================
function setLoginType(type) {
    loginType = type;
    
    // Resetuj przyciski
    if (btnUsername) btnUsername.classList.remove('active');
    if (btnEmail) btnEmail.classList.remove('active');
    if (btnCode) btnCode.classList.remove('active');
    
    // Ustaw aktywny przycisk
    switch(type) {
        case 'username':
            if (btnUsername) btnUsername.classList.add('active');
            if (identifierLabel) identifierLabel.innerHTML = '<i class="fas fa-user"></i> Login';
            if (identifierIcon) identifierIcon.className = 'fas fa-user';
            if (identifierInput) {
                identifierInput.placeholder = 'np. janek_nowakowski';
                identifierInput.type = 'text';
            }
            if (codeInfo) codeInfo.style.display = 'none';
            break;
            
        case 'email':
            if (btnEmail) btnEmail.classList.add('active');
            if (identifierLabel) identifierLabel.innerHTML = '<i class="fas fa-envelope"></i> Email';
            if (identifierIcon) identifierIcon.className = 'fas fa-envelope';
            if (identifierInput) {
                identifierInput.placeholder = 'np. uczen@szkola.pl';
                identifierInput.type = 'email';
            }
            if (codeInfo) codeInfo.style.display = 'none';
            break;
            
        case 'code':
            if (btnCode) btnCode.classList.add('active');
            if (identifierLabel) identifierLabel.innerHTML = '<i class="fas fa-id-card"></i> Kod';
            if (identifierIcon) identifierIcon.className = 'fas fa-id-card';
            if (identifierInput) {
                identifierInput.placeholder = 'np. 8S001 lub NAUCZ001';
                identifierInput.type = 'text';
            }
            if (codeInfo) codeInfo.style.display = 'block';
            break;
    }
    
    // Wyczyść pole i focus
    if (identifierInput) {
        identifierInput.value = '';
        identifierInput.focus();
    }
}

// ============================================
// WALIDACJA
// ============================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateIdentifier(identifier) {
    if (!identifier || identifier.trim() === '') {
        return 'Wprowadź login/email/kod';
    }
    
    if (loginType === 'email' && !validateEmail(identifier)) {
        return 'Wprowadź poprawny adres email';
    }
    
    if (loginType === 'code') {
        if (!/^[A-Z0-9]+$/.test(identifier.toUpperCase())) {
            return 'Kod może zawierać tylko litery i cyfry';
        }
        if (identifier.length < 3) {
            return 'Kod musi mieć minimum 3 znaki';
        }
    }
    
    if (loginType === 'username') {
        if (identifier.length < 3) {
            return 'Login musi mieć minimum 3 znaki';
        }
        if (!/^[a-zA-Z0-9_.-]+$/.test(identifier)) {
            return 'Login może zawierać tylko litery, cyfry, _, ., -';
        }
    }
    
    return null; // Brak błędów
}

function showError(message) {
    if (!errorMessage || !errorText) return;
    
    errorText.textContent = message;
    errorMessage.className = 'alert alert-error';
    errorMessage.style.display = 'flex';
    
    // Animacja
    errorMessage.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        if (errorMessage) errorMessage.style.animation = '';
    }, 500);
    
    setTimeout(() => {
        if (errorMessage) errorMessage.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    if (!errorMessage || !errorText) return;
    
    errorText.textContent = message;
    errorMessage.className = 'alert alert-success';
    errorMessage.style.display = 'flex';
    
    setTimeout(() => {
        if (errorMessage) errorMessage.style.display = 'none';
        errorMessage.className = 'alert alert-error';
    }, 3000);
}

// ============================================
// FUNKCJA ZNAJDŹ EMAIL PO IDENTYFIKATORZE
// ============================================
async function findEmailByIdentifier(identifier) {
    try {
        let query = supabase
            .from('profiles')
            .select('email')
            .eq('is_active', true);
        
        // Wyszukaj w zależności od typu
        switch(loginType) {
            case 'username':
                query = query.eq('username', identifier.toLowerCase());
                break;
            case 'email':
                query = query.eq('email', identifier.toLowerCase());
                break;
            case 'code':
                const codeUpper = identifier.toUpperCase();
                query = query.or(`student_code.eq.${codeUpper},teacher_code.eq.${codeUpper}`);
                break;
        }
        
        const { data, error } = await query.single();
        
        if (error) {
            console.error('❌ Nie znaleziono użytkownika:', error);
            return null;
        }
        
        return data.email;
        
    } catch (error) {
        console.error('💥 Błąd wyszukiwania:', error);
        return null;
    }
}

// ============================================
// LOGOWANIE
// ============================================
async function handleLogin(event) {
    if (event) event.preventDefault();
    
    if (!identifierInput || !passwordInput || !loginButton) return;
    
    const identifier = identifierInput.value.trim();
    const password = passwordInput.value;
    
    // Walidacja
    const validationError = validateIdentifier(identifier);
    if (validationError) {
        showError(validationError);
        return;
    }
    
    if (!password || password.length < 6) {
        showError('Hasło musi mieć minimum 6 znaków');
        return;
    }
    
    // Ustaw stan ładowania
    if (loginButton) {
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logowanie...';
    }
    if (loading) loading.style.display = 'flex';
    
    try {
        console.log(`🔐 Logowanie (${loginType}):`, identifier);
        
        // 1. Znajdź email na podstawie identyfikatora
        const userEmail = await findEmailByIdentifier(identifier);
        
        if (!userEmail) {
            throw new Error('Nie znaleziono użytkownika. Sprawdź login/email/kod.');
        }
        
        console.log('✅ Znaleziono email:', userEmail);
        
        // 2. Logowanie przez Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password: password
        });
        
        if (error) {
            console.error('❌ Błąd auth:', error.message);
            
            if (error.message.includes('Invalid login credentials')) {
                throw new Error('Nieprawidłowy login lub hasło');
            } else if (error.message.includes('Email not confirmed')) {
                throw new Error('Potwierdź email przed logowaniem');
            } else if (error.message.includes('User not found')) {
                throw new Error('Użytkownik nie istnieje');
            } else {
                throw new Error('Błąd logowania: ' + error.message);
            }
        }
        
        console.log('✅ Zalogowano:', data.user.email);
        
        // 3. Pobierz profil z bazy
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', userEmail)
            .single();
        
        if (profileError) {
            console.error('❌ Błąd profilu:', profileError);
            throw new Error('Błąd pobierania danych użytkownika');
        }
        
        if (!profile) {
            throw new Error('Profil użytkownika nie znaleziony');
        }
        
        console.log('👤 Profil:', profile);
        
        // 4. Sprawdź czy konto aktywne
        if (!profile.is_active) {
            throw new Error('Konto jest nieaktywne. Skontaktuj się z administratorem.');
        }
        
        // 5. Sprawdź czy pierwsze logowanie
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
        
        // 6. Normalne logowanie - zapisz dane
        localStorage.setItem('libruz_user', JSON.stringify(profile));
        localStorage.setItem('libruz_session', JSON.stringify(data.session));
        localStorage.setItem('libruz_auth', JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
        }));
        
        // Zapamiętaj identyfikator
        const rememberMe = document.getElementById('rememberMe');
        if (rememberMe && rememberMe.checked) {
            localStorage.setItem('libruz_remember_identifier', identifier);
            localStorage.setItem('libruz_remember_type', loginType);
        } else {
            localStorage.removeItem('libruz_remember_identifier');
            localStorage.removeItem('libruz_remember_type');
        }
        
        showSuccess('Logowanie udane! Przekierowuję...');
        
        // 7. Przekieruj według roli
        setTimeout(() => {
            redirectByRole(profile);
        }, 1000);
        
    } catch (error) {
        console.error('💥 Błąd:', error);
        showError(error.message);
        
        // Animacja błędu
        if (loginForm) {
            loginForm.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                if (loginForm) loginForm.style.animation = '';
            }, 500);
        }
        
    } finally {
        // Przywróć przycisk
        if (loginButton) {
            loginButton.disabled = false;
            loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Zaloguj się';
        }
        if (loading) loading.style.display = 'none';
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
// ZAŁADUJ ZAPAMIĘTANY IDENTYFIKATOR
// ============================================
function loadRememberedIdentifier() {
    const rememberedIdentifier = localStorage.getItem('libruz_remember_identifier');
    const rememberedType = localStorage.getItem('libruz_remember_type');
    
    if (rememberedIdentifier && rememberedType) {
        setLoginType(rememberedType);
        if (identifierInput) identifierInput.value = rememberedIdentifier;
        
        const rememberMe = document.getElementById('rememberMe');
        if (rememberMe) rememberMe.checked = true;
    }
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
        console.log('ℹ️ Brak sesji:', error.message);
    }
}

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

// ============================================
// FUNKCJE POMOCNICZE DLA ADMINA
// ============================================
async function generateUsernames() {
    try {
        // Pobierz wszystkich użytkowników bez username
        const { data: users, error } = await supabase
            .from('profiles')
            .select('id, email, first_name, last_name, role')
            .is('username', null);
        
        if (error) throw error;
        
        console.log(`📝 Generowanie loginów dla ${users?.length || 0} użytkowników`);
        
        if (!users || users.length === 0) {
            console.log('🎉 Wszyscy użytkownicy mają już loginy!');
            return;
        }
        
        // Dla każdego użytkownika wygeneruj username
        for (const user of users) {
            let username = '';
            
            if (user.role === 'student') {
                // Dla uczniów: imię_nazwisko (bez polskich znaków)
                username = `${user.first_name?.toLowerCase() || 'uczen'}_${user.last_name?.toLowerCase() || 'nowy'}`
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9_]/g, '')
                    .replace(/_+/g, '_');
            } else {
                // Dla innych: imie.nazwisko
                username = `${user.first_name?.toLowerCase() || 'user'}.${user.last_name?.toLowerCase() || 'nowy'}`
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9.]/g, '')
                    .replace(/\.+/g, '.');
            }
            
            // Jeśli username istnieje, dodaj liczbę
            let finalUsername = username;
            let counter = 1;
            
            while (counter < 100) {
                const { data: existing } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('username', finalUsername)
                    .single();
                
                if (!existing) break;
                
                finalUsername = `${username}${counter}`;
                counter++;
            }
            
            // Zaktualizuj w bazie
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ username: finalUsername })
                .eq('id', user.id);
            
            if (!updateError) {
                console.log(`✅ ${user.email} -> ${finalUsername}`);
            } else {
                console.error(`❌ Błąd dla ${user.email}:`, updateError);
            }
        }
        
        console.log('🎉 Loginy wygenerowane!');
        showSuccess('Loginy wygenerowane pomyślnie!');
        
    } catch (error) {
        console.error('💥 Błąd generowania loginów:', error);
        showError('Błąd generowania loginów: ' + error.message);
    }
}

// ============================================
// INICJALIZACJA APLIKACJI
// ============================================
function initApp() {
    console.log('🚀 LIBRUZ - Inicjalizacja aplikacji');
    
    // Inicjalizuj DOM
    initDOM();
    
    // Załaduj zapamiętane dane
    loadRememberedIdentifier();
    
    // Sprawdź sesję
    setTimeout(checkExistingSession, 500);
    
    // Test połączenia
    setTimeout(testConnection, 1000);
    
    // Focus na pole identyfikatora
    if (identifierInput) {
        setTimeout(() => identifierInput.focus(), 300);
    }
    
    // Ustaw domyślny typ logowania jeśli nie ma zapamiętanego
    if (!localStorage.getItem('libruz_remember_identifier')) {
        setLoginType('username');
    }
    
    console.log('✅ Aplikacja zainicjalizowana');
}

// ============================================
// EVENT DOMContentLoaded
// ============================================
document.addEventListener('DOMContentLoaded', initApp);

// ============================================
// EKSPORT FUNKCJI DO KONSOLI
// ============================================
window.LIBRUZ = {
    generateUsernames,
    setLoginType: (type) => setLoginType(type),
    testConnection,
    login: handleLogin,
    logout: () => {
        localStorage.clear();
        supabase.auth.signOut();
        window.location.href = 'index.html';
    },
    getUser: () => JSON.parse(localStorage.getItem('libruz_user') || 'null'),
    clearStorage: () => localStorage.clear()
};

console.log('📚 LIBRUZ System loaded. Dostępne funkcje:');
console.log('- LIBRUZ.generateUsernames() - generuj loginy');
console.log('- LIBRUZ.setLoginType("username"/"email"/"code")');
console.log('- LIBRUZ.testConnection() - testuj połączenie');
console.log('- LIBRUZ.getUser() - pobierz dane użytkownika');
console.log('- LIBRUZ.logout() - wyloguj się');
