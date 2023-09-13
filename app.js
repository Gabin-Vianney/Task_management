const todoList = document.querySelector(".todo_list");
const AllTodo = document.querySelector(".all_todo");
const todoContainer = document.querySelector(".todo_container");
const todos = document.querySelectorAll(".todo");
let draggedTodo = null;

todos.forEach((todo) => {
  todo.addEventListener("dragstart", () => {
    draggedTodo = todo;
    setTimeout(() => {
      todo.style.display = "none";
    }, 0);
  });

  todo.addEventListener("dragend", () => {
    setTimeout(() => {
      todo.style.display = "";
      draggedTodo = null;
    }, 0);
  });
});

todos.forEach((todo) => {
  todo.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  todo.addEventListener("dragenter", (e) => {
    e.preventDefault();
    todo.style.backgroundColor = "lightgray";
  });

  todo.addEventListener("dragleave", () => {
    todo.style.backgroundColor = "";
  });

  todo.addEventListener("drop", () => {
    todo.style.backgroundColor = "";
    if (draggedTodo) {
      // Insérer le div glissé avant le div cible
      const container = todo.parentNode;
      container.insertBefore(draggedTodo, todo);
    }
  });
});

const clearAllButton = document.querySelector(".clear-btn");
clearAllButton.addEventListener("click", () => {
  const tasks = document.querySelectorAll(".todo");
  tasks.forEach((task) => {
    task.remove();
  });

  localStorage.removeItem("tasks");
  localStorage.removeItem("completedTasks");
});

const showPendingTasksButton = document.querySelector("#pending");
showPendingTasksButton.addEventListener("click", showPendingTasks);
function showPendingTasks() {
  const tasks = todoList.querySelectorAll(".todo");

  tasks.forEach((task) => {
    const checkbox = task.querySelector(".complete_btn");
    if (!checkbox.checked) {
      task.style.display = "flex"; // on  affiche la tâche si la case à cocher n'est pas cochée
    } else {
      task.style.display = "none"; // on masque la tâche sinon
    }
  });

  saveTasksToLocalStorage();
  checkLateTasks();
}

const showCompletedTasksButton = document.querySelector("#completed");
showCompletedTasksButton.addEventListener("click", showCompletedTasks);
function showCompletedTasks() {
  const tasks = todoList.querySelectorAll(".todo");

  tasks.forEach((task) => {
    const checkbox = task.querySelector(".complete_btn");
    if (checkbox.checked) {
      task.style.display = "flex"; // on  affiche la tâche si la case à cocher n'est pas cochée
    } else {
      task.style.display = "none"; // on masque la tâche sinon
    }
  });

  saveTasksToLocalStorage();
  checkLateTasks();
}

const showAllTasksButton = document.querySelector("#all");
showAllTasksButton.addEventListener("click", showAllTasks);
function showAllTasks() {
  const tasks = todoList.querySelectorAll(".todo");

  tasks.forEach((task) => {
    const checkbox = task.querySelector(".complete_btn");
    if (!checkbox.checked || checkbox.checked) {
      task.style.display = "flex"; // on affiche la tâche si la case à cocher n'est pas cochée
    }
  });

  saveTasksToLocalStorage();
  checkLateTasks();
}

const taskNameInput = document.querySelector(".todo_input");
const taskDatetimeInput = document.getElementById("task-datetime");
const addTaskBtn = document.querySelector(".todo_button");
addTaskBtn.addEventListener("click", (e) => {
  const taskName = taskNameInput.value.trim();
  const taskDatetime = taskDatetimeInput.value;
  e.preventDefault(); // Empêche le rechargement de la page par défaut
  if (taskName && taskDatetime) {
    createTask(taskName, taskDatetime);
    taskNameInput.value = "";
    taskDatetimeInput.value = "";
    saveTasksToLocalStorage();
    checkLateTasks();
  }
});

// Fonction qui permet de donner le format de la date avec l'heure
function formatDatetime(datetime) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(datetime).toLocaleString("fr", options);
}

setInterval(checkLateTasks, 1000);

// Fonction qui permet de signaler une tâche en retard
function checkLateTasks() {
  const now = new Date();
  const tasks = document.querySelectorAll(".todo_list li");
  tasks.forEach((task) => {
    const taskDatetimeString = task.getAttribute("data-datetime");
    const taskDatetime = new Date(taskDatetimeString);
    if (!task.classList.contains("completed") && taskDatetime < now) {
      task.classList.add("late");
      task.classList.remove("new-task-future");
      task.classList.add("new-task-late");
      calculateTimeDifference(now, taskDatetime);
      const lateBanner = task.querySelector(".late-banner");
      if (!lateBanner) {
        const newLateBanner = document.createElement("span");
        newLateBanner.classList.add("late-banner");

        // Ajout de la classe "late-time" pour le style et le ciblage
        const lateTimeSpan = document.createElement("span");
        lateTimeSpan.classList.add("late-time");

        newLateBanner.appendChild(lateTimeSpan);
        task.appendChild(newLateBanner);
      }
    } else {
      task.classList.remove("late");
    }
  });
}

function editTask(taskItem) {
  if (taskItem.tagName === "LI") {
    const taskText = taskItem.innerText.split(" - ")[0];
    const taskDatetime = taskItem.getAttribute("data-datetime");

    const editTaskForm = document.createElement("div");
    editTaskForm.classList.add("todo_item");
    editTaskForm.innerHTML = `
        <input type="text" id="edit-task-name" value="${taskText}">
        <input type="datetime-local" id="edit-task-datetime" value="${taskDatetime}">
        <button id="save-edit-btn">Enregistrer</button>
    `;

    taskItem.innerHTML = "";
    taskItem.appendChild(editTaskForm);

    const saveEditBtn = document.getElementById("save-edit-btn");

    saveEditBtn.addEventListener("click", () => {
      const editedTaskText = document.getElementById("edit-task-name").value;
      const editedTaskDatetime =
        document.getElementById("edit-task-datetime").value;

      taskItem.innerHTML = `${editedTaskText} - ${formatDatetime(
        editedTaskDatetime
      )}`;
      taskItem.setAttribute("data-datetime", editedTaskDatetime);
      saveTasksToLocalStorage();
      checkLateTasks();
    });
  }
}
// Fonction pour créer le boutton edit pour modifier une tâche
function createEditButton() {
  const editButton = document.createElement("button");
  editButton.innerHTML = '<i class="fas fa-pen"></i> <span>Editer</span>';
  editButton.classList.add("edit-btn");
  return editButton;
}

// Au chargement de la page, on récupère les tâches depuis le localStorage
document.addEventListener("DOMContentLoaded", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((savedTask) => {
    createTask(savedTask.name, savedTask.datetime, savedTask.completed);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // Chargement des tâches terminées depuis le stockage local
  const savedCompletedTasks =
    JSON.parse(localStorage.getItem("completedTasks")) || [];
  savedCompletedTasks.forEach((savedTask) => {
    createTask(savedTask.name, savedTask.datetime, savedTask.completed);
  });
});

// Fonction pour créer une tâche
function createTask(name, datetime, completed = false) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  const newTodo = document.createElement("li");
  newTodo.classList.add("todo_item");
  newTodo.innerHTML = `${name} - ${formatDatetime(datetime)}`;
  todoDiv.setAttribute("draggable", "true");
  newTodo.setAttribute("data-datetime", datetime);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button_container");

  // Création du bouton de case à cocher
  const completedButton = document.createElement("input");
  completedButton.type = "checkbox";
  completedButton.classList.add("complete_btn");

  // Définition de  l'état de la case à cocher en fonction de la valeur "completed"
  completedButton.checked = completed;

  // Ajout d'un gestionnaire d'événements pour le changement d'état de la case à cocher
  completedButton.addEventListener("change", function () {
    if (completedButton.checked) {
      // Application des styles appropriés si la tâche est cochée
      newTodo.style.textDecoration = "line-through";
      newTodo.style.opacity = "0.6";
    } else {
      // Suppression des styles si la tâche n'est pas cochée
      newTodo.style.textDecoration = "none";
      newTodo.style.opacity = "1";
    }

    // Enregistrement de  l'état de la case à cocher dans le stockage local
    saveCheckboxState(datetime, completedButton.checked);
    saveTasksToLocalStorage();
    checkLateTasks();
  });

  // Restauration de  l'état de la case à cocher depuis le stockage local au chargement de la page
  const checkboxState = loadCheckboxState(datetime);
  completedButton.checked = checkboxState;
  buttonContainer.appendChild(completedButton);
  // Creation du button delete
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fas fa-trash"></i><span>Supprimer</span>';
  deleteButton.classList.add("delete_btn");
  buttonContainer.appendChild(deleteButton);
  // Creation du button edit
  const editButton = createEditButton();
  buttonContainer.appendChild(editButton);
  editButton.addEventListener("click", () => {
    editTask(newTodo);

  });
  const currentDatetime = new Date();
  if (
    new Date(datetime) < currentDatetime &&
    !newTodo.classList.contains("completed")
  ) {
    // Désactivation  du  bouton de suppression
    deleteButton.disabled = true;

    // Ajout d'une classe pour le style différent
    newTodo.classList.add("new-task-late");
    newTodo.style.backgroundColor = " lightcoral";
  } else if (new Date(datetime) > currentDatetime) {
    // Ajout  d'une classe pour le style différent des nouvelles tâches
    newTodo.classList.add("new-task-future");
  }

  // Ajout de todoDiv à la liste de tâches
  todoDiv.appendChild(buttonContainer);
  todoDiv.appendChild(newTodo);
  todoList.appendChild(todoDiv);

  taskNameInput.value = "";
  saveTasksToLocalStorage();
  checkLateTasks();
}

// Fonction pour sauvegarder l'état de la case à cocher dans le stockage local
function saveCheckboxState(datetime, isChecked) {
  // Récupération des  états de la case à cocher existants dans le stockage local
  const checkboxStates =
    JSON.parse(localStorage.getItem("checkboxStates")) || {};

  // Enregistrement de  l'état actuel de la case à cocher
  checkboxStates[datetime] = isChecked;

  // Enregistrement des états de la case à cocher mis à jour dans le stockage local
  localStorage.setItem("checkboxStates", JSON.stringify(checkboxStates));
}

// Fonction pour charger l'état de la case à cocher depuis le stockage local
function loadCheckboxState(datetime) {
  // Récupération des états de la case à cocher depuis le stockage local
  const checkboxStates =
    JSON.parse(localStorage.getItem("checkboxStates")) || {};

  // Récupération de  l'état de la case à cocher pour la tâche spécifique
  return checkboxStates[datetime] || false;
}

// Fonction pour sauvegarder les taches dans le localStorage
function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll(".todo_list li").forEach((taskItem) => {
    tasks.push({
      name: taskItem.innerText.split(" - ")[0],
      datetime: taskItem.getAttribute("data-datetime"),
      completed: false,
    });
  });

  // Sauvegarde des tâches cochées
  const completedTasks = [];
  document
    .querySelectorAll(".todo_item[data-completed='true']")
    .forEach((completedTaskItem) => {
      completedTasks.push({
        name: completedTaskItem.innerText.split(" - ")[0],
        datetime: completedTaskItem.getAttribute("data-datetime"),
        completed: true, // Marqué comme terminée
      });
    });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks)); // Sauvegarde les tâches cochées
}

todoList.addEventListener("click", deleteCheck);
function deleteCheck(e) {
  const item = e.target;
  if (item.classList.contains("delete_btn")) {
    const todo = item.parentElement.parentElement;
    todo.classList.add("fall");
    todo.addEventListener("transitionend", function () {
      todo.remove();
      saveTasksToLocalStorage();
    });
  } else if (item.classList.contains("complete_btn")) {
    const todo = item.parentElement.parentElement;
    todo.classList.toggle("completed");
    saveTasksToLocalStorage();
    checkLateTasks();
  }
}

function calculateTimeDifference(start, end) {
  const diffInMilliseconds = Math.abs(end - start);
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  return `${diffInMinutes} min`;
}

// Fonction pour mettre à jour le temps de retard
function updateLateTime() {
  const lateBanners = document.querySelectorAll(".late-banner");
  const now = new Date();
  lateBanners.forEach((lateBanner) => {
    const task = lateBanner.parentElement;
    const taskDatetimeString = task.getAttribute("data-datetime");
    const taskDatetime = new Date(taskDatetimeString);
    const timeDiffInMilliseconds = now - taskDatetime;
    const days = Math.floor(timeDiffInMilliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDiffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDiffInMilliseconds % (1000 * 60)) / 1000);
    const lateTimeElement = lateBanner.querySelector(".late-time");
    if (lateTimeElement) {
      lateTimeElement.textContent = ` Avec retard de ${days}jrs:${hours} h:${minutes}min:${seconds} s`;
    }
  });
}
updateLateTime();
setInterval(updateLateTime, 1000);

const Images = [
  {
    id: 1,
    img: "./images/task1.jpg",
  },
  {
    id: 2,
    img: "./images/task2.jpg",
  },
  {
    id: 3,
    img: "./images/task3.jpg",
  },
  {
    id: 4,
    img: "./images/task4.jpg",
  },
  {
    id: 5,
    img: "./images/task5.jpg",
  },
  {
    id: 6,
    img: "./images/task6.jpg",
  },
  {
    id: 7,
    img: "./images/task7.jpg",
  },
];

// Sélection de  l'élément img dans le DOM en utilisant son ID
const imgElement = document.querySelector(".myImgId");
let currentImageIndex = 0;

// FONCTION POUR METTRE A JOUR L'IMAGE
function updateImage() {
  imgElement.src = Images[currentImageIndex].img;
}

// FONCTION POUR PASSER A L'IMAGE SUIVANTE
function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % Images.length;
  updateImage();
}

// Définition de  l'intervalle pour changer automatiquement l'image toutes les 3 secondes.
const interval = setInterval(nextImage, 4000);

// Nettoyage de l'intervalle lorsqu'on n'en a plus besoin.
function cleanupInterval() {
  clearInterval(interval);
}

// Utilisation de l'équivalent de useEffect pour gérer le nettoyage
window.addEventListener("beforeunload", cleanupInterval);

// Initialisation de l'image affichée au démarrage.
updateImage();
