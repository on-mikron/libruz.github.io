// js/dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('libruz_user'));
    const menuItems = document.getElementById('menuItems');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const dashboardContent = document.getElementById('dashboardContent');
    
    // Ustaw informacje o użytkowniku
    userName.textContent = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
    userRole.textContent = getRoleName(user.role);
    userRole.className = `role-badge ${user.role}-badge`;
    
    // Załaduj menu w zależności od roli
    loadMenu(user.role);
    
    // Obsługa wylogowania
    window.logout = function() {
        localStorage.removeItem('libruz_user');
        localStorage.removeItem('libruz_token');
        window.location.href = 'index.html';
    };
    
    function getRoleName(role) {
        const roles = {
            'admin': 'Administrator',
            'director': 'Dyrektor',
            'teacher': 'Nauczyciel',
            'student': 'Uczeń',
            'parent': 'Rodzic'
        };
        return roles[role] || role;
    }
    
    function loadMenu(role) {
        const menus = {
            admin: [
                { id: 'schools', name: '🏫 Zarządzanie szkołami', function: 'loadSchools' },
                { id: 'overview', name: '📊 Przegląd systemu', function: 'loadOverview' },
                { id: 'logs', name: '📋 Logi systemowe', function: 'loadLogs' }
            ],
            director: [
                { id: 'teachers', name: '👨‍🏫 Zarządzanie nauczycielami', function: 'loadTeachers' },
                { id: 'classes', name: '🏫 Zarządzanie klasami', function: 'loadClasses' },
                { id: 'students', name: '👨‍🎓 Zarządzanie uczniami', function: 'loadStudents' },
                { id: 'schedule', name: '📅 Konstruktor planu lekcji', function: 'loadScheduleBuilder' },
                { id: 'timetable', name: '🕐 Godziny lekcyjne', function: 'loadTimetable' },
                { id: 'classrooms', name: '🏠 Sale lekcyjne', function: 'loadClassrooms' },
                { id: 'messages', name: '✉️ Wiadomości', function: 'loadMessages' },
                { id: 'calendar', name: '📅 Terminarz', function: 'loadCalendar' }
            ],
            teacher: [
                { id: 'lessons', name: '📚 Lekcje', function: 'loadLessons' },
                { id: 'grades', name: '📝 Oceny', function: 'loadGrades' },
                { id: 'notes', name: '📋 Uwagi', function: 'loadNotes' },
                { id: 'homeroom', name: '👨‍🏫 Wychowawstwo', function: 'loadHomeroom' },
                { id: 'messages', name: '✉️ Wiadomości', function: 'loadMessages' },
                { id: 'calendar', name: '📅 Terminarz', function: 'loadCalendar' },
                { id: 'timetable', name: '🕐 Mój plan lekcji', function: 'loadTeacherTimetable' }
            ],
            student: [
                { id: 'schedule', name: '🕐 Mój plan lekcji', function: 'loadStudentSchedule' },
                { id: 'grades', name: '📝 Moje oceny', function: 'loadStudentGrades' },
                { id: 'attendance', name: '📊 Frekwencja', function: 'loadAttendance' },
                { id: 'messages', name: '✉️ Wiadomości', function: 'loadMessages' },
                { id: 'calendar', name: '📅 Terminarz', function: 'loadCalendar' },
                { id: 'classchat', name: '💬 Czat klasowy', function: 'loadClassChat' },
                { id: 'excuses', name: '📄 Usprawiedliwienia', function: 'loadExcuses' }
            ]
        };
        
        const currentMenu = menus[role] || [];
        
        // Wyczyść menu
        menuItems.innerHTML = '';
        
        // Dodaj elementy menu
        currentMenu.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="#" onclick="${item.function}(); return false;" class="menu-item">
                    ${item.name}
                </a>
            `;
            menuItems.appendChild(li);
        });
    }
    
    // Funkcje do ładowania zawartości (przykłady)
    window.loadSchools = function() {
        dashboardContent.innerHTML = `
            <h2>Zarządzanie szkołami</h2>
            <button onclick="createSchool()" class="btn btn-primary">
                ➕ Dodaj nową szkołę
            </button>
            <div id="schoolsList"></div>
        `;
        // Tutaj załaduj listę szkół z API
    };
    
    window.loadTeachers = function() {
        dashboardContent.innerHTML = `
            <h2>Zarządzanie nauczycielami</h2>
            <button onclick="addTeacher()" class="btn btn-primary">
                👨‍🏫 Dodaj nauczyciela
            </button>
            <div id="teachersList"></div>
        `;
    };
    
    // ... reszta funkcji
});
