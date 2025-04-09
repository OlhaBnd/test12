// Масив математичних операцій для випадкового вибору
let signs = ['+', '-', '*']

// Оголошення змінних для доступу до елементів на сторінці
let container_main = document.querySelector('.main')  // Головний контейнер
let container_start = document.querySelector('.start')  // Контейнер стартового екрану
let container_start_h3 = container_start.querySelector('h3')  // Заголовок в стартовому контейнері
let question_field = document.querySelector('.question')  // Поле для відображення питання
let answer_buttons = document.querySelectorAll('.answer')  // Кнопки для відповідей
let start_button = document.querySelector('.start-btn')  // Кнопка старту

// Перевірка наявності cookie для високого результату
let cookie = false
let cookies = document.cookie.split('; ')  // Розбиття cookie на окремі пари ключ-значення

// Процес перевірки, чи є значення 'numbers_high_score' в cookie
for (let i = 0; i < cookies.length; i += 1) {
    if (cookies[i].split('=')[0] == 'numbers_high_score') {  // Пошук cookie з високим результатом
        cookie = cookies[i].split('=')[1]  // Якщо знайдено, присвоюємо значення
        break
    }
}

// Якщо є значення в cookie, виводимо повідомлення з попереднім результатом
if (cookie) {
    let data = cookie.split('/')  // Розбиття cookie на кількість правильних і всіх відповідей
    container_start_h3.innerHTML = `<h3>Минулого разу ви дали ${data[1]} правильних відповідей із ${data[0]}. Точність - ${Math.round(data[1] * 100 / data[0])}%.</h3>`  // Виведення статистики
}

// Функція для генерації випадкового числа між min і max
function randint(min, max) {
    return Math.round(Math.random() * (max - min) + min)  // Повертає випадкове ціле число
}

// Функція для отримання випадкового математичного знаку
function getRandomSign() {
    return signs[randint(0, 2)]  // Повертає випадковий знак з масиву signs
}

// Клас для генерації і відображення запитання
class Question {
    constructor() {
        // Генерація двох випадкових чисел для операції
        let a = randint(1, 30)
        let b = randint(1, 30)
        let sign = getRandomSign()  // Вибір випадкового знака
        this.question = `${a} ${sign} ${b}`  // Формування питання

        // Обчислення правильної відповіді в залежності від знака
        if (sign == '+') { this.correct = a + b }
        else if (sign == '-') { this.correct = a - b }
        else if (sign == '*') { this.correct = a * b }

        // Генерація масиву варіантів відповідей
        this.answers = [
            randint(this.correct - 20, this.correct - 1),
            randint(this.correct - 20, this.correct - 1),
            this.correct,
            randint(this.correct + 1, this.correct + 20),
            randint(this.correct + 1, this.correct + 20),
        ]
        shuffle(this.answers);  // Перемішування варіантів відповідей
    }

    // Метод для відображення питання та відповідей
    display () {
        question_field.innerHTML = this.question  // Виведення питання
        for (let i = 0; i < this.answers.length; i += 1) {
            answer_buttons[i].innerHTML = this.answers[i]  // Виведення варіантів відповідей
        }
    }
}

// Змінні для поточного питання та кількості правильних відповідей
let current_question
let correct_answers_given
let total_answers_given

// Обробник події для кнопки старту
start_button.addEventListener('click', function() {
    container_main.style.display = 'flex'  // Показуємо основний екран
    container_start.style.display = 'none'  // Сховуємо стартовий екран
    current_question = new Question()  // Створюємо нове питання
    current_question.display()  // Відображаємо питання

    // Ініціалізація лічильників правильних і загальних відповідей
    correct_answers_given = 0
    total_answers_given = 0

    // Через 10 секунд зберігаємо результат в cookie та відновлюємо стартовий екран
    setTimeout(function() {
        let new_cookie = `numbers_high_score=${total_answers_given}/${correct_answers_given}; max-age=10000000000`  // Формуємо новий cookie
        document.cookie = new_cookie  // Зберігаємо cookie
        
        container_main.style.display = 'none'  // Сховуємо основний екран
        container_start.style.display = 'flex'  // Показуємо стартовий екран
        container_start_h3.innerHTML = `<h3>Ви дали ${correct_answers_given} правильних відповідей із ${total_answers_given}. Точність - ${Math.round(correct_answers_given * 100 / total_answers_given)}%.</h3>`  // Виводимо результат
    }, 10000)  // Затримка на 10 секунд
})

// Обробник події для кнопок відповідей
for (let i = 0; i < answer_buttons.length; i += 1) {
    answer_buttons[i].addEventListener('click', function() {
        // Якщо відповідь правильна, змінюємо колір кнопки на зелений
        if (answer_buttons[i].innerHTML == current_question.correct) {
            correct_answers_given += 1  // Збільшуємо кількість правильних відповідей
            answer_buttons[i].style.background = '#00FF00'  // Змінюємо фон на зелений
            anime({
                targets: answer_buttons[i],
                background: '#FFFFFF',  // Повертаємо фон назад на білий
                duration: 500,  // Тривалість анімації
                delay: 100,  // Затримка перед анімацією
                easing: 'linear'  // Лінійний ефект анімації
            })
        } else {
            // Якщо відповідь неправильна, змінюємо колір кнопки на червоний
            answer_buttons[i].style.background = '#FF0000'  // Змінюємо фон на червоний
            anime({
                targets: answer_buttons[i],
                background: '#FFFFFF',  // Повертаємо фон назад на білий
                duration: 500,  // Тривалість анімації
                delay: 100,  // Затримка перед анімацією
                easing: 'linear'  // Лінійний ефект анімації
            })
        }
        total_answers_given += 1  // Збільшуємо кількість загальних відповідей

        // Створюємо нове питання
        current_question = new Question()
        current_question.display()  // Відображаємо нове питання
    })
}
