// Login System
let currentUser = null;
let authToken = null;

// API Base URL
const API_BASE = 'http://localhost:3000';

// Check if user is already logged in
function checkAuth() {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        showMainApp();
        document.getElementById('welcomeUser').textContent = `Welcome back, ${currentUser.name}!`;
        // Load user's API keys and history
        loadUserData();
    }
}

// Show main app and hide login
function showMainApp() {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
}

// Show login and hide main app
function showLogin() {
    document.getElementById('loginOverlay').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

// Load user data (API keys, history)
async function loadUserData() {
    if (!authToken) return;
    
    try {
        // Load API keys
        const apiResponse = await fetch(`${API_BASE}/api-keys`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (apiResponse.ok) {
            const { apiKeys } = await apiResponse.json();
            if (apiKeys.gemini) document.getElementById('geminiKey').value = apiKeys.gemini;
            if (apiKeys.anthropic) document.getElementById('anthropicKey').value = apiKeys.anthropic;
            if (apiKeys.openai) document.getElementById('openaiKey').value = apiKeys.openai;
            if (apiKeys.other) document.getElementById('otherKey').value = apiKeys.other;
        }
    } catch (error) {
        console.warn('Could not load user data:', error);
    }
}

// Tab switching
document.getElementById('loginTab').addEventListener('click', () => {
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('registerTab').classList.remove('active');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
});

document.getElementById('registerTab').addEventListener('click', () => {
    document.getElementById('registerTab').classList.add('active');
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginBtn = document.getElementById('loginBtnText');
    
    // Show loading
    loginBtn.innerHTML = '<div class="loading"></div> Signing in...';
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            authToken = data.token;
            
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                localStorage.setItem('authToken', authToken);
            }
            
            showMainApp();
            document.getElementById('welcomeUser').textContent = `Welcome, ${currentUser.name}!`;
            loadUserData();
            
            // Reset form
            document.getElementById('loginForm').reset();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Network error. Please try again.');
    } finally {
        loginBtn.textContent = 'Sign In';
    }
});

// Register form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerBtn = document.getElementById('registerBtnText');
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Show loading
    registerBtn.innerHTML = '<div class="loading"></div> Creating account...';
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            authToken = data.token;
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('authToken', authToken);
            
            showMainApp();
            document.getElementById('welcomeUser').textContent = `Welcome, ${currentUser.name}!`;
            
            // Reset form
            document.getElementById('registerForm').reset();
        } else {
            const errorMsg = data.errors ? data.errors.map(e => e.msg).join(', ') : data.error;
            alert(errorMsg || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Network error. Please try again.');
    } finally {
        registerBtn.textContent = 'Sign Up';
    }
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', async () => {
    if (authToken) {
        try {
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
        } catch (error) {
            console.warn('Logout request failed:', error);
        }
    }
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    currentUser = null;
    authToken = null;
    showLogin();
});

// Social login buttons (placeholder functionality)
document.querySelector('.google-btn').addEventListener('click', () => {
    alert('Google login integration coming soon!');
});

document.querySelector('.github-btn').addEventListener('click', () => {
    alert('GitHub login integration coming soon!');
});

// File upload handling
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = `<div class="file-info">📄 ${file.name}</div>`;
        }
    }
});

// Solve doubt function
async function solveDoubt() {
    const fileInput = document.getElementById('fileInput');
    const subjectInput = document.getElementById('subjectInput');
    const solutionDiv = document.getElementById('solutionDiv');
    const solutionOutput = document.getElementById('solutionOutput');
    const btnText = document.getElementById('btnText');
    const solveBtn = document.getElementById('solveBtn');
    
    if (!fileInput.files[0]) {
        alert('Please upload a file first!');
        return;
    }
    
    // Show loading state
    solveBtn.disabled = true;
    btnText.innerHTML = '<div class="loading"></div> Processing...';
    solutionDiv.style.display = 'block';
    solutionOutput.innerHTML = 'Analyzing your question...';
    
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('subject', subjectInput.value || 'general');
    
    // Get API keys from form (will be merged with saved keys on backend)
    const apiKeys = {
        gemini: document.getElementById('geminiKey').value,
        anthropic: document.getElementById('anthropicKey').value,
        openai: document.getElementById('openaiKey').value,
        other: document.getElementById('otherKey').value
    };
    
    formData.append('apiKeys', JSON.stringify(apiKeys));
    
    try {
        const headers = {};
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        console.log('Making request to:', `${API_BASE}/solve`);
        console.log('Headers:', headers);
        console.log('API Keys:', Object.keys(apiKeys).filter(k => apiKeys[k]));
        
        const response = await fetch(`${API_BASE}/solve`, {
            method: 'POST',
            headers,
            body: formData
        });
        
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response result:', result);
        
        if (response.ok && result.solution) {
            const formattedSolution = formatSolution(result.solution, result.provider);
            solutionOutput.innerHTML = formattedSolution;
            
            // Refresh history if user is logged in
            if (authToken) {
                setTimeout(() => renderHistory(), 1000);
            }
        } else {
            solutionOutput.innerHTML = result.error || 'Sorry, I couldn\'t process your question. Please try again.';
        }
    } catch (error) {
        console.error('Error:', error);
        solutionOutput.innerHTML = 'Error connecting to server. Please make sure the backend is running.';
    } finally {
        solveBtn.disabled = false;
        btnText.textContent = 'Get Solution';
    }
}

// Format AI solution into organized sections
function formatSolution(solution, provider) {
    let formattedHTML = '';
    
    // Split solution into paragraphs and sections
    const paragraphs = solution.split('\n').filter(p => p.trim());
    
    // Check if solution looks like it has steps or structured content
    const hasSteps = solution.includes('Step') || solution.includes('1.') || solution.includes('2.') || solution.includes('First') || solution.includes('Next');
    const hasFinalAnswer = solution.toLowerCase().includes('answer') || solution.toLowerCase().includes('result') || solution.toLowerCase().includes('solution');
    
    formattedHTML += '<div class="solution-header">🎯 Solution Analysis</div>';
    formattedHTML += '<div class="solution-content">';
    
    let currentSection = '';
    let stepCounter = 0;
    let inSteps = false;
    let finalAnswer = '';
    let explanation = '';
    let summary = '';
    
    paragraphs.forEach((paragraph, index) => {
        const lowerPara = paragraph.toLowerCase().trim();
        
        // Detect final answer section
        if (lowerPara.includes('final answer') || lowerPara.includes('the answer is') || 
            lowerPara.includes('therefore') || lowerPara.includes('result is') ||
            (lowerPara.includes('answer:') && index > paragraphs.length / 2)) {
            finalAnswer = paragraph.replace(/^(.*?answer[^:]*:?\s*)/i, '').trim();
        }
        // Detect steps
        else if (lowerPara.match(/^(step\s*\d+|^\d+\.|\bfirst\b|\bnext\b|\bthen\b)/)) {
            if (!inSteps) {
                inSteps = true;
                if (currentSection) {
                    formattedHTML += `<div class="solution-explanation">
                        <div class="solution-explanation-title">Understanding the Problem</div>
                        ${currentSection}
                    </div>`;
                    currentSection = '';
                }
                formattedHTML += '<div class="solution-steps">';
            }
            stepCounter++;
            formattedHTML += `<div class="solution-step">${paragraph}</div>`;
        }
        // Regular explanation content
        else {
            if (inSteps) {
                formattedHTML += '</div>'; // Close steps
                inSteps = false;
            }
            
            if (index < paragraphs.length / 3) {
                // Early content - likely explanation
                currentSection += `<p style="margin-bottom: 12px; line-height: 1.7;">${paragraph}</p>`;
            } else if (!finalAnswer && index > paragraphs.length * 0.7) {
                // Late content without explicit final answer - might be summary
                summary += `<p style="margin-bottom: 12px; line-height: 1.7;">${paragraph}</p>`;
            } else {
                // Middle content - likely detailed explanation
                explanation += `<p style="margin-bottom: 12px; line-height: 1.7;">${paragraph}</p>`;
            }
        }
    });
    
    // Close steps if still open
    if (inSteps) {
        formattedHTML += '</div>';
    }
    
    // Add remaining content sections
    if (currentSection) {
        formattedHTML += `<div class="solution-explanation">
            <div class="solution-explanation-title">Understanding the Problem</div>
            ${currentSection}
        </div>`;
    }
    
    if (explanation) {
        formattedHTML += `<div class="solution-section">
            ${explanation}
        </div>`;
    }
    
    // Add final answer if found
    if (finalAnswer) {
        // Extract mathematical expressions
        const mathMatch = finalAnswer.match(/[\d\+\-\*\/\^\(\)\s\=]+|[a-zA-Z]\s*=\s*[\d\+\-\*\/\^\(\)\s]+/);
        if (mathMatch) {
            formattedHTML += `<div class="solution-final-answer">
                <div class="solution-final-answer-title">📋 Final Answer</div>
                <div class="solution-math">${mathMatch[0]}</div>
            </div>`;
        } else {
            formattedHTML += `<div class="solution-final-answer">
                <div class="solution-final-answer-title">📋 Final Answer</div>
                ${finalAnswer}
            </div>`;
        }
    }
    
    // Add summary if available
    if (summary) {
        formattedHTML += `<div class="solution-summary">
            <div class="solution-summary-title">Key Takeaways</div>
            ${summary}
        </div>`;
    }
    
    // Add provider info
    if (provider) {
        formattedHTML += `<div style="text-align: center; margin-top: 20px; padding: 12px; background: rgba(99, 102, 241, 0.1); border-radius: 8px;">
            <small style="color: #6366f1; font-weight: 500;">🤖 Powered by ${provider.charAt(0).toUpperCase() + provider.slice(1)} AI</small>
        </div>`;
    }
    
    formattedHTML += '</div>'; // Close solution-content
    
    return formattedHTML;
}

// History management
function addToHistory(filename, subject, solution) {
    let history = JSON.parse(localStorage.getItem('doubtHistory') || '[]');
    history.unshift({ 
        filename, 
        subject, 
        solution, 
        time: new Date().toLocaleString() 
    });
    
    // Keep only last 20 entries
    if (history.length > 20) {
        history = history.slice(0, 20);
    }
    
    localStorage.setItem('doubtHistory', JSON.stringify(history));
}

// Sidebar toggle logic
const apiConfigPanel = document.getElementById('apiConfigPanel');
const historyPanel = document.getElementById('historyPanel');
const toggleApiConfig = document.getElementById('toggleApiConfig');
const toggleHistory = document.getElementById('toggleHistory');
const closeApiConfig = document.getElementById('closeApiConfig');
const closeHistory = document.getElementById('closeHistory');

function showPanel(panel) {
    panel.style.display = 'flex';
}

function hidePanel(panel) {
    panel.style.display = 'none';
}

toggleApiConfig.addEventListener('click', () => {
    showPanel(apiConfigPanel);
    hidePanel(historyPanel);
});

toggleHistory.addEventListener('click', () => {
    showPanel(historyPanel);
    hidePanel(apiConfigPanel);
    renderHistory();
});

closeApiConfig.addEventListener('click', async () => {
    // Save API keys to backend if user is logged in
    if (authToken) {
        const keys = {
            gemini: document.getElementById('geminiKey').value,
            anthropic: document.getElementById('anthropicKey').value,
            openai: document.getElementById('openaiKey').value,
            other: document.getElementById('otherKey').value
        };
        
        try {
            const response = await fetch(`${API_BASE}/api-keys`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ apiKeys: keys })
            });
            
            if (response.ok) {
                // Also save to localStorage as backup
                localStorage.setItem('apiKeys', JSON.stringify(keys));
            }
        } catch (error) {
            console.warn('Could not save API keys to server:', error);
            // Fallback to localStorage
            localStorage.setItem('apiKeys', JSON.stringify(keys));
        }
    } else {
        // Save to localStorage if not logged in
        const keys = {
            gemini: document.getElementById('geminiKey').value,
            anthropic: document.getElementById('anthropicKey').value,
            openai: document.getElementById('openaiKey').value,
            other: document.getElementById('otherKey').value
        };
        localStorage.setItem('apiKeys', JSON.stringify(keys));
    }
    
    hidePanel(apiConfigPanel);
});

closeHistory.addEventListener('click', () => hidePanel(historyPanel));

// History rendering logic
async function renderHistory() {
    const container = document.getElementById('doubtHistory');
    
    if (!container) return;
    
    // If user is logged in, fetch from backend
    if (authToken) {
        try {
            const response = await fetch(`${API_BASE}/history`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            if (response.ok) {
                const { doubts } = await response.json();
                
                if (doubts.length === 0) {
                    container.innerHTML = '<p style="color: #a0aec0; text-align: center; padding: 20px;">No past doubts found</p>';
                    return;
                }
                
                container.innerHTML = '';
                doubts.forEach((item) => {
                    const div = document.createElement('div');
                    div.className = 'lux-solution-output';
                    div.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <strong style="color: #2d3748;">${item.filename || 'Unknown file'}</strong>
                            <small style="color: #a0aec0;">${new Date(item.created_at).toLocaleDateString()}</small>
                        </div>
                        <div style="margin-bottom: 8px;"><strong>Subject:</strong> ${item.subject}</div>
                        <div><strong>Solution:</strong> ${item.solution}</div>
                        ${item.provider_used ? `<div style="margin-top: 8px;"><small style="color: #718096;">Powered by ${item.provider_used}</small></div>` : ''}
                    `;
                    container.appendChild(div);
                });
            } else {
                throw new Error('Failed to fetch history');
            }
        } catch (error) {
            console.warn('Could not fetch history from server, falling back to localStorage:', error);
            renderLocalHistory();
        }
    } else {
        renderLocalHistory();
    }
}

// Fallback to localStorage history
function renderLocalHistory() {
    const history = JSON.parse(localStorage.getItem('doubtHistory') || '[]');
    const container = document.getElementById('doubtHistory');
    
    if (!container) return;
    
    if (history.length === 0) {
        container.innerHTML = '<p style="color: #a0aec0; text-align: center; padding: 20px;">No past doubts found</p>';
        return;
    }
    
    container.innerHTML = '';
    history.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'lux-solution-output';
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <strong style="color: #2d3748;">${item.filename}</strong>
                <small style="color: #a0aec0;">${item.time}</small>
            </div>
            <div style="margin-bottom: 8px;"><strong>Subject:</strong> ${item.subject}</div>
            <div><strong>Solution:</strong> ${item.solution}</div>
        `;
        container.appendChild(div);
    });
}

// Load saved API keys on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication first
    checkAuth();
    
    const savedKeys = JSON.parse(localStorage.getItem('apiKeys') || '{}');
    
    // Pre-populate with saved keys or default test key
    if (savedKeys.gemini) {
        document.getElementById('geminiKey').value = savedKeys.gemini;
    } else {
        // Set default Gemini API key for testing
        document.getElementById('geminiKey').value = 'AIzaSyA3_LeDwQten5frQcahGtySIBpdKUGouR4';
    }
    
    if (savedKeys.anthropic) document.getElementById('anthropicKey').value = savedKeys.anthropic;
    if (savedKeys.openai) document.getElementById('openaiKey').value = savedKeys.openai;
    if (savedKeys.other) document.getElementById('otherKey').value = savedKeys.other;
    
    // Add fade-in animation to card
    setTimeout(() => {
        const card = document.querySelector('.lux-card');
        if (card) card.classList.add('fade-in');
    }, 100);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        solveDoubt();
    }
    if (e.key === 'Escape') {
        hidePanel(apiConfigPanel);
        hidePanel(historyPanel);
    }
});