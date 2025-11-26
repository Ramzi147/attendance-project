document.addEventListener('DOMContentLoaded', function() {
    loadSessionsHistory();
    setupFilters();
});

function loadSessionsHistory() {
    const sessions = JSON.parse(localStorage.getItem('professor_sessions')) || [];
    
    // Mettre à jour les statistiques
    document.getElementById('totalSessions').textContent = sessions.length;
    
    // Ici vous pouvez charger les données réelles depuis localStorage
}

function setupFilters() {
    const filters = document.querySelectorAll('.filter-select');
    filters.forEach(filter => {
        filter.addEventListener('change', filterSessions);
    });
}

function filterSessions() {
    // Implémentation du filtrage des sessions
    console.log('Filtrage des sessions...');
}

function viewSessionDetails(sessionId) {
    alert(`Détails de la session ${sessionId} - Cette fonctionnalité sera implémentée prochainement`);
}

function exportSession(sessionId) {
    alert(`Export de la session ${sessionId} - Cette fonctionnalité sera implémentée prochainement`);
}

function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('user_data');
        window.location.href = '../index.html';
    }
}