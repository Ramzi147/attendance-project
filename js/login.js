let selectedRole = '';

// Vérifier si l'utilisateur est déjà connecté
window.addEventListener('load', function() {
    const userData = localStorage.getItem('user_data');
    if (userData) {
        const user = JSON.parse(userData);
        redirectToDashboard(user.role);
    }
});

function showLoginForm(role) {
    selectedRole = role;
    
    // Masquer la sélection de rôle et afficher le formulaire
    document.querySelector('.role-selection').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('userRole').value = role;
    
    // Mettre à jour le titre du formulaire
    const titles = {
        'student': 'Connexion Étudiant',
        'professor': 'Connexion Professeur', 
        'admin': 'Connexion Administrateur'
    };
    document.getElementById('formTitle').textContent = titles[role];
    
    // Mettre à jour les placeholders
    updatePlaceholders(role);
}

function updatePlaceholders(role) {
    const idField = document.getElementById('user_id');
    
    switch(role) {
        case 'student':
            idField.placeholder = 'Ex: 2025001';
            break;
        case 'professor':
            idField.placeholder = 'Ex: PROF123';
            break;
        case 'admin':
            idField.placeholder = 'Ex: ADMIN001';
            break;
    }
}

function goBackToRoleSelection() {
    document.getElementById('loginForm').style.display = 'none';
    document.querySelector('.role-selection').style.display = 'block';
    selectedRole = '';
    document.getElementById('loginForm').reset();
    hideMessage();
}

function hideMessage() {
    document.getElementById('loginMessage').style.display = 'none';
}

// Gestion du formulaire
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        user_id: document.getElementById('user_id').value,
        last_name: document.getElementById('last_name').value,
        first_name: document.getElementById('first_name').value,
        email: document.getElementById('email').value,
        role: document.getElementById('userRole').value
    };
    
    // Validation basique
    if (!formData.user_id || !formData.last_name || !formData.first_name || !formData.email) {
        showMessage('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    // Simuler la connexion (toujours réussie)
    simulateLogin(formData);
});

function simulateLogin(userData) {
    // Afficher le loading
    const submitBtn = document.querySelector('.btn-login');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="spinner"></div> Connexion...';
    submitBtn.disabled = true;
    
    // Simuler un délai de connexion
    setTimeout(function() {
        // Stocker les données utilisateur
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        showMessage('Connexion réussie! Redirection...', 'success');
        
        // Redirection vers la page appropriée
        setTimeout(function() {
            redirectToDashboard(userData.role);
        }, 1000);
        
    }, 1500);
}

function redirectToDashboard(role) {
    switch(role) {
        case 'student':
            window.location.href = 'student/student_home.html';
            break;
        case 'professor':
            window.location.href = 'professor/professor_home.html';
            break;
        case 'admin':
            window.location.href = 'admin/admin_home.html';
            break;
    }
}

function showMessage(message, type) {
    const messageElement = document.getElementById('loginMessage');
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    messageElement.style.display = 'block';
}

// Fonction de déconnexion accessible globalement
function logout() {
    localStorage.removeItem('user_data');
    window.location.href = '../index.html';
}

// Ajouter le style pour le spinner
const style = document.createElement('style');
style.textContent = `
    .spinner {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);