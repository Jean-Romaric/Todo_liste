// =============================
// RÉCUPÉRER LES ÉLÉMENTS HTML
// =============================

const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");


// =============================
// RÉCUPÉRER LES TÂCHES
// =============================

// On récupère les tâches enregistrées
// Si aucune tâche n'existe, on utilise un tableau vide
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// =============================
// AFFICHER LES TÂCHES
// =============================

function displayTasks() {

    // On vide la liste HTML
    taskList.innerHTML = "";

    // On parcourt toutes les tâches
    tasks.forEach(function (task, index) {

        // Création d'un <li>
        const li = document.createElement("li");

        li.classList.add("task");

        // Texte de la tâche
        const span = document.createElement("span");

        span.textContent = task;

        // Bouton supprimer
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Supprimer";

        deleteButton.classList.add("delete-button");

        // Quand on clique sur supprimer
        deleteButton.addEventListener("click", function () {

            // Supprime la tâche du tableau
            tasks.splice(index, 1);

            // Enregistre le nouveau tableau
            localStorage.setItem("tasks", JSON.stringify(tasks));

            // Réaffiche les tâches
            displayTasks();
        });

        // On ajoute le texte dans le <li>
        li.appendChild(span);

        // On ajoute le bouton dans le <li>
        li.appendChild(deleteButton);

        // On ajoute le <li> dans la liste
        taskList.appendChild(li);
    });
}


// =============================
// AJOUTER UNE TÂCHE
// =============================

addButton.addEventListener("click", function () {

    // Récupérer le texte
    const taskText = taskInput.value.trim();

    // Vérifier si le champ est vide
    if (taskText === "") {

        alert("Écris une tâche !");

        return;
    }

    // Ajouter la tâche au tableau
    tasks.push(taskText);

    // Sauvegarder dans localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Vider le champ
    taskInput.value = "";

    // Réafficher les tâches
    displayTasks();
});


// =============================
// AFFICHAGE INITIAL
// =============================

// Afficher les tâches déjà enregistrées
displayTasks();