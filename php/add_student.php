
<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Validation des données
$student_id = $_POST['student_id'] ?? '';
$name = $_POST['name'] ?? '';
$group = $_POST['group'] ?? '';

$errors = [];

if (empty($student_id)) {
    $errors[] = 'ID étudiant est requis';
}

if (empty($name)) {
    $errors[] = 'Le nom est requis';
}

if (empty($group)) {
    $errors[] = 'Le groupe est requis';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Erreurs de validation', 'errors' => $errors]);
    exit;
}

// Charger les étudiants existants
$students_file = DATA_DIR . 'students.json';
$students = [];

if (file_exists($students_file)) {
    $existing_data = file_get_contents($students_file);
    $students = json_decode($existing_data, true) ?: [];
}

// Vérifier si l'ID existe déjà
foreach ($students as $student) {
    if ($student['student_id'] == $student_id) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'ID étudiant déjà existant']);
        exit;
    }
}

// Ajouter le nouvel étudiant
$new_student = [
    'student_id' => $student_id,
    'name' => $name,
    'group' => $group,
    'created_at' => date('Y-m-d H:i:s')
];

$students[] = $new_student;

// Sauvegarder dans le fichier
if (file_put_contents($students_file, json_encode($students, JSON_PRETTY_PRINT))) {
    echo json_encode([
        'success' => true, 
        'message' => 'Étudiant ajouté avec succès',
        'student' => $new_student
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la sauvegarde']);
}
?>