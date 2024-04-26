const url = "https://opentdb.com/api.php?amount=10&type=multiple";
const quizBox = document.querySelector(".quiz-box");
const question = document.getElementById("question");
const score = document.getElementById("score");
const form = document.querySelector(".quiz-box__main form");
const ch1 = document.getElementById("choice1");
const ch2 = document.getElementById("choice2");
const ch3 = document.getElementById("choice3");
const ch4 = document.getElementById("choice4");
const chs = [ch1, ch2, ch3, ch4];

const submit = document.getElementById("submit");
const next = document.getElementById("next");

let quizData;
let answer = "";
let userChoice = "";
let quizCount = 1;
let correct = 0;
let wrong = 0;

async function fetchData(url) {
  try {
    const res = await fetch(url);
    quizData = await res.json();
  } catch (err) {
    console.error("Error:", err);
  }
}

function printData() {
  resetChoice(false);
  question.innerHTML = quizData.results[quizCount].question;
  score.innerText = `Number ${quizCount} / Correct : ${correct} / Wrong : ${wrong}`;

  answer = quizData.results[quizCount].correct_answer;
  const answers = quizData.results[quizCount].incorrect_answers;
  const answerNum = Math.floor(Math.random() * 4);

  answers.splice(answerNum, 0, answer);
  chs.forEach((ch, idx) => {
    ch.innerHTML = answers[idx];
  });
}

function onClickChoice(event) {
  event.preventDefault();
  chs.forEach((ch) => {
    ch.classList.remove("selected");
  });
  event.target.classList.add("selected");
  userChoice = event.target.innerHTML;
}

function onClickSubmit(event) {
  event.preventDefault();

  if (userChoice === "") {
    console.log("choose answer");
  } else {
    printResult();
  }
}

function onClickNext(event) {
  event.preventDefault();
  userChoice = "";
  if (quizCount === 10) {
    finishQuiz();
  } else {
    printData();
  }
}

function printResult() {
  resetChoice(true);

  chs.forEach((ch) => {
    if (ch.innerHTML === answer) {
      ch.classList.add("correct");
    }
    if (ch.innerHTML === userChoice && ch.innerHTML !== answer) {
      ch.classList.add("wrong");
    }
  });

  answer === userChoice ? correct++ : wrong++;
  quizCount++;
}

function resetChoice(disable) {
  if (disable) {
    next.classList.remove("hidden");
    submit.classList.add("hidden");
    chs.forEach((ch) => {
      ch.setAttribute("disabled", "true");
      ch.classList.remove("hover", "selected");
    });
  } else {
    next.classList.add("hidden");
    submit.classList.remove("hidden");
    chs.forEach((ch) => {
      ch.removeAttribute("disabled");
      ch.classList.add("hover");
      ch.classList.remove("correct", "wrong");
    });
  }
}

function finishQuiz() {
  quizBox.innerHTML = "";

  const finish = document.createElement("span");
  finish.innerText = `your score is ${correct}/10`;
  quizBox.appendChild(finish);

  const restart = document.createElement("input");
  restart.setAttribute("type", "submit");
  restart.setAttribute("id", "restart");
  restart.setAttribute("value", "restart");
  restart.addEventListener("click", onClickRestart);
  quizBox.appendChild(restart);
}

function onClickRestart() {
  location.reload();
}

(async () => {
  try {
    fetchData(url) //
      .then(printData);
  } catch (err) {
    console.error(err);
  }
})();

submit.addEventListener("click", onClickSubmit);
next.addEventListener("click", onClickNext);
chs.forEach((ch) => {
  ch.addEventListener("click", onClickChoice);
});
