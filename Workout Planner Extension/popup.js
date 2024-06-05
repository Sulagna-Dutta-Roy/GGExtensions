const workoutForm = document.getElementById('workout-form');
const workoutList = document.getElementById('workout-list');

workoutForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const workoutName = document.getElementById('workout-name').value;
  const workoutType = document.getElementById('workout-type').value;
  const workoutDuration = document.getElementById('workout-duration').value;
  const workoutNotes = document.getElementById('workout-notes').value;

  const newWorkout = {
    name: workoutName,
    type: workoutType,
    duration: workoutDuration,
    notes: workoutNotes
  };

  // Get existing workouts from local storage (if any)
  let storedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];

  // Save only the new workout
  storedWorkouts.push(newWorkout);

  // Update local storage with the new list
  localStorage.setItem('workouts', JSON.stringify(storedWorkouts));

  // Clear the form
  workoutForm.reset();

  // Display the workout with delete button and notes
  displayWorkout(newWorkout);
});

function displayWorkout(workout) {
  const listItem = document.createElement('li');
  listItem.textContent = `Workout Name: ${workout.name} - Workout Type: ${workout.type} - Duration: ${workout.duration} minutes`;

  // Add a notes paragraph
  const notesParagraph = document.createElement('p');
  notesParagraph.textContent = `Notes: ${workout.notes}`;
  listItem.appendChild(notesParagraph);

  // Add a delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', function() {
    deleteWorkout(listItem, workout);
  });
  listItem.appendChild(deleteButton);

  workoutList.appendChild(listItem);
}

function deleteWorkout(listItem, workout) {
  // Clear local storage for workouts
  localStorage.removeItem('workouts');

  // Remove the list item from the DOM
  workoutList.removeChild(listItem);
}

// Get any existing workouts from local storage (already displayed on load)
const storedWorkouts = JSON.parse(localStorage.getItem('workouts'));

if (storedWorkouts) {
  storedWorkouts.forEach(workout => displayWorkout(workout));
}
