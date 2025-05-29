document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const quizArea = document.getElementById('quizArea');
    const resultArea = document.getElementById('resultArea');
    const quizTitle = document.getElementById('quizTitle');
    const studentInfoDisplay = document.getElementById('studentInfo');
    const questionContainer = document.getElementById('questionContainer');
    const optionsContainer = document.getElementById('optionsContainer');
    const nextButton = document.getElementById('nextButton');

    const jumpscareContainer = document.getElementById('jumpscare-container');
    const jumpscareAudio = document.getElementById('jumpscare-audio');
    const applauseContainer = document.getElementById('applause-container');
    const applauseAudio = document.getElementById('applause-audio');

    let currentQuestionIndex = 0;
    let quizData = null;
    let studentAnswers = [];
    let studentDetails = {};

    const SCORE_MC = 7; 
    const SCORE_ESSAY = 6; 
    const MIN_PASS_SCORE = 75;
    const JUMPSCARE_DURATION = 3000; // Durasi jumpscare dalam milidetik (3 detik)
    const APPLAUSE_DURATION = 4000; // Durasi applause dalam milidetik (4 detik)

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('studentName').value.trim();
            const className = document.getElementById('studentClass').value.trim();
            const subject = document.getElementById('subject').value;

            if (name && className) {
                studentDetails = { name, className, subject };
                sessionStorage.setItem('studentDetails', JSON.stringify(studentDetails));
                window.location.href = 'quiz.html';
            } else {
                alert('Nama dan Kelas wajib diisi!');
            }
        });
    }

    if (quizArea) { // Berarti kita di halaman quiz.html
        loadQuiz();
        if (nextButton) { // Pastikan tombol ada sebelum menambah event listener
             nextButton.addEventListener('click', handleNextQuestion);
        }
    }
    
    function loadQuiz() {
        const storedDetails = sessionStorage.getItem('studentDetails');
        if (!storedDetails) {
            alert('Silakan login terlebih dahulu.');
            window.location.href = 'student_login.html';
            return;
        }
        studentDetails = JSON.parse(storedDetails);

        if (studentInfoDisplay) {
             studentInfoDisplay.innerHTML = `Peserta: <strong>${studentDetails.name}</strong> - Kelas: <strong>${studentDetails.className}</strong>`;
        }

        const rawQuizData = localStorage.getItem('fiqhQuizData');
        if (!rawQuizData) {
            if (quizTitle) quizTitle.textContent = "Kuis Tidak Ditemukan!";
            if (questionContainer) questionContainer.innerHTML = "<p>Pastikan guru telah membuat soal dan menyimpannya dari halaman guru.</p>";
            if (nextButton) nextButton.classList.add('hidden');
            if (optionsContainer) optionsContainer.innerHTML = '';
            return;
        }
        quizData = JSON.parse(rawQuizData);
        quizData.allQuestions = [...quizData.multipleChoice, ...quizData.essays]; 

        if (quizTitle) quizTitle.textContent = quizData.title || "Kuis Fiqh";
        displayQuestion();
    }

    function displayQuestion() {
        if (!quizData || !quizData.allQuestions) {
            console.error("Data kuis tidak termuat dengan benar.");
             if (quizTitle) quizTitle.textContent = "Error Memuat Kuis!";
            return;
        }
        if (currentQuestionIndex < quizData.allQuestions.length) {
            const questionData = quizData.allQuestions[currentQuestionIndex];
            if (questionContainer) questionContainer.innerHTML = `<p><strong>Soal ${currentQuestionIndex + 1} dari ${quizData.allQuestions.length}:</strong></p><p>${questionData.question}</p>`;
            if (optionsContainer) optionsContainer.innerHTML = ''; 

            if (questionData.options) { 
                questionData.options.forEach((option, index) => {
                    const radioId = `option_${index}`;
                    if (optionsContainer) optionsContainer.innerHTML += `
                        <label for="${radioId}" class="option-label">
                            <input type="radio" id="${radioId}" name="answer" value="${index}">
                            ${String.fromCharCode(65 + index)}. ${option}
                        </label><br>
                    `;
                });
            } else { 
                if (optionsContainer) optionsContainer.innerHTML = `
                    <textarea id="essay_answer" rows="5" placeholder="Tulis jawaban esai Anda di sini..."></textarea>
                `;
            }
            if (nextButton) {
                if (currentQuestionIndex === quizData.allQuestions.length - 1) {
                    nextButton.textContent = 'Selesaikan Kuis';
                } else {
                    nextButton.textContent = 'Soal Berikutnya';
                }
            }
        } else {
            finishQuiz();
        }
    }

    function handleNextQuestion() {
        const questionData = quizData.allQuestions[currentQuestionIndex];
        let answer;

        if (questionData.options) { 
            const selectedOption = document.querySelector('input[name="answer"]:checked');
            if (!selectedOption) {
                alert('Harap pilih salah satu jawaban!');
                return;
            }
            answer = parseInt(selectedOption.value);
        } else { 
            const essayAnswer = document.getElementById('essay_answer');
            if (!essayAnswer.value.trim()) {
                if (!confirm("Anda belum menjawab esai ini. Yakin ingin melanjutkan? Jawaban kosong tidak akan mendapat poin.")) {
                    return;
                }
                answer = ""; 
            } else {
                answer = essayAnswer.value.trim();
            }
        }
        studentAnswers.push(answer);
        currentQuestionIndex++;
        displayQuestion();
    }

    function finishQuiz() {
        if (quizArea) quizArea.classList.add('hidden');
        if (resultArea) resultArea.classList.remove('hidden');

        let score = 0;
        quizData.allQuestions.forEach((q, index) => {
            if (q.options) { 
                if (studentAnswers[index] === q.correctAnswer) {
                    score += SCORE_MC;
                }
            } else { 
                if (studentAnswers[index] && studentAnswers[index].length > 0) { 
                    score += SCORE_ESSAY;
                }
            }
        });

        score = Math.min(score, 100); 

        if (document.getElementById('resultName')) document.getElementById('resultName').textContent = studentDetails.name;
        if (document.getElementById('resultClass')) document.getElementById('resultClass').textContent = studentDetails.className;
        if (document.getElementById('resultScore')) document.getElementById('resultScore').textContent = score;

        let message = "";
        if (score === 100) {
            message = "LUAR BIASA! Anda memahami materi dengan sempurna!";
            triggerApplause();
        } else if (score >= MIN_PASS_SCORE) {
            message = "Selamat! Anda berhasil melewati batas minimal. Terus tingkatkan pemahaman Anda!";
        } else {
            message = "Sayang sekali, skor Anda di bawah batas minimal. Jangan menyerah, coba lagi!";
            triggerJumpscare();
        }
        if (document.getElementById('resultMessage')) document.getElementById('resultMessage').textContent = message;
        saveResultToLeaderboard(studentDetails.name, studentDetails.className, score);
    }
    
    function saveResultToLeaderboard(name, className, score) {
        const results = JSON.parse(localStorage.getItem('quizResults')) || [];
        results.push({
            name: name,
            className: className,
            score: score,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('quizResults', JSON.stringify(results));
    }

    function triggerJumpscare() {
        if(jumpscareContainer && jumpscareAudio) {
            jumpscareContainer.classList.remove('hidden');
            jumpscareAudio.play().catch(e => console.warn("Audio jumpscare gagal diputar otomatis:", e));
            setTimeout(() => {
                jumpscareContainer.classList.add('hidden');
            }, JUMPSCARE_DURATION);
        }
    }

    function triggerApplause() {
         if(applauseContainer && applauseAudio) {
            applauseContainer.classList.remove('hidden');
            applauseAudio.play().catch(e => console.warn("Audio tepuk tangan gagal diputar otomatis:", e));
            setTimeout(() => {
                applauseContainer.classList.add('hidden');
            }, APPLAUSE_DURATION);
        }
    }

    // Inisialisasi untuk halaman kuis
    if (document.getElementById('quizArea') && !document.getElementById('loginForm')) {
        if (!sessionStorage.getItem('studentDetails')) {
            if (!resultArea || resultArea.classList.contains('hidden')) {
                 alert('Sesi Anda tidak ditemukan, silakan login kembali.');
                 window.location.href = 'student_login.html';
            }
        } else {
             studentDetails = JSON.parse(sessionStorage.getItem('studentDetails'));
             if (studentInfoDisplay) {
                studentInfoDisplay.innerHTML = `Peserta: <strong>${studentDetails.name}</strong> - Kelas: <strong>${studentDetails.className}</strong>`;
             }
        }
    }
});
