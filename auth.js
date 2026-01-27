// js/auth.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const changePasswordButton = document.getElementById('changePasswordButton');
    const changePasswordSection = document.getElementById('changePasswordSection');
    const userInfoSection = document.getElementById('userInfoSection');
    const errorMessage = document.getElementById('errorMessage');
    
    let isTemporaryPassword = false;
    let currentUser = null;
    
    // Sprawdź czy użytkownik jest już zalogowany
    checkAuthStatus();
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        
        try {
            // Logowanie przez Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: login, // W naszym systemie login = email
                password: password
            });
            
            if (error) throw error;
            
            // Pobierz dane użytkownika z tabeli profiles
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();
            
            if (profileError) throw profileError;
            
            currentUser = profile;
            
            // Sprawdź czy to pierwsze logowanie z tymczasowym hasłem
            if (profile.temporary_password) {
                isTemporaryPassword = true;
                showChangePasswordForm();
                return;
            }
            
            // Jeśli wszystko OK, przekieruj do dashboardu
            redirectToDashboard(profile);
            
        } catch (error) {
            showError(error.message);
        }
    });
    
    changePasswordButton.addEventListener('click', async function() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        
        if (newPassword !== confirmPassword) {
            showError('Hasła nie są identyczne!');
            return;
        }
        
        if (newPassword.length < 8) {
            showError('Hasło musi mieć co najmniej 8 znaków!');
            return;
        }
        
        try {
            // Zmiana hasła w Supabase Auth
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });
            
            if (updateError) throw updateError;
            
            // Aktualizacja profilu w naszej tabeli
            const updates = {
                temporary_password: false,
                updated_at: new Date().toISOString()
            };
            
            // Jeśli użytkownik podał imię i nazwisko
            if (firstName && lastName) {
                updates.first_name = firstName;
                updates.last_name = lastName;
            }
            
            const { error: profileError } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', currentUser.id);
            
            if (profileError) throw profileError;
            
            // Przekieruj do dashboardu
            redirectToDashboard({ ...currentUser, ...updates });
            
        } catch (error) {
            showError(error.message);
        }
    });
    
    function showChangePasswordForm() {
        loginButton.classList.add('hidden');
        changePasswordSection.classList.remove('hidden');
        changePasswordButton.classList.remove('hidden');
        
        // Pokaż pola imię/nazwisko tylko dla niektórych ról
        if (['director', 'teacher', 'student'].includes(currentUser.role)) {
            userInfoSection.classList.remove('hidden');
        }
        
        showInfo('To Twoje pierwsze logowanie. Proszę zmienić hasło.');
    }
    
    function redirectToDashboard(user) {
        // Zapisz dane użytkownika w localStorage
        localStorage.setItem('libruz_user', JSON.stringify(user));
        localStorage.setItem('libruz_token', supabase.auth.session()?.access_token);
        
        // Przekieruj na dashboard
        window.location.href = 'dashboard.html';
    }
    
    function checkAuthStatus() {
        const user = localStorage.getItem('libruz_user');
        const token = localStorage.getItem('libruz_token');
        
        if (user && token) {
            // Użytkownik już zalogowany, przekieruj na dashboard
            window.location.href = 'dashboard.html';
        }
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
    
    function showInfo(message) {
        errorMessage.textContent = message;
        errorMessage.style.color = 'blue';
        errorMessage.classList.remove('hidden');
    }
});
