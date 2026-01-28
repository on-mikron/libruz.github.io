// ====== AUTH.JS - POPRAWIONE LOGOWANIE ======
console.log('🔐 Ładuję system logowania...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Formularz logowania gotowy');
    
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    if (!loginForm) {
        console.error('❌ Nie znaleziono formularza logowania!');
        return;
    }
    
    // Nasłuchuj zdarzenie submit
    loginForm.addEventListener('submit', async function(event) {
        console.log('🖱️ Kliknięto przycisk logowania');
        event.preventDefault(); // Zatrzymaj domyślne wysłanie formularza
        
        // Pobierz wartości z formularza
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        console.log('📧 Email:', email);
        console.log('🔑 Hasło:', password ? '***' : 'PUSTE');
        
        // Walidacja
        if (!email || !password) {
            showError('⚠️ Wypełnij wszystkie pola!');
            return;
        }
        
        if (!email.includes('@')) {
            showError('⚠️ Wprowadź poprawny email!');
            return;
        }
        
        // Przycisk "ładowania"
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logowanie...';
        submitBtn.disabled = true;
        
        try {
            console.log('🔄 Próba logowania...');
            
            // Poczekaj aż Supabase będzie gotowy
            const supabaseClient = await window.checkSupabase();
            
            if (!supabaseClient) {
                throw new Error('Nie można połączyć się z bazą danych');
            }
            
            // Próba logowania
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) {
                console.error('❌ Błąd logowania:', error.message);
                
                // Sprawdź konkretne błędy
                if (error.message.includes('Invalid login credentials')) {
                    throw new Error('Nieprawidłowy email lub hasło');
                } else if (error.message.includes('Email not confirmed')) {
                    throw new Error('Email niepotwierdzony');
                } else {
                    throw error;
                }
            }
            
            console.log('✅ Zalogowano pomyślnie!');
            console.log('Użytkownik:', data.user.email);
            
            // Pobierz profil użytkownika
            const { data: profile, error: profileError } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();
            
            if (profileError) {
                console.error('Błąd pobierania profilu:', profileError);
                throw new Error('Błąd pobierania danych użytkownika');
            }
            
            console.log('👤 Profil:', profile);
            
            // Sprawdź czy to pierwsze logowanie
            if (profile.temporary_password === true) {
                console.log('🔐 Pierwsze logowanie - przekierowuję do zmiany hasła');
                
                // Zapisz dane w localStorage
                localStorage.setItem('libruz_temp_user', JSON.stringify(profile));
                localStorage.setItem('libruz_user_id', profile.id);
                
                // Przekieruj do zmiany hasła
                window.location.href = 'change-password.html';
                
            } else {
                console.log('✅ Normalne logowanie');
                
                // Zapisz sesję
                localStorage.setItem('libruz_user', JSON.stringify(profile));
                localStorage.setItem('libruz_session', JSON.stringify(data.session));
                
                // Przekieruj do odpowiedniego panelu
                redirectToDashboard(profile);
            }
            
        } catch (error) {
            console.error('💥 Krytyczny błąd:', error);
            showError('❌ ' + error.message);
            
            // DEMO: Jeśli Supabase nie działa, użyj trybu demo
            if (error.message.includes('baza danych') || error.message.includes('połączyć')) {
                console.log('🔄 Przechodzę w tryb DEMO...');
                
                // Demo logowanie tylko dla admina
                if (email === 'admin@libruz.pl' && password === 'Grahamka321@##') {
                    showError('✅ DEMO: Zalogowano jako admin (tryb testowy)');
                    
                    // Symulacja admina
                    const demoProfile = {
                        id: 'demo-admin-id',
                        email: 'admin@libruz.pl',
                        first_name: 'Admin',
                        last_name: 'System',
                        role: 'admin',
                        temporary_password: false
                    };
                    
                    localStorage.setItem('libruz_user', JSON.stringify(demoProfile));
                    setTimeout(() => {
                        window.location.href = 'admin-dashboard.html';
                    }, 1000);
                    
                } else {
                    showError('❌ DEMO: Tylko admin@libruz.pl / Grahamka321@##');
                }
            }
            
        } finally {
            // Przywróć przycisk
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Funkcja przekierowania
    function redirectToDashboard(profile) {
        console.log('🎯 Przekierowuję do panelu dla roli:', profile.role);
        
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
                showError('Nieznana rola użytkownika: ' + profile.role);
        }
    }
    
    // Funkcja pokazująca błąd
    function showError(message) {
        console.error('🚨 Błąd:', message);
        
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            
            // Ukryj po 5 sekundach
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }
    
    // Sprawdź czy użytkownik jest już zalogowany
    async function checkExistingSession() {
        try {
            const supabaseClient = await window.checkSupabase();
            if (!supabaseClient) return;
            
            const { data: { session } } = await supabaseClient.auth.getSession();
            
            if (session) {
                console.log('📱 Znaleziono istniejącą sesję');
                
                // Pobierz profil
                const { data: profile } = await supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                
                if (profile) {
                    console.log('👤 Automatyczne logowanie:', profile.email);
                    redirectToDashboard(profile);
                }
            }
        } catch (error) {
            console.log('Brak sesji lub błąd:', error.message);
        }
    }
    
    // Uruchom sprawdzenie sesji
    setTimeout(() => {
        checkExistingSession();
    }, 1000);
    
    console.log('✅ System logowania gotowy do użycia');
});
