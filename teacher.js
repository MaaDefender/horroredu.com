document.addEventListener('DOMContentLoaded', () => {
    const NUM_MC_QUESTIONS = 10;
    const NUM_ESSAY_QUESTIONS = 5;

    const mcQuestionsContainer = document.getElementById('multipleChoiceQuestions');
    const essayQuestionsContainer = document.getElementById('essayQuestions');
    const quizSetupForm = document.getElementById('quizSetupForm');
    const publicationLinkDiv = document.getElementById('publicationLink');
    const generatedLinkInput = document.getElementById('generatedLink');
    const leaderboardBody = document.getElementById('leaderboardBody');
    const refreshLeaderboardBtn = document.getElementById('refreshLeaderboardBtn');

    // Contoh Soal (bisa dikosongkan jika ingin guru mengisi dari awal)
    // Format: [soal, pilihanA, pilihanB, pilihanC, pilihanD, jawabanBenarIndex (0-3)]
    const defaultMcQuestions = [
        ["Ketetapan Allah SWT yang telah tertulis di Lauhul Mahfuzh sejak zaman azali disebut...", "Qadha", "Qadhar", "Ikhtiar", "Tawakkal", 0],
        ["Perwujudan atau realisasi dari Qadha Allah SWT yang berkaitan dengan detail ukuran disebut...", "Qadha", "Qadhar", "Takdir Mubram", "Doa", 1],
        ["Beriman kepada Qadha dan Qadhar Allah SWT merupakan salah satu pilar dalam...", "Rukun Islam", "Rukun Iman", "Syarat Sah Shalat", "Sunnah Muakkadah", 1],
        ["Sikap yang benar seorang Muslim dalam menyikapi takdir Allah SWT adalah...", "Pasrah total tanpa usaha.", "Menyalahkan keadaan.", "Berusaha (ikhtiar) dan berserah diri (tawakkal).", "Merasa manusia tak punya peran.", 2],
        ["Salah satu hikmah utama beriman kepada Qadha dan Qadhar adalah menumbuhkan sifat...", "Sombong dan putus asa.", "Malas berusaha.", "Sabar dan syukur.", "Iri hati.", 2],
        ["Takdir yang kejadiannya dapat dipengaruhi oleh usaha manusia disebut...", "Takdir Mubram", "Takdir Mu'allaq", "Lauhul Mahfuzh", "Azali", 1],
        ["Kematian, jenis kelamin, dan jodoh adalah contoh dari...", "Takdir Mu'allaq", "Takdir Mubram", "Ikhtiar Manusia", "Keberuntungan Semata", 1],
        ["Memahami Qadha dan Qadhar akan membuat seorang Muslim terhindar dari sifat...", "Optimis.", "Rendah hati.", "Arogan saat sukses dan putus asa saat gagal.", "Giat bekerja.", 2],
        ["Usaha dan upaya maksimal yang dilakukan manusia untuk mencapai sesuatu disebut...", "Tawakkal", "Qana'ah", "Ikhtiar", "Syukur", 2],
        ["Setelah melakukan ikhtiar, langkah selanjutnya adalah...", "Memastikan hasil sesuai keinginan.", "Mengeluh jika gagal.", "Bertawakal kepada Allah SWT.", "Merasa usaha sia-sia.", 2]
    ];

    // Format: [soal]
    const defaultEssayQuestions = [
        "Jelaskan dengan bahasa Anda sendiri apa yang dimaksud dengan Qadha dan Qadhar Allah SWT! Berikan masing-masing satu contoh nyata!",
        "Mengapa beriman kepada Qadha dan Qadhar menjadi salah satu rukun iman? Jelaskan dampak positifnya!",
        "Bagaimana Anda menjelaskan hubungan antara kewajiban manusia untuk berikhtiar dengan keimanan kepada Qadha dan Qadhar?",
        "Sebutkan dan jelaskan minimal tiga hikmah dari meyakini Qadha dan Qadhar Allah SWT!",
        "Apa perbedaan mendasar antara Takdir Mubram dan Takdir Mu'allaq? Berikan contoh konkret!"
    ];


    function createMultipleChoiceInput(index, data = []) {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-block');
        questionDiv.innerHTML = `
            <label for="mc_question_${index}">Soal Pilihan Ganda ${index + 1}:</label>
            <textarea id="mc_question_${index}" name="mc_question_${index}" required>${data[0] || ''}</textarea>
            <label>Pilihan Jawaban:</label>
            <input type="text" name="mc_option_${index}_0" placeholder="Pilihan A" value="${data[1] || ''}" required>
            <input type="text" name="mc_option_${index}_1" placeholder="Pilihan B" value="${data[2] || ''}" required>
            <input type="text" name="mc_option_${index}_2" placeholder="Pilihan C" value="${data[3] || ''}" required>
            <input type="text" name="mc_option_${index}_3" placeholder="Pilihan D" value="${data[4] || ''}" required>
            <label for="mc_correct_${index}">Jawaban Benar:</label>
            <select id="mc_correct_${index}" name="mc_correct_${index}" required>
                <option value="0" ${data[5] === 0 ? 'selected' : ''}>A</option>
                <option value="1" ${data[5] === 1 ? 'selected' : ''}>B</option>
                <option value="2" ${data[5] === 2 ? 'selected' : ''}>C</option>
                <option value="3" ${data[5] === 3 ? 'selected' : ''}>D</option>
            </select>
        `;
        return questionDiv;
    }

    function createEssayInput(index, data = "") {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-block');
        questionDiv.innerHTML = `
            <label for="essay_question_${index}">Soal Esai ${index + 1}:</label>
            <textarea id="essay_question_${index}" name="essay_question_${index}" required>${data || ''}</textarea>
        `;
        return questionDiv;
    }

    for (let i = 0; i < NUM_MC_QUESTIONS; i++) {
        mcQuestionsContainer.appendChild(createMultipleChoiceInput(i, defaultMcQuestions[i]));
    }
    for (let i = 0; i < NUM_ESSAY_QUESTIONS; i++) {
        essayQuestionsContainer.appendChild(createEssayInput(i, defaultEssayQuestions[i]));
    }

    quizSetupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(quizSetupForm);
        const quizData = {
            title: "Kuis Fiqh: Qadha & Qadhar",
            multipleChoice: [],
            essays: []
        };

        for (let i = 0; i < NUM_MC_QUESTIONS; i++) {
            quizData.multipleChoice.push({
                question: formData.get(`mc_question_${i}`),
                options: [
                    formData.get(`mc_option_${i}_0`),
                    formData.get(`mc_option_${i}_1`),
                    formData.get(`mc_option_${i}_2`),
                    formData.get(`mc_option_${i}_3`),
                ],
                correctAnswer: parseInt(formData.get(`mc_correct_${i}`))
            });
        }

        for (let i = 0; i < NUM_ESSAY_QUESTIONS; i++) {
            quizData.essays.push({
                question: formData.get(`essay_question_${i}`)
            });
        }

        try {
            localStorage.setItem('fiqhQuizData', JSON.stringify(quizData));
            alert('Soal berhasil disimpan! Kuis siap dipublikasikan.');
            
            // Perbaikan untuk path link, terutama jika dijalankan dari file://
            let studentLoginPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1) + 'student_login.html';
            if (window.location.protocol === 'file:') {
                 generatedLinkInput.value = 'file://' + studentLoginPath;
            } else {
                 generatedLinkInput.value = window.location.origin + studentLoginPath;
            }
            publicationLinkDiv.classList.remove('hidden');

        } catch (e) {
            alert('Gagal menyimpan soal. LocalStorage mungkin penuh atau tidak didukung.');
            console.error("Error saving to localStorage:", e);
        }
    });

    function loadLeaderboard() {
        leaderboardBody.innerHTML = '';
        const results = JSON.parse(localStorage.getItem('quizResults')) || [];
        results.sort((a, b) => b.score - a.score);

        if (results.length === 0) {
            const row = leaderboardBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 5;
            cell.textContent = "Belum ada siswa yang mengerjakan kuis.";
            cell.style.textAlign = "center";
            return;
        }
        
        results.forEach((result, index) => {
            const row = leaderboardBody.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = result.name;
            row.insertCell().textContent = result.className;
            row.insertCell().textContent = result.score;
            row.insertCell().textContent = new Date(result.timestamp).toLocaleString('id-ID');
        });
    }

    refreshLeaderboardBtn.addEventListener('click', loadLeaderboard);
    loadLeaderboard();
});
