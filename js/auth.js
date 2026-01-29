// auth.js - UPROSZCZONY KOD LOGOWANIA
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Inicjalizacja logowania...');
    
    // Supabase
    const supabase = window.supabase.createClient(
        'https://fupfgshptjghdjpkeaee.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cGZnc2hwdGpnaGRqcGtlYWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDk2MTcsImV4cCI6MjA4NTEyNTYxN30.PO_kVi3YBslUH1GQtfSHduMap_oSNYCsGL9eIhpxYnM'
    );
    
    // Elementy
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const alertDiv = document.getElementById('alert');
    
    if (!loginForm) {
        console.error('❌ Nie znaleziono formularza!');
        return;
    }
    
    // Obsługa formularza
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Prosta walidacja
        if (!email || !password) {
            showAlert('Wprowadź email i hasło', 'error');
            return;
        }
        
        if (!email.includes('@')) {
            showAlert('Wprowadź poprawny email', 'error');
            return;
        }
        
        // Przycisk ładowania
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span>⌛ Logowanie...</span>';
        }
        
        try {
            console.log('🔐 Próba logowania:', email);
            
            // 1. Sprawdź czy użytkownik istnieje w naszej bazie
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', email)
                .eq('is_active', true)
                .single();
            
            if (profileError || !profile) {
                console.error('❌ Użytkownik nie znaleziony w bazie');
                showAlert('Nieprawidłowy email lub konto nieaktywne', 'error');
                return;
            }
            
            console.log('✅ Znaleziono profil:', profile);
            
            // 2. Dla DEMO - proste hasło (w prawdziwym systemie użyj Supabase Auth)
            // W DEMO sprawdzamy czy hasło = "admin123" dla admina
            let isValidPassword = false;
            
            if (email === 'admin@libruz.pl' && password === 'admin123') {
                isValidPassword = true;
            } else if (email === 'dyrektor@sp1.pl' && password === 'dyrektor123') {
                isValidPassword = true;
            } else if (email === 'nauczyciel@sp1.pl' && password === 'nauczyciel123') {
                isValidPassword = true;
            } else if (email === 'uczen@sp1.pl' && password === 'uczen123') {
                isValidPassword = true;
            } else if (email === 'rodzic@sp1.pl' && password === 'rodzic123') {
                isValidPassword = true;
            }
            
            if (!isValidPassword) {
                showAlert('Nieprawidłowe hasło', 'error');
                return;
            }
            
            // 3. Zapisz dane użytkownika
            localStorage.setItem('libruz_user', JSON.stringify(profile));
            
            // 4. Pokaz sukces
            showAlert('✅ Zalogowano pomyślnie! Przekierowuję...', 'success');
            
            // 5. Przekieruj według roli
            setTimeout(() => {
                if (profile.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else if (profile.role === 'director') {
                    window.location.href = 'director-dashboard.html';
                } else if (profile.role === 'teacher') {
                    window.location.href = 'teacher-dashboard.html';
                } else if (profile.role === 'student') {
                    window.location.href = 'student-dashboard.html';
                } else if (profile.role === 'parent') {
                    window.location.href = 'parent-dashboard.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 1500);
            
        } catch (error) {
            console.error('💥 Błąd logowania:', error);
            showAlert('❌ Błąd systemu: ' + error.message, 'error');
        } finally {
            // Przywróć przycisk
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<span>🔐 Zaloguj się</span>';
            }
        }
    });
    
    // Funkcja pokazywania alertów
    function showAlert(message, type) {
        if (!alertDiv) {
            // Jeśli nie ma diva alert, pokaż jako alert przeglądarki
            alert(message);
            return;
        }
        
        alertDiv.textContent = message;
        alertDiv.className = 'alert alert-' + type;
        alertDiv.style.display = 'flex';
        
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 5000);
    }
    
    // Auto-focus na email
    if (emailInput) {
        setTimeout(() => emailInput.focus(), 100);
    }
    
    console.log('✅ System logowania gotowy');
});
// auth.js - rozszerzenie o obsługę wymuszonej zmiany hasła

// Dodaj tę funkcję po udanym logowaniu
async function handleFirstLogin(user) {
    if (user.must_change_password || user.temporary_password) {
        // Przekieruj do zmiany hasła
        localStorage.setItem('libruz_must_change_password', 'true');
        window.location.href = 'change-password.html';
        return false;
    }
    return true;
}

// Funkcja zmiany hasła (change-password.html)
async function changePassword(newPassword) {
    const user = JSON.parse(localStorage.getItem('libruz_user'));
    
    const { error } = await supabase
        .from('profiles')
        .update({
            must_change_password: false,
            temporary_password: false,
            password_hash: await hashPassword(newPassword),
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    
    if (!error) {
        localStorage.removeItem('libruz_must_change_password');
        alert('Hasło zostało zmienione!');
        // Przekieruj do odpowiedniego dashboard
        redirectByRole(user.role);
    }
}
