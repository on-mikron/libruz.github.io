// curriculum.js - System rozkładów materiału
class CurriculumManager {
    constructor() {
        this.editingCurriculum = null;
    }

    // Główny interfejs edytora
    renderEditor() {
        return `
            <div class="curriculum-editor">
                <!-- Nagłówek -->
                <div class="editor-header">
                    <h2>Edytor rozkładów materiału</h2>
                    <div class="editor-actions">
                        <button onclick="curriculum.newCurriculum()">+ Nowy rozkład</button>
                        <button onclick="curriculum.copyCurriculum()">📋 Kopiuj istniejący</button>
                        <button onclick="curriculum.importFromBase()">📥 Importuj z bazy</button>
                    </div>
                </div>
                
                <!-- Lista rozkładów -->
                <div class="curriculum-list">
                    <div class="list-filters">
                        <input type="text" placeholder="Szukaj rozkładu..." 
                               oninput="curriculum.searchCurricula(this.value)">
                        <select onchange="curriculum.filterBySubject(this.value)">
                            <option value="">Wszystkie przedmioty</option>
                            <!-- Dynamiczne opcje -->
                        </select>
                    </div>
                    
                    <div id="curriculaGrid" class="curricula-grid">
                        <!-- Dynamiczne ładowanie rozkładów -->
                    </div>
                </div>
                
                <!-- Edytor tematów -->
                <div class="topics-editor" id="topicsEditor">
                    <!-- Ładowane dynamicznie po wybraniu rozkładu -->
                </div>
            </div>
        `;
    }

    // Tworzenie nowego rozkładu
    async newCurriculum() {
        const modal = `
            <div class="modal curriculum-modal">
                <h3>Nowy rozkład materiału</h3>
                <form id="newCurriculumForm">
                    <div class="form-group">
                        <label>Nazwa rozkładu*</label>
                        <input type="text" id="curriculumName" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Przedmiot*</label>
                            <select id="curriculumSubject" required>
                                <option value="matematyka">Matematyka</option>
                                <option value="polski">Język polski</option>
                                <!-- Więcej przedmiotów -->
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Liczba godzin</label>
                            <input type="number" id="curriculumHours" min="1" value="30">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Siatka godzin</label>
                        <select id="hourGrid" multiple>
                            <option value="1">1 godz/tydz</option>
                            <option value="2">2 godz/tydz</option>
                            <option value="3">3 godz/tydz</option>
                            <option value="4">4 godz/tydz</option>
                            <option value="5">5 godz/tydz</option>
                        </select>
                    </div>
                    
                    <div class="form-check">
                        <input type="checkbox" id="isPublic">
                        <label>Publiczny (dostępny dla innych nauczycieli)</label>
                    </div>
                    
                    <div class="form-check">
                        <input type="checkbox" id="publisherBase">
                        <label>Korzystaj z bazy wydawców</label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit">Utwórz rozkład</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Anuluj</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    // Edycja tematów w rozkładzie
    async editTopics(curriculumId) {
        this.editingCurriculum = curriculumId;
        
        const { data: topics } = await supabase
            .from('curriculum_topics')
            .select('*')
            .eq('curriculum_id', curriculumId)
            .order('topic_number', { ascending: true });
        
        const editor = `
            <div class="topics-container">
                <h3>Edycja tematów</h3>
                
                <!-- Lista tematów z drag&drop -->
                <div class="topics-list" id="topicsList">
                    ${topics.map((topic, index) => `
                        <div class="topic-item" data-id="${topic.id}" draggable="true">
                            <div class="topic-header">
                                <span class="topic-number">${index + 1}</span>
                                <input type="text" value="${topic.title}" 
                                       onchange="curriculum.updateTopic('${topic.id}', 'title', this.value)">
                                <div class="topic-actions">
                                    <button onclick="curriculum.toggleTopicType('${topic.id}', 'main')" 
                                            class="${topic.is_main_topic ? 'active' : ''}"
                                            title="Temat właściwy">
                                        📘
                                    </button>
                                    <button onclick="curriculum.toggleTopicType('${topic.id}', 'test')"
                                            class="${topic.is_test ? 'active' : ''}"
                                            title="Sprawdzian">
                                        📝
                                    </button>
                                    <button onclick="curriculum.addHours('${topic.id}')"
                                            title="Liczba godzin">
                                        ${topic.hours}h
                                    </button>
                                    <button onclick="curriculum.deleteTopic('${topic.id}')">🗑️</button>
                                </div>
                            </div>
                            
                            <div class="topic-details">
                                <div class="topic-skills">
                                    <small>Podstawa programowa:</small>
                                    <div class="skills-list">
                                        ${(topic.skills || []).map(skill => `
                                            <span class="skill-tag">${skill}</span>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <div class="topic-resources">
                                    <small>Zasoby:</small>
                                    <div class="resources-list">
                                        ${(topic.resources || []).map(res => `
                                            <a href="${res.url}" target="_blank">${res.name}</a>
                                        `).join(', ')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Dodawanie nowego tematu -->
                <div class="add-topic-form">
                    <input type="text" id="newTopicTitle" placeholder="Nowy temat...">
                    <button onclick="curriculum.addTopic()">+ Dodaj temat</button>
                    <button onclick="curriculum.addResourceToCurriculum()">+ Dodaj zasób</button>
                </div>
            </div>
        `;
        
        document.getElementById('topicsEditor').innerHTML = editor;
        this.setupDragAndDrop();
    }

    // Przypisywanie rozkładu do klas
    async assignToClasses(curriculumId) {
        const { data: classes } = await supabase
            .from('classes')
            .select('id, name');
        
        const modal = `
            <div class="modal assign-modal">
                <h3>Przypisz rozkład do klas</h3>
                <div class="classes-list">
                    ${classes.map(cls => `
                        <div class="class-item">
                            <label>
                                <input type="checkbox" value="${cls.id}" 
                                       onchange="curriculum.toggleClassAssignment('${curriculumId}', '${cls.id}', this.checked)">
                                ${cls.name}
                            </label>
                        </div>
                    `).join('')}
                </div>
                
                <div class="virtual-classes">
                    <h4>Grupy wirtualne</h4>
                    <input type="text" id="virtualGroupName" placeholder="Nazwa grupy...">
                    <button onclick="curriculum.createVirtualGroup()">Utwórz grupę</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    // Kopiowanie istniejącego rozkładu
    async copyCurriculum(sourceId) {
        const { data: source } = await supabase
            .from('curriculum')
            .select('*, curriculum_topics(*)')
            .eq('id', sourceId)
            .single();
        
        if (!source) return;
        
        // Utwórz kopię rozkładu
        const { data: newCurriculum } = await supabase
            .from('curriculum')
            .insert([{
                name: `${source.name} (kopia)`,
                subject: source.subject,
                hours_total: source.hours_total,
                author_id: JSON.parse(localStorage.getItem('libruz_user')).id
            }])
            .select()
            .single();
        
        // Skopiuj tematy
        const topicsCopy = source.curriculum_topics.map(topic => ({
            curriculum_id: newCurriculum.id,
            title: topic.title,
            hours: topic.hours,
            is_main_topic: topic.is_main_topic,
            is_test: topic.is_test,
            skills: topic.skills,
            resources: topic.resources
        }));
        
        await supabase
            .from('curriculum_topics')
            .insert(topicsCopy);
        
        this.showNotification('Rozkład skopiowany pomyślnie');
    }
}

const curriculum = new CurriculumManager();
