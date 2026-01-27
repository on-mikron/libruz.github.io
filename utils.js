// js/utils.js
class UserGenerator {
    static generateLogin(lastName, role) {
        const roleSuffix = {
            'teacher': 'N',
            'student': 'U',
            'director': 'D',
            'admin': 'A'
        };
        
        const cleanLastName = lastName
            .toLowerCase()
            .replace(/[ąćęłńóśźż]/g, c => {
                const map = {
                    'ą': 'a', 'ć': 'c', 'ę': 'e',
                    'ł': 'l', 'ń': 'n', 'ó': 'o',
                    'ś': 's', 'ź': 'z', 'ż': 'z'
                };
                return map[c] || c;
            })
            .replace(/[^a-z]/g, '');
        
        return `${cleanLastName}${roleSuffix[role] || ''}`.toLowerCase();
    }
    
    static generatePassword(length = 12) {
        const chars = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*'
        };
        
        let password = '';
        
        // Zapewnij przynajmniej po jednym znaku z każdej kategorii
        password += this.getRandomChar(chars.uppercase);
        password += this.getRandomChar(chars.lowercase);
        password += this.getRandomChar(chars.numbers);
        password += this.getRandomChar(chars.symbols);
        
        // Uzupełnij do wymaganej długości
        const allChars = Object.values(chars).join('');
        for (let i = password.length; i < length; i++) {
            password += this.getRandomChar(allChars);
        }
        
        // Wymieszaj znaki
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }
    
    static getRandomChar(string) {
        return string[Math.floor(Math.random() * string.length)];
    }
}

class Validation {
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    static validatePassword(password) {
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /[a-z]/.test(password) &&
               /[0-9]/.test(password) &&
               /[!@#$%^&*]/.test(password);
    }
}

class UIHelper {
    static showModal(title, content, buttons = []) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
                <div class="modal-footer">
                    ${buttons.map(btn => 
                        `<button class="btn btn-${btn.type}" onclick="${btn.onclick}">
                            ${btn.text}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
    
    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}
