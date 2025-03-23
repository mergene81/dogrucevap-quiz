// Firebase bağlantısı
const firebaseConfig = {
  apiKey: "AIzaSyCtfJmHTeXr3YoUQwaFr2P8EDK7wwqOsQ4",
  authDomain: "dogrucevap-3aa75.firebaseapp.com",
  projectId: "dogrucevap-3aa75",
  storageBucket: "dogrucevap-3aa75.firebasestorage.app",
  messagingSenderId: "12679869016",
  appId: "1:12679869016:web:03b1e0991a968d4d63d02d",
  measurementId: "G-3GHJEE9J0C"
};

// Firebase'i başlat
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;
let totalTime = 0;
let selectedQuestions = [];

const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', startQuiz);

function startQuiz() {
    startBtn.style.display = 'none';
    fetchQuestions();
}

async function fetchQuestions() {
    const snapshot = await db.collection('sorular').get();
    const allQuestions = snapshot.docs.map(doc => doc.data());
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    selectedQuestions = shuffled.slice(0, 10);
    loadQuestion();
}

function loadQuestion() {
    quizContainer.innerHTML = '';

    if (currentQuestion >= selectedQuestions.length) {
        showResult();
        return;
    }

    const q = selectedQuestions[currentQuestion];
    const questionEl = document.createElement('div');
    questionEl.classList.add('question');
    questionEl.innerText = q.question;

    const choicesEl = document.createElement('div');
    choicesEl.classList.add('choices');

    q.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.classList.add('choice');
        btn.innerText = choice;
        btn.addEventListener('click', () => selectAnswer(btn, index));
        choicesEl.appendChild(btn);
    });

    const timerEl = document.createElement('div');
    timerEl.classList.add('timer');
    timerEl.innerText = `Süre: ${timeLeft} saniye`;

    quizContainer.appendChild(questionEl);
    quizContainer.appendChild(choicesEl);
    quizContainer.appendChild(timerEl);

    clearInterval(timer);
    timeLeft = 15;
    timer = setInterval(() => {
        timeLeft--;
        totalTime++;
        timerEl.innerText = `Süre: ${timeLeft} saniye`;
        if (timeLeft === 0) {
            clearInterval(timer);
            currentQuestion++;
            loadQuestion();
        }
    }, 1000);
}

function selectAnswer(btn, index) {
    const q = selectedQuestions[currentQuestion];
    const buttons = document.querySelectorAll('.choice');

    if (index === q.correct) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        buttons[q.correct].classList.add('correct');
    }

    clearInterval(timer);
    buttons.forEach(b => b.disabled = true);

    setTimeout(() => {
        currentQuestion++;
        loadQuestion();
    }, 1000);
}

function showResult() {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    document.getElementById('score').innerText = `Doğru Cevap Sayısı: ${score} / ${selectedQuestions.length}`;
    document.getElementById('time').innerText = `Toplam Süre: ${totalTime} saniye`;
}

function restartQuiz() {
    quizContainer.style.display = 'block';
    resultContainer.style.display = 'none';
    currentQuestion = 0;
    score = 0;
    totalTime = 0;
    startQuiz();
}
