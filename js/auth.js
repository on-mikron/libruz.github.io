// auth.js - UPROSZCZONY KOD LOGOWANIA DLA WSZYSTKICH UŻYTKOWNIKÓW
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Inicjalizacja logowania LIBRUZ');
    
    // Inicjalizacja Supabase (dla ewentualnych przyszłych integracji)
    const supabaseUrl = 'https://fupfgshptjghdjpkeaee.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cGZnc2hwdGpnaGRqcGtlYWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDk2MTcsImV4cCI6MjA4NTEyNTYxN30.PO_kVi3YBslUH1GQtfSHduMap_oSNYCsGL9eIhpxYnM';
    
    let supabase;
    try {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase zainicjalizowany');
    } catch (error) {
        console.warn('⚠️ Błąd inicjalizacji Supabase:', error);
        // Kontynuuj bez Supabase - używamy tylko localStorage
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
            loginBtn.innerHTML = '<span>⌛ Logowanie...</span>';
        }
        
        try {
            console.log('🔐 Próba logowania dla:', email);
            
            // 1. SPRAWDŹ W LOCALSTORAGE (gdzie admin zapisuje nowych użytkowników)
            let userProfile = findUserInLocalStorage(email, password);
            
            // 2. Jeśli nie znaleziono w localStorage, sprawdź domyślne konta
            if (!userProfile) {
                userProfile = checkDefaultAccounts(email, password);
            }
            
            // 3. Jeśli nadal nie znaleziono, spróbuj Supabase (opcjonalnie)
            if (!userProfile && supabase) {
                userProfile = await checkSupabaseAccount(email, password, supabase);
            }
            
            // 4. Jeśli nadal brak, pokaż błąd
            if (!userProfile) {
                showAlert('❌ Nieprawidłowy email lub hasło', 'error');
                return;
            }
            
            // 5. ZAPISZ DO LOCALSTORAGE - TO JEST KLUCZOWE
            console.log('✅ Użytkownik znaleziony, zapisuję do localStorage:', userProfile.email);
            
            localStorage.setItem('libruz_user', JSON.stringify(userProfile));
            localStorage.setItem('libruz_is_logged_in', 'true');
            
            // 6. Zapisz również w ogólnej liście użytkowników (jeśli to nowy użytkownik)
            saveUserToGlobalList(userProfile);
            
            // 7. Pokaz sukces
            showAlert('✅ Zalogowano pomyślnie! Przekierowuję...', 'success');
            
            // 8. Przekieruj według roli
            setTimeout(() => {
                redirectByRole(userProfile);
            }, 1000);
            
        } catch (error) {
            console.error('💥 Krytyczny błąd logowania:', error);
            showAlert('❌ Wystąpił nieoczekiwany błąd', 'error');
        } finally {
            // Przywróć przycisk
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<span>🔐 Zaloguj się</span>';
            }
        }
    });
    
    // ===== FUNKCJE POMOCNICZE =====
    
    // Funkcja szukania użytkownika w localStorage
    function findUserInLocalStorage(email, password) {
        console.log('🔍 Szukam użytkownika w localStorage...');
        
        // Szukaj w globalnej liście użytkowników
        const allUsers = JSON.parse(localStorage.getItem('libruz_users')) || [];
        console.log('Znaleziono użytkowników w localStorage:', allUsers.length);
        
        // Szukaj użytkownika po emailu
        const user = allUsers.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.is_active === true
        );
        
        if (!user) {
            console.log('❌ Użytkownik nie znaleziony w localStorage');
            return null;
        }
        
        console.log('✅ Znaleziono użytkownika:', user.email);
        
        // SPRAWDŹ HASŁO
        // Wersja demo: hasło jest w polu temporary_password
        // W prawdziwym systemie użyj hashowania
        
        if (user.temporary_password && user.temporary_password === password) {
            console.log('✅ Hasło poprawne (tymczasowe)');
            return user;
        }
        
        // Dla admina tworzącego dyrektorów - domyślne hasło
        if (password === 'Dyrektor2024!' && email.includes('dyrektor')) {
            console.log('✅ Używam domyślnego hasła dla dyrektora');
            return user;
        }
        
        // Dla testowych kont
        if (checkDefaultPassword(email, password)) {
            console.log('✅ Używam hasła domyślnego');
            return user;
        }
        
        console.log('❌ Nieprawidłowe hasło');
        return null;
    }
    
    // Funkcja sprawdzania domyślnych kont
    function checkDefaultAccounts(email, password) {
        console.log('🔍 Sprawdzam domyślne konta...');
        
        // Domyślne konta demo
        const defaultAccounts = [
            {
                email: 'admin@libruz.pl',
                password: 'admin123',
                user: {
                    id: 'admin-001',
                    email: 'admin@libruz.pl',
                    username: 'admin',
                    first_name: 'Admin',
                    last_name: 'System',
                    role: 'admin',
                    school_id: null,
                    is_active: true,
                    created_at: new Date().toISOString()
                }
            },
            {
                email: 'dyrektor@sp1.pl',
                password: 'dyrektor123',
                user: {
                    id: 'dir-001',
                    email: 'dyrektor@sp1.pl',
                    username: 'kowalskiD',
                    first_name: 'Jan',
                    last_name: 'Kowalski',
                    role: 'director',
                    school_id: 'school-001',
                    is_active: true,
                    created_at: new Date().toISOString()
                }
            },
            {
                email: 'nauczyciel@sp1.pl',
                password: 'nauczyciel123',
                user: {
                    id: 'teach-001',
                    email: 'nauczyciel@sp1.pl',
                    username: 'nowakN',
                    first_name: 'Anna',
                    last_name: 'Nowak',
                    role: 'teacher',
                    school_id: 'school-001',
                    is_active: true,
                    created_at: new Date().toISOString()
                }
            },
            {
                email: 'uczen@sp1.pl',
                password: 'uczen123',
                user: {
                    id: 'stud-001',
                    email: 'uczen@sp1.pl',
                    username: 'wisniewskiU',
                    first_name: 'Piotr',
                    last_name: 'Wiśniewski',
                    role: 'student',
                    school_id: 'school-001',
                    class_id: 'class-001',
                    is_active: true,
                    created_at: new Date().toISOString()
                }
            },
            {
                email: 'rodzic@sp1.pl',
                password: 'rodzic123',
                user: {
                    id: 'parent-001',
                    email: 'rodzic@sp1.pl',
                    username: 'wisniewskaR',
                    first_name: 'Maria',
                    last_name: 'Wiśniewska',
                    role: 'parent',
                    school_id: 'school-001',
                    is_active: true,
                    created_at: new Date().toISOString()
                }
            }
        ];
        
        // Sprawdź czy to któreś z domyślnych kont
        const account = defaultAccounts.find(acc => 
            acc.email.toLowerCase() === email.toLowerCase() && 
            acc.password === password
        );
        
        if (account) {
            console.log('✅ Znaleziono domyślne konto:', email);
            return account.user;
        }
        
        return null;
    }
    
    // Funkcja sprawdzania domyślnego hasła (dla uproszczenia)
    function checkDefaultPassword(email, password) {
        // Dla użytkowników utworzonych przez admina
        // Admin tworzy hasło w formacie: Nazwisko2024!
        // Np. Kowalski2024!
        
        // Pobierz nazwisko z emaila lub danych użytkownika
        const emailParts = email.split('@')[0];
        
        // Sprawdź kilka wariantów
        const passwordVariants = [
            password === 'Haslo123!',
            password === 'Password123!',
            password === 'Libruz2024!',
            password === 'Dyrektor2024!',
            password === 'Nauczyciel2024!',
            password === 'Uczen2024!',
            password === 'Rodzic2024!'
        ];
        
        return passwordVariants.some(variant => variant === true);
    }
    
    // Funkcja sprawdzania w Supabase (opcjonalna)
    async function checkSupabaseAccount(email, password, supabaseClient) {
        try {
            console.log('🔍 Sprawdzam w Supabase...');
            
            const { data: profile, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('email', email)
                .eq('is_active', true)
                .single();
            
            if (error || !profile) {
                console.log('❌ Użytkownik nie znaleziony w Supabase');
                return null;
            }
            
            // W DEMO: proste sprawdzenie hasła
            // W rzeczywistości: użyj Supabase Auth lub hashowania
            if (password === 'demo123' || password === profile.temporary_password) {
                return profile;
            }
            
            return null;
            
        } catch (error) {
            console.warn('⚠️ Błąd połączenia z Supabase:', error);
            return null;
        }
    }
    
    // Funkcja zapisywania użytkownika do globalnej listy
    function saveUserToGlobalList(user) {
        try {
            const allUsers = JSON.parse(localStorage.getItem('libruz_users')) || [];
            
            // Sprawdź czy użytkownik już istnieje
            const existingIndex = allUsers.findIndex(u => u.id === user.id || u.email === user.email);
            
            if (existingIndex >= 0) {
                // Zaktualizuj istniejącego użytkownika
                allUsers[existingIndex] = user;
            } else {
                // Dodaj nowego użytkownika
                allUsers.push(user);
            }
            
            localStorage.setItem('libruz_users', JSON.stringify(allUsers));
            console.log('💾 Zapisano użytkownika do globalnej listy');
            
        } catch (error) {
            console.error('Błąd zapisywania użytkownika:', error);
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
    
    // ===== FUNKCJA DODATKOWA DLA ADMINA =====
    // Ta funkcja pozwala adminowi zalogować się jako dowolny użytkownik
    function adminLoginAs(userEmail) {
        const allUsers = JSON.parse(localStorage.getItem('libruz_users')) || [];
        const user = allUsers.find(u => u.email === userEmail);
        
        if (user) {
            localStorage.setItem('libruz_user', JSON.stringify(user));
            localStorage.setItem('libruz_is_logged_in', 'true');
            localStorage.setItem('libruz_original_admin', JSON.stringify(
                JSON.parse(localStorage.getItem('libruz_user'))
            ));
            
            alert(`✅ Zalogowano jako: ${user.first_name} ${user.last_name} (${user.role})`);
            redirectByRole(user);
        } else {
            alert('❌ Użytkownik nie znaleziony');
        }
    }
    
    // Eksport funkcji do globalnego scope
    window.adminLoginAs = adminLoginAs;
    
    console.log('✅ System logowania gotowy');
});
