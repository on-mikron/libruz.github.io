// ====== SYSTEM LOGOWANIA LIBRUZ ======
console.log('🔐 Inicjalizacja systemu logowania...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Strona załadowana, konfiguruję logowanie...');
    
    const loginButton = document.getElementById('loginButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    
    if (!loginButton || !emailInput || !passwordInput) {
        console.error('❌ Nie znaleziono elementów formularza!');
        return;
    }
    
    console.log('✅ Formularz znaleziony, dodaję obsługę...');
    
    // 1. Obsługa kliknięcia przycisku
    loginButton.addEventListener('click', handleLogin);
    
    // 2. Obsługa klawisza Enter w polach
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    
    // 3. Główna funkcja logowania
    async function handleLogin() {
        console.log('🖱️ Rozpoczynam logowanie...');
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Walidacja
        if (!email || !password) {
            showError('⚠️ Wypełnij wszystkie pola!');
            return;
        }
        
        if (!email.includes('@')) {
            showError('⚠️ Wpisz poprawny adres email!');
            return;
        }
        
        // Zmiana stanu przycisku
        loginButton.innerHTML = '⌛ Logowanie...';
        loginButton.disabled = true;
        
        try {
            console.log('🔄 Łączę z Supabase...');
            
            // Sprawdź czy Supabase jest dostępny
            if (!window.supabase) {
                throw new Error('Brak połączenia z systemem. Odśwież stronę.');
            }
            
            // Próba logowania
            console.log('🔑 Próbuję zalogować:', email);
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
                } else {
                    throw new Error('Błąd logowania: ' + error.message);
                }
            }
            
            console.log('✅ Logowanie udane!', data.user.email);
            
            // Pobierz profil użytkownika
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();
            
            if (profileError) {
                console.error('❌ Błąd profilu:', profileError);
                throw new Error('Błąd pobierania danych użytkownika');
            }
            
            console.log('👤 Profil:', profile);
            
            // Sprawdź czy to pierwsze logowanie
            if (profile.temporary_password === true) {
                console.log('🔐 Pierwsze logowanie - zmiana hasła wymagana');
                
                // Zapisz w localStorage
                localStorage.setItem('libruz_temp_user', JSON.stringify(profile));
                localStorage.setItem('libruz_user_id', profile.id);
                
                // Przekieruj do zmiany hasła
                showSuccess('✅ Pierwsze logowanie! Przekierowuję...');
                setTimeout(() => {
                    window.location.href = 'change-password.html';
                }, 1500);
                
            } else {
                // Normalne logowanie
                console.log('✅ Normalne logowanie - przekierowuję...');
                
                // Zapisz dane
                localStorage.setItem('libruz_user', JSON.stringify(profile));
                localStorage.setItem('libruz_session', JSON.stringify(data.session));
                
                // Przekieruj według roli
                redirectByRole(profile);
            }
            
        } catch (error) {
            console.error('💥 Błąd podczas logowania:', error);
            
            // Pokaz błąd użytkownikowi
            showError('❌ ' + error.message);
            
            // DEMO MODE: Jeśli Supabase nie działa, użyj trybu demo
            if (error.message.includes('Brak połączenia') || 
                error.message.includes('network')) {
                
                console.log('🔄 Przechodzę w tryb DEMO...');
                demoLogin(email, password);
            }
            
        } finally {
            // Przywróć przycisk
            loginButton.innerHTML = '🔐 Zaloguj się';
            loginButton.disabled = false;
        }
    }
    
    // 4. Przekierowanie według roli
    function redirectByRole(profile) {
        console.log('🎯 Przekierowuję dla roli:', profile.role);
        
        showSuccess('✅ Zalogowano! Przekierowuję...');
        
        setTimeout(() => {
            switch(profile.role) {
                case 'admin':
                    window.location.href = 'admin-dashboard.html';
                    break;
                case 'director':
                    window.location.href = 'director-dashboard.html';
                    break;
                case 'teacher':
                    window.location.href = 'teacher-dashboard.html';
                    break;
                case 'student':
                    window.location.href = 'student-dashboard.html';
                    break;
                default:
                    showError('Nieznana rola użytkownika');
            }
        }, 1000);
    }
    
    // 5. Tryb DEMO (gdy Supabase nie działa)
    function demoLogin(email, password) {
        // Tylko dla admina w demo
        if (email === 'admin@libruz.pl' && password === 'Grahamka321@##') {
            showSuccess('✅ DEMO: Zalogowano jako Administrator');
            
            const demoProfile = {
                id: 'demo-admin-123',
                email: 'admin@libruz.pl',
                first_name: 'Admin',
                last_name: 'System',
                role: 'admin',
                temporary_password: false
            };
            
            localStorage.setItem('libruz_user', JSON.stringify(demoProfile));
            
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1500);
            
        } else {
            showError('❌ DEMO: Tylko admin@libruz.pl / Grahamka321@##');
        }
    }
    
    // 6. Funkcje pomocnicze
    function showError(message) {
        console.error('🚨 Błąd:', message);
        
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.style.background = '#ffeaea';
            errorMessage.style.color = '#ff3b30';
            errorMessage.style.borderLeftColor = '#ff3b30';
            
            // Ukryj po 5 sekundach
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    function showSuccess(message) {
        console.log('✅ Sukces:', message);
        
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.style.background = '#e8f5e9';
            errorMessage.style.color = '#2e7d32';
            errorMessage.style.borderLeftColor = '#2e7d32';
        }
    }
    
    // 7. Automatyczne sprawdzenie sesji
    async function checkExistingSession() {
        try {
            if (!window.supabase) return;
            
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                console.log('📱 Znaleziono aktywną sesję');
                
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                
                if (profile) {
                    console.log('🔄 Automatyczne logowanie:', profile.email);
                    redirectByRole(profile);
                }
            }
        } catch (error) {
            console.log('ℹ️ Brak sesji:', error.message);
        }
    }
    
    // Sprawdź sesję po załadowaniu
    setTimeout(checkExistingSession, 500);
    
    console.log('✅ System logowania gotowy!');
});
