document.addEventListener('DOMContentLoaded', () => {
    const habitInput = document.getElementById('habit-input');
    const addHabitButton = document.getElementById('add-habit-button');
    const habitList = document.getElementById('habit-list');

    // Load habits from storage
    chrome.storage.sync.get(['habits'], (result) => {
        const habits = result.habits || [];
        habits.forEach(addHabitToUI);
    });

    // Add habit button click event
    addHabitButton.addEventListener('click', () => {
        const habitName = habitInput.value.trim();
        if (habitName) {
            addHabit(habitName);
            habitInput.value = '';
        }
    });

    // Add habit to storage and UI
    function addHabit(habitName) {
        chrome.storage.sync.get(['habits'], (result) => {
            const habits = result.habits || [];
            habits.push({ name: habitName, completed: false });
            chrome.storage.sync.set({ habits });
            addHabitToUI({ name: habitName, completed: false });
        });
    }

    // Add habit to the UI
    function addHabitToUI(habit) {
        const listItem = document.createElement('li');
        listItem.className = 'habit-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = habit.completed;
        checkbox.addEventListener('change', () => {
            habit.completed = checkbox.checked;
            updateHabit(habit);
        });

        const span = document.createElement('span');
        span.textContent = habit.name;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteHabit(habit);
            listItem.remove();
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(span);
        listItem.appendChild(deleteButton);
        habitList.appendChild(listItem);
    }

    // Update habit in storage
    function updateHabit(updatedHabit) {
        chrome.storage.sync.get(['habits'], (result) => {
            const habits = result.habits || [];
            const habitIndex = habits.findIndex(habit => habit.name === updatedHabit.name);
            if (habitIndex !== -1) {
                habits[habitIndex] = updatedHabit;
                chrome.storage.sync.set({ habits });
            }
        });
    }

    // Delete habit from storage
    function deleteHabit(habitToDelete) {
        chrome.storage.sync.get(['habits'], (result) => {
            const habits = result.habits || [];
            const updatedHabits = habits.filter(habit => habit.name !== habitToDelete.name);
            chrome.storage.sync.set({ habits: updatedHabits });
        });
    }
});
