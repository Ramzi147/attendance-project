// Gestion de l'interface professeur
document.addEventListener('DOMContentLoaded', function() {
    loadProfessorData();
    loadAttendanceTable();
    setupEventHandlers();
    setupSearch();
    setupIntegratedForm();
});

function loadProfessorData() {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    if (userData) {
        document.getElementById('professorName').textContent = userData.first_name + ' ' + userData.last_name;
    }
}

function loadAttendanceTable() {
    // Récupérer tous les étudiants (y compris ceux qui se sont connectés)
    let students = getAllStudents();
    
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
                <td class="editable" data-student="${student.id}" data-session="1">${student.sessions[0] || ''}</td>
                <td class="editable" data-student="${student.id}" data-participation="1">${student.participations[0] || ''}</td>
                <td class="editable" data-student="${student.id}" data-session="2">${student.sessions[1] || ''}</td>
                <td class="editable" data-student="${student.id}" data-participation="2">${student.participations[1] || ''}</td>
                <td class="editable" data-student="${student.id}" data-session="3">${student.sessions[2] || ''}</td>
                <td class="editable" data-student="${student.id}" data-participation="3">${student.participations[2] || ''}</td>
                <td class="editable" data-student="${student.id}" data-session="4">${student.sessions[3] || ''}</td>
                <td class="editable" data-student="${student.id}" data-participation="4">${student.participations[3] || ''}</td>
                <td class="editable" data-student="${student.id}" data-session="5">${student.sessions[4] || ''}</td>
                <td class="editable" data-student="${student.id}" data-participation="5">${student.participations[4] || ''}</td>
                <td class="editable" data-student="${student.id}" data-session="6">${student.sessions[5] || ''}</td>
                <td class="editable" data-student="${student.id}" data-participation="6">${student.participations[5] || ''}</td>
                <td>${student.absences}</td>
                <td>${student.participation}</td>
                <td>${message}</td>
                <td>
                    <button class="btn btn-danger btn-small" onclick="deleteStudent('${student.id}')">🗑️</button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
    updateCalculations();
}

// Fonction pour récupérer tous les étudiants
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

// Fonction pour sauvegarder tous les étudiants
function saveAllStudents(students) {
    localStorage.setItem('all_students', JSON.stringify(students));
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

// Gestion des clics sur les cellules modifiables
function setupEventHandlers() {
    // Gestion des clics sur les cellules modifiables
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('editable')) {
            const cell = e.target;
            const currentValue = cell.textContent.trim();
            const newValue = currentValue === '✓' ? '' : '✓';
            
            cell.textContent = newValue;
            updateCalculations();
        }
    });

    // Show report
    document.getElementById('showReport').addEventListener('click', function() {
        showReport();
    });

    // Highlight excellent students
    document.getElementById('highlightExcellent').addEventListener('click', function() {
        highlightExcellentStudents();
    });

    // Reset colors
    document.getElementById('resetColors').addEventListener('click', function() {
        resetColors();
    });
}

// Barre de recherche pour professeur
function setupSearch() {
    const searchInput = document.getElementById('studentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterStudents(searchTerm);
        });
    }
}

function filterStudents(searchTerm) {
    const rows = document.querySelectorAll('#professorAttendanceTable tbody tr');
    
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

function clearSearch() {
    const searchInput = document.getElementById('studentSearch');
    searchInput.value = '';
    filterStudents('');
}

// Fonction pour scroller vers le formulaire
function scrollToForm() {
    document.querySelector('.add-student-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Gestion du formulaire intégré
function setupIntegratedForm() {
    const form = document.getElementById('addStudentForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addStudentFromIntegratedForm();
        });
    }
}

function addStudentFromIntegratedForm() {
    const studentId = document.getElementById('newStudentId').value;
    const lastName = document.getElementById('newStudentLastName').value;
    const firstName = document.getElementById('newStudentFirstName').value;
    const email = document.getElementById('newStudentEmail').value;
    const group = document.getElementById('newStudentGroup').value;

    // Validation simple
    if (!studentId || !lastName || !firstName || !email || !group) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    const students = getAllStudents();

    // Vérifier si l'ID existe déjà
    const studentExists = students.some(student => student.id === studentId);
    if (studentExists) {
        alert('Un étudiant avec cet ID existe déjà');
        return;
    }

    // Ajouter le nouvel étudiant
    const newStudent = {
        id: studentId,
        last_name: lastName,
        first_name: firstName,
        email: email,
        group: group,
        sessions: ['','','','','',''],
        participations: ['','','','','',''],
        absences: 6,
        participation: 0
    };

    students.push(newStudent);
    saveAllStudents(students);

    // Recharger le tableau
    loadAttendanceTable();
    
    // Notifier le changement
    notifyDataChange();
    
    // Réinitialiser le formulaire
    document.getElementById('addStudentForm').reset();
    
    // Message de succès
    alert('Étudiant ajouté avec succès !');
}

// Fonction pour highlight les excellents étudiants (ceux avec le plus de participation)
function highlightExcellentStudents() {
    const rows = document.querySelectorAll('#professorAttendanceTable tbody tr');
    
    // Trouver le nombre maximum de participations
    let maxParticipation = 0;
    rows.forEach(row => {
        const participation = parseInt(row.getAttribute('data-participation'));
        if (participation > maxParticipation) {
            maxParticipation = participation;
        }
    });
    
    // Highlight les étudiants avec le maximum de participations
    rows.forEach(row => {
        const participation = parseInt(row.getAttribute('data-participation'));
        if (participation === maxParticipation && maxParticipation > 0) {
            row.style.backgroundColor = '#d4edda';
            row.style.border = '2px solid #27ae60';
            row.style.fontWeight = 'bold';
        }
    });
}

// Fonction pour reset les couleurs
function resetColors() {
    const rows = document.querySelectorAll('#professorAttendanceTable tbody tr');
    rows.forEach(row => {
        row.style.backgroundColor = '';
        row.style.border = '';
        row.style.fontWeight = '';
    });
    // Réappliquer les couleurs normales
    updateCalculations();
}

// Fonction pour supprimer un étudiant
function deleteStudent(studentId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
        return;
    }

    const students = getAllStudents();
    const updatedStudents = students.filter(student => student.id !== studentId);
    
    saveAllStudents(updatedStudents);
    loadAttendanceTable();
    
    // Notifier le changement
    notifyDataChange();
    
    alert('Étudiant supprimé avec succès !');
}

function updateCalculations() {
    const rows = document.querySelectorAll('#professorAttendanceTable tbody tr');
    const students = getAllStudents();
    
    rows.forEach(row => {
        const studentId = row.cells[0].textContent;
        let absences = 0;
        let participation = 0;
        
        // Compter les absences et participations
        for (let i = 3; i <= 13; i += 2) { // Colonnes sessions
            if (row.cells[i].textContent.trim() === '') {
                absences++;
            }
        }
        
        for (let i = 4; i <= 14; i += 2) { // Colonnes participations
            if (row.cells[i].textContent.trim() === '✓') {
                participation++;
            }
        }
        
        // Mettre à jour les données
        row.setAttribute('data-absences', absences);
        row.setAttribute('data-participation', participation);
        row.cells[15].textContent = absences;
        row.cells[16].textContent = participation;
        row.cells[17].textContent = getStudentMessage(absences, participation);
        
        // Mettre à jour la classe de couleur
        row.className = getRowClass(absences);
        
        // Mettre à jour les données dans le localStorage
        const studentIndex = students.findIndex(student => student.id === studentId);
        if (studentIndex !== -1) {
            // Mettre à jour les sessions et participations
            for (let i = 0; i < 6; i++) {
                students[studentIndex].sessions[i] = row.cells[3 + (i * 2)].textContent.trim();
                students[studentIndex].participations[i] = row.cells[4 + (i * 2)].textContent.trim();
            }
            students[studentIndex].absences = absences;
            students[studentIndex].participation = participation;
        }
    });
    
    // Sauvegarder les modifications
    saveAllStudents(students);
    
    // Notifier le changement
    notifyDataChange();
}

function showReport() {
    const rows = document.querySelectorAll('#professorAttendanceTable tbody tr');
    let totalStudents = rows.length;
    let presentStudents = 0;
    let participatingStudents = 0;
    
    rows.forEach(row => {
        const absences = parseInt(row.getAttribute('data-absences'));
        const participation = parseInt(row.getAttribute('data-participation'));
        
        if (absences < 3) {
            presentStudents++;
        }
        
        if (participation >= 3) {
            participatingStudents++;
        }
    });
    
    const presentPercentage = Math.round((presentStudents / totalStudents) * 100);
    const participationPercentage = Math.round((participatingStudents / totalStudents) * 100);
    
    const reportContent = `
        <div class="report-stats">
            <div class="stat-item">
                <h4>Total Étudiants</h4>
                <span class="stat-number">${totalStudents}</span>
            </div>
            <div class="stat-item">
                <h4>Bonnes Présences</h4>
                <span class="stat-number">${presentStudents}</span>
            </div>
            <div class="stat-item">
                <h4>Bonnes Participations</h4>
                <span class="stat-number">${participatingStudents}</span>
            </div>
        </div>
    `;
    
    document.getElementById('reportContent').innerHTML = reportContent;
    document.getElementById('reportSection').style.display = 'block';
    
    // Mettre à jour les graphiques
    updateCharts(presentPercentage, participationPercentage);
}

function updateCharts(presentPercent, participationPercent) {
    const presentBar = document.querySelector('.present .bar-fill');
    const participationBar = document.querySelector('.participation .bar-fill');
    
    if (presentBar) {
        presentBar.style.height = presentPercent + '%';
    }
    if (participationBar) {
        participationBar.style.height = participationPercent + '%';
    }
    
    // Mettre à jour les tooltips
    const presentElement = document.querySelector('.present');
    const participationElement = document.querySelector('.participation');
    
    if (presentElement) {
        presentElement.setAttribute('data-tooltip', `Présents: ${Math.round(presentPercent)}%`);
    }
    if (participationElement) {
        participationElement.setAttribute('data-tooltip', `Participation: ${Math.round(participationPercent)}%`);
    }
}

// Fonction pour notifier les autres onglets des changements
function notifyDataChange() {
    // Sauvegarder un timestamp de modification
    localStorage.setItem('last_data_update', Date.now());
}

function createNewSession() {
    window.location.href = 'professor_session.html';
}

function viewAttendance() {
    window.location.href = 'professor_attendance.html';
}

// Fonction de déconnexion
function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('user_data');
        window.location.href = '../index.html';
    }
}