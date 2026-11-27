/* ========================================
   1. スマートフォン用メニュー
======================================== */

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "目次を閉じる" : "目次を開く"
    );
});

// 目次を選択したらメニューを閉じる
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        sidebar.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});


/* ========================================
   2. 学習進捗の管理
======================================== */

const progressChecks = document.querySelectorAll(".progress-check");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

function updateProgress() {

    const total = progressChecks.length;

    const completed = document.querySelectorAll(
        ".progress-check:checked"
    ).length;

    const percentage = total === 0
        ? 0
        : (completed / total) * 100;

    progressFill.style.width = percentage + "%";

    progressText.textContent =
        `${completed} / ${total} 完了`;

}

// チェックが変更されたら進捗を更新
progressChecks.forEach(check => {
    check.addEventListener("change", updateProgress);
});

updateProgress();


/* ========================================
   3. コードのコピー機能
======================================== */

document.querySelectorAll(".copy-button").forEach(button => {

    button.addEventListener("click", async () => {

        const targetId = button.dataset.copy;
        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        const text = target.textContent;

        try {

            await navigator.clipboard.writeText(text);

            button.textContent = "コピーしました！";

            setTimeout(() => {
                button.textContent = "コピー";
            }, 2000);

        } catch (error) {

            button.textContent = "コピーできません";

            console.error("コピーに失敗しました", error);

        }

    });

});


/* ========================================
   4. 理解度チェック
======================================== */

const gradeButton = document.getElementById("gradeButton");
const quizResult = document.getElementById("quizResult");

gradeButton.addEventListener("click", () => {

    const questions = document.querySelectorAll(".quiz-question");

    let score = 0;
    let unanswered = 0;

    questions.forEach((question, index) => {

        const correctAnswer = question.dataset.answer;

        const selected = question.querySelector(
            'input[type="radio"]:checked'
        );

        question.classList.remove("correct", "incorrect");

        if (!selected) {

            unanswered++;

            question.classList.add("incorrect");

            return;
        }

        if (selected.value === correctAnswer) {

            score++;

            question.classList.add("correct");

        } else {

            question.classList.add("incorrect");

        }

    });

    if (unanswered > 0) {

        quizResult.className = "quiz-result show";

        quizResult.innerHTML = `
            <strong>まだ回答していない問題があります。</strong>
            <p>${unanswered}問が未回答です。すべて回答してから採点してください。</p>
        `;

        return;
    }

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    let message = "";

    if (score === total) {

        message = "全問正解です！素晴らしい！";

    } else if (score >= total * 0.8) {

        message = "よくできました！あと少しで満点です。";

    } else if (score >= total * 0.6) {

        message = "合格ラインです。間違えた問題を復習しましょう。";

    } else {

        message = "もう一度教材を読み直してみましょう。";

    }

    quizResult.className = "quiz-result show";

    quizResult.innerHTML = `
        <h3>採点結果</h3>
        <p class="quiz-score">${score} / ${total} 問正解</p>
        <p>正答率：${percentage}%</p>
        <strong>${message}</strong>
    `;

    quizResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});


/* ========================================
   5. 現在の目次を強調表示
======================================== */

const sections = document.querySelectorAll(
    ".main-content section[id]"
);

const navLinks = document.querySelectorAll(".nav-link");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) {
            return;
        }

        const currentId = entry.target.id;

        navLinks.forEach(link => {

            const href = link.getAttribute("href");

            link.classList.toggle(
                "active",
                href === "#" + currentId
            );

        });

    });

}, {
    rootMargin: "-15% 0px -75% 0px"
});

sections.forEach(section => {
    observer.observe(section);
});


/* ========================================
   6. 外部リンクの確認
======================================== */

// 外部リンクは新しいタブで開く設定にしています。
// HTML側のtarget="_blank"とrel="noopener noreferrer"を使用します。


/* ========================================
   初期化完了
======================================== */

console.log("Web制作入門 第0章を読み込みました。");
