<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LIBRUZ - System Szkolny</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="css/auth.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-box">
            <div class="logo">
                <h1>LIBRUZ</h1>
                <p>System Zarządzania Szkołą</p>
            </div>
            
            <form id="loginForm" class="auth-form">
                <div class="form-group">
                    <label for="login">Login:</label>
                    <input type="text" id="login" name="login" required 
                           placeholder="Wpisz swój login">
                </div>
                
                <div class="form-group">
                    <label for="password">Hasło:</label>
                    <input type="password" id="password" name="password" required 
                           placeholder="Wpisz swoje hasło">
                </div>
                
                <div id="changePasswordSection" class="form-group hidden">
                    <label for="newPassword">Nowe hasło:</label>
                    <input type="password" id="newPassword" name="newPassword" 
                           placeholder="Wpisz nowe hasło">
                    <label for="confirmPassword">Potwierdź hasło:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" 
                           placeholder="Potwierdź nowe hasło">
                </div>
                
                <div id="userInfoSection" class="form-group hidden">
                    <label for="firstName">Imię:</label>
                    <input type="text" id="firstName" name="firstName">
                    <label for="lastName">Nazwisko:</label>
                    <input type="text" id="lastName" name="lastName">
                </div>
                
                <button type="submit" id="loginButton" class="btn btn-primary">
                    Zaloguj się
                </button>
                
                <button type="button" id="changePasswordButton" class="btn btn-secondary hidden">
                    Zmień hasło
                </button>
                
                <div id="errorMessage" class="error-message hidden"></div>
            </form>
            
            <div class="auth-footer">
                <p>Wersja 1.0 | © 2024 LIBRUZ</p>
            </div>
        </div>
    </div>
    
    <script src="js/supabase-client.js"></script>
    <script src="js/auth.js"></script>
</body>
</html>
