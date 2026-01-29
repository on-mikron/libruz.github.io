// Wspólne funkcje dla dashboardów
console.log('📊 Inicjalizacja dashboardu...');

// Inicjalizacja dashboardu
async function initDashboard(expectedRole = null) {
    try {
        console.log('🔍 Sprawdzam autoryzację...');
        
        // Pobierz dane użytkownika
        const userData = localStorage.getItem('libruz_user');
        const sessionData = localStorage.getItem('libruz_session');
        
        if (!userData || !sessionData) {
            console.error('❌ Brak danych sesji');
            redirectToLogin();
            return;
        }
        
        const user = JSON.parse(userData);
        const session = JSON.parse(sessionData);
        
        console.log('👤 Użytkownik:', user.email, 'Rola:', user.role);
        
        // Sprawdź czy sesja jest ważna
        const sessionExpiry = new Date(session.expires_at);
        if (sessionExpiry < new Date()) {
            console.error('❌ Sesja wygasła');
            localStorage.clear();
            redirectToLogin();
            return;
        }
        
        // Sprawdź rolę jeśli wymagana
        if (expectedRole && user.role !== expectedRole) {
            console.error(`❌ Brak uprawnień. Wymagana rola: ${expectedRole}, aktualna: ${user.role}`);
            redirectToLogin();
            return;
        }
        
        // Ustaw dane użytkownika w UI
        updateUserInfo(user);
        
        // Ustaw tytuł welcome
        updateWelcomeTitle(user);
        
        console.log('✅ Dashboard zainicjalizowany');
        
    } catch (error) {
        console.error('💥 Błąd inicjalizacji dashboardu:', error);
        redirectToLogin();
    }
}

// Aktualizuj informacje o użytkowniku
function updateUserInfo(user) {
    const userInfo = document.getElementById('userInfo');
    if (!userInfo) return;
    
    // Generuj inicjały
    const initials = (user.first_name?.charAt(0) || '') + (user.last_name?.charAt(0) || '');
    
    userInfo.innerHTML = `
        <div class="user-avatar">${initials}</div>
        <div>
            <div class="user-name">${user.first_name || ''} ${user.last_name || ''}</div>
            <div class="user-role">${getRoleDisplayName(user.role)}</div>
        </div>
    `;
}

// Aktualizuj tytuł welcome
function updateWelcomeTitle(user) {
    const welcomeTitle = document.getElementById('welcomeTitle');
    if (!welcomeTitle) return;
    
    const roleName = getRoleDisplayName(user.role);
    welcomeTitle.textContent = `Witaj ${user.first_name || ''} w Panelu ${roleName}!`;
}

// Pobierz nazwę roli do wyświetlenia
function getRoleDisplayName(role) {
    const roleNames = {
        'admin': 'Administratora',
        'director': 'Dyrektora',
        'vice_director': 'Wicedyrektora',
        'teacher': 'Nauczyciela',
        'student': 'Ucznia',
        'parent': 'Rodzica'
    };
    
    return roleNames[role] || role;
}

// Przekieruj do logowania
function redirectToLogin() {
    localStorage.removeItem('libruz_user');
    localStorage.removeItem('libruz_session');
    window.location.href = 'index.html';
}

// Wyloguj
function logout() {
    if (window.supabase && window.supabase.auth) {
        supabase.auth.signOut();
    }
    localStorage.clear();
    redirectToLogin();
}

// Sprawdź połączenie z bazą
async function checkDatabaseConnection() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('count')
            .limit(1);
        
        if (error) throw error;
        
        console.log('✅ Połączenie z bazą OK');
        return true;
    } catch (error) {
        console.error('❌ Błąd połączenia z bazą:', error);
        return false;
    }
}

// Eksport funkcji
window.initDashboard = initDashboard;
window.logout = logout;
window.checkDatabaseConnection = checkDatabaseConnection;

console.log('✅ Dashboard.js załadowany');
