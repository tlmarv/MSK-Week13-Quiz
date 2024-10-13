let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let isExplanationShown = false;

const questionContainer = document.getElementById("question-container");
const choicesContainer = document.getElementById("choices-container");
const explanationContainer = document.getElementById("explanation");
const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("prev-btn");
const scoreContainer = document.getElementById("score-container");

// Fetch questions from an external JSON file
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        quizData = data.map(q => ({ ...q, answered: false, selectedAnswer: null })); // Track 'answered' and 'selectedAnswer'
        loadQuestion();  // Load the first question after fetching
    })
    .catch(error => console.error('Error loading quiz data:', error));

function loadQuestion() {
    resetState();
    const currentQuestion = quizData[currentQuestionIndex];

    const quizTitle = document.querySelector('h1');
    quizTitle.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    
    questionContainer.textContent = currentQuestion.question;

    currentQuestion.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.textContent = choice;

        // If the question was previously answered, disable the button and apply the correct styles
        if (currentQuestion.answered) {
            button.disabled = true;
            if (index === currentQuestion.correctAnswer) {
                button.style.backgroundColor = "green"; // Highlight correct answer
            } else if (index === currentQuestion.selectedAnswer) {
                button.style.backgroundColor = "red"; // Highlight the selected incorrect answer
            } else {
                button.style.backgroundColor = "gray"; // Other unselected options
            }
        } else {
            // If not answered, attach event listener
            button.addEventListener("click", () => selectAnswer(index));
        }

        choicesContainer.appendChild(button);
    });

    // Show the explanation if the question has already been answered
    if (currentQuestion.answered) {
        explanationContainer.textContent = currentQuestion.explanation;
    }

    if (currentQuestionIndex > 0) {
        prevButton.classList.remove("hidden");
    } else {
        prevButton.classList.add("hidden");
    }

    if (isExplanationShown || currentQuestion.answered) {
        nextButton.classList.remove("hidden");
    }
}

function selectAnswer(selectedIndex) {
    const currentQuestion = quizData[currentQuestionIndex];

    // Update the score and selectedAnswer only if the question hasn't been answered yet
    if (!currentQuestion.answered) {
        currentQuestion.selectedAnswer = selectedIndex; // Track the selected answer

        if (selectedIndex === currentQuestion.correctAnswer) {
            score++;
            explanationContainer.textContent = "Correct! " + currentQuestion.explanation;
            document.body.style.backgroundColor = "green";
        } else {
            explanationContainer.textContent = "Incorrect. " + currentQuestion.explanation;
            document.body.style.backgroundColor = "red";
        }
        
        // Mark the question as answered
        currentQuestion.answered = true;

        const buttons = choicesContainer.querySelectorAll("button");
        buttons.forEach((button, index) => {
            button.disabled = true;
            if (index === currentQuestion.correctAnswer) {
                button.style.backgroundColor = "green"; // Highlight the correct answer
            } else if (index === selectedIndex) {
                button.style.backgroundColor = "red"; // Highlight the selected incorrect answer
            } else {
                button.style.backgroundColor = "gray"; // Neutral for unselected options
            }
        });

        nextButton.classList.remove("hidden");
    } else {
        explanationContainer.textContent = currentQuestion.explanation; // Show the explanation again
    }
    
    const modal = document.getElementById("explanation-modal");
    modal.style.display = "block";
}

document.getElementById("close-modal").onclick = function() {
    document.getElementById("explanation-modal").style.display = "none";
};

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showScore();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function showScore() {
    questionContainer.classList.add("hidden");
    choicesContainer.classList.add("hidden");
    nextButton.classList.add("hidden");
    
    scoreContainer.classList.remove("hidden");
    scoreContainer.textContent = `Your score: ${score} out of ${quizData.length}`;
}

function resetState() {
    explanationContainer.textContent = "";
    nextButton.classList.add("hidden");
    prevButton.classList.add("hidden");
    choicesContainer.innerHTML = "";
    document.body.style.backgroundColor = "";
    document.getElementById("explanation-modal").style.display = "none";
}

nextButton.addEventListener("click", () => {
    if (isExplanationShown) {
        isExplanationShown = false;
        nextQuestion();
    }
});

prevButton.addEventListener("click", () => {
    prevQuestion();
});
