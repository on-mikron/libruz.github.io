// ====== LOGIKA LOGOWANIA LIBRUZ ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('LIBRUZ System - gotowy!');
    
    const loginForm = document.getElementById('loginForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const loginSection = document.getElementById('loginSection');
    const changePasswordSection = document.getElementById('changePasswordSection');
    const errorBox = document.getElementById('errorBox');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Sprawdź czy użytkownik już zmienił hasło (w localStorage)
    const hasChangedPassword = localStorage.getItem('libruz_password_changed');
    
    // 1. LOGOWANIE
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const login = document.getElementById('loginInput').value.trim();
        const password = document.getElementById('passwordInput').value;
        
        // WALIDACJA
        if (!login || !password) {
            showError('❌ Wypełnij wszystkie pola!');
            return;
        }
        
        // DEMO: Logowanie admina
        if (login === 'admin@libruz.pl' && password === 'Grahamka321@##') {
            console.log('Zalogowano admina');
            
            // Symulacja: Czy to pierwsze logowanie z tymczasowym hasłem?
            const isFirstLogin = true; // W prawdziwym systemie sprawdzamy z bazy
            
            if (isFirstLogin && !hasChangedPassword) {
                // PIERWSZE LOGOWANIE - pokaż formularz zmiany
                showChangePasswordForm();
                showInfo('🔐 Witaj! To Twoje pierwsze logowanie. Ustaw swoje dane.');
            } else {
                // NORMALNE LOGOWANIE - przejdź do dashboardu
                goToDashboard();
            }
            
        } else {
            showError('❌ Nieprawidłowy login lub hasło');
        }
    });
    
    // 2. ZMIANA HASŁA (po zalogowaniu)
    changePasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const firstName = document.getElementById('firstNameInput').value.trim();
        const lastName = document.getElementById('lastNameInput').value.trim();
        const newPassword = document.getElementById('newPasswordInput').value;
        const confirmPassword = document.getElementById('confirmPasswordInput').value;
        
        // WALIDACJA
        if (!firstName || !lastName) {
            showError('❌ Podaj imię i nazwisko!');
            return;
        }
        
        if (newPassword.length < 8) {
            showError('❌ Hasło musi mieć minimum 8 znaków!');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showError('❌ Hasła nie są identyczne!');
            return;
        }
        
        // ZAPISZ DANE (w localStorage dla demo)
        localStorage.setItem('libruz_password_changed', 'true');
        localStorage.setItem('libruz_user_name', firstName + ' ' + lastName);
        localStorage.setItem('libruz_user_role', 'admin');
        
        // Komunikat sukcesu
        showSuccess('✅ Dane zapisane! Witaj, ' + firstName + ' ' + lastName);
        
        // Przekieruj do dashboardu po 2 sekundach
        setTimeout(() => {
            goToDashboard();
        }, 2000);
    });
    
    // 3. WYLOGOWANIE
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('libruz_password_changed');
        localStorage.removeItem('libruz_user_name');
        showLoginForm();
        showInfo('👋 Wylogowano pomyślnie');
    });
    
    // FUNKCJE POMOCNICZE
    function showChangePasswordForm() {
        loginSection.style.display = 'none';
        changePasswordSection.style.display = 'block';
        errorBox.classList.add('hidden');
    }
    
    function showLoginForm() {
        loginSection.style.display = 'block';
        changePasswordSection.style.display = 'none';
        errorBox.classList.add('hidden');
        // Wyczyść formularz
        loginForm.reset();
        changePasswordForm.reset();
    }
    
    function goToDashboard() {
        // Przekieruj do dashboardu
        showSuccess('✅ Przekierowywanie do panelu...');
        
        // W prawdziwym systemie:
        // window.location.href = 'dashboard.html';
        
        // Na razie pokażemy komunikat
        setTimeout(() => {
            alert('🏫 PANEL LIBRUZ\n\nWitaj w systemie!\n\nFunkcje do implementacji:\n• Zarządzanie szkołami\n• Dodawanie nauczycieli\n• Generowanie planu lekcji\n• i wiele innych!');
            
            // Wróć do logowania (dla demo)
            showLoginForm();
        }, 1000);
    }
    
    function showError(message) {
        errorBox.textContent = message;
        errorBox.style.background = '#ffeaa7';
        errorBox.style.color = '#d63031';
        errorBox.style.borderLeftColor = '#d63031';
        errorBox.classList.remove('hidden');
        
        setTimeout(() => {
            errorBox.classList.add('hidden');
        }, 5000);
    }
    
    function showSuccess(message) {
        errorBox.textContent = message;
        errorBox.style.background = '#d1ecf1';
        errorBox.style.color = '#0c5460';
        errorBox.style.borderLeftColor = '#0c5460';
        errorBox.classList.remove('hidden');
    }
    
    function showInfo(message) {
        errorBox.textContent = message;
        errorBox.style.background = '#d4edda';
        errorBox.style.color = '#155724';
        errorBox.style.borderLeftColor = '#155724';
        errorBox.classList.remove('hidden');
        
        setTimeout(() => {
            errorBox.classList.add('hidden');
        }, 4000);
    }
    
    // Na starcie pokaż formularz logowania
    showLoginForm();
});
