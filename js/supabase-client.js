// ====== KONFIGURACJA SUPABASE ======
console.log('⚙️ Ładuję konfigurację Supabase...');

// TWOJE DANE z Supabase (te same co wcześniej)
const SUPABASE_URL = 'https://fupfgshptjghdjpkeaee.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cGZnc2hwdGpnaGRqcGtlYWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDk2MTcsImV4cCI6MjA4NTEyNTYxN30.PO_kVi3YBslUH1GQtfSHduMap_oSNYCsGL9eIhpxYnM';

// Inicjalizuj Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Eksportuj do globalnego zasięgu
window.supabase = supabase;

console.log('✅ Supabase skonfigurowany!');
console.log('URL:', SUPABASE_URL);

// Funkcja testowa połączenia
window.testSupabase = async function() {
    try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        
        if (error) {
            console.error('❌ Błąd połączenia z Supabase:', error);
            return false;
        }
        
        console.log('✅ Połączenie z Supabase OK!');
        return true;
        
    } catch (error) {
        console.error('❌ Krytyczny błąd Supabase:', error);
        return false;
    }
};

// Testuj połączenie przy ładowaniu
setTimeout(() => {
    window.testSupabase();
}, 1000);
