document.addEventListener('DOMContentLoaded', loadTodoList);

        document.getElementById('addBtn').addEventListener('click', function () {
            const input = document.getElementById('todoInput');
            const value = input.value.trim();
            if (value) {
                addTodoItem(value);
                input.value = '';
                saveTodoList();
            }
        });

        function addTodoItem(text, skipSave = false) {
            const item = document.createElement('div');
            item.classList.add('todo-item');
            item.draggable = true;

            const itemText = document.createElement('span');
            itemText.textContent = text;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => {
                item.remove();
                saveTodoList();
            });

            item.appendChild(itemText);
            item.appendChild(deleteBtn);

            item.addEventListener('dragstart', () => {
                item.classList.add('dragging');
            });
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });

            document.getElementById('todoList').appendChild(item);

            if (!skipSave) {
                saveTodoList();
            }

            addDragAndDropHandlers();
        }

        function saveTodoList() {
            const items = document.querySelectorAll('.todo-item span');
            const todoArray = [];
            items.forEach(item => {
                todoArray.push(item.textContent);
            });
            localStorage.setItem('todoList', JSON.stringify(todoArray));
        }

        function loadTodoList() {
            const savedList = JSON.parse(localStorage.getItem('todoList'));
            if (savedList && Array.isArray(savedList)) {
                savedList.forEach(itemText => addTodoItem(itemText, true));
            }
        }

        function addDragAndDropHandlers() {
            const list = document.getElementById('todoList');
            const items = document.querySelectorAll('.todo-item');
            items.forEach(item => {
                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    const afterElement = getDragAfterElement(list, e.clientY);
                    const draggingItem = document.querySelector('.dragging');
                    if (afterElement == null) {
                        list.appendChild(draggingItem);
                    } else {
                        list.insertBefore(draggingItem, afterElement);
                    }
                });
            });
        }

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        } 