// schedule.js - Terminarz i system ogłoszeń
class ScheduleSystem {
    constructor() {
        this.currentView = 'month';
        this.selectedDate = new Date();
        this.maxTestsPerWeek = 3;
    }

    // Główny widok terminarza
    renderCalendar() {
        return `
            <div class="schedule-container">
                <!-- Nagłówek -->
                <div class="calendar-header">
                    <div class="view-controls">
                        <button onclick="schedule.setView('month')" 
                                class="${this.currentView === 'month' ? 'active' : ''}">
                            Miesiąc
                        </button>
                        <button onclick="schedule.setView('week')"
                                class="${this.currentView === 'week' ? 'active' : ''}">
                            Tydzień
                        </button>
                        <button onclick="schedule.setView('day')"
                                class="${this.currentView === 'day' ? 'active' : ''}">
                            Dzień
                        </button>
                    </div>
                    
                    <div class="date-navigation">
                        <button onclick="schedule.prevPeriod()">◀</button>
                        <h3 id="currentPeriod">${this.getPeriodTitle()}</h3>
                        <button onclick="schedule.nextPeriod()">▶</button>
                    </div>
                    
                    <div class="calendar-actions">
                        <button onclick="schedule.addEvent()">+ Nowe wydarzenie</button>
                        <button onclick="schedule.addAnnouncement()">📢 Nowe ogłoszenie</button>
                    </div>
                </div>
                
                <!-- Kalendarz -->
                <div class="calendar-view" id="calendarView">
                    ${this.currentView === 'month' ? this.renderMonthView() : ''}
                    ${this.currentView === 'week' ? this.renderWeekView() : ''}
                    ${this.currentView === 'day' ? this.renderDayView() : ''}
                </div>
                
                <!-- Lista wydarzeń -->
                <div class="events-sidebar">
                    <h4>Nadchodzące wydarzenia</h4>
                    <div id="upcomingEvents"></div>
                </div>
            </div>
        `;
    }

    // Widok miesięczny
    renderMonthView() {
        const daysInMonth = this.getDaysInMonth();
        const firstDay = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
        const startingDay = firstDay.getDay();
        
        let calendarHTML = '<div class="month-grid">';
        
        // Nagłówki dni
        const dayNames = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
        calendarHTML += dayNames.map(day => `<div class="day-header">${day}</div>`).join('');
        
        // Puste komórki na początek miesiąca
        for (let i = 0; i < startingDay; i++) {
            calendarHTML += '<div class="day-cell empty"></div>';
        }
        
        // Dni miesiąca
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), day);
            const isToday = this.isToday(date);
            const isHoliday = this.isHoliday(date);
            
            calendarHTML += `
                <div class="day-cell ${isToday ? 'today' : ''} ${isHoliday ? 'holiday' : ''}" 
                     onclick="schedule.selectDate('${date.toISOString()}')">
                    <div class="day-number">${day}</div>
                    <div class="day-events" id="events-${date.toISOString().split('T')[0]}">
                        <!-- Wydarzenia ładowane dynamicznie -->
                    </div>
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        return calendarHTML;
    }

    // Dodawanie nowego wydarzenia
    async addEvent() {
        const modal = `
            <div class="modal event-modal">
                <h3>Nowe wydarzenie</h3>
                <form id="eventForm">
                    <div class="form-group">
                        <label>Typ wydarzenia*</label>
                        <select id="eventType" required>
                            <option value="test">Sprawdzian</option>
                            <option value="quiz">Kartkówka</option>
                            <option value="meeting">Spotkanie online</option>
                            <option value="exam">Egzamin</option>
                            <option value="other">Inne</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Tytuł*</label>
                        <input type="text" id="eventTitle" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Data*</label>
                            <input type="date" id="eventDate" required 
                                   value="${this.selectedDate.toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label>Godzina</label>
                            <input type="time" id="eventTime">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Klasa</label>
                        <select id="eventClass">
                            <option value="">Wszystkie klasy</option>
                            <!-- Dynamiczne klasy -->
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Przedmiot</label>
                        <input type="text" id="eventSubject">
                    </div>
                    
                    <div class="form-check" id="onlineMeetingSection" style="display: none;">
                        <input type="checkbox" id="isOnline">
                        <label>Spotkanie online</label>
                        <input type="text" id="meetingLink" placeholder="Link do spotkania">
                    </div>
                    
                    <!-- Sprawdzenie limitu sprawdzianów -->
                    <div class="limit-warning" id="limitWarning" style="display: none;">
                        ⚠️ Osiągnięto limit sprawdzianów w tym tygodniu (${this.maxTestsPerWeek})
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" id="submitEvent">Dodaj</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Anuluj</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
        this.checkTestLimit();
    }

    // Sprawdzenie limitu sprawdzianów
    async checkTestLimit() {
        const selectedDate = document.getElementById('eventDate').value;
        const weekNumber = this.getWeekNumber(new Date(selectedDate));
        
        const { data: tests } = await supabase
            .from('schedule')
            .select('*')
            .eq('event_type', 'test')
            .gte('start_date', this.getWeekStart(weekNumber))
            .lte('start_date', this.getWeekEnd(weekNumber));
        
        if (tests && tests.length >= this.maxTestsPerWeek) {
            document.getElementById('limitWarning').style.display = 'block';
        }
    }

    // System ogłoszeń
    async addAnnouncement() {
        const modal = `
            <div class="modal announcement-modal">
                <h3>Nowe ogłoszenie</h3>
                <form id="announcementForm">
                    <div class="form-group">
                        <label>Tytuł*</label>
                        <input type="text" id="annTitle" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Treść*</label>
                        <textarea id="annContent" rows="6" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Grupa docelowa*</label>
                        <select id="annTarget" multiple required>
                            <option value="parents">Rodzice</option>
                            <option value="students">Uczniowie</option>
                            <option value="teachers">Nauczyciele</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Data publikacji</label>
                            <input type="date" id="annPublishDate" 
                                   value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label>Data wygaśnięcia</label>
                            <input type="date" id="annExpireDate">
                        </div>
                    </div>
                    
                    <div class="form-check">
                        <input type="checkbox" id="annPublished" checked>
                        <label>Opublikuj od razu</label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit">Opublikuj</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Anuluj</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    // Tablica ogłoszeń
    async renderAnnouncementsBoard() {
        const user = JSON.parse(localStorage.getItem('libruz_user'));
        const today = new Date().toISOString().split('T')[0];
        
        const { data: announcements } = await supabase
            .from('announcements')
            .select('*')
            .or(`target_audience.cs.{${user.role}},target_audience.cs.{all}`)
            .lte('publish_date', today)
            .gte('expire_date', today)
            .eq('is_published', true)
            .order('publish_date', { ascending: false });
        
        const board = `
            <div class="announcements-board">
                <h2>📢 Ogłoszenia</h2>
                <div class="announcements-list">
                    ${announcements.map(ann => `
                        <div class="announcement-card">
                            <div class="ann-header">
                                <h4>${ann.title}</h4>
                                <span class="ann-date">
                                    ${new Date(ann.publish_date).toLocaleDateString('pl-PL')}
                                    ${ann.expire_date ? ` - ${new Date(ann.expire_date).toLocaleDateString('pl-PL')}` : ''}
                                </span>
                            </div>
                            <div class="ann-content">${ann.content}</div>
                            <div class="ann-footer">
                                <span class="ann-target">Dla: ${ann.target_audience.join(', ')}</span>
                                ${user.role === 'admin' || user.role === 'director' ? 
                                    `<button onclick="schedule.editAnnouncement('${ann.id}')">Edytuj</button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        return board;
    }
}

const schedule = new ScheduleSystem();
