<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Vérifier si la présence a déjà été prise aujourd'hui
$today = date('Y-m-d');
$attendance_file = DATA_DIR . "attendance_{$today}.json";

if (file_exists($attendance_file)) {
    echo json_encode(['success' => false, 'message' => 'La présence pour aujourd\'hui a déjà été prise.']);
    exit;
}

// Charger les étudiants
$students_file = DATA_DIR . 'students.json';
if (!file_exists($students_file)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Aucun étudiant trouvé']);
    exit;
}

$students_data = file_get_contents($students_file);
$students = json_decode($students_data, true);

if (empty($students)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Aucun étudiant à traiter']);
    exit;
}

// Préparer les données de présence
$attendance_data = [
    'date' => $today,
    'created_at' => date('Y-m-d H:i:s'),
    'records' => []
];

foreach ($students as $student) {
    $student_id = $student['student_id'];
    $status = isset($_POST["attendance_{$student_id}"]) ? 'present' : 'absent';
    
    $attendance_data['records'][] = [
        'student_id' => $student_id,
        'name' => $student['name'],
        'status' => $status
    ];
}

// Sauvegarder la présence
if (file_put_contents($attendance_file, json_encode($attendance_data, JSON_PRETTY_PRINT))) {
    echo json_encode([
        'success' => true, 
        'message' => 'Prise de présence enregistrée avec succès',
        'date' => $today,
        'total_students' => count($students)
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'enregistrement']);
}
?>