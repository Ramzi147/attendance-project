// Gestion de l'interface étudiant
document.addEventListener('DOMContentLoaded', function() {
    loadStudentData();
    loadAttendanceTable();
    setupEventHandlers();
    setupDataListener();
    setupStudentSearch();
});

function loadStudentData() {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    if (userData) {
        document.getElementById('studentName').textContent = userData.first_name + ' ' + userData.last_name;
        document.getElementById('studentMatricule').textContent = userData.user_id;
    }
}

function loadAttendanceTable() {
    // Utiliser les mêmes données que le professeur
    const students = getAllStudents();
    
    const tableBody = document.getElementById('attendanceTableBody');
    let html = '';

    students.forEach(student => {
        const message = getStudentMessage(student.absences, student.participation);
        const rowClass = getRowClass(student.absences);
        
        html += `
            <tr class="${rowClass}" data-absences="${student.absences}" data-participation="${student.participation}">
                <td>${student.id}</td>
                <td>${student.last_name}</td>
                <td>${student.first_name}</td>
                <td>${student.sessions[0] || ''}</td><td>${student.participations[0] || ''}</td>
                <td>${student.sessions[1] || ''}</td><td>${student.participations[1] || ''}</td>
                <td>${student.sessions[2] || ''}</td><td>${student.participations[2] || ''}</td>
                <td>${student.sessions[3] || ''}</td><td>${student.participations[3] || ''}</td>
                <td>${student.sessions[4] || ''}</td><td>${student.participations[4] || ''}</td>
                <td>${student.sessions[5] || ''}</td><td>${student.participations[5] || ''}</td>
                <td>${student.absences}</td>
                <td>${student.participation}</td>
                <td>${message}</td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

// Barre de recherche pour étudiant
function setupStudentSearch() {
    const searchInput = document.getElementById('studentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterStudentTable(searchTerm);
        });
    }
}

function filterStudentTable(searchTerm) {
    const rows = document.querySelectorAll('#studentAttendanceTable tbody tr');
    
    rows.forEach(row => {
        const studentName = row.cells[1].textContent.toLowerCase() + ' ' + row.cells[2].textContent.toLowerCase();
        const studentId = row.cells[0].textContent.toLowerCase();
        
        if (studentName.includes(searchTerm) || studentId.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Utiliser la même fonction que le professeur pour récupérer les étudiants
function getAllStudents() {
    let students = JSON.parse(localStorage.getItem('all_students')) || [];
    
    // Ajouter les étudiants qui se sont connectés mais ne sont pas dans la liste
    const connectedStudents = JSON.parse(localStorage.getItem('connected_students')) || [];
    
    connectedStudents.forEach(connectedStudent => {
        const exists = students.some(student => student.id === connectedStudent.user_id);
        if (!exists) {
            students.push({
                id: connectedStudent.user_id,
                last_name: connectedStudent.last_name,
                first_name: connectedStudent.first_name,
                email: connectedStudent.email,
                sessions: ['','','','','',''],
                participations: ['','','','','',''],
                absences: 6,
                participation: 0
            });
        }
    });

    // Données par défaut si aucun étudiant n'existe
    if (students.length === 0) {
        students = [
            {
                id: '101',
                last_name: 'Ahmed',
                first_name: 'Sara',
                email: 'sara@univ-alger.dz',
                sessions: ['✓','✓','✓','','✓',''],
                participations: ['✓','✓','','','✓',''],
                absences: 2,
                participation: 4
            },
            {
                id: '102', 
                last_name: 'Yacine',
                first_name: 'Ali',
                email: 'ali@univ-alger.dz',
                sessions: ['✓','','✓','✓','✓','✓'],
                participations: ['✓','✓','✓','✓','','✓'],
                absences: 1,
                participation: 5
            },
            {
                id: '103',
                last_name: 'Houcine',
                first_name: 'Rania', 
                email: 'rania@univ-alger.dz',
                sessions: ['✓','','','✓','',''],
                participations: ['✓','','','✓','',''],
                absences: 4,
                participation: 2
            }
        ];
    }

    return students;
}

function getStudentMessage(absences, participation) {
    if (absences < 3) {
        if (participation >= 4) {
            return 'Bon présence - Excellente participation';
        } else {
            return 'Bon présence - Participation moyenne';
        }
    } else if (absences >= 3 && absences <= 4) {
        return 'Attention - présence faible';
    } else {
        return 'Exclu - trop d\'absences';
    }
}

function getRowClass(absences) {
    if (absences < 3) return 'status-good';
    if (absences >= 3 && absences <= 4) return 'status-warning';
    return 'status-danger';
}

function setupEventHandlers() {
    // Highlight excellent students
    document.getElementById('highlightExcellent').addEventListener('click', function() {
        $('#studentAttendanceTable tbody tr').each(function() {
            const absences = $(this).data('absences');
            if (absences < 3) {
                $(this).animate({
                    backgroundColor: '#d4edda'
                }, 1000)
                .animate({
                    backgroundColor: '#ffffff'
                }, 1000);
            }
        });
    });

    // Reset colors
    document.getElementById('resetColors').addEventListener('click', function() {
        $('#studentAttendanceTable tbody tr').css('background-color', '');
        applyRowColors();
    });
}

function applyRowColors() {
    const rows = document.querySelectorAll('#studentAttendanceTable tbody tr');
    rows.forEach(row => {
        const absences = parseInt(row.getAttribute('data-absences'));
        row.className = getRowClass(absences);
    });
}

// Écouter les changements de données
function setupDataListener() {
    window.addEventListener('storage', function(e) {
        if (e.key === 'last_data_update') {
            // Recharger le tableau quand les données changent
            loadAttendanceTable();
        }
    });
    
    // Vérifier périodiquement les changements
    setInterval(function() {
        const lastUpdate = localStorage.getItem('last_data_update');
        if (lastUpdate && lastUpdate !== window.lastKnownUpdate) {
            window.lastKnownUpdate = lastUpdate;
            loadAttendanceTable();
        }
    }, 1000);
}

// Fonction de déconnexion
function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('user_data');
        window.location.href = '../index.html';
    }
}
// Barre de recherche pour étudiant
function setupStudentSearch() {
    const searchInput = document.getElementById('studentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterStudentTable(searchTerm);
        });
    }
}

function filterStudentTable(searchTerm) {
    const rows = document.querySelectorAll('#studentAttendanceTable tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const studentName = row.cells[1].textContent.toLowerCase() + ' ' + row.cells[2].textContent.toLowerCase();
        const studentId = row.cells[0].textContent.toLowerCase();
        
        if (studentName.includes(searchTerm) || studentId.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
}

function clearSearch() {
    const searchInput = document.getElementById('studentSearch');
    searchInput.value = '';
    filterStudentTable('');
}

// Ajouter au DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    loadStudentData();
    loadAttendanceTable();
    setupEventHandlers();
    setupDataListener();
    setupStudentSearch(); // ← AJOUTER CETTE LIGNE
});