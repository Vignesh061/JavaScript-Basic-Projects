document.addEventListener('DOMContentLoaded', () => {
    const passwordDisplay = document.getElementById('passwordDisplay');
    const copyBtn = document.getElementById('copyBtn');
    const strengthMeter = document.getElementById('strengthMeter');
    const passwordLength = document.getElementById('passwordLength');
    const lengthDisplay = document.getElementById('lengthDisplay');
    const generateBtn = document.getElementById('generateBtn');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const excludeSimilarCheckbox = document.getElementById('excludeSimilar');
    const avoidAmbiguousCheckbox = document.getElementById('avoidAmbiguous');
    const passwordHistory = document.getElementById('passwordHistory');
    
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similarChars = 'il1oO0';
    const ambiguousSymbols = '{}[]()/\\';
    
    let passwordHistoryArray = [];
    
    // Update length display when slider changes
    passwordLength.addEventListener('input', () => {
        lengthDisplay.textContent = passwordLength.value;
    });
    
    // Generate button click handler
    generateBtn.addEventListener('click', generatePassword);
    
    // Copy button click handler
    copyBtn.addEventListener('click', () => {
        if (passwordDisplay.textContent !== 'Click generate to create a password') {
            navigator.clipboard.writeText(passwordDisplay.textContent.trim())
                .then(() => {
                    showToast('Password copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        }
    });
    
    function generatePassword() {
        // Ensure at least one character type is selected
        if (!uppercaseCheckbox.checked && 
            !lowercaseCheckbox.checked && 
            !numbersCheckbox.checked && 
            !symbolsCheckbox.checked) {
            alert('Please select at least one character type!');
            return;
        }
        
        let characterPool = '';
        let password = '';
        
        // Build character pool based on selections
        if (uppercaseCheckbox.checked) {
            characterPool += getFilteredChars(uppercaseChars);
        }
        
        if (lowercaseCheckbox.checked) {
            characterPool += getFilteredChars(lowercaseChars);
        }
        
        if (numbersCheckbox.checked) {
            characterPool += getFilteredChars(numberChars);
        }
        
        if (symbolsCheckbox.checked) {
            characterPool += getFilteredChars(symbolChars);
        }
        
        // Generate password
        const length = parseInt(passwordLength.value);
        
        // Ensure we include at least one character from each selected type
        const types = [];
        if (uppercaseCheckbox.checked) types.push('uppercase');
        if (lowercaseCheckbox.checked) types.push('lowercase');
        if (numbersCheckbox.checked) types.push('numbers');
        if (symbolsCheckbox.checked) types.push('symbols');
        
        // First, add one character of each type
        for (const type of types) {
            let chars;
            switch(type) {
                case 'uppercase':
                    chars = getFilteredChars(uppercaseChars);
                    break;
                case 'lowercase':
                    chars = getFilteredChars(lowercaseChars);
                    break;
                case 'numbers':
                    chars = getFilteredChars(numberChars);
                    break;
                case 'symbols':
                    chars = getFilteredChars(symbolChars);
                    break;
            }
            
            if (chars.length > 0) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }
        
        // Fill the rest with random characters from the pool
        for (let i = password.length; i < length; i++) {
            password += characterPool.charAt(Math.floor(Math.random() * characterPool.length));
        }
        
        // Shuffle the password to avoid predictable pattern of character types
        password = shuffleString(password);
        
        // Update display
        passwordDisplay.textContent = password;
        
        // Update strength meter
        updateStrengthMeter(password);
        
        // Add to history
        addToHistory(password);
    }
    
    function getFilteredChars(charSet) {
        let result = charSet;
        
        if (excludeSimilarCheckbox.checked) {
            for (const char of similarChars) {
                result = result.replace(char, '');
            }
        }
        
        if (avoidAmbiguousCheckbox.checked && charSet === symbolChars) {
            for (const char of ambiguousSymbols) {
                result = result.replace(char, '');
            }
        }
        
        return result;
    }
    
    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }
    
    function updateStrengthMeter(password) {
        const strength = calculatePasswordStrength(password);
        let color;
        
        if (strength < 30) {
            color = '#dc3545'; // Red - Weak
        } else if (strength < 60) {
            color = '#ffc107'; // Yellow - Medium
        } else if (strength < 80) {
            color = '#17a2b8'; // Blue - Strong
        } else {
            color = '#28a745'; // Green - Very Strong
        }
        
        strengthMeter.style.width = `${strength}%`;
        strengthMeter.style.backgroundColor = color;
    }
    
    function calculatePasswordStrength(password) {
        // Basic strength calculation
        let strength = 0;
        
        // Length contribution (up to 40 points)
        strength += Math.min(40, password.length * 2);
        
        // Character variety contribution
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);
        
        const varietyCount = (hasUpper ? 1 : 0) + 
                            (hasLower ? 1 : 0) + 
                            (hasNumber ? 1 : 0) + 
                            (hasSymbol ? 1 : 0);
        
        strength += varietyCount * 10;
        
        // Check for sequential characters and repeating patterns (penalize)
        let deduction = 0;
        
        // Check for repeating characters
        for (let i = 0; i < password.length - 2; i++) {
            if (password[i] === password[i+1] && password[i] === password[i+2]) {
                deduction += 5;
            }
        }
        
        strength = Math.max(0, Math.min(100, strength - deduction));
        return strength;
    }
    
    function addToHistory(password) {
        // Add to history array (limit to 10 items)
        passwordHistoryArray.unshift(password);
        if (passwordHistoryArray.length > 10) {
            passwordHistoryArray.pop();
        }
        
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        // Clear existing history display except for the heading
        while (passwordHistory.children.length > 1) {
            passwordHistory.removeChild(passwordHistory.lastChild);
        }
        
        // Add each password from history
        passwordHistoryArray.forEach((password, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const passwordEl = document.createElement('span');
            passwordEl.className = 'history-password';
            passwordEl.textContent = password;
            historyItem.appendChild(passwordEl);
            
            const actions = document.createElement('div');
            actions.className = 'history-actions';
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'history-copy';
            copyBtn.innerHTML = `
                <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(password)
                    .then(() => {
                        showToast('Password copied to clipboard!');
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                    });
            });
            
            actions.appendChild(copyBtn);
            historyItem.appendChild(actions);
            
            passwordHistory.appendChild(historyItem);
        });
    }
    
    function showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = '#333';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '1000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);
        
        // Hide and remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Generate a password on initial load
    generatePassword();
});