// ====== SUPABASE CLIENT - POPRAWIONA WERSJA ======
console.log('🔄 Ładuję Supabase Client...');

// TWOJE DANE z Supabase (pamiętasz?)
const SUPABASE_URL = 'https://fupfgshptjghdjpkeaee.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cGZnc2hwdGpnaGRqcGtlYWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDk2MTcsImV4cCI6MjA4NTEyNTYxN30.PO_kVi3YBslUH1GQtfSHduMap_oSNYCsGL9eIhpxYnM';

// Globalna zmienna dla Supabase
let supabase = null;

// Funkcja inicjalizacji
async function initSupabase() {
    try {
        console.log('1. Sprawdzam bibliotekę Supabase...');
        
        // Jeśli biblioteka nie jest załadowana, załaduj ją
        if (typeof window.supabase === 'undefined') {
            console.log('2. Ładuję bibliotekę z CDN...');
            
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        
        console.log('3. Tworzę klienta Supabase...');
        
        // Stwórz klienta Supabase
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        window.supabase = supabase; // Udostępnij globalnie
        
        console.log('✅ Supabase gotowy!');
        console.log('URL:', SUPABASE_URL);
        
        return supabase;
        
    } catch (error) {
        console.error('❌ BŁĄD Supabase:', error);
        return null;
    }
}

// Wywołaj inicjalizację od razu
initSupabase().then(client => {
    if (client) {
        console.log('🎉 Supabase zainicjalizowany pomyślnie!');
    } else {
        console.error('💥 Supabase nie zainicjalizowany!');
    }
});

// Funkcja pomocnicza do sprawdzania połączenia
window.checkSupabase = async function() {
    if (!supabase) {
        console.log('Supabase nie jest gotowy, inicjalizuję...');
        await initSupabase();
    }
    return supabase;
};
