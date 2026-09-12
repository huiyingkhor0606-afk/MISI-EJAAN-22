const questions = [
  {
    visual: "⚪",
    text: "Bentuk seperti bola ialah ______.",
    options: ["bulat", "leper", "bujur"],
    answer: "bulat"
  },
  {
    visual: "⬛",
    text: "Bentuk yang mempunyai empat sisi sama panjang ialah ______.",
    options: ["segi tiga", "segi empat", "bulat"],
    answer: "segi empat"
  },
  {
    visual: "🔺",
    text: "Bentuk yang mempunyai tiga sisi ialah ______.",
    options: ["segi tiga", "segi empat", "bujur"],
    answer: "segi tiga"
  },
  {
    visual: "🥚",
    text: "Bentuk telur biasanya berbentuk ______.",
    options: ["bujur", "bulat", "leper"],
    answer: "bujur"
  },
  {
    visual: "🪭",
    text: "Kipas yang nipis dan rata boleh digambarkan sebagai ______.",
    options: ["ringan", "leper", "segar"],
    answer: "leper"
  },
  {
    visual: "🍹",
    text: "Jus yang baru dibuat dan baik untuk diminum ialah ______.",
    options: ["segar", "selesa", "bujur"],
    answer: "segar"
  },
  {
    visual: "🛋️",
    text: "Kerusi sofa yang empuk membuat kita berasa ______.",
    options: ["leper", "selesa", "bulat"],
    answer: "selesa"
  },
  {
    visual: "🪶",
    text: "Bulu ayam mudah diangkat kerana sangat ______.",
    options: ["ringan", "segar", "leper"],
    answer: "ringan"
  },
  {
    visual: "😴",
    text: "Selepas bermain, kita boleh ______ di bawah pokok.",
    options: ["berehat", "segi tiga", "segar"],
    answer: "berehat"
  },
  {
    visual: "🌴",
    text: "Tempat yang teduh dan nyaman membuat kita berasa ______.",
    options: ["nyaman", "bujur", "leper"],
    answer: "nyaman"
  }
];

let current = 0;
let score = 0;
let student = "";
let answered = false;

const $ = (id) => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startGame() {
  const name = $("studentName").value.trim();
  if (!name) {
    $("studentName").focus();
    $("studentName").style.borderColor = "#ef6b72";
    $("studentName").placeholder = "Sila masukkan nama kamu dahulu 😊";
    return;
  }

  student = name;
  current = 0;
  score = 0;
  $("playerName").textContent = student;
  $("score").textContent = score;
  showScreen("quizScreen");
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const q = questions[current];

  $("questionNumber").textContent = `Soalan ${current + 1} daripada ${questions.length}`;
  $("progressPercent").textContent = `${Math.round(((current + 1) / questions.length) * 100)}%`;
  $("progressFill").style.width = `${((current + 1) / questions.length) * 100}%`;
  $("questionVisual").textContent = q.visual;
  $("questionText").textContent = q.text;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("nextBtn").classList.add("hidden");

  const options = $("options");
  options.innerHTML = "";

  // Shuffle the answer choices on every question.
  [...q.options].sort(() => Math.random() - 0.5).forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = choice;
    btn.type = "button";
    btn.addEventListener("click", () => checkAnswer(choice, btn));
    options.appendChild(btn);
  });
}

function checkAnswer(choice, clickedButton) {
  if (answered) return;
  answered = true;

  const q = questions[current];
  const buttons = [...document.querySelectorAll(".option")];

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === q.answer) btn.classList.add("correct");
  });

  if (choice === q.answer) {
    score++;
    $("score").textContent = score;
    clickedButton.classList.add("correct");
    $("feedback").className = "feedback correct";
    $("feedback").textContent = "🎉 Betul! Syabas, kamu hebat!";
  } else {
    clickedButton.classList.add("wrong");
    $("feedback").className = "feedback wrong";
    $("feedback").textContent = `😊 Hampir betul! Jawapan yang tepat ialah "${q.answer}".`;
  }

  $("nextBtn").classList.remove("hidden");
  $("nextBtn").textContent = current === questions.length - 1 ? "🏆 Lihat Keputusan" : "Seterusnya ➜";
}

function nextQuestion() {
  if (!answered) return;
  current++;

  if (current >= questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

function showResult() {
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  const wrong = total - score;

  $("resultName").textContent = student;
  $("finalScore").textContent = score;
  $("correctCount").textContent = score;
  $("wrongCount").textContent = wrong;
  $("percentage").textContent = `${percentage}%`;

  let message, emoji, starCount;
  if (score === 10) {
    emoji = "🏆";
    message = "Hebat! Semua jawapan betul. Kamu memang Juara Ejaan 22!";
    starCount = 5;
  } else if (score >= 8) {
    emoji = "🌟";
    message = "Cemerlang! Kamu sudah menguasai banyak kosa kata Ejaan 22.";
    starCount = 4;
  } else if (score >= 5) {
    emoji = "😊";
    message = "Bagus! Teruskan berlatih supaya lebih yakin.";
    starCount = 3;
  } else {
    emoji = "💪";
    message = "Jangan putus asa! Cuba lagi dan ingat perkataan sedikit demi sedikit.";
    starCount = 2;
  }

  $("resultEmoji").textContent = emoji;
  $("resultMessage").textContent = message;
  $("stars").textContent = "⭐".repeat(starCount) + "☆".repeat(5 - starCount);

  showScreen("resultScreen");
}

function restartGame() {
  $("studentName").value = student;
  showScreen("quizScreen");
  current = 0;
  score = 0;
  $("score").textContent = "0";
  renderQuestion();
}

$("startBtn").addEventListener("click", startGame);
$("nextBtn").addEventListener("click", nextQuestion);
$("restartBtn").addEventListener("click", restartGame);

$("studentName").addEventListener("keydown", (e) => {
  if (e.key === "Enter") startGame();
});
