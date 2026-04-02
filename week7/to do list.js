if (Notification.permission !== "granted") {
    Notification.requestPermission();
}
let selectedDate=localStorage.getItem("selectedDate");

let dateObj=new Date(selectedDate);

let day=dateObj.toLocaleDateString('en-US',{weekday:'long'});

document.getElementById("dateTitle").innerText=
"Tasks for "+selectedDate+" ("+day+")";


loadTasks();

setInterval(checkAlarms,1000);


function goHome(){

window.location.href="main.html";

}


function loadTasks(){

let tasks=JSON.parse(localStorage.getItem(selectedDate))||[];

let list=document.getElementById("taskList");

list.innerHTML="";

tasks.forEach((task,index)=>{

let li=document.createElement("li");

if(task.completed){
li.classList.add("completed");
}

li.innerHTML=

task.text+" ("+task.time+")"+

`<div>

<button onclick="toggleComplete(${index})">✔</button>

<button onclick="editTask(${index})">✏</button>

<button onclick="deleteTask(${index})">❌</button>

</div>`;

list.appendChild(li);

});

}


function addTask(){

let text=document.getElementById("taskInput").value;

let time=document.getElementById("taskTime").value;

if(!text || !time){
alert("Enter task and time");
return;
}

let tasks=JSON.parse(localStorage.getItem(selectedDate))||[];

tasks.push({
text:text,
time:time,
completed:false,
alerted:false
});

localStorage.setItem(selectedDate,JSON.stringify(tasks));

document.getElementById("taskInput").value="";
document.getElementById("taskTime").value="";

loadTasks();

}


function deleteTask(index){

let tasks=JSON.parse(localStorage.getItem(selectedDate));

tasks.splice(index,1);

localStorage.setItem(selectedDate,JSON.stringify(tasks));

loadTasks();

}


function editTask(index){

let tasks=JSON.parse(localStorage.getItem(selectedDate));

let newTask=prompt("Edit task",tasks[index].text);

if(newTask){

tasks[index].text=newTask;

localStorage.setItem(selectedDate,JSON.stringify(tasks));

loadTasks();

}

}


function toggleComplete(index){

let tasks=JSON.parse(localStorage.getItem(selectedDate));

tasks[index].completed=!tasks[index].completed;

localStorage.setItem(selectedDate,JSON.stringify(tasks));

loadTasks();

}


function resetTasks(){

if(confirm("Delete all tasks?")){

localStorage.removeItem(selectedDate);

loadTasks();

}

}


function checkAlarms(){

let today=new Date().toISOString().split("T")[0];

if(today!==selectedDate) return;

let now=new Date();

let currentTime=now.toTimeString().slice(0,5);

let tasks=JSON.parse(localStorage.getItem(selectedDate))||[];

tasks.forEach((task,index)=>{

if(task.time===currentTime && !task.alerted){

// Browser alert
alert("⏰ Reminder: "+task.text);

// Alarm sound
let audio=new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
audio.play();

// Desktop notification
if(Notification.permission==="granted"){

new Notification("📌 Task Reminder",{
body: task.text + " at " + task.time,
icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
});

}

tasks[index].alerted=true;

localStorage.setItem(selectedDate,JSON.stringify(tasks));

}

});

}

tasks.forEach((task,index)=>{

if(task.time===currentTime && !task.alerted){

alert("⏰ Reminder: "+task.text);

let audio=new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");

audio.play();

tasks[index].alerted=true;

localStorage.setItem(selectedDate,JSON.stringify(tasks));

}

});
