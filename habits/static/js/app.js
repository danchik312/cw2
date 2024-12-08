document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const loginForm = document.getElementById("login-form");
    const registrationForm = document.getElementById("registration-form");
    const habitTracker = document.getElementById("habit-tracker");
    const loginError = document.getElementById("login-error");
    const registrationError = document.getElementById("registration-error");

    // Переключение между формами
    loginBtn.addEventListener("click", () => {
        loginForm.style.display = "block";
        registrationForm.style.display = "none";
    });

    registerBtn.addEventListener("click", () => {
        registrationForm.style.display = "block";
        loginForm.style.display = "none";
    });

    // Регистрация пользователя
    const registrationFormElement = document.getElementById("registration-form-element");
    registrationFormElement.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch("/api/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            alert("Регистрация прошла успешно!");
            showHabitTracker();  // Показываем трекер привычек
        } else {
            const errorData = await response.json();
            registrationError.textContent = Object.values(errorData.errors).join(", ");
        }
    });

    // Вход пользователя
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
    
        // Получаем данные из формы
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
    
        const loginData = {
            username,
            password
        };
    
        // Отправляем запрос на сервер для получения токена
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });
    
        if (response.ok) {
            // Если токен получен, сохраняем его в localStorage
            const data = await response.json();
            localStorage.setItem("token", data.access);  // Сохраняем токен с ключом 'token'
            alert("Вы успешно вошли в систему!");
            window.location.href = "/dashboard";  // Перенаправляем на страницу с данными
        } else {
            alert("Ошибка при входе.");
        }
    });
    

    // Показать трекер привычек
    function showHabitTracker() {
        habitTracker.style.display = "block";  // Показываем трекер привычек
        loginForm.style.display = "none";  // Скрываем форму входа
        registrationForm.style.display = "none";  // Скрываем форму регистрации
    }

    // Форма добавления привычки
    habitForm.addEventListener("submit", async (e) => {
        e.preventDefault();
    
        // Получаем данные формы
        const title = document.getElementById("habit-title").value;
        const period = document.getElementById("habit-period").value;
        const dataToSend = { title, period };
    
        // Извлекаем токен из localStorage
        const token = localStorage.getItem("token");
    
        // Если токен отсутствует, показываем предупреждение
        if (!token) {
            alert("Пожалуйста, войдите в систему.");
            return;
        }
    
        // Формируем заголовки с токеном
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`  // Передаем токен в заголовке
        };
    
        // Отправляем запрос
        const response = await fetch("http://127.0.0.1:8000/api/habits/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(dataToSend),
        });
    
        if (response.ok) {
            const habit = await response.json();
            addHabitToList(habit);  // Добавляем привычку в список
            habitForm.reset();
        } else {
            alert("Ошибка при добавлении привычки.");
        }
    });
    

    // Функция для добавления привычки в список
    function addHabitToList(habit) {
        const li = document.createElement("li");
        li.innerHTML = `
            ${habit.title} (${habit.period})
            <button onclick="deleteHabit(${habit.id}, this)">Удалить</button>
        `;
        habitList.appendChild(li);
    }
});
