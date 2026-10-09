// =============================
// RÉCUPÉRER LES ÉLÉMENTS HTML
// =============================

const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskLists = document.querySelectorAll(".task-list");

// =============================
// RÉCUPÉRER LES TÂCHES
// =============================

const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Les anciennes tâches étaient enregistrées comme du texte.
// On les transforme en tâches avec un texte et une colonne.
let tasks = savedTasks.map(function (task) {
    if (typeof task === "string") {
        return { text: task, status: "todo" };
    }

    const validStatuses = ["todo", "doing", "done"];
    const status = validStatuses.includes(task.status) ? task.status : "todo";

    return { text: task.text, status: status };
});

// =============================
// AFFICHER LES TÂCHES
// =============================

function displayTasks() {
    taskLists.forEach(function (taskList) {
        taskList.innerHTML = "";

        const status = taskList.dataset.status;

        tasks.forEach(function (task, index) {
            if (task.status !== status) {
                return;
            }

            const li = document.createElement("li");
            li.classList.add("task");
            li.draggable = true;

            li.addEventListener("dragstart", function (event) {
                event.dataTransfer.setData("text/plain", index);
                event.dataTransfer.effectAllowed = "move";
            });

            const span = document.createElement("span");
            span.textContent = task.text;
            span.classList.add("task-text");

            const actions = document.createElement("div");
            actions.classList.add("task-actions");

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Modifier";
            editButton.classList.add("edit-button");

            editButton.addEventListener("click", function () {
                const editInput = document.createElement("input");
                editInput.type = "text";
                editInput.value = task.text;
                editInput.setAttribute("aria-label", "Modifier la tâche");
                editInput.classList.add("edit-input");

                const saveButton = document.createElement("button");
                saveButton.type = "button";
                saveButton.textContent = "Enregistrer";
                saveButton.classList.add("save-button");

                const cancelButton = document.createElement("button");
                cancelButton.type = "button";
                cancelButton.textContent = "Annuler";
                cancelButton.classList.add("cancel-button");

                function saveTask() {
                    const updatedTask = editInput.value.trim();

                    if (updatedTask === "") {
                        alert("La tâche ne peut pas être vide !");
                        editInput.focus();
                        return;
                    }

                    task.text = updatedTask;
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    displayTasks();
                }

                saveButton.addEventListener("click", saveTask);
                cancelButton.addEventListener("click", displayTasks);

                li.replaceChild(editInput, span);
                actions.replaceChildren(saveButton, cancelButton);
                editInput.focus();
                editInput.select();
            });

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Supprimer";
            deleteButton.classList.add("delete-button");

            deleteButton.addEventListener("click", function () {
                tasks.splice(index, 1);
                localStorage.setItem("tasks", JSON.stringify(tasks));
                displayTasks();
            });

            li.appendChild(span);
            actions.appendChild(editButton);
            actions.appendChild(deleteButton);
            li.appendChild(actions);
            taskList.appendChild(li);
        });
    });
}

// =============================
// GLISSER UNE TÂCHE VERS UNE AUTRE COLONNE
// =============================

taskLists.forEach(function (taskList) {
    taskList.addEventListener("dragover", function (event) {
        event.preventDefault();
    });

    taskList.addEventListener("drop", function (event) {
        event.preventDefault();

        const draggedIndex = event.dataTransfer.getData("text/plain");
        const taskIndex = Number(draggedIndex);
        const task = tasks[taskIndex];

        if (draggedIndex === "" || !Number.isInteger(taskIndex) || !task) {
            return;
        }

        task.status = taskList.dataset.status;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks();
    });
});

// =============================
// AJOUTER UNE TÂCHE
// =============================

addButton.addEventListener("click", function () {

    const taskText = taskInput.value.trim();

    if (taskText === "") {

        alert("Écris une tâche !");

        return;
    }

    tasks.push({ text: taskText, status: "todo" });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";
    taskInput.focus();
    displayTasks();
});


// =============================
// AFFICHAGE INITIAL
// =============================
displayTasks();