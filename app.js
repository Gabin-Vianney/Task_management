const todoList = document.querySelector(".todo_list");
const completedTasks = [];
const todoContainer = document.querySelector(".todo_container");
let draggedTask = null;
todoList.addEventListener("dragstart", (e) => {
  draggedTask = e.target;
  e.target.style.opacity = "0.5";
});
todoList.addEventListener("dragend", (e) => {
  e.target.style.opacity = "1";
});
todoList.addEventListener("dragover", (e) => {
  e.preventDefault();
});
todoList.addEventListener("dragenter", (e) => {
  e.target.style.backgroundColor = "lightblue";
});
todoList.addEventListener("dragleave", (e) => {
  e.target.style.backgroundColor = "";
});
todoList.addEventListener("drop", (e) => {
  e.target.style.backgroundColor = "";

  if (draggedTask && draggedTask.parentNode === todoList) {
    todoList.insertBefore(draggedTask, e.target);
    saveTasksToLocalStorage();
  }
});

todoList.addEventListener("click", (e) => {
  saveTasksToLocalStorage();
  checkLateTasks();
});


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

        // Ajoutez la classe "late-time" pour le style et le ciblage
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

// Fonction qui permet d'éditer une tâche
function editTask(taskItem) {
  const taskText = taskItem.innerText.split(" - ")[0];
  const taskDatetime = taskItem.getAttribute("data-datetime");
  const editTaskForm = document.createElement("div");
  editTaskForm.innerHTML = `
    <input type="text" id="edit-task-name" value="${taskText}">
    <input type="datetime-local" id="edit-task-datetime" value="${taskDatetime}">
    <button id="save-edit-btn">Sauvegarder</button>
    <button id="cancel-edit-btn">Annuler</button>
  `;
  taskItem.innerHTML = "";
  taskItem.appendChild(editTaskForm);
  const saveEditBtn = document.getElementById("save-edit-btn");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  saveEditBtn.addEventListener("click", () => {
    const editedTaskText = document.getElementById("edit-task-name").value;
    const editedTaskDatetime = document.getElementById("edit-task-datetime").value;
    const wasLate = taskItem.classList.contains("late");
    taskItem.innerHTML = `${editedTaskText} - ${formatDatetime(editedTaskDatetime)}`;
    taskItem.setAttribute("data-datetime", editedTaskDatetime);
    if (wasLate && taskItem.classList.contains("completed")) {
      const editedTaskDatetimeObj = new Date(editedTaskDatetime);
      const currentDatetime = new Date();
      const lateBanner = taskItem.querySelector(".late-banner");
      if (editedTaskDatetimeObj > currentDatetime) {
        taskItem.classList.remove("new-task-late");
        // taskItem.classList.add("new-task-future");
        //taskItem.style.backgroundColor = "lightgreen";
        taskItem.classList.remove("late");
        if (lateBanner) {
          lateBanner.remove();
        }
      }

    }

    saveTasksToLocalStorage();
    checkLateTasks();
  });

  cancelEditBtn.addEventListener("click", () => {
    taskItem.innerHTML = `${taskText} - ${formatDatetime(taskDatetime)}`;
    taskItem.setAttribute("data-datetime", taskDatetime);
    checkLateTasks();
  });
  saveTasksToLocalStorage();
  checkLateTasks();
}

// Fonction pour créer le boutton edit pour modifier une tâche
function createEditButton() {
  const editButton = document.createElement("button");
  editButton.innerHTML = '<i class="fas fa-pen"></i>';
  editButton.classList.add("edit-btn");
  return editButton;
}
// Au chargement de la page, on récupère les tâches depuis le localStorage
document.addEventListener("DOMContentLoaded", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((savedTask) => {
    createTask(savedTask.name, savedTask.datetime, savedTask.completed);
  });

  displayCompletedTasks();


  saveTasksToLocalStorage(); // Assurez-vous d'appeler la sauvegarde ici
});
// Fonction pour afficher les tâches marquées comme terminées
function displayCompletedTasks() {
  const savedCompletedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
  savedCompletedTasks.forEach((savedTask) => {
    const task = document.querySelector(`.todo_item[data-datetime="${savedTask.datetime}"]`);
    if (task && task.classList.contains("completed")) {
      task.parentElement.classList.add("completed");
    }
     
  });
  saveTasksToLocalStorage();
}


// Fonction pour créer une tâche
function createTask(name, datetime, completed = false) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  const newTodo = document.createElement("li");
  newTodo.classList.add("todo_item");
  newTodo.innerHTML = `${name} - ${formatDatetime(datetime)}`; // Ajoutez les espaces avec &nbsp;
  todoDiv.setAttribute("draggable", "true");
  newTodo.setAttribute("data-datetime", datetime);
  if (completed) {
    newTodo.classList.add("completed");
    completedTasks.push(todoDiv); // Ajout de l'élément parent (todoDiv)  
    completedTasks.push(newTodo); // Ajout de l'élément parent au tableau completedTasks
    saveTasksToLocalStorage();
  }
  // Creation du button check
  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete_btn");
  todoDiv.appendChild(completedButton);

  // Creation du button delete
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.classList.add("delete_btn");
  todoDiv.appendChild(deleteButton);
  // Creation du button edit
  const editButton = createEditButton(); // Utilisez votre fonction pour créer le bouton d'édition
  todoDiv.appendChild(editButton);
  editButton.addEventListener("click", () => editTask(newTodo));
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
  const allTodoDiv = document.querySelector(".all_todo");
  allTodoDiv.style.display = "flex";
  todoDiv.appendChild(newTodo); // Ajoutez newTodo à todoDiv
  todoList.appendChild(todoDiv); // Ajoutez todoDiv à todoList

  taskNameInput.value = "";
  saveTasksToLocalStorage();
  checkLateTasks();
}
// Fonction pour sauvegarder les taches dans le localStorage
function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll(".todo_list li").forEach((taskItem) => {
    tasks.push({
      name: taskItem.innerText.split(" - ")[0],
      datetime: taskItem.getAttribute("data-datetime"),
      completed: taskItem.classList.contains("completed"), // Ajouter le statut complet

    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Sauvegarder les tâches terminées séparément
  document.querySelectorAll(".todo_list li").forEach((taskItem) => {
    completedTasks.push({
      name: taskItem.innerText.split(" - ")[0],
      datetime: taskItem.getAttribute("data-datetime"),
      completed: taskItem.classList.contains("completed"), // Ajouter le statut complet
    });
  });
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));



}




todoList.addEventListener("click", deleteCheck);
function deleteCheck(e) {
  const item = e.target;
  if (item.classList.contains("delete_btn")) {
    const todo = item.parentElement;
    todo.classList.add('fall');
    todo.addEventListener('transitionend', function () {
      if (todo.classList.contains('completed')) {
        const index = completedTasks.indexOf(todo.querySelector('.todo_item'));
        if (index !== -1) {
          completedTasks.splice(index, 1);
          saveTasksToLocalStorage(); // Sauvegarder après la suppression de la tâche terminée
        }
      }
      todo.remove();
      AllTodoVisibility();
      saveTasksToLocalStorage();
    });
  } else if (item.classList.contains("complete_btn")) {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    const todoItem = todo.querySelector('.todo_item');
    if (todo.classList.contains("completed")) {
      completedTasks.push(todoItem);
    } else {
      const index = completedTasks.indexOf(todoItem);
      if (index !== -1) {
        completedTasks.splice(index, 1);
      }
    }
    saveTasksToLocalStorage();
    checkLateTasks();
  }
}

// Fonction qui permet d'afficher le conteneur de toutes les tâches créées
function AllTodoVisibility() {
  const tasks = document.querySelectorAll(".todo_list li");
  // Sélection du conteneur all_todo
  const allTodoDiv = document.querySelector(".all_todo");
  if (tasks.length === 0) {
    // S'il n'y a plus de tâches, on supprime le conteneur all_todo
    allTodoDiv.style.display = 'none';
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
    const hours = Math.floor((timeDiffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiffInMilliseconds % (1000 * 60)) / 1000);
    const lateTimeElement = lateBanner.querySelector(".late-time");
    if (lateTimeElement) {
      lateTimeElement.textContent = ` Avec retard de ${days} jours:${hours} heures:${minutes}minutes:${seconds} seconds`;
    }
  });
}
updateLateTime();
setInterval(updateLateTime, 1000);
