function playDing() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";    
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

let addBtn = document.querySelector('.Add-Btn')
let TaskCont = document.querySelector('.Task-Cont')
let addTaskFlag = false;
let TaskArea = document.querySelector('.task-area');
let createTicket = document.querySelector('.Create-Ticket');

addBtn.addEventListener('click', function() {
    addTaskFlag = !addTaskFlag;
    if (addTaskFlag == true) {
        TaskCont.style.display = 'flex';
    } else {
        TaskCont.style.display = 'none';
    }
});


function saveTasks() {
    let tickets = document.querySelectorAll('.ticket');
    let tasks = [];
    tickets.forEach(ticket => {
        let text = ticket.querySelector('.ticket-text').innerText;
        let completed = ticket.classList.contains('completed');
        tasks.push({ text, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function createTicketElement(text, completed = false) {
    let ticket = document.createElement('div');
    ticket.classList.add('ticket');
    if (completed) ticket.classList.add('completed');

    let tickettext = document.createElement('div');
    tickettext.classList.add('ticket-text');
    tickettext.innerText = text;

    let doneBtn = document.createElement('div');
    doneBtn.classList.add('ticket-done');
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';

    doneBtn.addEventListener('click', function() {
        ticket.classList.add('completed');
        playDing();
        saveTasks();
    });

    let deleteBtn = document.createElement('div');
    deleteBtn.classList.add('ticket-delete');
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.addEventListener('click', function() {
        ticket.remove();
        saveTasks();
    });

    ticket.appendChild(tickettext);
    ticket.appendChild(doneBtn);
    ticket.appendChild(deleteBtn);
    document.body.appendChild(ticket);
}


createTicket.addEventListener('click', function() {
    let text = TaskArea.innerText.trim();
    if (!text) return; 
    createTicketElement(text, false);
    TaskArea.innerText = "";
    saveTasks();
});


window.addEventListener('load', function() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        createTicketElement(task.text, task.completed);
    });
});
