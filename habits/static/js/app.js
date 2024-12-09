// Функция для получения CSRF-токена из cookies
function getCSRFToken() {
    let cookieValue = null;
    const name = 'csrftoken';
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const loginForm = document.getElementById("login-form");
    const registrationForm = document.getElementById("registration-form");
    const habitTracker = document.getElementById("habit-tracker");
    const loginError = document.getElementById("login-error");
    const registrationError = document.getElementById("registration-error");
    const habitForm = document.getElementById("habit-form");  // Исправление ошибки habitForm

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
                "X-CSRFToken": getCSRFToken(),  // Добавляем CSRF-токен в заголовок
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
    
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;
    
        const loginData = {
            username,
            password
        };
    
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData)
        });
    
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.access);  // Сохраняем токен в localStorage
            alert("Вы успешно вошли в систему!");
            showHabitTracker();
        } else {
            alert("Ошибка при входе.");
        }
    });

    // Форма добавления привычки
// Форма добавления привычки
habitForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("habit-title").value;
    const period = document.getElementById("habit-period").value;
    const dataToSend = { title, period };

    const token = localStorage.getItem("token");
    const csrfToken = getCSRFToken();

    if (!token) {
        alert("Пожалуйста, войдите в систему.");
        return;
    }

    const response = await fetch("http://127.0.0.1:8000/api/habits/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
        const habit = await response.json();
        addHabitToList(habit);
        habitForm.reset();
    } else {
        alert("Ошибка при добавлении привычки.");
    }
});

// Функция для добавления галочки при выполнении привычки
function addHabitToList(habit) {
    const habitList = document.getElementById("habit-list");
    const li = document.createElement("li");
    li.innerHTML = `
        ${habit.title} (${habit.period})
        <input type="checkbox" onclick="markHabitComplete(${habit.id}, this)">
    `;
    habitList.appendChild(li);
}

// Функция для отображения статистики
async function viewHabitLogs(habitId) {
    const token = localStorage.getItem("token");
    const csrfToken = getCSRFToken();

    const response = await fetch(`http://127.0.0.1:8000/api/habits/${habitId}/logs/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-CSRFToken": csrfToken,
        },
    });

    if (response.ok) {
        const logs = await response.json();
        console.log(logs); // Логи выполнения привычки
        // Можно здесь обновить UI для отображения статистики
    } else {
        alert("Ошибка при получении статистики.");
    }
}


// Отметка выполнения привычки
async function markHabitComplete(habitId, checkbox) {
    const status = checkbox.checked; // Если галочка установлена, значит выполнено
    const token = localStorage.getItem("token");
    const csrfToken = getCSRFToken();

    const response = await fetch(`http://127.0.0.1:8000/api/habits/${habitId}/logs/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ status }),
    });

    if (response.ok) {
        alert("Статус привычки обновлен!");
    } else {
        alert("Ошибка при обновлении статуса привычки.");
    }
}

    // Функция для добавления привычки в список
    function addHabitToList(habit) {
        const habitList = document.getElementById("habit-list");
        const li = document.createElement("li");
        li.innerHTML = `
            ${habit.title} (${habit.period})
            <button onclick="deleteHabit(${habit.id}, this)">Удалить</button>
        `;
        habitList.appendChild(li);
    }

    // Показать трекер привычек
    function showHabitTracker() {
        habitTracker.style.display = "block";
        loginForm.style.display = "none";
        registrationForm.style.display = "none";
    }
});
