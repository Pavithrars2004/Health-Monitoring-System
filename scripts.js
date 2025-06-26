document.addEventListener('DOMContentLoaded', () => {
    // Navigation buttons
    const loginBtn = document.getElementById('login-btn');
    const testBtn = document.getElementById('test-btn');
    const quizBtn = document.getElementById('quiz-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    if (testBtn) {
        testBtn.addEventListener('click', () => {
            window.location.href = 'test.html';
        });
    }

    if (quizBtn) {
        quizBtn.addEventListener('click', () => {
            window.location.href = 'quiz.html';
        });
    }
});


