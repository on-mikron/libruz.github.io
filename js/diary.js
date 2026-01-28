// diary.js - Kompletny dziennik z narzędziami
class DiarySystem {
    constructor() {
        this.currentClass = null;
        this.studentCache = new Map();
    }

    // Inicjalizacja dziennika
    async init(classId) {
        this.currentClass = classId;
        await this.loadClassData();
        await this.loadStudents();
        this.setupClassView();
    }

    // Ładowanie danych klasy
    async loadClassData() {
        const { data: classData } = await supabase
            .from('classes')
            .select(`
                *,
                teacher:profiles!classes_teacher_id_fkey(first_name, last_name)
            `)
            .eq('id', this.currentClass)
            .single();
        
        this.classData = classData;
    }

    // Ładowanie uczniów
    async loadStudents() {
        const { data: students } = await supabase
            .from('class_students')
            .select(`
                student_id,
                profiles:student_id(first_name, last_name, email),
                student_info:student_id(*)
            `)
            .eq('class_id', this.currentClass);
        
        this.students = students || [];
        this.students.forEach(s => {
            this.studentCache.set(s.student_id, s);
        });
    }

    // Główny widok dziennika
    setupClassView() {
        const view = `
            <div class="diary-container">
                <!-- Nagłówek klasy -->
                <div class="class-header">
                    <h2>Klasa ${this.classData.name}</h2>
                    <p>Wychowawca: ${this.classData.teacher.first_name} ${this.classData.teacher.last_name}</p>
                </div>
                
                <!-- Menu narzędzi -->
                <div class="diary-tools">
                    <button onclick="diary.showStudentInfo()">👤 Dane osobowe</button>
                    <button onclick="diary.showSpecialNeeds()">🏥 Orzeczenia/opinie</button>
                    <button onclick="diary.showAchievements()">🏆 Osiągnięcia</button>
                    <button onclick="diary.showExcuses()">📝 Zwolnienia seryjne</button>
                    <button onclick="diary.showClassDuties()">👨‍💼 Dyżurni</button>
                    <button onclick="diary.showStatistics()">📊 Statystyki</button>
                </div>
                
                <!-- Lista uczniów -->
                <div class="students-list">
                    <h3>Uczniowie (${this.students.length})</h3>
                    <table class="students-table">
                        <thead>
                            <tr>
                                <th>Lp.</th>
                                <th>Uczeń</th>
                                <th>Adres</th>
                                <th>Telefon</th>
                                <th>Dysfunkcje</th>
                                <th>Akcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.students.map((student, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>
                                        ${student.profiles.first_name} ${student.profiles.last_name}
                                        ${student.student_info?.special_needs?.length ? 
                                            '<span class="special-needs-icon" title="Specjalne potrzeby">❓</span>' : ''}
                                    </td>
                                    <td>${student.student_info?.address || '-'}</td>
                                    <td>${student.profiles.phone || '-'}</td>
                                    <td>
                                        ${(student.student_info?.special_needs || []).map(need => 
                                            `<span class="badge">${need}</span>`
                                        ).join(' ')}
                                    </td>
                                    <td>
                                        <button onclick="diary.editStudent('${student.student_id}')">Edytuj</button>
                                        <button onclick="diary.addRemark('${student.student_id}')">Uwaga</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        document.getElementById('diaryContent').innerHTML = view;
    }

    // Modal edycji danych ucznia
    async editStudent(studentId) {
        const student = this.studentCache.get(studentId);
        
        const modal = `
            <div class="modal student-modal">
                <h3>Edycja danych ucznia</h3>
                <form id="studentForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Imię</label>
                            <input type="text" value="${student.profiles.first_name}" required>
                        </div>
                        <div class="form-group">
                            <label>Nazwisko</label>
                            <input type="text" value="${student.profiles.last_name}" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Data urodzenia</label>
                        <input type="date" value="${student.student_info?.birth_date || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label>Miejsce urodzenia</label>
                        <input type="text" value="${student.student_info?.birth_place || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label>Adres zamieszkania</label>
                        <textarea>${student.student_info?.address || ''}</textarea>
                    </div>
                    
                    <div class="form-check">
                        <input type="checkbox" ${student.student_info?.school_district ? 'checked' : ''}>
                        <label>Obwód szkolny</label>
                    </div>
                    
                    <div class="form-group">
                        <h4>Kontakty do rodziców</h4>
                        <!-- Dynamiczne pola kontaktów -->
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit">Zapisz</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Anuluj</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    // Zwolnienia seryjne
    async showExcuses() {
        const modal = `
            <div class="modal excuses-modal">
                <h3>Zwolnienia seryjne</h3>
                <form id="excuseForm">
                    <div class="form-group">
                        <label>Uczeń</label>
                        <select id="excuseStudent" required>
                            ${this.students.map(s => `
                                <option value="${s.student_id}">
                                    ${s.profiles.first_name} ${s.profiles.last_name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Od</label>
                            <input type="date" id="excuseStart" required>
                        </div>
                        <div class="form-group">
                            <label>Do</label>
                            <input type="date" id="excuseEnd" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Przedmiot (opcjonalnie)</label>
                        <input type="text" id="excuseSubject" placeholder="np. WF">
                    </div>
                    
                    <div class="form-group">
                        <label>Powód zwolnienia</label>
                        <textarea id="excuseReason"></textarea>
                    </div>
                    
                    <div class="form-check">
                        <input type="checkbox" id="autoAttendance" checked>
                        <label>Automatycznie zaznaczaj frekwencję</label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit">Zapisz zwolnienie</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Anuluj</button>
                    </div>
                </form>
                
                <!-- Lista istniejących zwolnień -->
                <div class="existing-excuses">
                    <h4>Istniejące zwolnienia</h4>
                    <div id="excusesList"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
        await this.loadExistingExcuses();
    }

    // Osiągnięcia ucznia
    async showAchievements() {
        const achievementsModal = `
            <div class="modal achievements-modal">
                <h3>Szczególne osiągnięcia</h3>
                
                <div class="achievement-form">
                    <input type="text" id="achievementTitle" placeholder="Tytuł osiągnięcia">
                    <select id="achievementType">
                        <option value="olympiad">Olimpiada</option>
                        <option value="contest">Konkurs</option>
                        <option value="sport">Sport</option>
                        <option value="art">Artystyczne</option>
                        <option value="other">Inne</option>
                    </select>
                    <select id="achievementLevel">
                        <option value="school">Szkoła</option>
                        <option value="municipal">Gmina</option>
                        <option value="regional">Województwo</option>
                        <option value="national">Kraj</option>
                        <option value="international">Międzynarodowe</option>
                    </select>
                    <input type="text" id="achievementPlace" placeholder="Miejsce">
                    <input type="date" id="achievementDate">
                    <button onclick="diary.addAchievement()">Dodaj</button>
                </div>
                
                <div class="import-section">
                    <button onclick="diary.importToCertificate()">📋 Zaimportuj na świadectwo</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    // Statystyki i kontrola
    async showStatistics() {
        const { data: stats } = await supabase
            .from('attendance')
            .select(`
                status,
                count(*),
                lessons(date)
            `)
            .eq('student_id', this.studentId)
            .group('status, lessons.date');
        
        const statsModal = `
            <div class="modal statistics-modal">
                <h3>Kontrola realizacji i frekwencji</h3>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>Frekwencja</h4>
                        <div class="stat-value">${this.calculateAttendancePercentage()}%</div>
                        <div class="stat-details">
                            Obecności: ${stats.filter(s => s.status === 'present').length}<br>
                            Nieobecności: ${stats.filter(s => s.status === 'absent').length}<br>
                            Spóźnienia: ${stats.filter(s => s.status === 'late').length}
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <h4>Realizacja programu</h4>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${this.calculateCurriculumProgress()}%"></div>
                        </div>
                        <div>${this.calculateCurriculumProgress()}%</div>
                    </div>
                    
                    <div class="stat-card">
                        <h4>Brakujące wpisy</h4>
                        <ul class="missing-entries">
                            ${this.findMissingEntries().map(entry => `
                                <li>${entry}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }
}

const diary = new DiarySystem();
