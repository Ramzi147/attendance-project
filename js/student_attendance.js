// Gestion de la page de présence étudiant
document.addEventListener('DOMContentLoaded', function() {
    loadStudentData();
    setupSearch();
    setupJustificationForm();
});

function loadStudentData() {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    if (userData) {
        document.getElementById('studentName').textContent = userData.first_name + ' ' + userData.last_name;
    }
}

// Barre de recherche
function setupSearch() {
    const searchInput = document.getElementById('sessionSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterSessions(searchTerm);
        });
    }
}

function filterSessions(searchTerm) {
    const rows = document.querySelectorAll('.session-row');
    
    rows.forEach(row => {
        const date = row.cells[0].textContent.toLowerCase();
        const course = row.cells[1].textContent.toLowerCase();
        const subject = row.cells[2].textContent.toLowerCase();
        
        if (date.includes(searchTerm) || course.includes(searchTerm) || subject.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function clearSearch() {
    const searchInput = document.getElementById('sessionSearch');
    searchInput.value = '';
    filterSessions('');
}

// Justification
function justifyAbsence(sessionId) {
    const select = document.getElementById('sessionSelect');
    select.value = sessionId;
    document.getElementById('justificationText').focus();
}

function setupJustificationForm() {
    const form = document.getElementById('justificationForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitJustification();
    });
}

function submitJustification() {
    const sessionSelect = document.getElementById('sessionSelect');
    const justificationType = document.getElementById('justificationType');
    const justificationText = document.getElementById('justificationText');
    
    if (!sessionSelect.value || !justificationType.value || !justificationText.value) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    alert('Justification soumise avec succès !');
    form.reset();
}

// Déconnexion
function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('user_data');
        window.location.href = '../index.html';
    }
}