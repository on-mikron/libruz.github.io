// messages.js - System wiadomości wielojęzyczny
class MessageSystem {
    constructor() {
        this.currentLang = 'pl';
        this.languages = {
            pl: 'Polski',
            en: 'English',
            uk: 'Українська',
            ru: 'Русский'
        };
        this.selectedRecipients = new Set();
        this.selectedGroups = new Set();
    }

    // Inicjalizacja modułu
    async init() {
        await this.loadUserGroups();
        this.setupEventListeners();
        this.setupLanguageSwitcher();
        this.renderRecipientFilters();
    }

    // Ładowanie grup użytkownika
    async loadUserGroups() {
        const user = JSON.parse(localStorage.getItem('libruz_user'));
        const { data: groups } = await supabase
            .from('recipient_groups')
            .select('*')
            .eq('owner_id', user.id);
        
        this.userGroups = groups || [];
    }

    // Konfiguracja filtrów odbiorców
    renderRecipientFilters() {
        const filters = `
            <div class="recipient-filters">
                <div class="filter-section">
                    <h4>📦 Skrzynki odbiorców</h4>
                    <select id="recipientType" multiple>
                        <option value="students">Uczniowie</option>
                        <option value="parents">Opiekunowie</option>
                        <option value="teachers">Pracownicy</option>
                    </select>
                </div>
                
                <div class="filter-section">
                    <h4>🏫 Klasy</h4>
                    <select id="classFilter" multiple>
                        <!-- Dynamicznie wczytywane -->
                    </select>
                </div>
                
                <div class="filter-section">
                    <h4>👥 Moje grupy</h4>
                    <select id="groupFilter" multiple>
                        ${this.userGroups.map(g => 
                            `<option value="${g.id}">${g.name}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="filter-section">
                    <h4>🔍 Wyszukiwarka</h4>
                    <input type="text" id="recipientSearch" 
                           placeholder="Wpisz fragment nazwiska..." 
                           oninput="messageSystem.searchRecipients(this.value)">
                    <div id="searchResults" class="search-results"></div>
                </div>
            </div>
        `;
        
        document.getElementById('recipientFilters').innerHTML = filters;
    }

    // Dynamiczne wyszukiwanie odbiorców
    async searchRecipients(query) {
        if (query.length < 2) return;
        
        const { data } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, role')
            .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
            .limit(20);
        
        this.displaySearchResults(data);
    }

    // Wyświetlanie wyników wyszukiwania
    displaySearchResults(recipients) {
        const container = document.getElementById('searchResults');
        container.innerHTML = recipients.map(r => `
            <div class="recipient-item" data-id="${r.id}">
                <label>
                    <input type="checkbox" onchange="messageSystem.toggleRecipient('${r.id}', this.checked)">
                    ${r.first_name} ${r.last_name} (${r.role})
                </label>
            </div>
        `).join('');
    }

    // Zarządzanie wyborem odbiorców
    toggleRecipient(id, checked) {
        if (checked) {
            this.selectedRecipients.add(id);
        } else {
            this.selectedRecipients.delete(id);
        }
        this.updateRecipientCounter();
    }

    // Tworzenie nowej grupy
    async createGroup(name, members = []) {
        const user = JSON.parse(localStorage.getItem('libruz_user'));
        
        const { data } = await supabase
            .from('recipient_groups')
            .insert([{
                name: name,
                owner_id: user.id,
                members: members
            }])
            .select()
            .single();
        
        this.userGroups.push(data);
        this.renderRecipientFilters();
    }

    // Wysyłanie wiadomości
    async sendMessage() {
        const subject = document.getElementById('messageSubject').value;
        const content = document.getElementById('messageContent').value;
        const senderRole = document.getElementById('senderRole').value;
        
        const user = JSON.parse(localStorage.getItem('libruz_user'));
        
        // 1. Zapisz wiadomość
        const { data: message } = await supabase
            .from('messages')
            .insert([{
                sender_id: user.id,
                sender_role: senderRole,
                subject: subject,
                content: content,
                lang: this.currentLang,
                sent_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        // 2. Dodaj odbiorców
        const recipients = Array.from(this.selectedRecipients).map(recipientId => ({
            message_id: message.id,
            recipient_id: recipientId,
            recipient_type: 'individual'
        }));
        
        // 3. Dodaj grupy
        const groupRecipients = Array.from(this.selectedGroups).flatMap(groupId => {
            const group = this.userGroups.find(g => g.id === groupId);
            return group.members.map(memberId => ({
                message_id: message.id,
                recipient_id: memberId,
                recipient_type: 'group'
            }));
        });
        
        await supabase
            .from('message_recipients')
            .insert([...recipients, ...groupRecipients]);
        
        // 4. Pokaż sukces
        this.showSuccess('Wiadomość wysłana pomyślnie!');
        
        // 5. Wygeneruj raport
        await this.generateReport(message.id);
    }

    // Generowanie raportu PDF
    async generateReport(messageId) {
        const { data: recipients } = await supabase
            .from('message_recipients')
            .select(`
                recipient_id,
                read_at,
                profiles(first_name, last_name, role)
            `)
            .eq('message_id', messageId);
        
        // Tutaj logika generowania PDF (np. z użyciem jsPDF)
        this.generatePDFReport(recipients);
    }

    // Formatowanie treści (Rich Text Editor)
    setupEditor() {
        const editor = document.getElementById('messageContent');
        
        // Prosty edytor formatowania
        const toolbar = `
            <div class="editor-toolbar">
                <button onclick="formatText('bold')"><b>B</b></button>
                <button onclick="formatText('italic')"><i>I</i></button>
                <button onclick="formatText('underline')"><u>U</u></button>
                <button onclick="formatText('insertLink')">🔗</button>
            </div>
        `;
        
        editor.insertAdjacentHTML('beforebegin', toolbar);
    }

    // Przełączanie języka
    setupLanguageSwitcher() {
        const switcher = `
            <div class="language-switcher">
                Język: 
                ${Object.entries(this.languages).map(([code, name]) => `
                    <button onclick="messageSystem.setLanguage('${code}')" 
                            class="${this.currentLang === code ? 'active' : ''}">
                        ${name}
                    </button>
                `).join('')}
            </div>
        `;
        
        document.getElementById('languageSection').innerHTML = switcher;
    }

    setLanguage(lang) {
        this.currentLang = lang;
        this.setupLanguageSwitcher();
        // Tutaj można dodać tłumaczenie interfejsu
    }
}

// Inicjalizacja systemu wiadomości
const messageSystem = new MessageSystem();
