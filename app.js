const url = "https://opentdb.com/api.php?amount=1&type=multiple";

const question = document.getElementById("question");
const submit = document.getElementById("submit");
const next = document.getElementById("next");

const form = document.querySelector(".quiz-box__main form");
const ch1 = document.getElementById("choice1");
const ch2 = document.getElementById("choice2");
const ch3 = document.getElementById("choice3");
const ch4 = document.getElementById("choice4");
const chs = [ch1, ch2, ch3, ch4];

let answer = "";
let userChoice = "";

function fetchData(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => printData(data));
}

function printData(data) {
  //console.log(data);
  question.innerText = data.results[0].question;

  answer = data.results[0].correct_answer;
  const answers = data.results[0].incorrect_answers;
  const answerNum = Math.floor(Math.random() * 4);
  answers.splice(answerNum, 0, answer);

  chs.forEach((ch, idx) => {
    ch.value = answers[idx];
  });
}

function onClickChoice(event) {
  chs.forEach((ch) => {
    ch.classList.remove("selected");
  });
  event.target.classList.add("selected");
  userChoice = event.target.value;
}

function onClickSubmit(event) {
  event.preventDefault();

  if (userChoice === "") {
    console.log("choose answer!");
  } else if (userChoice === answer) {
    console.log("correct!");
    printResult();
  } else {
    console.log("wrong!");
    printResult();
  }
}

function printResult() {
  next.classList.remove("hidden");
  submit.classList.add("hidden");

  chs.forEach((ch) => {
    ch.removeEventListener("click", onClickChoice);
    ch.setAttribute("disabled", "true");

    if (ch.value === answer) {
      ch.classList.remove("selected");
      ch.classList.add("correct");
    }

    if (ch.value === userChoice && ch.value !== answer) {
      ch.classList.remove("selected");
      ch.classList.add("wrong");
    }
  });
}

submit.addEventListener("click", onClickSubmit);
next.addEventListener("click", window.location.reload);
chs.forEach((ch) => {
  ch.addEventListener("click", onClickChoice);
});

fetchData(url);
