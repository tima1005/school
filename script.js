// ==========================================
// ЖОКТОО СИСТЕМАСЫ
// ==========================================


// ОКУУЧУЛАР

let students =
    JSON.parse(localStorage.getItem("students")) || [];


// УШУЛ АПТАНЫН БАШЫ

let weekStart = getMonday(new Date());


// ==========================================
// ДАТАНЫ АЛУУ
// ==========================================

function getMonday(date) {

    const d = new Date(date);

    const day = d.getDay();

    const difference =
        day === 0 ? -6 : 1 - day;

    d.setDate(
        d.getDate() + difference
    );

    d.setHours(0, 0, 0, 0);

    return d;
}


// ==========================================
// YYYY-MM-DD
// ==========================================

function dateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ==========================================
// КҮНДҮН АТТАРЫ
// ==========================================

const dayNames = [
    "Жекшемби",
    "Дүйшөмбү",
    "Шейшемби",
    "Шаршемби",
    "Бейшемби",
    "Жума",
    "Ишемби"
];

const shortDays = [
    "Вс",
    "Пн",
    "Вт",
    "Ср",
    "Чт",
    "Пт",
    "Сб"
];


// ==========================================
// АПТАНЫ ЧЫГАРУУ
// ==========================================

function renderWeek() {

    const days = [];

    for (let i = 0; i < 5; i++) {

        const date =
            new Date(weekStart);

        date.setDate(
            weekStart.getDate() + i
        );

        days.push(date);
    }


    // HEADER DATE

    const first =
        days[0];

    const last =
        days[4];


    const firstText =
        first.toLocaleDateString(
            "ru-RU",
            {
                day: "numeric",
                month: "long"
            }
        );

    const lastText =
        last.toLocaleDateString(
            "ru-RU",
            {
                day: "numeric",
                month: "long"
            }
        );


    document.getElementById(
        "weekTitle"
    ).textContent =
        `${firstText} — ${lastText}`;


    document.getElementById(
        "weekSubtitle"
    ).textContent =
        `${first.getFullYear()} год`;


    // КҮНДӨРДҮН HEADER'И

    days.forEach(
        (date, index) => {

            const element =
                document.getElementById(
                    `day-${index}`
                );


            const dateNumber =
                String(
                    date.getDate()
                ).padStart(2, "0");


            const month =
                String(
                    date.getMonth() + 1
                ).padStart(2, "0");


            const day =
                shortDays[
                    date.getDay()
                ];


            element.innerHTML = `

                <div class="day-header">

                    <div>
                        ${dateNumber}.${month}
                    </div>

                    <div>
                        ${day}
                    </div>

                </div>

            `;

        }
    );


    renderStudents();

}


// ==========================================
// КАТЫШУУНУ АЛУУ
// ==========================================

function getAttendance() {

    return JSON.parse(
        localStorage.getItem(
            "attendance"
        )
    ) || {};

}


// ==========================================
// КАТЫШУУНУ САКТОО
// ==========================================

function setStatus(
    studentId,
    date,
    period,
    status
) {

    let attendance =
        getAttendance();


    const key =
        dateKey(date);


    if (!attendance[key]) {

        attendance[key] = {};

    }


    if (!attendance[key][studentId]) {

        attendance[key][studentId] = {};

    }


    attendance[key][studentId][period] =
        status;


    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );


    renderStudents();

}


// ==========================================
// СТАТУСТУН ОКУУУ
// ==========================================

function getStatus(
    studentId,
    date,
    period
) {

    const attendance =
        getAttendance();


    const key =
        dateKey(date);


    return (
        attendance[key] &&
        attendance[key][studentId] &&
        attendance[key][studentId][period]
    ) || null;

}


// ==========================================
// ОКУУЧУЛАРДЫ ТАБЛИЦАГА ЧЫГАРУУ
// ==========================================

function renderStudents() {

    const table =
        document.getElementById(
            "studentsTable"
        );


    if (students.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="14"
                    class="empty"
                >
                    Окуучулар жок.
                    ⚙ басып окуучуларды кошуңуз.
                </td>

            </tr>

        `;

        return;

    }


    let html = "";


    students.forEach(
        (student, index) => {

            html += `

                <tr class="student-row">

                    <td class="number-cell">
                        ${index + 1}
                    </td>


                    <td class="fio-cell">
                        ${student.name}
                    </td>


                    <td class="address-cell">
                        ${student.address || "—"}
                    </td>


                    <td class="phone-cell">
                        ${student.phone || "—"}
                    </td>

            `;


            // 5 КҮН

            for (let i = 0; i < 5; i++) {

                const date =
                    new Date(weekStart);

                date.setDate(
                    weekStart.getDate() + i
                );


                // ЭРТЕҢ МЕНЕН

                html += createStatusCell(
                    student.id,
                    date,
                    "morning"
                );


                // КЕЧИНДЕ

                html += createStatusCell(
                    student.id,
                    date,
                    "evening"
                );

            }


            html += `

                </tr>

            `;

        }
    );


    table.innerHTML = html;

}


// ==========================================
// + / - КЛЕТКАСЫ
// ==========================================

function createStatusCell(
    studentId,
    date,
    period
) {

    const status =
        getStatus(
            studentId,
            date,
            period
        );


    const plusActive =
        status === "plus"
            ? "active-plus"
            : "";


    const minusActive =
        status === "minus"
            ? "active-minus"
            : "";


    return `

        <td class="attendance-cell">

            <div class="status-buttons">

                <button
                    class="
                        status-btn
                        plus-btn
                        ${plusActive}
                    "
                    onclick="
                        setStatus(
                            ${studentId},
                            new Date('${dateKey(date)}'),
                            '${period}',
                            'plus'
                        )
                    "
                >
                    +
                </button>


                <button
                    class="
                        status-btn
                        minus-btn
                        ${minusActive}
                    "
                    onclick="
                        setStatus(
                            ${studentId},
                            new Date('${dateKey(date)}'),
                            '${period}',
                            'minus'
                        )
                    "
                >
                    −
                </button>

            </div>

        </td>

    `;

}


// ==========================================
// АПТАНЫ АЛМАШТЫРУУ
// ==========================================

function changeWeek(direction) {

    weekStart.setDate(
        weekStart.getDate() +
        direction * 7
    );

    renderWeek();

}


// ==========================================
// ОКУУЧУЛАР МЕНЮСУ
// ==========================================

function openStudents() {

    document
        .getElementById("studentsModal")
        .classList.add("show");


    renderManageStudents();

}


function closeStudents() {

    document
        .getElementById("studentsModal")
        .classList.remove("show");

}


// ==========================================
// ОКУУЧУ КОШУУ
// ==========================================

function addStudent() {

    const name =
        document
            .getElementById("studentName")
            .value
            .trim();


    const address =
        document
            .getElementById("studentAddress")
            .value
            .trim();


    const phone =
        document
            .getElementById("studentPhone")
            .value
            .trim();


    if (!name) {

        alert(
            "ФИО жазыңыз"
        );

        return;

    }


    const student = {

        id: Date.now(),

        name: name,

        address: address,

        phone: phone

    };


    students.push(
        student
    );


    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    document.getElementById(
        "studentName"
    ).value = "";


    document.getElementById(
        "studentAddress"
    ).value = "";


    document.getElementById(
        "studentPhone"
    ).value = "";


    renderManageStudents();

    renderStudents();

}


// ==========================================
// ОКУУЧУ ӨЧҮРҮҮ
// ==========================================

function deleteStudent(id) {

    if (
        !confirm(
            "Бул окуучуну өчүрөсүзбү?"
        )
    ) {

        return;

    }


    students =
        students.filter(
            student =>
                student.id !== id
        );


    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    renderManageStudents();

    renderStudents();

}


// ==========================================
// ОКУУЧУЛАРДЫ БАШКАРУУ
// ==========================================

function renderManageStudents() {

    const container =
        document.getElementById(
            "studentsManageList"
        );


    if (students.length === 0) {

        container.innerHTML =
            "<p>Окуучу жок.</p>";

        return;

    }


    container.innerHTML =
        students.map(
            (student, index) => `

                <div class="manage-student">

                    <span>
                        ${index + 1}.
                        ${student.name}
                    </span>

                    <span>
                        ${student.address || "—"}
                    </span>

                    <span>
                        ${student.phone || "—"}
                    </span>

                    <button
                        class="delete-student"
                        onclick="
                            deleteStudent(
                                ${student.id}
                            )
                        "
                    >
                        🗑
                    </button>

                </div>

            `
        ).join("");

}


// ==========================================
// БАШТАЛГАНДА
// ==========================================

renderWeek();