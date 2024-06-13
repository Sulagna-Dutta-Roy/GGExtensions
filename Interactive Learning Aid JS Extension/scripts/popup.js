document.addEventListener('DOMContentLoaded', () => {
    loadFlashcards();
    loadNotes();
    loadBookmarks();
    loadProgress();
    loadQuizzes();

    document.getElementById('addFlashcard').addEventListener('click', addFlashcard);
    document.getElementById('addNote').addEventListener('click', addNote);
    document.getElementById('addQuiz').addEventListener('click', addQuiz);
    document.getElementById('startQuiz').addEventListener('click', startQuiz);
});

const loadFlashcards = () => {
    chrome.storage.local.get(['flashcards'], (result) => {
        const flashcards = result.flashcards || [];
        const list = document.getElementById('flashcardList');
        list.innerHTML = '';
        flashcards.forEach((flashcard, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = flashcard.question;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteFlashcard(index);
            listItem.appendChild(deleteButton);
            list.appendChild(listItem);
        });
    });
};

const addFlashcard = () => {
    const question = prompt('Enter the question:');
    const answer = prompt('Enter the answer:');
    chrome.storage.local.get(['flashcards'], (result) => {
        const flashcards = result.flashcards || [];
        flashcards.push({ question, answer });
        chrome.storage.local.set({ flashcards }, loadFlashcards);
    });
};

const deleteFlashcard = (index) => {
    chrome.storage.local.get(['flashcards'], (result) => {
        const flashcards = result.flashcards || [];
        flashcards.splice(index, 1);
        chrome.storage.local.set({ flashcards }, loadFlashcards);
    });
};

const loadNotes = () => {
    chrome.storage.local.get(['notes'], (result) => {
        const notes = result.notes || [];
        const list = document.getElementById('noteList');
        list.innerHTML = '';
        notes.forEach((note, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = note;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteNote(index);
            listItem.appendChild(deleteButton);
            list.appendChild(listItem);
        });
    });
};

const addNote = () => {
    const note = prompt('Enter your note:');
    chrome.storage.local.get(['notes'], (result) => {
        const notes = result.notes || [];
        notes.push(note);
        chrome.storage.local.set({ notes }, loadNotes);
    });
};

const deleteNote = (index) => {
    chrome.storage.local.get(['notes'], (result) => {
        const notes = result.notes || [];
        notes.splice(index, 1);
        chrome.storage.local.set({ notes }, loadNotes);
    });
};

const loadBookmarks = () => {
    chrome.storage.local.get(['bookmarks'], (result) => {
        const bookmarks = result.bookmarks || [];
        const list = document.getElementById('bookmarkList');
        list.innerHTML = '';
        bookmarks.forEach((bookmark, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = bookmark.title;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteBookmark(index);
            listItem.appendChild(deleteButton);
            list.appendChild(listItem);
        });
    });
};

const deleteBookmark = (index) => {
    chrome.storage.local.get(['bookmarks'], (result) => {
        const bookmarks = result.bookmarks || [];
        bookmarks.splice(index, 1);
        chrome.storage.local.set({ bookmarks }, loadBookmarks);
    });
};

const loadProgress = () => {
    chrome.storage.local.get(['progress'], (result) => {
        const progress = result.progress || [];
        const container = document.getElementById('progressContainer');
        container.innerHTML = '';
        progress.forEach(item => {
            const div = document.createElement('div');
            div.textContent = `${item.subject}: ${item.progress}%`;
            container.appendChild(div);
        });
    });
};

const loadQuizzes = () => {
    chrome.storage.local.get(['quizzes'], (result) => {
        const quizzes = result.quizzes || [];
        const list = document.getElementById('quizList');
        list.innerHTML = '';
        quizzes.forEach((quiz, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = quiz.title;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteQuiz(index);
            listItem.appendChild(deleteButton);
            list.appendChild(listItem);
        });
    });
};

const addQuiz = () => {
    const title = prompt('Enter the quiz title:');
    const questions = [];
    let addMore = true;
    while (addMore) {
        const question = prompt('Enter the question:');
        const options = [];
        for (let i = 1; i <= 4; i++) {
            options.push(prompt(`Enter option ${i}:`));
        }
        const correctAnswer = prompt('Enter the correct option number:');
        questions.push({ question, options, correctAnswer });
        addMore = confirm('Add another question?');
    }
    chrome.storage.local.get(['quizzes'], (result) => {
        const quizzes = result.quizzes || [];
        quizzes.push({ title, questions });
        chrome.storage.local.set({ quizzes }, loadQuizzes);
    });
};

const deleteQuiz = (index) => {
    chrome.storage.local.get(['quizzes'], (result) => {
        const quizzes = result.quizzes || [];
        quizzes.splice(index, 1);
        chrome.storage.local.set({ quizzes }, loadQuizzes);
    });
};

const startQuiz = () => {
    chrome.storage.local.get(['quizzes'], (result) => {
        const quizzes = result.quizzes || [];
        if (quizzes.length === 0) {
            alert('No quizzes available.');
            return;
        }

        const quizIndex = Math.floor(Math.random() * quizzes.length);
        const quiz = quizzes[quizIndex];
        const container = document.getElementById('quizContainer');
        container.innerHTML = `<h3>${quiz.title}</h3>`;
        quiz.questions.forEach((question, qIndex) => {
            const questionDiv = document.createElement('div');
            questionDiv.textContent = question.question;
            question.options.forEach((option, oIndex) => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `question${qIndex}`;
                input.value = oIndex + 1;
                label.appendChild(input);
                label.appendChild(document.createTextNode(option));
                questionDiv.appendChild(label);
                questionDiv.appendChild(document.createElement('br'));
            });
            container.appendChild(questionDiv);
        });

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.onclick = () => {
            let score = 0;
            quiz.questions.forEach((question, qIndex) => {
                const selectedOption = container.querySelector(`input[name="question${qIndex}"]:checked`);
                if (selectedOption && selectedOption.value == question.correctAnswer) {
                    score++;
                }
            });
            alert(`Your score: ${score} out of ${quiz.questions.length}`);
        };
        container.appendChild(submitButton);
    });
};  