# Système de Gestion des Présences - Université d'Alger

## Description
Système web de gestion des présences étudiants avec 3 rôles : Étudiant, Professeur, Administrateur.

## Fonctionnalités Implémentées

### 🔐 Connexion
- Page de login avec sélection de rôle
- Validation des champs en JavaScript
- Redirection automatique selon le rôle

### 🎓 Espace ÉTUDIANT
- Tableau de présence de toute la classe
- Visualisation des sessions (S1 à S6) et participations (P1 à P6)
- Calcul automatique des absences et participations
- Messages de statut ("Bon présence", "Attention", "Exclu")
- Barre de recherche des étudiants
- Surlignage des excellents étudiants

### 👨‍🏫 Espace PROFESSEUR 
- Tableau modifiable des présences (cliquer pour ✓)
- Calcul automatique en temps réel
- Formulaire intégré d'ajout d'étudiants
- Création de nouvelles sessions
- Bouton "Show Report" avec statistiques
- Recherche et tri des étudiants
- Couleurs selon absences (vert/jaune/rouge)

### ⚙️ Espace ADMINISTRATEUR
- Tableau de bord avec statistiques
- Gestion complète des étudiants (ajouter/modifier/supprimer)
- Tableau avancé avec filtres et pagination
- Visualisation des étudiants récents

## Base de Données
- MySQL avec table `attendance_sessions`
- 3 sessions de test incluses (AWP, DBMS, SE)
- Connexion PHP configurée

## Technologies
- Frontend : HTML5, CSS3, JavaScript, jQuery
- Backend : PHP
- Base de données : MySQL
- Design : Mobile First Responsive