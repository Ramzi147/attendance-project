// Gestion de l'interface administrateur
document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    loadRecentStudents();
    loadAllStudentsTable();
    setupModalHandlers();
    setupAdminSearch();
});

function loadAdminData() {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    if (userData) {
        document.getElementById('adminName').textContent = userData.first_name + ' ' + userData.last_name;
    }
}

function loadRecentStudents() {
    let students = getAllStudents();
    
    const studentsList = document.getElementById('recentStudentsList');
    let html = '';

    // Prendre les 5 derniers étudiants
    const recentStudents = students.slice(-5);

    recentStudents.forEach(student => {
        html += `
            <div class="student-item">
                <div class="student-info">
                    <span class="student-id">${student.id}</span>
                    <span class="student-name">${student.first_name} ${student.last_name}</span>
                    <span class="student-email">${student.email}</span>
                </div>
            </div>
        `;
    });

    studentsList.innerHTML = html;
    document.getElementById('totalStudents').textContent = students.length;
}

function loadAllStudentsTable() {
    const students = getAllStudents();
    const tableBody = document.getElementById('studentsTable');
    let html = '';

    students.forEach(student => {
        const attendanceRate = Math.round(((6 - student.absences) / 6) * 100);
        const statusClass = attendanceRate >= 80 ? 'status-good' : 
                           attendanceRate >= 60 ? 'status-warning' : 'status-danger';
        const statusText = attendanceRate >= 80 ? 'Bon' : 
                          attendanceRate >= 60 ? 'Moyen' : 'Faible';

        html += `
            <tr>
                <td>${student.id}</td>
                <td>${student.first_name} ${student.last_name}</td>
                <td>${student.email}</td>
                <td>Informatique</td>
                <td>${student.group || 'AWP-G1'}</td>
                <td>
                    <div class="attendance-progress">
                        <span>${attendanceRate}%</span>
                        <div class="progress-bar">
                            <div style="width: ${attendanceRate}%"></div>
                        </div>
                    </div>
                </td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn-small" onclick="editStudent('${student.id}')">✏️</button>
                    <button class="btn-small btn-danger" onclick="deleteStudent('${student.id}')">🗑️</button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
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

function setupModalHandlers() {
    // Gestion du formulaire d'ajout d'étudiant
    document.getElementById('addStudentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewStudent();
    });
}

// Barre de recherche admin
function setupAdminSearch() {
    const searchInput = document.getElementById('studentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterAdminStudents(searchTerm);
        });
    }
}

function filterAdminStudents(searchTerm) {
    const rows = document.querySelectorAll('#studentsTable tr');
    
    rows.forEach(row => {
        const studentName = row.cells[1].textContent.toLowerCase();
        const studentId = row.cells[0].textContent.toLowerCase();
        const studentEmail = row.cells[2].textContent.toLowerCase();
        
        if (studentName.includes(searchTerm) || studentId.includes(searchTerm) || studentEmail.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function showAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('addStudentModal').style.display = 'none';
    document.getElementById('addStudentForm').reset();
}

// Fonction pour ajouter un nouvel étudiant
function addNewStudent() {
    const studentId = document.getElementById('newMatricule').value;
    const lastName = document.getElementById('newLastName').value;
    const firstName = document.getElementById('newFirstName').value;
    const email = document.getElementById('newEmail').value;
    const group = document.getElementById('newGroup').value;

    // Validation simple
    if (!studentId || !lastName || !firstName || !email) {
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
    localStorage.setItem('all_students', JSON.stringify(students));

    // Recharger les tableaux
    loadRecentStudents();
    loadAllStudentsTable();
    
    // Notifier le changement
    notifyDataChange();
    
    // Fermer le modal et afficher un message
    closeModal();
    alert('Étudiant ajouté avec succès !');
}

// Fonction pour supprimer un étudiant
function deleteStudent(studentId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
        return;
    }

    const students = getAllStudents();
    const updatedStudents = students.filter(student => student.id !== studentId);
    
    localStorage.setItem('all_students', JSON.stringify(updatedStudents));
    
    // Recharger les tableaux
    loadRecentStudents();
    loadAllStudentsTable();
    
    // Notifier le changement
    notifyDataChange();
    
    alert('Étudiant supprimé avec succès !');
}

function editStudent(studentId) {
    alert(`Édition de l'étudiant ${studentId} - Cette fonctionnalité sera implémentée prochainement`);
}

function importStudents() {
    alert('Fonctionnalité d\'import Excel à implémenter');
}

function exportStudents() {
    alert('Fonctionnalité d\'export Excel à implémenter');
}

// Fonction pour notifier les autres onglets des changements
function notifyDataChange() {
    // Sauvegarder un timestamp de modification
    localStorage.setItem('last_data_update', Date.now());
}

// Fonction de déconnexion
function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('user_data');
        window.location.href = '../index.html';
    }
}
