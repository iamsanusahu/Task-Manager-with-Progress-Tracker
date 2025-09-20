document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const updateProgress = () => {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        progressBar.style.setProperty('--width', `${percentage}%`);
        progressText.textContent = `${percentage}% Complete`;
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            if (task.completed) li.classList.add('completed');

            const textSpan = document.createElement('span');
            textSpan.textContent = task.text;
            li.appendChild(textSpan);

            const completeBtn = document.createElement('button');
            completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
            completeBtn.classList.add('complete');
            completeBtn.onclick = () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            };

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit');
            editBtn.onclick = () => {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = task.text;
                li.replaceChild(input, textSpan);
                input.focus();
                input.onblur = () => {
                    if (input.value.trim()) {
                        tasks[index].text = input.value.trim();
                        saveTasks();
                        renderTasks();
                    }
                };
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            };

            li.append(editBtn, completeBtn, deleteBtn);
            taskList.appendChild(li);
        });
        updateProgress();
    };

    taskForm.onsubmit = (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    };

    // Add this to progress-bar in CSS via JS for dynamic width
    progressBar.style.setProperty('--width', '0%');
    renderTasks();
});

// Note: Add this to styles.css for the progress bar animation
// #progress-bar::before { width: var(--width); }