document.addEventListener('DOMContentLoaded', function() {
    initializeSessionForm();
    setDefaultDate();
});

function initializeSessionForm() {
    const form = document.getElementById('sessionForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        createNewSession();
    });
}

function setDefaultDate() {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    const timeString = now.toTimeString().slice(0, 5);
    
    document.getElementById('sessionDate').value = dateString;
    document.getElementById('sessionTime').value = timeString;
    
    updatePreview();
}

function updatePreview() {
    document.getElementById('previewCourse').textContent = 
        document.getElementById('courseSelect').value || '-';
    document.getElementById('previewGroup').textContent = 
        document.getElementById('groupSelect').value || '-';
    document.getElementById('previewDate').textContent = 
        document.getElementById('sessionDate').value || '-';
    document.getElementById('previewTime').textContent = 
        document.getElementById('sessionTime').value || '-';
    document.getElementById('previewTopic').textContent = 
        document.getElementById('sessionTopic').value || '-';
}

function createNewSession() {
    const course = document.getElementById('courseSelect').value;
    const group = document.getElementById('groupSelect').value;
    const date = document.getElementById('sessionDate').value;
    const time = document.getElementById('sessionTime').value;
    const topic = document.getElementById('sessionTopic').value;
    
    if (!course || !group || !date || !time) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Simulation de création de session
    const sessionData = {
        course,
        group,
        date,
        time,
        topic,
        timestamp: new Date().toISOString()
    };
    
    // Sauvegarder dans localStorage
    let sessions = JSON.parse(localStorage.getItem('professor_sessions')) || [];
    sessions.push(sessionData);
    localStorage.setItem('professor_sessions', JSON.stringify(sessions));
    
    alert('Session créée avec succès ! Redirection vers la prise de présence...');
    
    // Redirection vers la page d'accueil professor
    setTimeout(() => {
        window.location.href = 'professor_home.html';
    }, 1500);
}

function goBack() {
    window.location.href = 'professor_home.html';
}

function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('user_data');
        window.location.href = '../index.html';
    }
}