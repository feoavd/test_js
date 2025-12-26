// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Конфигурация викторины
    const quizConfig = {
        totalQuestions: 6,
        correctAnswers: {
            1: "1", // Правильный ответ: "Он выиграл в лотерею"
            2: "42", // Возраст: 42 год (если 2025 год)
            3: ["2", "3"], // Правильные ответы: "Евровидение" и "Танцы со звездами"
            4: "видел снег", // Продолжение песни
            5: "found", // Найден на фото
            6: "183" // Рост в см
        },
        scores: {
            1: 1,
            2: 1,
            3: 2, // За вопрос с множественным выбором можно получить 2 балла
            4: 1,
            5: 1,
            6: 1
        }
    };

    // Переменные состояния
    let currentQuestion = 1;
    let userAnswers = {};
    let totalScore = 0;
    let progressInterval;

    // Инициализация
    initQuiz();

    // Функция инициализации викторины
    function initQuiz() {
        showQuestion(currentQuestion);
        updateProgressBar();
        setupEventListeners();
    }

    // Показать вопрос
    function showQuestion(questionNumber) {
        // Скрыть все вопросы
        document.querySelectorAll('.question-container').forEach(q => {
            q.classList.remove('active');
        });
        
        // Показать нужный вопрос
        const questionElement = document.getElementById(`question${questionNumber}`);
        if (questionElement) {
            questionElement.classList.add('active');
        }
        
        // Обновить прогресс-бар
        updateProgressBar();
    }

    // Обновить прогресс-бар
    function updateProgressBar() {
        const progress = ((currentQuestion - 1) / quizConfig.totalQuestions) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Вопрос 1: Выбор одного варианта
        setupSingleChoiceQuestion(1);
        
        // Вопрос 2: Числовой ввод
        setupNumberInputQuestion(2);
        
        // Вопрос 3: Множественный выбор
        setupMultipleChoiceQuestion(3);
        
        // Вопрос 4: Текстовый ввод
        setupTextInputQuestion(4);
        
        // Вопрос 5: Найти на изображении
        setupFindOnImageQuestion(5);
        
        // Вопрос 6: Числовой ввод (рост)
        setupNumberInputQuestion(6);
        
        // Кнопки подсказок
        document.querySelectorAll('.hint-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const hintId = this.getAttribute('data-hint');
                const hintContent = document.getElementById(`hint${hintId}`);
                
                if (hintContent.classList.contains('show')) {
                    hintContent.classList.remove('show');
                } else {
                    // Скрыть все открытые подсказки
                    document.querySelectorAll('.hint-content').forEach(h => {
                        h.classList.remove('show');
                    });
                    hintContent.classList.add('show');
                }
            });
        });
        
        // Кнопка перехода на следующую страницу
        document.getElementById('nextPageBtn').addEventListener('click', function() {
            window.location.href = 'index2.html';
        });
    }

    // Вопрос с выбором одного варианта
    function setupSingleChoiceQuestion(questionNumber) {
        const options = document.querySelectorAll(`.option[data-question="${questionNumber}"]`);
        const resultElement = document.getElementById(`result${questionNumber}`);
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                // Снять выделение с других вариантов
                options.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Выделить выбранный вариант
                this.classList.add('selected');
                
                // Сохранить ответ пользователя
                userAnswers[questionNumber] = this.getAttribute('data-value');
                
                // Проверить ответ
                checkAnswer(questionNumber);
            });
        });
    }

    // Вопрос с числовым вводом
    function setupNumberInputQuestion(questionNumber) {
        const input = document.getElementById(`answer${questionNumber}`);
        const checkBtn = document.getElementById(`check${questionNumber}`);
        const resultElement = document.getElementById(`result${questionNumber}`);
        
        checkBtn.addEventListener('click', function() {
            const userAnswer = input.value.trim();
            
            if (!userAnswer) {
                showResult(questionNumber, false, "Пожалуйста, введите ответ");
                return;
            }
            
            userAnswers[questionNumber] = userAnswer;
            checkAnswer(questionNumber);
        });
        
        // Разрешить нажатие Enter для проверки
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkBtn.click();
            }
        });
    }

    // Вопрос с множественным выбором
    function setupMultipleChoiceQuestion(questionNumber) {
        const options = document.querySelectorAll(`.option[data-question="${questionNumber}"]`);
        const checkBtn = document.getElementById(`check${questionNumber}`);
        const resultElement = document.getElementById(`result${questionNumber}`);
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                // Переключить выбранное состояние
                this.classList.toggle('selected');
                
                // Обновить список выбранных ответов
                const selectedOptions = Array.from(options)
                    .filter(opt => opt.classList.contains('selected'))
                    .map(opt => opt.getAttribute('data-value'));
                
                userAnswers[questionNumber] = selectedOptions;
                
                // Активировать/деактивировать кнопку проверки
                checkBtn.disabled = selectedOptions.length === 0;
            });
        });
        
        checkBtn.addEventListener('click', function() {
            if (!userAnswers[questionNumber] || userAnswers[questionNumber].length === 0) {
                showResult(questionNumber, false, "Пожалуйста, выберите хотя бы один вариант");
                return;
            }
            
            checkAnswer(questionNumber);
        });
    }

    // Вопрос с текстовым вводом
    function setupTextInputQuestion(questionNumber) {
        const input = document.getElementById(`answer${questionNumber}`);
        const checkBtn = document.getElementById(`check${questionNumber}`);
        const resultElement = document.getElementById(`result${questionNumber}`);
        
        checkBtn.addEventListener('click', function() {
            const userAnswer = input.value.trim().toUpperCase();
            
            if (!userAnswer) {
                showResult(questionNumber, false, "Пожалуйста, введите ответ");
                return;
            }
            
            userAnswers[questionNumber] = userAnswer;
            checkAnswer(questionNumber);
        });
        
        // Разрешить нажатие Enter для проверки
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkBtn.click();
            }
        });
    }

    // Вопрос "Найди на изображении"
    function setupFindOnImageQuestion(questionNumber) {
        const image = document.getElementById('sergeiImage');
        const resultElement = document.getElementById(`result${questionNumber}`);
        
        // Определяем область для клика (примерные координаты)
        // В реальном проекте здесь должна быть точная область
        const correctArea = {
            x: 100, // Примерные координаты
            y: 50,
            width: 150,
            height: 200
        };
        
        image.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Проверяем, попал ли клик в область Сергея
            const isCorrect = 
                x >= correctArea.x && 
                x <= correctArea.x + correctArea.width && 
                y >= correctArea.y && 
                y <= correctArea.y + correctArea.height;
            
            if (isCorrect) {
                userAnswers[questionNumber] = "found";
                showResult(questionNumber, true, "Поздравляем! Вы нашли Сергея!");
                
                // Показать эффект успеха
                this.style.boxShadow = "0 0 0 5px rgba(139, 195, 74, 0.5)";
                setTimeout(() => {
                    this.style.boxShadow = "";
                }, 1000);
            } else {
                userAnswers[questionNumber] = "not_found";
                showResult(questionNumber, false, "Вы кликнули не на Сергея. Попробуйте еще раз!");
                
                // Показать эффект ошибки
                this.style.boxShadow = "0 0 0 5px rgba(242, 139, 130, 0.5)";
                setTimeout(() => {
                    this.style.boxShadow = "";
                }, 1000);
            }
            
            checkAnswer(questionNumber);
        });
    }

    // Проверить ответ на вопрос
    function checkAnswer(questionNumber) {
        const userAnswer = userAnswers[questionNumber];
        const correctAnswer = quizConfig.correctAnswers[questionNumber];
        const resultElement = document.getElementById(`result${questionNumber}`);
        
        let isCorrect = false;
        let message = "";
        
        // Проверка в зависимости от типа вопроса
        switch(questionNumber) {
            case 1:
            case 2:
            case 4:
            case 6:
                // Простые сравнения
                isCorrect = String(userAnswer).toUpperCase() === String(correctAnswer).toUpperCase();
                message = isCorrect 
                    ? `Правильно! ${getCorrectMessage(questionNumber)}` 
                    : `Неправильно. ${getIncorrectMessage(questionNumber)}`;
                break;
                
            case 3:
                // Множественный выбор - проверяем массивы
                if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                    // Сортируем для сравнения
                    const sortedUser = [...userAnswer].sort();
                    const sortedCorrect = [...correctAnswer].sort();
                    
                    // Преобразуем в строки для сравнения
                    isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
                    
                    if (isCorrect) {
                        message = "Отлично! Вы правильно выбрали все телепроекты!";
                    } else {
                        const correctCount = userAnswer.filter(val => correctAnswer.includes(val)).length;
                        message = `Частично правильно. Вы выбрали ${correctCount} из 2 правильных ответов.`;
                    }
                }
                break;
                
            case 5:
                // Найди на фото
                isCorrect = userAnswer === correctAnswer;
                message = isCorrect 
                    ? "Отлично! Вы нашли Сергея на фото!" 
                    : "Попробуйте еще раз!";
                break;
        }
        
        // Показать результат
        showResult(questionNumber, isCorrect, message);
        
        // Если ответ правильный, добавляем баллы
        if (isCorrect && !userAnswers[`${questionNumber}_scored`]) {
            totalScore += quizConfig.scores[questionNumber];
            userAnswers[`${questionNumber}_scored`] = true;
        }
        
        // Перейти к следующему вопросу через 2 секунды
        if (isCorrect || questionNumber === 5) {
            setTimeout(() => {
                nextQuestion();
            }, 2000);
        }
    }

    // Показать результат для вопроса
    function showResult(questionNumber, isCorrect, message) {
        const resultElement = document.getElementById(`result${questionNumber}`);
        
        // Обновить стиль и текст
        resultElement.textContent = message;
        resultElement.className = `result ${isCorrect ? 'correct' : 'incorrect'} show`;
        
        // Добавить анимацию
        resultElement.classList.add('pulse');
        setTimeout(() => {
            resultElement.classList.remove('pulse');
        }, 500);
        
        // Для вопросов с вариантами ответов подсветить правильные/неправильные
        if (questionNumber === 1 || questionNumber === 3) {
            highlightAnswers(questionNumber, isCorrect);
        }
    }

    // Подсветить правильные и неправильные ответы
    function highlightAnswers(questionNumber, userWasCorrect) {
        const correctAnswer = quizConfig.correctAnswers[questionNumber];
        const options = document.querySelectorAll(`.option[data-question="${questionNumber}"]`);
        
        options.forEach(option => {
            const optionValue = option.getAttribute('data-value');
            const isCorrectOption = Array.isArray(correctAnswer) 
                ? correctAnswer.includes(optionValue)
                : optionValue === correctAnswer;
            
            // Сбрасываем классы
            option.classList.remove('correct', 'incorrect');
            
            // Если пользователь уже ответил, показываем правильные ответы
            if (userAnswers[questionNumber]) {
                if (isCorrectOption) {
                    option.classList.add('correct');
                } else if (option.classList.contains('selected') && !isCorrectOption) {
                    option.classList.add('incorrect');
                }
            }
        });
    }

    // Перейти к следующему вопросу
    function nextQuestion() {
        // Скрыть текущий вопрос
        document.getElementById(`question${currentQuestion}`).classList.remove('active');
        
        // Увеличить номер текущего вопроса
        currentQuestion++;
        
        // Если вопросы закончились, показать результаты
        if (currentQuestion > quizConfig.totalQuestions) {
            showFinalResults();
        } else {
            // Показать следующий вопрос
            showQuestion(currentQuestion);
        }
        
        // Обновить прогресс-бар
        updateProgressBar();
    }

    // Показать финальные результаты
    function showFinalResults() {
        const resultContainer = document.getElementById('finalResult');
        const totalScoreElement = document.getElementById('totalScore');
        const scoreOutOfElement = document.getElementById('scoreOutOf');
        const scoreMessageElement = document.getElementById('scoreMessage');
        const nextPageBtn = document.getElementById('nextPageBtn');
        
        // Вычислить максимально возможный балл
        const maxScore = Object.values(quizConfig.scores).reduce((a, b) => a + b, 0);
        
        // Обновить отображение результатов
        totalScoreElement.textContent = totalScore;
        scoreOutOfElement.textContent = `${totalScore} из ${maxScore}`;
        
        // Показать сообщение в зависимости от результата
        let message = "";
        if (totalScore === maxScore) {
            message = "Потрясающе! Вы настоящий эксперт по Сергею Лазареву! ";
        } else if (totalScore >= maxScore * 0.7) {
            message = "Отличный результат! Вы хорошо знаете Сергея Лазарева! ";
        } else if (totalScore >= maxScore * 0.5) {
            message = "Неплохо! Вы кое-что знаете о Сергее Лазареве. ";
        } else {
            message = "Есть куда стремиться! Узнайте больше о Сергее Лазареве! ";
        }
        
        scoreMessageElement.textContent = message;
        
        // Показать контейнер с результатами
        resultContainer.classList.add('show');
        
        // Активировать кнопку перехода на следующую страницу
        nextPageBtn.disabled = false;
        
        // Прокрутить к результатам
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Вспомогательные функции для сообщений
    function getCorrectMessage(questionNumber) {
        const messages = {
            1: "Сергей действительно выиграл в лотерею!",
            2: "Сергею действительно 42 год!",
            4: "Правильно, продолжение: 'снег в океане'!",
            6: "Верно, рост Сергея 183 см!"
        };
        return messages[questionNumber] || "Правильный ответ!";
    }
    
    function getIncorrectMessage(questionNumber) {
        const messages = {
            1: "Правильный ответ: Он выиграл в лотерею.",
            2: "Правильный ответ: 42 год.",
            4: "Правильный ответ: видел снег",
            6: "Правильный ответ: 183 см."
        };
        return messages[questionNumber] || "Попробуйте еще раз!";
    }
});
