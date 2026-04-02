// ====================================
// Simple C Programming Quiz Logic
// ====================================

// Array of quiz questions about C programming
// Each question object has:
// - question: the question text
// - options: an array of answer choices
// - correctIndex: index of the correct answer in the options array
var questions = [
    {
        question: "1. Which of the following is a valid C variable name?",
        options: [
            "2variable",
            "_count",
            "total value",
            "int"
        ],
        correctIndex: 1
    },
    {
        question: "2. Which header file is required for the printf() function in C?",
        options: [
            "<stdlib.h>",
            "<stdio.h>",
            "<string.h>",
            "<math.h>"
        ],
        correctIndex: 1
    },
    {
        question: "3. What is the correct format specifier for an integer in C?",
        options: [
            "%d",
            "%f",
            "%c",
            "%s"
        ],
        correctIndex: 0
    },
    {
        question: "4. How do you write a single-line comment in C?",
        options: [
            "# This is a comment",
            "// This is a comment",
            "/* This is a comment */",
            "<!-- This is a comment -->"
        ],
        correctIndex: 1
    },
    {
        question: "5. What is the index of the first element in an array in C?",
        options: [
            "-1",
            "0",
            "1",
            "Depends on the compiler"
        ],
        correctIndex: 1
    },
    {
        question: "6. Which data type is used to store a single character in C?",
        options: [
            "char",
            "int",
            "float",
            "double"
        ],
        correctIndex: 0
    },
    {
        question: "7. Which operator is used to access the value at an address stored in a pointer?",
        options: [
            "& (ampersand)",
            "* (asterisk)",
            "-> (arrow)",
            ". (dot)"
        ],
        correctIndex: 1
    },
    {
        question: "8. What will be the size of int in most 32-bit C compilers?",
        options: [
            "1 byte",
            "2 bytes",
            "4 bytes",
            "8 bytes"
        ],
        correctIndex: 2
    }
];

// Variables to track quiz state
var currentQuestionIndex = 0;
var score = 0;
var hasAnsweredCurrentQuestion = false;

// Get important elements from the page
var questionTextEl = document.getElementById("questionText"); /connecting js with html/
var optionsContainerEl = document.getElementById("optionsContainer");
var progressTextEl = document.getElementById("progressText");
var scoreTextEl = document.getElementById("scoreText");
var feedbackEl = document.getElementById("feedback");
var nextBtnEl = document.getElementById("nextBtn");
var resultBoxEl = document.getElementById("resultBox");
var finalScoreTextEl = document.getElementById("finalScoreText");
var finalMessageTextEl = document.getElementById("finalMessageText");
var restartBtnEl = document.getElementById("restartBtn");

// ------------------------------------
// Helper: update score display
// ------------------------------------
function updateScoreDisplay() {
    scoreTextEl.textContent = "Score: " + score + " / " + questions.length;
}

// Helper: update progress text (Question X of Y)
function updateProgressDisplay() {
    var questionNumber = currentQuestionIndex + 1;
    progressTextEl.textContent = "Question " + questionNumber + " of " + questions.length;
}

// ------------------------------------
// Load and display the current question
// ------------------------------------
function loadQuestion() {
    var currentQuestion = questions[currentQuestionIndex];/Fetches question from array/

    // Show question text It replaces HTML text dynamically
    questionTextEl.textContent = currentQuestion.question;

    // Remove old options clears previous options.
    optionsContainerEl.innerHTML = "";

    // Reset feedback
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";

    // Create a radio button for each option
    for (var i = 0; i < currentQuestion.options.length; i++) {
        var optionText = currentQuestion.options[i];

        // Container for each option
        var optionDiv = document.createElement("div");
        optionDiv.className = "option";

        // Radio input
        var radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.name = "option";
        radioInput.value = i;     // store index of this option
        radioInput.id = "option" + i;

        // When user selects this radio, check the answer
        radioInput.addEventListener("change", handleAnswerSelection);

        // Label for radio
        var label = document.createElement("label");
        label.htmlFor = radioInput.id;
        label.textContent = optionText;

        // Add input and label into the option row
        optionDiv.appendChild(radioInput);
        optionDiv.appendChild(label);

        // Add this option row into the options container
        optionsContainerEl.appendChild(optionDiv);
    }

    // Update progress text
    updateProgressDisplay();

    // Disable Next button until an answer is selected
    nextBtnEl.disabled = true;

    // Mark that this question has not been answered yet
    hasAnsweredCurrentQuestion = false;

    // Change button text on last question
    if (currentQuestionIndex === questions.length - 1) {
        nextBtnEl.textContent = "See Result";
    } else {
        nextBtnEl.textContent = "Next Question";
    }
}

// ------------------------------------
// Handle when user selects an option
// ------------------------------------
function handleAnswerSelection(event) {
    // Only handle first selection per question
    if (hasAnsweredCurrentQuestion) {
        return;
    }

    var selectedIndex = parseInt(event.target.value, 10);
    var currentQuestion = questions[currentQuestionIndex];
    var correctIndex = currentQuestion.correctIndex;

    // Mark question as answered
    hasAnsweredCurrentQuestion = true;

    // Check if the selected answer is correct
    if (selectedIndex === correctIndex) {
        score++;
        updateScoreDisplay();
        feedbackEl.textContent = "Correct Answer";
        feedbackEl.className = "feedback correct";
    } else {
        var correctText = currentQuestion.options[correctIndex];
        feedbackEl.textContent = "Wrong Answer. Correct answer: " + correctText;
        feedbackEl.className = "feedback incorrect";
    }

    // Disable all options after answering
    var optionRadios = document.querySelectorAll('input[name="option"]');
    for (var i = 0; i < optionRadios.length; i++) {
        optionRadios[i].disabled = true;
    }

    // Enable Next button
    nextBtnEl.disabled = false;
}

// ------------------------------------
// Go to the next question or show result
// ------------------------------------
function goToNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showFinalResult();
    }
}

// ------------------------------------
// Show the final result screen
// ------------------------------------
function showFinalResult() {
    // Hide question-related elements
    document.getElementById("questionBox").classList.add("hidden");
    document.getElementById("optionsForm").classList.add("hidden");
    document.getElementById("progressText").classList.add("hidden");
    document.querySelector(".controls").classList.add("hidden");

    // Show result box
    resultBoxEl.classList.remove("hidden");

    var percentage = Math.round((score / questions.length) * 100);
    finalScoreTextEl.textContent =
        "Your Score: " + score + " out of " + questions.length + " (" + percentage + "%)";

    // Simple message based on score
    if (percentage === 100) {
        finalMessageTextEl.textContent =
            "Outstanding! You have excellent command of C programming basics.";
    } else if (percentage >= 60) {
        finalMessageTextEl.textContent =
            "Good job! You know the basics. Keep practicing to get even better.";
    } else {
        finalMessageTextEl.textContent =
            "Keep learning and practicing C programming. You can improve quickly!";
    }
}

// ------------------------------------
// Restart the quiz from the beginning
// ------------------------------------
function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    hasAnsweredCurrentQuestion = false;

    updateScoreDisplay();

    // Show question-related elements again
    document.getElementById("questionBox").classList.remove("hidden");
    document.getElementById("optionsForm").classList.remove("hidden");
    document.getElementById("progressText").classList.remove("hidden");
    document.querySelector(".controls").classList.remove("hidden");

    // Hide result box
    resultBoxEl.classList.add("hidden");

    // Load the first question
    loadQuestion();
}

// ------------------------------------
// Set up event listeners and start quiz
// ------------------------------------
nextBtnEl.addEventListener("click", goToNextQuestion);
restartBtnEl.addEventListener("click", restartQuiz);

// Initialize quiz when page loads
updateScoreDisplay();
loadQuestion();
