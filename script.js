document.addEventListener('DOMContentLoaded', function () {
    loadSavedData();
    createStars(2000);

    document.getElementById('addRowBtn').addEventListener('click', function () {
        addRow();
        saveData();
    });

    document.getElementById('calculateGpaBtn').addEventListener('click', calculateGpa);

    document.getElementById('gradesTable').addEventListener('input', saveData);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', resetStarsPosition);
});

function addRow(subject = '', credits = '', grade = '') {
    const table = document.getElementById('gradesTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);

    cell1.innerHTML = `<input type="text" class="subject" value="${subject}">`;
    cell2.innerHTML = `<input type="number" class="credits" min="0" value="${credits}">`;
    cell3.innerHTML = `<input type="number" class="grade" min="0" max="10" value="${grade}">`;
    cell4.innerHTML = '<button onclick="removeRow(this)">Remove</button>';
}

function removeRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    saveData();
}

function calculateGpa() {
    const rows = document.getElementById('gradesTable').getElementsByTagName('tbody')[0].rows;
    let totalCredits = 0;
    let totalPoints = 0;

    for (let i = 0; i < rows.length; i++) {
        const credits = parseFloat(rows[i].getElementsByClassName('credits')[0].value);
        const grade = parseFloat(rows[i].getElementsByClassName('grade')[0].value);

        if (!isNaN(credits) && !isNaN(grade)) {
            totalCredits += credits;
            totalPoints += credits * grade;
        }
    }

    const gpa = totalPoints / totalCredits;
    document.getElementById('gpaResult').innerText = isNaN(gpa) ? 'Please enter valid data' : `Your GPA is ${gpa.toFixed(2)}`;
}

function saveData() {
    const rows = document.getElementById('gradesTable').getElementsByTagName('tbody')[0].rows;
    const data = [];

    for (let i = 0; i < rows.length; i++) {
        const subject = rows[i].getElementsByClassName('subject')[0].value;
        const credits = rows[i].getElementsByClassName('credits')[0].value;
        const grade = rows[i].getElementsByClassName('grade')[0].value;

        data.push({ subject, credits, grade });
    }

    localStorage.setItem('gradesData', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem('gradesData'));

    if (savedData && savedData.length > 0) {
        savedData.forEach(item => {
            addRow(item.subject, item.credits, item.grade);
        });
    } else {
        addRow();
    }
}

function createStars(count) {
    const starfield = document.getElementById('starfield');
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}vh`;
        star.style.left = `${Math.random() * 100}vw`;
        starfield.appendChild(star);
    }
}

function handleMouseMove(event) {
    const stars = document.getElementsByClassName('star');
    for (let star of stars) {
        const rect = star.getBoundingClientRect();
        const distance = Math.sqrt(Math.pow(event.clientX - (rect.left + rect.width / 2), 2) + Math.pow(event.clientY - (rect.top + rect.height / 2), 2));

        if (distance < 100) {
            star.classList.add('active');
            star.style.transform = `translate(${event.clientX - rect.left - rect.width / 2}px, ${event.clientY - rect.top - rect.height / 2}px)`;
        } else {
            star.classList.remove('active');
            star.style.transform = '';
        }
    }
}

function resetStarsPosition() {
    const stars = document.getElementsByClassName('star');
    for (let star of stars) {
        star.style.transition = 'transform 0.5s ease-out';
        star.style.transform = '';
    }
}
