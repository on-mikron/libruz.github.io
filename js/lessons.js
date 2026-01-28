// lessons.js - Interfejs prowadzenia lekcji
class LessonManager {
    constructor() {
        this.currentLesson = null;
        this.happyNumber = this.generateHappyNumber();
    }

    // Rozpoczęcie lekcji
    async startLesson(classId, subject, lessonNumber) {
        const today = new Date().toISOString().split('T')[0];
        const user = JSON.parse(localStorage.getItem('libruz_user'));
        
        // Sprawdź czy lekcja już istnieje
        const { data: existing } = await supabase
            .from('lessons')
            .select('*')
            .eq('date', today)
            .eq('lesson_number', lessonNumber)
            .eq('class_id', classId)
            .single();
        
        if (existing) {
            this.currentLesson = existing;
            this.loadLesson(existing.id);
        } else {
            // Utwórz nową lekcję
            const { data: lesson } = await supabase
                .from('lessons')
                .insert([{
                    date: today,
                    lesson_number: lessonNumber,
                    subject: subject,
                    teacher_id: user.id,
                    class_id: classId,
                    topic: this.suggestTopic(subject)
                }])
                .select()
                .single();
            
            this.currentLesson = lesson;
            this.initializeAttendance(classId);
        }
        
        this.renderLessonInterface();
    }

    // Renderowanie interfejsu lekcji
    renderLessonInterface() {
        const interfaceHTML = `
            <div class="lesson-interface">
                <!-- Nagłówek lekcji -->
                <div class="lesson-header">
                    <div class="lesson-info">
                        <span class="lesson-number">Lekcja ${this.currentLesson.lesson_number}</span>
                        <span class="lesson-date">${this.formatDate(this.currentLesson.date)}</span>
                        <span class="lesson-subject">${this.currentLesson.subject}</span>
                    </div>
                    <div class="lesson-actions">
                        <button onclick="lessonManager.saveLesson()">💾 Zapisz</button>
                        <button onclick="lessonManager.endLesson()">🏁 Zakończ</button>
                    </div>
                </div>
                
                <!-- Temat lekcji -->
                <div class="lesson-topic">
                    <h3>Temat lekcji</h3>
                    <div class="topic-controls">
                        <input type="text" id="lessonTopic" 
                               value="${this.currentLesson.topic || ''}" 
                               placeholder="Wprowadź temat...">
                        <button onclick="lessonManager.suggestTopic()">🎲 Zaproponuj temat</button>
                        <button onclick="lessonManager.showCurriculum()">📚 Wybierz z rozkładu</button>
                    </div>
                </div>
                
                <!-- Umiejętności (podstawa programowa) -->
                <div class="lesson-skills">
                    <h4>Podstawa programowa</h4>
                    <div id="skillsContainer">
                        <!-- Dynamicznie ładowane umiejętności -->
                    </div>
                    <button onclick="lessonManager.addSkill()">+ Dodaj umiejętność</button>
                </div>
                
                <!-- Frekwencja -->
                <div class="lesson-attendance">
                    <h4>Frekwencja 
                        <span class="happy-number" title="Szczęśliwy numerek">🎯 ${this.happyNumber}</span>
                    </h4>
                    <div class="attendance-grid">
                        ${this.renderAttendanceGrid()}
                    </div>
                </div>
                
                <!-- Zadanie domowe -->
                <div class="lesson-homework">
                    <h4>Zadanie domowe</h4>
                    <textarea id="homeworkText" 
                              placeholder="Wprowadź zadanie domowe...">${this.currentLesson.homework || ''}</textarea>
                    <div class="homework-options">
                        <label>
                            <input type="checkbox" id="requireFileUpload">
                            Wymagaj przesłania pliku
                        </label>
                        <input type="date" id="homeworkDeadline" 
                               value="${this.currentLesson.homework_deadline || ''}">
                    </div>
                </div>
                
                <!-- Zasoby -->
                <div class="lesson-resources">
                    <h4>Zasoby do lekcji</h4>
                    <div class="resources-list">
                        ${(this.currentLesson.resources || []).map(resource => `
                            <div class="resource-item">
                                <a href="${resource.url}" target="_blank">${resource.name}</a>
                                <button onclick="lessonManager.removeResource('${resource.id}')">✕</button>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="lessonManager.addResource()">+ Dodaj zasób</button>
                </div>
                
                <!-- Planowanie w terminarzu -->
                <div class="lesson-schedule">
                    <button onclick="lessonManager.scheduleNextLesson()">📅 Zaplanuj kolejną lekcję</button>
                </div>
            </div>
        `;
        
        document.getElementById('lessonContainer').innerHTML = interfaceHTML;
        this.loadClassStudents();
    }

    // Renderowanie siatki frekwencji
    renderAttendanceGrid() {
        return this.students.map(student => `
            <div class="attendance-item" data-student="${student.student_id}">
                <span class="student-name">
                    ${student.profiles.first_name} ${student.profiles.last_name}
                </span>
                <div class="attendance-buttons">
                    <button class="btn-present ${student.attendance?.status === 'present' ? 'active' : ''}" 
                            onclick="lessonManager.markAttendance('${student.student_id}', 'present')">
                        ✓
                    </button>
                    <button class="btn-absent ${student.attendance?.status === 'absent' ? 'active' : ''}"
                            onclick="lessonManager.markAttendance('${student.student_id}', 'absent')">
                        ✗
                    </button>
                    <button class="btn-late ${student.attendance?.status === 'late' ? 'active' : ''}"
                            onclick="lessonManager.markAttendance('${student.student_id}', 'late')">
                        ⏰
                    </button>
                    <button class="btn-excused ${student.attendance?.status === 'excused' ? 'active' : ''}"
                            onclick="lessonManager.markAttendance('${student.student_id}', 'excused')">
                        🏥
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Zaznaczanie frekwencji
    async markAttendance(studentId, status) {
        if (!this.currentLesson) return;
        
        const { error } = await supabase
            .from('attendance')
            .upsert([{
                lesson_id: this.currentLesson.id,
                student_id: studentId,
                status: status,
                updated_at: new Date().toISOString()
            }], {
                onConflict: 'lesson_id,student_id'
            });
        
        if (!error) {
            this.showNotification('Frekwencja zapisana');
        }
    }

    // Proponowanie tematu z rozkładu
    async suggestTopic() {
        const { data: topics } = await supabase
            .from('curriculum_topics')
            .select('title')
            .eq('curriculum_id', this.currentCurriculumId)
            .eq('is_main_topic', true)
            .order('topic_number', { ascending: true })
            .limit(5);
        
        if (topics && topics.length > 0) {
            const randomTopic = topics[Math.floor(Math.random() * topics.length)];
            document.getElementById('lessonTopic').value = randomTopic.title;
        }
    }

    // Dodawanie zasobu
    async addResource() {
        const modal = `
            <div class="modal resource-modal">
                <h3>Dodaj zasób do lekcji</h3>
                <form id="resourceForm">
                    <div class="form-group">
                        <label>Typ zasobu</label>
                        <select id="resourceType">
                            <option value="file">Plik</option>
                            <option value="link">Link</option>
                            <option value="video">Wideo</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Nazwa</label>
                        <input type="text" id="resourceName" required>
                    </div>
                    
                    <div class="form-group">
                        <label>URL/Plik</label>
                        <input type="text" id="resourceUrl" required>
                        <small>Dla linków: możesz użyć skróconego URLa (bit.ly)</small>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit">Dodaj</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Anuluj</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    // Generowanie szczęśliwego numerka
    generateHappyNumber() {
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        return (seed % this.students?.length || 0) + 1;
    }

    // Zapis lekcji
    async saveLesson() {
        const topic = document.getElementById('lessonTopic').value;
        const homework = document.getElementById('homeworkText').value;
        const deadline = document.getElementById('homeworkDeadline').value;
        
        const { error } = await supabase
            .from('lessons')
            .update({
                topic: topic,
                homework: homework,
                homework_deadline: deadline,
                updated_at: new Date().toISOString()
            })
            .eq('id', this.currentLesson.id);
        
        if (!error) {
            this.showNotification('Lekcja zapisana pomyślnie');
        }
    }
}

const lessonManager = new LessonManager();
