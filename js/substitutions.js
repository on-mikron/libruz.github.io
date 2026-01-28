// substitutions.js - System zastępstw dla dyrektora
class SubstitutionSystem {
    constructor() {
        this.substitutions = [];
    }

    // Główny panel zastępstw
    renderSubstitutionPanel() {
        return `
            <div class="substitutions-panel">
                <!-- Nagłówek -->
                <div class="panel-header">
                    <h2>🔄 System zastępstw</h2>
                    <div class="panel-actions">
                        <button onclick="substitutions.addSubstitution()">+ Nowe zastępstwo</button>
                        <button onclick="substitutions.importSubstitutions()">📥 Import z planu</button>
                        <button onclick="substitutions.printSchedule()">🖨️ Drukuj grafik</button>
                    </div>
                </div>
                
                <!-- Filtr dat -->
                <div class="date-filter">
                    <label>Data:</label>
                    <input type="date" id="substitutionDate" 
                           value="${new Date().toISOString().split('T')[0]}"
                           onchange="substitutions.loadSubstitutions()">
                    <button onclick="substitutions.prevDay()">◀</button>
                    <button onclick="substitutions.nextDay()">▶</button>
                    <button onclick="substitutions.today()">Dzisiaj</button>
                </div>
                
                <!-- Lista zastępstw -->
                <div class="substitutions-list" id="substitutionsList">
                    <!-- Dynamiczne ładowanie -->
                </div>
                
                <!-- Statystyki -->
                <div class="substitution-stats">
                    <div class="stat-item">
                        <span class="stat-label">Zastępstw dzisiaj:</span>
                        <span class="stat-value" id="todayCount">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Nauczyciele nieobecni:</span>
                        <span class="stat-value" id="absentCount">0</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Ładowanie zastępstw
    async loadSubstitutions(date = null) {
        const targetDate = date || document.getElementById('substitutionDate').value;
        
        const { data: subs } = await supabase
            .from('substitutions')
            .select(`
                *,
                absent_teacher:absent_teacher_id(first_name, last_name),
                substitute_teacher:substitute_teacher_id(first_name, last_name),
                class:class_id(name),
                created_by:profiles(first_name, last_name)
            `)
            .eq('date', targetDate)
            .order('lesson_number', { ascending: true });
        
        this.substitutions = subs || [];
        this.renderSubstitutionsList();
        this.updateStats();
    }

    // Renderowanie listy zastępstw
    renderSubstitutionsList() {
        const container = document.getElementById('substitutionsList');
        
        if (this.substitutions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    📭 Brak zastępstw na wybraną datę
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.substitutions.map(sub => `
            <div class="substitution-card">
                <div class="sub-header">
                    <span class="lesson-number">Lekcja ${sub.lesson_number}</span>
                    <span class="subject">${sub.subject || 'Brak przedmiotu'}</span>
                    <span class="class">${sub.class?.name || 'Brak klasy'}</span>
                    <span class="room">Sala: ${sub.room || '---'}</span>
                </div>
                
                <div class="sub-teachers">
                    <div class="teacher absent">
                        <span class="label">Nieobecny:</span>
                        <span class="name">${sub.absent_teacher?.first_name} ${sub.absent_teacher?.last_name}</span>
                    </div>
                    <div class="arrow">➔</div>
                    <div class="teacher substitute">
                        <span class="label">Zastępuje:</span>
                        <span class="name">${sub.substitute_teacher?.first_name} ${sub.substitute_teacher?.last_name}</span>
                    </div>
                </div>
                
                <div class="sub-notes">
                    <strong>Uwagi:</strong> ${sub.notes || 'Brak uwag'}
                </div>
                
                <div class="sub-footer">
                    <span class="created-by">
                        Dodano przez: ${sub.created_by?.first_name} ${sub.created_by?.last_name}
                    </span>
                    <div class="sub-actions">
                        <button onclick="substitutions.editSubstitution('${sub.id}')">Edytuj</button>
                        <button onclick="substitutions.deleteSubstitution('${sub.id}')">Usuń</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Dodawanie nowego zastępstwa
    async addSubstitution() {
        const modal = `
            <div class="modal substitution-modal">
                <h3>Nowe zastępstwo</h3>
                <form id="substitutionForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Data*</label>
                            <input type="date" id="subDate" required 
                                   value="${document.getElementById('substitutionDate')?.value || new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label>Nr lekcji*</label>
                            <input type="number" id="subLesson" min="1" max="10" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Nieobecny nauczyciel*</label>
                        <select id="absentTeacher" required 
                                onchange="substitutions.loadTeacherSchedule(this.value)">
                            <option value="">Wybierz nauczyciela...</option>
                            <!-- Dynamicznie ładowani nauczyciele -->
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Zastępujący nauczyciel*</label>
                        <select id="substituteTeacher" required>
                            <option value="">Wybierz nauczyciela...</option>
                            <!-- Dynamicznie ładowani nauczyciele -->
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Klasa</label>
                            <select id="subClass">
                                <option value="">Wybierz klasę...</option>
                                <!-- Dynamiczne klasy -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Sala</label>
                            <input type="text" id="subRoom">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Przedmiot</label>
                        <input type="text" id="subSubject">
                    </div>
                    
                    <div class="form-group">
                        <label>Uwagi</label>
                        <textarea id="subNotes" rows="3"></textarea>
                    </div>
                    
                    <!-- Plan lekcji nieobecnego nauczyciela -->
                    <div class="teacher-schedule" id="teacherSchedule" style="display: none;">
                        <h4>Plan lekcji nieobecnego nauczyciela</h4>
                        <div id="scheduleDetails"></div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit">Zapisz zastępstwo</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Anuluj</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
        await this.loadTeachersList();
    }

    // Funkcja "Zaloguj jako" dla dyrektora
    async renderLoginAsPanel() {
        const user = JSON.parse(localStorage.getItem('libruz_user'));
        
        // Sprawdź uprawnienia
        if (!['admin', 'director'].includes(user.role)) {
            return '';
        }
        
        return `
            <div class="login-as-panel">
                <h3>🔐 Logowanie jako inny użytkownik</h3>
                <div class="search-box">
                    <input type="text" id="userSearch" 
                           placeholder="Wyszukaj po imieniu, nazwisku lub email..."
                           oninput="substitutions.searchUsers(this.value)">
                    <div class="search-results" id="searchResults"></div>
                </div>
                
                <div class="quick-access">
                    <h4>Szybki dostęp:</h4>
                    <button onclick="substitutions.loginAsRole('teacher')">👨‍🏫 Nauczyciel</button>
                    <button onclick="substitutions.loginAsRole('student')">👨‍🎓 Uczeń</button>
                    <button onclick="substitutions.loginAsRole('parent')">👪 Rodzic</button>
                </div>
            </div>
        `;
    }

    // Wyszukiwanie użytkowników
    async searchUsers(query) {
        if (query.length < 2) return;
        
        const { data: users } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, role, school_id')
            .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
            .limit(10);
        
        this.displayUserResults(users);
    }

    // Wyświetlanie wyników wyszukiwania
    displayUserResults(users) {
        const container = document.getElementById('searchResults');
        container.innerHTML = users.map(user => `
            <div class="user-result">
                <div class="user-info">
                    <strong>${user.first_name} ${user.last_name}</strong>
                    <small>${user.email} (${user.role})</small>
                </div>
                <button onclick="substitutions.loginAsUser('${user.id}')">
                    Zaloguj jako
                </button>
            </div>
        `).join('');
    }

    // Logowanie jako inny użytkownik
    async loginAsUser(targetUserId) {
        const currentUser = JSON.parse(localStorage.getItem('libruz_user'));
        
        // 1. Sprawdź czy ma uprawnienia
        if (!['admin', 'director'].includes(currentUser.role)) {
            alert('Brak uprawnień do tej funkcji');
            return;
        }
        
        // 2. Pobierz dane docelowego użytkownika
        const { data: targetUser } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', targetUserId)
            .single();
        
        if (!targetUser) {
            alert('Użytkownik nie znaleziony');
            return;
        }
        
        // 3. Zapisz oryginalnego użytkownika w localStorage
        localStorage.setItem('libruz_original_user', JSON.stringify(currentUser));
        localStorage.setItem('libruz_impersonation_token', btoa(`${currentUser.id}:${targetUser.id}:${Date.now()}`));
        
        // 4. Tymczasowo ustaw docelowego użytkownika
        localStorage.setItem('libruz_user', JSON.stringify(targetUser));
        
        // 5. Przekieruj do odpowiedniego dashboardu
        switch(targetUser.role) {
            case 'teacher':
                window.location.href = '../dashboards/teacher.html';
                break;
            case 'student':
                window.location.href = '../dashboards/student.html';
                break;
            case 'parent':
                window.location.href = '../dashboards/parent.html';
                break;
            case 'director':
            case 'vicedirector':
                window.location.href = '../dashboards/director.html';
                break;
            default:
                alert('Nieznana rola użytkownika');
        }
    }

    // Przywracanie oryginalnego użytkownika
    async restoreOriginalUser() {
        const originalUser = JSON.parse(localStorage.getItem('libruz_original_user'));
        
        if (originalUser) {
            localStorage.setItem('libruz_user', JSON.stringify(originalUser));
            localStorage.removeItem('libruz_original_user');
            localStorage.removeItem('libruz_impersonation_token');
            
            window.location.href = originalUser.role === 'admin' ? 
                '../dashboards/admin.html' : 
                '../dashboards/director.html';
        }
    }
}

const substitutions = new SubstitutionSystem();
