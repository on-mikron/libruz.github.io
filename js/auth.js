// js/auth.js - PRAWDZIWE LOGOWANIE
document.addEventListener('DOMContentLoaded', async function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    // Sprawdź czy użytkownik już zalogowany
    await checkSession();
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            // 1. Logowanie przez Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            // 2. Pobierz profil użytkownika
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();
            
            if (profileError) throw profileError;
            
            // 3. Sprawdź czy pierwsze logowanie
            if (profile.temporary_password) {
                // Przekieruj do zmiany hasła
                localStorage.setItem('libruz_temp_user', JSON.stringify(profile));
                window.location.href = 'change-password.html';
            } else {
                // Przekieruj do odpowiedniego panelu
                redirectByRole(profile);
            }
            
        } catch (error) {
            showError('Błąd logowania: ' + error.message);
        }
    });
    
    async function checkSession() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            // Pobierz profil i przekieruj
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            
            if (profile) {
                redirectByRole(profile);
            }
        }
    }
    
    function redirectByRole(profile) {
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
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});
