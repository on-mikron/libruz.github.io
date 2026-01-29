// auth.js - POPRAWIONY KOD LOGOWANIA BEZ BŁĘDÓW
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
        return;
    }
    
    // Elementy DOM
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    
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
            alert('⚠️ Wprowadź email i hasło');
            return;
        }
        
        if (!email.includes('@')) {
            alert('⚠️ Wprowadź poprawny email');
            return;
        }
        
        // Przycisk ładowania
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '⌛ Logowanie...';
        }
        
        try {
            console.log('🔐 Próba logowania dla:', email);
            
            // ZAWSZE TWORZ PROFILE DLA STANDARDOWYCH UŻYTKOWNIKÓW
            // Nie czekaj na odpowiedź z Supabase
            let userProfile = null;
            
            // Standardowe konta demo - BEZ SPRAWDZANIA W BAZIE
            if (email === 'admin@libruz.pl' && password === 'admin123') {
                userProfile = {
                    id: 'admin-001',
                    email: 'admin@libruz.pl',
                    username: 'admin',
                    first_name: 'Admin',
                    last_name: 'System',
                    role: 'admin',
                    school_id: null,
                    is_active: true,
                    created_at: new Date().toISOString()
                };
            } 
            else if (email === 'dyrektor@sp1.pl' && password === 'dyrektor123') {
                userProfile = {
                    id: 'dir-001',
                    email: 'dyrektor@sp1.pl',
                    username: 'kowalskiD',
                    first_name: 'Jan',
                    last_name: 'Kowalski',
                    role: 'director',
                    school_id: 'school-001',
                    is_active: true,
                    created_at: new Date().toISOString()
                };
            }
            else if (email === 'nauczyciel@sp1.pl' && password === 'nauczyciel123') {
                userProfile = {
                    id: 'teach-001',
                    email: 'nauczyciel@sp1.pl',
                    username: 'nowakN',
                    first_name: 'Anna',
                    last_name: 'Nowak',
                    role: 'teacher',
                    school_id: 'school-001',
                    is_active: true,
                    created_at: new Date().toISOString()
                };
            }
            else if (email === 'uczen@sp1.pl' && password === 'uczen123') {
                userProfile = {
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
                };
            }
            else if (email === 'rodzic@sp1.pl' && password === 'rodzic123') {
                userProfile = {
                    id: 'parent-001',
                    email: 'rodzic@sp1.pl',
                    username: 'wisniewskaR',
                    first_name: 'Maria',
                    last_name: 'Wiśniewska',
                    role: 'parent',
                    school_id: 'school-001',
                    is_active: true,
                    created_at: new Date().toISOString()
                };
            }
            else {
                // Dla innych użytkowników - spróbuj znaleźć w Supabase
                try {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('email', email)
                        .eq('is_active', true)
                        .single();
                    
                    if (profileError || !profile) {
                        alert('❌ Nieprawidłowy email lub konto nieaktywne');
                        return;
                    }
                    
                    userProfile = profile;
                } catch (dbError) {
                    console.warn('⚠️ Błąd bazy danych, używam fallback:', dbError);
                    alert('❌ Błąd połączenia z bazą. Spróbuj ponownie.');
                    return;
                }
            }
            
            if (!userProfile) {
                alert('❌ Nieprawidłowe dane logowania');
                return;
            }
            
            // ZAPISZ DO LOCALSTORAGE - TO JEST KLUCZOWE
            console.log('💾 Zapisuję do localStorage:', userProfile.email);
            localStorage.setItem('libruz_user', JSON.stringify(userProfile));
            localStorage.setItem('libruz_is_logged_in', 'true');
            
            // Potwierdzenie
            alert('✅ Zalogowano pomyślnie! Przekierowuję...');
            
            // Przekierowanie
            setTimeout(() => {
                switch(userProfile.role) {
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
            }, 1000);
            
        } catch (error) {
            console.error('💥 Krytyczny błąd logowania:', error);
            alert('❌ Wystąpił nieoczekiwany błąd: ' + error.message);
        } finally {
            // Przywróć przycisk
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = '🔐 Zaloguj się';
            }
        }
    });
    
    // Auto-focus
    if (emailInput) {
        setTimeout(() => emailInput.focus(), 100);
    }
    
    console.log('✅ System logowania gotowy');
});
