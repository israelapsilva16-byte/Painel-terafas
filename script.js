function loadTasks() {

    try {

        const stored = localStorage.getItem("taskflow_tasks");

        const parsed = stored ? JSON.parse(stored) : [];


        let needsResave = false;

        const fixed = parsed.map(task => {

            if (!task.id) {

                needsResave = true;

                return { ...task, id: generateId() };

            }

            return task;

        });

        if (needsResave) {

            localStorage.setItem(
                "taskflow_tasks",
                JSON.stringify(fixed)
            );

        }

        return fixed;

    } catch (error) {

        console.error("Não foi possível ler as tarefas salvas:", error);

        return [];

    }

}


let tasks = loadTasks();

let currentFilter = "all";

let editingId = null;

let draggedId = null;

let lastFocusedElement = null;

 

function saveTasks() {

    try {

        localStorage.setItem(
            "taskflow_tasks",
            JSON.stringify(tasks)
        );

    } catch (error) {

        console.error("Não foi possível salvar as tarefas:", error);

        alert("Não foi possível salvar as alterações. O armazenamento local pode estar cheio ou desativado.");

    }

}


function generateId() {

    if (window.crypto && crypto.randomUUID) {

        return crypto.randomUUID();

    }

    return Date.now() + "-" + Math.random().toString(36).slice(2, 8);

}


function addTask() {

    const title =
        document
        .getElementById("taskInput")
        .value
        .trim();

    const date =
        document
        .getElementById("dateInput")
        .value;

    const priority =
        document
        .getElementById("priorityInput")
        .value;

    const category =
        document
        .getElementById("categoryInput")
        .value;


    if (!title) {

        alert("Digite o nome da tarefa.");

        return;

    }


    tasks.push({

        id: generateId(),

        title,

        date,

        priority,

        category,

        completed: false

    });


    saveTasks();


    document.getElementById("taskInput").value = "";

    document.getElementById("dateInput").value = "";


    renderTasks();

}




function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed =
                !task.completed;

        }

        return task;

    });


    saveTasks();

    renderTasks();

}




function deleteTask(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta tarefa?"
        )
    ) {

        return;

    }


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderTasks();

}




function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    editingId = id;


    document.getElementById("editTitle").value =
        task.title;

    document.getElementById("editDate").value =
        task.date;

    document.getElementById("editPriority").value =
        task.priority;

    document.getElementById("editCategory").value =
        task.category;


    document.getElementById("modal").style.display =
        "flex";

    lastFocusedElement = document.activeElement;

    document.getElementById("editTitle").focus();

}


function saveEdit() {

    const title =
        document
        .getElementById("editTitle")
        .value
        .trim();

    const date =
        document
        .getElementById("editDate")
        .value;

    const priority =
        document
        .getElementById("editPriority")
        .value;

    const category =
        document
        .getElementById("editCategory")
        .value;


    if (!title) {

        alert("Digite o nome da tarefa.");

        return;

    }


    tasks =
        tasks.map(task => {

            if (task.id === editingId) {

                return {

                    ...task,

                    title,

                    date,

                    priority,

                    category

                };

            }

            return task;

        });


    saveTasks();

    closeModal();

    renderTasks();

}


function closeModal() {

    document.getElementById("modal").style.display =
        "none";

    editingId = null;

    if (lastFocusedElement) {

        lastFocusedElement.focus();

        lastFocusedElement = null;

    }

}



document.addEventListener("keydown", event => {

    const modalOpen =
        document.getElementById("modal").style.display === "flex";

    if (!modalOpen) return;

    if (event.key === "Escape") {

        closeModal();

    }

    if (event.key === "Enter" && event.target.tagName !== "SELECT") {

        saveEdit();

    }

});



function setFilter(filter) {

    currentFilter = filter;


    document
        .querySelectorAll("[data-filter]")
        .forEach(btn => {

            btn.classList.toggle(
                "active",
                btn.dataset.filter === filter
            );

        });


    renderTasks();

}



function todayString() {

    const date = new Date();

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(date.getDate())
        .padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function formatDate(date) {

    if (!date) {

        return "Sem data";

    }


    const [year, month, day] =
        date.split("-");


    return `${day}/${month}/${year}`;

}


function isOverdue(task) {

    return (
        task.date &&
        task.date < todayString() &&
        !task.completed
    );

}



function priorityText(priority) {

    if (priority === "high")
        return "Alta";

    if (priority === "medium")
        return "Média";

    return "Baixa";

}



function getFilteredTasks() {

    const search =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();


    let result = [...tasks];


    if (currentFilter === "pending") {

        result =
            result.filter(
                task => !task.completed
            );

    }


    if (currentFilter === "completed") {

        result =
            result.filter(
                task => task.completed
            );

    }


    if (currentFilter === "today") {

        result =
            result.filter(
                task =>
                    task.date === todayString()
            );

    }


    if (currentFilter === "overdue") {

        result =
            result.filter(
                task => isOverdue(task)
            );

    }


    if (search) {

        result =
            result.filter(task =>

                task.title
                    .toLowerCase()
                    .includes(search)

                ||

                task.category
                    .toLowerCase()
                    .includes(search)

            );

    }


    return result;

}



function renderTasks() {

    const list =
        document.getElementById("taskList");


    list.innerHTML = "";


    const filtered =
        getFilteredTasks();


    if (filtered.length === 0) {

        list.innerHTML = `

            <div class="empty">

                <h3>Nenhuma tarefa encontrada</h3>

                <p>
                    Adicione uma tarefa ou altere os filtros.
                </p>

            </div>

        `;

        updateStats();

        return;

    }


    filtered.forEach(task => {

        const element =
            document.createElement("div");


        element.className =
            "task" +
            (
                task.completed
                ? " completed"
                : ""
            );


        element.draggable = true;

        element.dataset.id = task.id;


        const overdue =
            isOverdue(task);


        element.innerHTML = `

            <input
                class="checkbox"
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask('${task.id}')"
                aria-label="Marcar '${escapeHTML(task.title)}' como concluída"
            >

            <div class="task-content">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-info">

                    <span class="badge category">
                        ${escapeHTML(task.category)}
                    </span>

                    <span class="badge priority-${task.priority}">
                        ${priorityText(task.priority)}
                    </span>

                    <span class="date ${overdue ? "overdue" : ""}">
                        📅 ${formatDate(task.date)}
                        ${overdue ? " • Atrasada" : ""}
                    </span>

                </div>

            </div>

            <div class="actions">

                <button
                    class="action-btn edit"
                    onclick="editTask('${task.id}')"
                    aria-label="Editar tarefa"
                    title="Editar"
                >
                    ✏️
                </button>

                <button
                    class="action-btn delete"
                    onclick="deleteTask('${task.id}')"
                    aria-label="Excluir tarefa"
                    title="Excluir"
                >
                    🗑️
                </button>

            </div>

        `;


        /* DRAG */

        element.addEventListener(
            "dragstart",
            () => {

                draggedId = task.id;

                element.classList.add(
                    "dragging"
                );

            }
        );


        element.addEventListener(
            "dragend",
            () => {

                element.classList.remove(
                    "dragging"
                );

            }
        );


        element.addEventListener(
            "dragover",
            event => {

                event.preventDefault();

            }
        );


        element.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                reorderTasks(
                    draggedId,
                    task.id
                );

            }
        );


        list.appendChild(element);

    });


    updateStats();

}




function reorderTasks(fromId, toId) {

    if (
        fromId === toId ||
        fromId === null
    ) {

        return;

    }


    const fromIndex =
        tasks.findIndex(
            task => task.id === fromId
        );


    const toIndex =
        tasks.findIndex(
            task => task.id === toId
        );


    const [moved] =
        tasks.splice(fromIndex, 1);


    tasks.splice(
        toIndex,
        0,
        moved
    );


    saveTasks();

    renderTasks();

}




function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    const overdue =
        tasks.filter(
            task => isOverdue(task)
        ).length;


    const progress =
        total === 0
        ? 0
        : Math.round(
            completed / total * 100
        );


    document.getElementById("total").textContent =
        total;


    document.getElementById("completed").textContent =
        completed;


    document.getElementById("pending").textContent =
        pending;


    document.getElementById("overdue").textContent =
        overdue;


    document.getElementById("progressText").textContent =
        progress + "%";


    document.getElementById("progressFill").style.width =
        progress + "%";

}



function clearCompleted() {

    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    if (completed === 0) {

        alert(
            "Não existem tarefas concluídas."
        );

        return;

    }


    if (
        !confirm(
            "Excluir todas as tarefas concluídas?"
        )
    ) {

        return;

    }


    tasks =
        tasks.filter(
            task => !task.completed
        );


    saveTasks();

    renderTasks();

}




function toggleTheme() {

    document.body.classList.toggle("dark");


    const dark =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "taskflow_theme",
        dark
        ? "dark"
        : "light"
    );

}


function loadTheme() {

    const theme =
        localStorage.getItem(
            "taskflow_theme"
        );


    if (theme === "dark") {

        document.body.classList.add("dark");

    }

}




function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}




document
    .getElementById("taskInput")
    .addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                addTask();

            }

        }
    );




loadTheme();

renderTasks();
