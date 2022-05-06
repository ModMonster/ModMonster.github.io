var questions = [];
var questionButtons;
var selectedQuestion = 0;

// elements
var questionsBar = document.getElementById("questions");

var questionTitle = document.getElementById("question-window-title");

var questionRed = document.querySelector("#red textarea");
var questionBlue = document.querySelector("#blue textarea");
var questionYellow = document.querySelector("#yellow textarea");
var questionGreen = document.querySelector("#green textarea");

var questionRedCheckbox = document.querySelector("#red input[type=checkbox]");
var questionBlueCheckbox = document.querySelector("#blue input[type=checkbox]");
var questionYellowCheckbox = document.querySelector("#yellow input[type=checkbox]");
var questionGreenCheckbox = document.querySelector("#green input[type=checkbox]");

var questionTimer = document.getElementById("time-limit-dropdown");

var kablookName = document.getElementById("title");

class Question {
    constructor(name, red, blue, yellow, green, redCorrect, blueCorrect, yellowCorrect, greenCorrect, timeLimit) {
        this.name = name;

        this.red = red;
        this.blue = blue;
        this.yellow = yellow;
        this.green = green;

        this.redCorrect = redCorrect;
        this.blueCorrect = blueCorrect;
        this.yellowCorrect = yellowCorrect;
        this.greenCorrect = greenCorrect;

        this.timeLimit = timeLimit;
    }
}

function newQuestion() {
    questions.push(new Question("New question", "Option 1", "Option 2", "Option 3", "Option 4", false, false, false, false, "30s"))
    updateQuestions();
}

function deleteQuestion() {
    questions.splice(selectedQuestion, 1);
    questionButtons[selectedQuestion].remove();
    questionButtons.splice(selectedQuestion, 1);

    if (questions.length >= 1) {
        if (selectedQuestion > 0) {
            selectedQuestion -= 1;
        }
        selectQuestionButton(questionButtons[selectedQuestion]);
    } else {
        newQuestion();
    }
}

function duplicateQuestion() {
    questions.push(questions[selectedQuestion]);
    updateQuestions();
    questionButtons[selectedQuestion].innerHTML = questions[selectedQuestion].name;
}

function updateQuestions() {
    var element = document.createElement("button");
    element.classList.add("question-button");
    element.onclick = function() {
        selectQuestionButton(element);
    }
    element.innerHTML = "New question";

    questionsBar.appendChild(element);
    questionsBar.scrollTo(0, questionsBar.scrollHeight);

    selectQuestionButton(element);
}

function selectQuestionButton(element) {
    questionButtons = [...document.querySelectorAll("#questions button")];

    questionButtons.forEach(question => {
        question.classList.remove("selected-question-button");
    });

    element.classList.add("selected-question-button");

    selectedQuestion = questionButtons.indexOf(element);

    var currentQuestion = questions[selectedQuestion];

    questionTitle.value = currentQuestion.name != "New question"? currentQuestion.name : "";

    questionRed.value = currentQuestion.red != "Option 1"? currentQuestion.red : "";
    questionBlue.value = currentQuestion.blue != "Option 2"? currentQuestion.blue : "";
    questionYellow.value = currentQuestion.yellow != "Option 3"? currentQuestion.yellow : "";
    questionGreen.value = currentQuestion.green != "Option 4"? currentQuestion.green : "";

    questionRedCheckbox.checked = currentQuestion.redCorrect == "t";
    questionBlueCheckbox.checked = currentQuestion.blueCorrect == "t";
    questionYellowCheckbox.checked = currentQuestion.yellowCorrect == "t";
    questionGreenCheckbox.checked = currentQuestion.greenCorrect == "t";

    toggleQuestionCheckbox("red");
    toggleQuestionCheckbox("blue");
    toggleQuestionCheckbox("yellow");
    toggleQuestionCheckbox("green");

    questionTimer.value = currentQuestion.timeLimit;
}

function updateTitle() {
    questions[selectedQuestion].name = questionTitle.value;
    questionButtons[selectedQuestion].innerHTML = questionTitle.value;
}

function updateTimer() {
    questions[selectedQuestion].timeLimit = questionTimer.value;
}

function updateOptions() {
    questions[selectedQuestion].red = questionRed.value != ""? questionRed.value : "Option 1";
    questions[selectedQuestion].blue = questionBlue.value != ""? questionBlue.value : "Option 2";
    questions[selectedQuestion].yellow = questionYellow.value != ""? questionYellow.value : "Option 3";
    questions[selectedQuestion].green = questionGreen.value != ""? questionGreen.value : "Option 4";

    questions[selectedQuestion].redCorrect = questionRedCheckbox.checked? "t" : "f";
    questions[selectedQuestion].blueCorrect = questionBlueCheckbox.checked? "t" : "f";
    questions[selectedQuestion].yellowCorrect = questionYellowCheckbox.checked? "t" : "f";
    questions[selectedQuestion].greenCorrect = questionGreenCheckbox.checked? "t" : "f";
}

function toggleQuestionCheckbox(id) {
    var checkboxDiv = document.querySelector(`#${id} .question-checkbox`);
    var realCheckbox = document.querySelector(`#${id} input[type=checkbox]`);

    if (realCheckbox.checked) {
        checkboxDiv.classList.add("question-checkbox-checked");
    } else {
        checkboxDiv.classList.remove("question-checkbox-checked");
    }
}

function createUrl() {
    var url = "https://kablook.nicholasstraete.repl.co/host";
    
    addedCount = 0;

    url += "?t=" + (title.value != ""? formatString(title.value) : "Untitled Kablook");
    url += "&qC=" + questions.length;

    questions.forEach(question => {
        url += "&n" + addedCount + "=" + formatString(question.name);

        url += "&r" + addedCount + "=" + formatString(question.red);
        url += "&b" + addedCount + "=" + formatString(question.blue);
        url += "&y" + addedCount + "=" + formatString(question.yellow);
        url += "&g" + addedCount + "=" + formatString(question.green);

        url += "&rC" + addedCount + "=" + question.redCorrect;
        url += "&bC" + addedCount + "=" + question.blueCorrect;
        url += "&yC" + addedCount + "=" + question.yellowCorrect;
        url += "&gC" + addedCount + "=" + question.greenCorrect;

        url += "&ti" + addedCount + "=" + question.timeLimit;

        addedCount += 1;
    });

    Swal.fire({
        title: "Here's your link!",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Copy",
        cancelButtonText: "Done",
        preConfirm: () => {navigator.clipboard.writeText(url);},
        html: `Bookmark or save this link. When you want to play the game, go to the link. Be careful, it's a long one!
        <input type="text" value="${url}" id="link-input" readonly></input>

        <style>
            #link-input {
                margin-top: 32px;
                padding: 8px;
                width: 100%;
            }
        </style>`,
        
    });
}

async function loadFromUrl() {
    var inputUrl = await Swal.fire({
        title: "Enter a URL to load it back into the editor.",
        input: "text",
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return "You need to enter a URL!"
            }
        }
    });

    if (inputUrl.value == null) {
        return;
    }

    var argumentList = inputUrl.value.split(/\?|&|=/);

    argumentList.shift();

    // convert to dictionary
    var arguments = {};

    argumentList.forEach(argument => {
        var indexOfArgument = argumentList.indexOf(argument);

        if (indexOfArgument % 2 == 0) {
            arguments[argument] = argumentList[indexOfArgument + 1];
        }
    });

    // delete all questions
    questions = [];

    questionButtons.forEach(element => {
        element.remove();
    });

    questionButtons = [];

    // add questions

    for (let i = 0; i < arguments["qC"]; i++) {
        questions.push(new Question(unFormatString(arguments["n" + i]), unFormatString(arguments["r" + i]), unFormatString(arguments["b" + i]), unFormatString(arguments["y" + i]), unFormatString(arguments["g" + i]), arguments["rC" + i], arguments["bC" + i], arguments["yC" + i], arguments["gC" + i], arguments["ti" + i]))
        updateQuestions();
        questionButtons[i].innerHTML = unFormatString(arguments["n" + i]);
    }

    selectQuestionButton(questionButtons[0]);

    // update title
    kablookName.value = arguments["t"] != "Untitled Kablook"? unFormatString(arguments["t"]) : "";
}

function formatString(i) {
    return i.replaceAll("?", "!q!").replaceAll("&", "!a!");
}

function unFormatString(i) {
    return decodeURI(i.replaceAll("!q!", "?").replaceAll("!a!", "&").replaceAll());
}

newQuestion();