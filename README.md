<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LIBRUZ - System Szkolny</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        /* Dodatkowe style */
        .change-password-section {
            display: none; /* Na początku ukryte */
        }
        .demo-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            border-left: 4px solid #3498db;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>LIBRUZ</h1>
        <p class="subtitle">System Zarządzania Szkołą</p>
        
        <!-- FORMULARZ LOGOWANIA (widoczny na starcie) -->
        <div id="loginSection">
            <form id="loginForm">
                <div class="input-group">
                    <label for="loginInput">Login / Email:</label>
                    <input type="text" id="loginInput" placeholder="np. admin@libruz.pl" required>
                </div>
                
                <div class="input-group">
                    <label for="passwordInput">Hasło:</label>
                    <input type="password" id="passwordInput" placeholder="Wpisz hasło" required>
                </div>
                
                <button type="submit" class="btn" id="loginBtn">🔐 Zaloguj się</button>
                
                <div class="demo-info">
                    <strong>Dane testowe:</strong><br>
                    Login: <code>admin@libruz.pl</code><br>
                    Hasło: <code>Grahamka321@##</code>
                </div>
            </form>
        </div>
        
        <!-- FORMULARZ ZMIANY HASŁA (ukryty na starcie) -->
        <div id="changePasswordSection" class="change-password-section">
            <h2>👤 Ustaw swoje dane</h2>
            <p>To Twoje pierwsze logowanie. Ustaw nowe hasło i dane.</p>
            
            <form id="changePasswordForm">
                <div class="input-group">
                    <label for="firstNameInput">Imię:</label>
                    <input type="text" id="firstNameInput" placeholder="Twoje imię" required>
                </div>
                
                <div class="input-group">
                    <label for="lastNameInput">Nazwisko:</label>
                    <input type="text" id="lastNameInput" placeholder="Twoje nazwisko" required>
                </div>
                
                <div class="input-group">
                    <label for="newPasswordInput">Nowe hasło:</label>
                    <input type="password" id="newPasswordInput" placeholder="Minimum 8 znaków" required>
                </div>
                
                <div class="input-group">
                    <label for="confirmPasswordInput">Potwierdź hasło:</label>
                    <input type="password" id="confirmPasswordInput" placeholder="Powtórz hasło" required>
                </div>
                
                <button type="submit" class="btn secondary-btn" id="savePasswordBtn">💾 Zapisz dane</button>
                <button type="button" class="btn" id="logoutBtn" style="background:#e74c3c; margin-top:10px;">🚪 Wyloguj</button>
            </form>
        </div>
        
        <div id="errorBox" class="error-box hidden"></div>
        
        <footer>
            Wersja 1.0 | © 2024 LIBRUZ
        </footer>
    </div>
    
    <!-- Scripts -->
    <script src="js/supabase-client.js"></script>
    <script src="js/auth.js"></script>
</body>
</html>
