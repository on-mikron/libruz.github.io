<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>LIBRUZ - Zmiana hasła</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .container { max-width: 500px; margin: 50px auto; }
        .info-box { background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="login-box">
            <h1>🔐 Ustaw nowe hasło</h1>
            <div class="info-box">
                To Twoje pierwsze logowanie. Ustaw własne hasło i dane osobowe.
            </div>
            
            <form id="changePasswordForm">
                <div class="form-group">
                    <label for="firstName">Imię:</label>
                    <input type="text" id="firstName" required>
                </div>
                
                <div class="form-group">
                    <label for="lastName">Nazwisko:</label>
                    <input type="text" id="lastName" required>
                </div>
                
                <div class="form-group">
                    <label for="newPassword">Nowe hasło (min. 8 znaków):</label>
                    <input type="password" id="newPassword" required minlength="8">
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">Potwierdź hasło:</label>
                    <input type="password" id="confirmPassword" required>
                </div>
                
                <button type="submit" class="btn btn-primary">Zapisz i kontynuuj</button>
                <div id="errorMessage" class="error-message"></div>
            </form>
        </div>
    </div>
    
    <script src="js/supabase-client.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', async function() {
            const form = document.getElementById('changePasswordForm');
            const errorMessage = document.getElementById('errorMessage');
            
            // Sprawdź czy użytkownik jest tymczasowy
            const tempUser = JSON.parse(localStorage.getItem('libruz_temp_user'));
            if (!tempUser) {
                window.location.href = 'index.html';
                return;
            }
            
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (newPassword !== confirmPassword) {
                    showError('Hasła nie są identyczne');
                    return;
                }
                
                if (newPassword.length < 8) {
                    showError('Hasło musi mieć minimum 8 znaków');
                    return;
                }
                
                try {
                    // 1. Zmień hasło w Supabase Auth
                    const { error: updateError } = await supabase.auth.updateUser({
                        password: newPassword
                    });
                    
                    if (updateError) throw updateError;
                    
                    // 2. Zaktualizuj profil
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .update({
                            first_name: firstName,
                            last_name: lastName,
                            temporary_password: false,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', tempUser.id);
                    
                    if (profileError) throw profileError;
                    
                    // 3. Wyczyść localStorage i przekieruj
                    localStorage.removeItem('libruz_temp_user');
                    
                    // Przekieruj do odpowiedniego panelu
                    switch(tempUser.role) {
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
                            window.location.href = 'index.html';
                    }
                    
                } catch (error) {
                    showError('Błąd: ' + error.message);
                }
            });
            
            function showError(message) {
                errorMessage.textContent = message;
                errorMessage.style.display = 'block';
            }
        });
    </script>
</body>
</html>
