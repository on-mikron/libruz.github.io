// grading.js - System oceniania z poprawami i historią
class GradingSystem {
    constructor() {
        this.categories = this.loadCategories();
        this.currentStudent = null;
    }

    // Konfiguracja kategorii ocen
    loadCategories() {
        return [
            { id: 'quiz', name: 'Kartkówka', weight: 1, color: '#4CAF50', editable: true },
            { id: 'test', name: 'Sprawdzian', weight: 2, color: '#2196F3', editable: true },
            { id: 'answer', name: 'Odpowiedź', weight: 1, color: '#FF9800', editable: true },
            { id: 'homework', name: 'Praca domowa', weight: 0.5, color: '#9C27B0', editable: true },
            { id: 'project', name: 'Projekt', weight: 3, color: '#F44336', editable: true },
            { id: 'exam', name: 'Egzamin', weight: 5, color: '#607D8B', editable: false }, // systemowa
            { id: 'final', name: 'Ocena końcowa', weight: 0, color: '#000000', editable: false } // systemowa
        ];
    }

    // Główny interfejs oceniania
    renderGradingInterface(classId, subject) {
        return `
            <div class="grading-container">
                <!-- Nagłówek -->
                <div class="grading-header">
                    <h2>Ocenianie - ${subject}</h2>
                    <div class="grading-actions">
                        <button onclick="grading.addGradeColumn()">+ Nowa kolumna</button>
                        <button onclick="grading.configureCategories()">⚙️ Kategorie</button>
                        <button onclick="grading.exportGrades()">📊 Eksportuj oceny</button>
                    </div>
                </div>
                
                <!-- Widok dziennika (tabela) -->
                <div class="gradebook-view">
                    <table class="gradebook-table">
                        <thead>
                            <tr>
                                <th rowspan="2">Uczeń</th>
                                <!-- Dynamiczne kolumny ocen -->
                                <th colspan="${this.gradeColumns.length}" class="grade-columns-header">
                                    Oceny cząstkowe
                                </th>
                                <th rowspan="2">Średnia</th>
                                <th rowspan="2">Ocena końcowa</th>
                            </tr>
                            <tr id="gradeColumns">
                                <!-- Nagłówki kolumn ocen -->
                            </tr>
                        </thead>
                        <tbody id="gradebookBody">
                            <!-- Dynamiczne wiersze uczniów -->
                        </tbody>
                    </table>
                </div>
                
                <!-- Szybkie dodawanie oceny -->
                <div class="quick-grade-form">
                    <h4>Szybkie dodawanie oceny</h4>
                    <select id="quickStudent">
                        <option value="">Wybierz ucznia...</option>
                    </select>
                    <select id="quickCategory">
                        ${this.categories.filter(c => c.editable).map(cat => `
                            <option value="${cat.id}">${cat.name} (waga: ${cat.weight})</option>
                        `).join('')}
                    </select>
                    <input type="number" id="quickGrade" min="1" max="6" step="0.5" placeholder="Ocena">
                    <input type="text" id="quickComment" placeholder="Komentarz (opcjonalnie)">
                    <button onclick="grading.addQuickGrade()">Dodaj ocenę</button>
                </div>
            </div>
        `;
    }

    // Dodawanie oceny z możliwością poprawy
    async addGrade(studentId, category, gradeValue, comment = '', lessonId = null) {
        const user = JSON.parse(localStorage.getItem('libruz_user'));
        const categoryData = this.categories.find(c => c.id === category);
        
        // Sprawdź czy istnieje już ocena do poprawy
        const { data: existingGrade } = await supabase
            .from('grades')
            .select('*')
            .eq('student_id', studentId)
            .eq('category', category)
            .eq('lesson_id', lessonId)
            .maybeSingle();
        
        if (existingGrade) {
            // Zapisz starą ocenę do historii
            await supabase
                .from('grade_history')
                .insert([{
                    grade_id: existingGrade.id,
                    old_grade: existingGrade.grade,
                    new_grade: gradeValue,
                    changed_by: user.id,
                    change_reason: 'Poprawa'
                }]);
            
            // Aktualizuj ocenę
            const { data: updatedGrade } = await supabase
                .from('grades')
                .update({
                    grade: gradeValue,
                    comment: comment,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingGrade.id)
                .select()
                .single();
            
            // Format wyświetlania: [stara] nowa
            this.displayGradeAsImproved(existingGrade.grade, gradeValue);
            
            return updatedGrade;
        } else {
            // Dodaj nową ocenę
            const { data: newGrade } = await supabase
                .from('grades')
                .insert([{
                    student_id: studentId,
                    subject: this.currentSubject,
                    grade: gradeValue,
                    weight: categoryData.weight,
                    category: category,
                    teacher_id: user.id,
                    lesson_id: lessonId,
                    comment: comment
                }])
                .select()
                .single();
            
            return newGrade;
        }
    }

    // Wyświetlanie oceny z poprawą
    displayGradeAsImproved(oldGrade, newGrade) {
        return `<span class="improved-grade">
            [${oldGrade}] <strong>${newGrade}</strong>
        </span>`;
    }

    // Historia zmian oceny
    async getGradeHistory(gradeId) {
        const { data: history } = await supabase
            .from('grade_history')
            .select(`
                *,
                changed_by:profiles(first_name, last_name)
            `)
            .eq('grade_id', gradeId)
            .order('created_at', { ascending: false });
        
        return history || [];
    }

    // Obliczanie średniej ważonej
    calculateWeightedAverage(studentId) {
        const grades = this.getStudentGrades(studentId);
        
        if (grades.length === 0) return null;
        
        const weightedSum = grades.reduce((sum, grade) => {
            return sum + (grade.grade * grade.weight);
        }, 0);
        
        const totalWeight = grades.reduce((sum, grade) => sum + grade.weight, 0);
        
        return (weightedSum / totalWeight).toFixed(2);
    }

    // Konfiguracja kategorii (dla admina/dyrektora)
    configureCategories() {
        const modal = `
            <div class="modal categories-modal">
                <h3>Konfiguracja kategorii ocen</h3>
                <div class="categories-list">
                    ${this.categories.map(cat => `
                        <div class="category-item ${cat.editable ? '' : 'system-category'}">
                            <div class="category-header">
                                <span class="category-color" style="background: ${cat.color}"></span>
                                <span class="category-name">${cat.name}</span>
                                ${!cat.editable ? '<span class="system-badge">systemowa</span>' : ''}
                            </div>
                            
                            ${cat.editable ? `
                                <div class="category-controls">
                                    <input type="number" value="${cat.weight}" min="0" step="0.5"
                                           onchange="grading.updateCategoryWeight('${cat.id}', this.value)">
                                    <input type="color" value="${cat.color}"
                                           onchange="grading.updateCategoryColor('${cat.id}', this.value)">
                                    <button onclick="grading.deleteCategory('${cat.id}')">🗑️</button>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <div class="add-category-form">
                    <h4>Dodaj nową kategorię</h4>
                    <input type="text" id="newCategoryName" placeholder="Nazwa kategorii">
                    <input type="number" id="newCategoryWeight" placeholder="Waga" min="0" step="0.5" value="1">
                    <input type="color" id="newCategoryColor" value="#4CAF50">
                    <button onclick="grading.addNewCategory()">Dodaj kategorię</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    // Eksport ocen do różnych formatów
    async exportGrades(format = 'pdf') {
        const grades = await this.getAllClassGrades();
        
        switch(format) {
            case 'pdf':
                this.exportToPDF(grades);
                break;
            case 'excel':
                this.exportToExcel(grades);
                break;
            case 'csv':
                this.exportToCSV(grades);
                break;
        }
    }
}

const grading = new GradingSystem();
