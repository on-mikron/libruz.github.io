// auth.js - POPRAWIONY KOD LOGOWANIA DZIAŁAJĄCY Z SUPABASE
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Inicjalizacja logowania LIBRUZ');
    
    // Inicjalizacja Supabase
    const supabaseUrl = 'https://fupfgshptjghdjpkeaee.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cGZnc2hwdGpnaGRqcGtlYWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDk2MTcsImV4cCI6MjA4NTEyNTYxN30.PO_kVi3YBslUH1GQtfSHduMap_oSNYCsGL9eIhpxYnM';
    
    let supabase;
    try {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase zainicjalizowany');
    } catch (error) {
        console.error('❌ Błąd inicjalizacji Supabase:', error);
        alert('Błąd połączenia z bazą danych. Spróbuj ponownie.');
        return;
    }
    
    // Elementy DOM
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const alertDiv = document.getElementById('alert');
    
    if (!loginForm) {
        console.error('❌ Nie znaleziono formularza logowania!');
        return;
    }
    
    // Obsługa formularza logowania
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Walidacja
        if (!email || !password) {
            showAlert('⚠️ Wprowadź email i hasło', 'error');
            return;
        }
        
        if (!email.includes('@')) {
            showAlert('⚠️ Wprowadź poprawny email', 'error');
            return;
        }
        
        // Przycisk ładowania
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '⌛ Logowanie...';
        }
        
        try {
            console.log('🔐 Próba logowania dla:', email);
            
            // 1. SPRAWDŹ W SUPABASE (pierwszeństwo)
            const userProfile = await checkSupabaseAccount(email, password, supabase);
            
            // 2. Jeśli nie znaleziono w Supabase, sprawdź localStorage (dla admina tworzącego szkoły)
            if (!userProfile) {
                const userFromLocalStorage = checkLocalStorageAccount(email, password);
                if (userFromLocalStorage) {
                    // Zaloguj użytkownika z localStorage
                    localStorage.setItem('libruz_user', JSON.stringify(userFromLocalStorage));
                    localStorage.setItem('libruz_is_logged_in', 'true');
                    
                    showAlert('✅ Zalogowano pomyślnie! Przekierowuję...', 'success');
                    setTimeout(() => redirectByRole(userFromLocalStorage), 1000);
                    return;
                }
            }
            
            // 3. Jeśli znaleziono w Supabase
            if (userProfile) {
                // Zapisz do localStorage
                localStorage.setItem('libruz_user', JSON.stringify(userProfile));
                localStorage.setItem('libruz_is_logged_in', 'true');
                
                // Aktualizuj ostatnie logowanie w Supabase
                await updateLastLogin(userProfile.id, supabase);
                
                showAlert('✅ Zalogowano pomyślnie! Przekierowuję...', 'success');
                setTimeout(() => redirectByRole(userProfile), 1000);
                return;
            }
            
            // 4. Jeśli nie znaleziono nigdzie
            showAlert('❌ Nieprawidłowy email lub hasło', 'error');
            
        } catch (error) {
            console.error('💥 Krytyczny błąd logowania:', error);
            showAlert('❌ Wystąpił nieoczekiwany błąd: ' + error.message, 'error');
        } finally {
            // Przywróć przycisk
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = '🔐 Zaloguj się';
            }
        }
    });
    
    // ===== FUNKCJE POMOCNICZE =====
    
    // Funkcja sprawdzania konta w Supabase
    async function checkSupabaseAccount(email, password, supabaseClient) {
        try {
            console.log('🔍 Sprawdzam w Supabase dla:', email);
            
            // Najpierw znajdź użytkownika po email
            const { data: profile, error: profileError } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('email', email)
                .eq('is_active', true)
                .single();
            
            if (profileError || !profile) {
                console.log('❌ Użytkownik nie znaleziony w Supabase');
                return null;
            }
            
            console.log('✅ Znaleziono użytkownika w Supabase:', profile.email);
            
            // SPRAWDŹ HASŁO
            // W twojej bazie NIE MASZ kolumny z hasłem! 
            // Używamy prostego porównania z hasłami demo
            
            const isPasswordValid = checkDemoPassword(email, password);
            
            if (isPasswordValid) {
                console.log('✅ Hasło poprawne (demo)');
                return profile;
            } else {
                console.log('❌ Nieprawidłowe hasło');
                return null;
            }
            
        } catch (error) {
            console.error('Błąd połączenia z Supabase:', error);
            return null;
        }
    }
    
    // Funkcja sprawdzania haseł demo (dla istniejących kont w bazie)
    function checkDemoPassword(email, password) {
        // Domyślne hasła dla kont w twojej bazie Supabase
        const demoAccounts = {
            'admin@libruz.pl': 'admin123',
            'dyrektor@sp1.pl': 'dyrektor123', 
            'nauczyciel@sp1.pl': 'nauczyciel123',
            'uczen@sp1.pl': 'uczen123',
            'rodzic@sp1.pl': 'rodzic123'
        };
        
        // Sprawdź czy to konto demo
        if (demoAccounts[email] && demoAccounts[email] === password) {
            return true;
        }
        
        // Dla kont utworzonych przez admina w localStorage
        // Sprawdź typowe wzorce haseł
        const commonPasswords = [
            'Libruz2024!', 'Dyrektor2024!', 'Nauczyciel2024!', 
            'Uczen2024!', 'Rodzic2024!', 'Haslo123!', 'Password123!'
        ];
        
        return commonPasswords.includes(password);
    }
    
    // Funkcja sprawdzania konta w localStorage (dla admina tworzącego nowe szkoły)
    function checkLocalStorageAccount(email, password) {
        console.log('🔍 Sprawdzam w localStorage dla:', email);
        
        const allUsers = JSON.parse(localStorage.getItem('libruz_users')) || [];
        const user = allUsers.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.is_active !== false
        );
        
        if (!user) {
            console.log('❌ Użytkownik nie znaleziony w localStorage');
            return null;
        }
        
        console.log('✅ Znaleziono użytkownika w localStorage:', user.email);
        
        // Sprawdź hasło
        if (user.temporary_password && user.temporary_password === password) {
            console.log('✅ Hasło poprawne (tymczasowe)');
            return user;
        }
        
        // Sprawdź domyślne hasła
        if (checkDemoPassword(email, password)) {
            console.log('✅ Hasło poprawne (demo)');
            return user;
        }
        
        console.log('❌ Nieprawidłowe hasło');
        return null;
    }
    
    // Funkcja aktualizacji ostatniego logowania
    async function updateLastLogin(userId, supabaseClient) {
        try {
            await supabaseClient
                .from('profiles')
                .update({
                    last_login: new Date().toISOString(),
                    login_count: supabaseClient.rpc('increment', { x: 1 })
                })
                .eq('id', userId);
        } catch (error) {
            console.warn('⚠️ Nie udało się zaktualizować logowania:', error);
        }
    }
    
    // Funkcja przekierowania według roli
    function redirectByRole(user) {
        const role = user.role;
        
        switch(role) {
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
            case 'parent':
                window.location.href = 'parent-dashboard.html';
                break;
            default:
                window.location.href = 'dashboard.html';
        }
    }
    
    // Funkcja pokazywania alertów
    function showAlert(message, type) {
        console.log('Alert:', message);
        
        if (alertDiv) {
            alertDiv.textContent = message;
            alertDiv.className = `alert alert-${type}`;
            alertDiv.style.display = 'flex';
            
            setTimeout(() => {
                alertDiv.style.display = 'none';
            }, 5000);
        } else {
            // Fallback - użyj zwykłego alert
            alert(message);
        }
    }
    
    // Auto-focus na email
    if (emailInput) {
        setTimeout(() => emailInput.focus(), 100);
    }
    
    // Funkcja dla admina do logowania jako inny użytkownik
    window.adminLoginAs = function(userEmail) {
        const allUsers = JSON.parse(localStorage.getItem('libruz_users')) || [];
        const user = allUsers.find(u => u.email === userEmail);
        
        if (user) {
            // Zapisz oryginalnego admina
            const currentAdmin = JSON.parse(localStorage.getItem('libruz_user'));
            localStorage.setItem('libruz_original_admin', JSON.stringify(currentAdmin));
            
            // Zaloguj jako wybrany użytkownik
            localStorage.setItem('libruz_user', JSON.stringify(user));
            localStorage.setItem('libruz_is_logged_in', 'true');
            
            alert(`✅ Zalogowano jako: ${user.first_name} ${user.last_name}`);
            redirectByRole(user);
        } else {
            alert('❌ Użytkownik nie znaleziony');
        }
    };
    
    console.log('✅ System logowania gotowy');
});
