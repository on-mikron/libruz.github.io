// js/supabase-client.js
// Supabase klient
const SUPABASE_URL = 'https://twbgahurqbdcdcpjaflg.supabase.co'; // Zastąp swoim URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Zastąp swoim kluczem

// Inicjalizacja Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Funkcja pomocnicza do pobierania danych użytkownika
async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) {
        console.error('Błąd pobierania profilu:', error);
        return null;
    }
    
    return data;
}

// Funkcja do pobierania szkoły
async function getSchool(schoolId) {
    const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('id', schoolId)
        .single();
    
    if (error) {
        console.error('Błąd pobierania szkoły:', error);
        return null;
    }
    
    return data;
}

// Eksport do globalnego zakresu
window.supabase = supabase;
window.getUserProfile = getUserProfile;
window.getSchool = getSchool;
