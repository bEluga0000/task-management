const taskArr = []
const today = new Date().toISOString().split("T")[0]
class Task {
    constructor(id, title, desc, date, priority, completed) {
        this.id = id
        this.title = title
        this.desc = desc
        this.date = date
        this.priority = priority
        this.completed = completed
    }
}
window.onload = () => {
    document.getElementById("dueDate").setAttribute("min", today)
    document.getElementById("dueDate").setAttribute("value", today)
    const stringifyTasks = localStorage.getItem("tasks")
    if (stringifyTasks) {
        let parsedTasks = JSON.parse(stringifyTasks)
        if (parsedTasks.length == 0)
            document.getElementById("showNoTasks").textContent = "No tasks are present as of now"
        parsedTasks.sort((a, b) => new Date(a.date) - new Date(b.date))
        console.log(parsedTasks)
        parsedTasks.forEach((task, key) => {
            const onetask = document.createElement("div")
            onetask.setAttribute("id", task.id)
            const taskDiv = document.getElementById("tasks")
            const titleEle = document.createElement("h1")
            titleEle.textContent = task.title
            const descEle = document.createElement("h3")
            descEle.textContent = task.desc
            const duePriorEle = document.createElement("p")
            const showDate = task.date.split("-").reverse().join("-")
            duePriorEle.textContent = `${showDate}     ${task.priority}`
            const btnDiv = document.createElement("div")
            const editBtn = document.createElement("button")
            editBtn.textContent = "Edit"
            editBtn.addEventListener("click", () => {
                handelEditBtn(task.id)
            })
            const markBtn = document.createElement("button")
            markBtn.textContent = "Mark as completed"
            markBtn.addEventListener("click", () => {
                handelMarkBtn(task.id)
                btnDiv.removeChild(markBtn)
            })
            const deleteBtn = document.createElement("button")
            deleteBtn.textContent = "Delete"
            deleteBtn.addEventListener("click", () => {
                handelDeleteBtn(task.id)
                // need to do the below function inside the above function
                taskDiv.removeChild(onetask)
            })
            if (task.completed == false) {
                btnDiv.appendChild(editBtn)
                btnDiv.appendChild(markBtn)
            }
            const hrShow = document.createElement("hr")
            btnDiv.appendChild(deleteBtn)
            onetask.appendChild(titleEle)
            onetask.appendChild(descEle)
            onetask.appendChild(duePriorEle)
            onetask.appendChild(btnDiv)
            onetask.appendChild(hrShow)
            taskDiv.appendChild(onetask)
        })
    }
}
// i need to use this function properly rather than copy pasting this code in the two diffrent placess  i need to edit the window .reload code
const handelSubmitBtn = (e) => {
    e.preventDefault()
    let errrMsg = document.getElementById("errorMsg")
    errrMsg.textContent = ""
    let titleIn = document.getElementById("title").value
    let descIn = document.getElementById("desc").value
    const dateIn = document.getElementById("dueDate").value
    const priorityIn = document.getElementById("priority").value
    // need to add some things like if any of the above things or not enterd by the user  i need to show the error msg
    titleIn = titleIn.trim()
    descIn = descIn.trim()
    if(titleIn.length <1 || descIn.length<1)
    {
        errrMsg.textContent = "Enter the description and Title cannot be undefined"
        return 
    }
    document.getElementById("showNoTasks").textContent = ""
    const cuid = window.cuid()
    const task = new Task(cuid, titleIn, descIn, dateIn, priorityIn, false)
    const localStorageTasks = localStorage.getItem("tasks")
    if (!localStorageTasks) {
        const jsonData = JSON.stringify([task])
        localStorage.setItem("tasks", jsonData)
    }
    else {
        let stringifyTasks = localStorage.getItem("tasks")
        let taksParsed = JSON.parse(stringifyTasks)
        taksParsed.push(task)
        stringifyTasks = JSON.stringify(taksParsed)
        localStorage.setItem("tasks", stringifyTasks)
    }
    const onetask = document.createElement("div")
    onetask.setAttribute("id", cuid)
    const taskDiv = document.getElementById("tasks")
    const titleEle = document.createElement("h1")
    titleEle.textContent = task.title
    const descEle = document.createElement("h3")
    descEle.textContent = task.desc
    const duePriorEle = document.createElement("p")
    const showDate = task.date.split("-").reverse().join("-")
    duePriorEle.textContent = `${showDate}     ${task.priority}`
    const btnDiv = document.createElement("div")
    const editBtn = document.createElement("button")
    editBtn.textContent = "Edit"
    editBtn.addEventListener("click", () => {
        handelEditBtn(cuid)
    })
    const markBtn = document.createElement("button")
    markBtn.textContent = "Mark as completed"
    markBtn.addEventListener("click", () => {
        handelMarkBtn(cuid)
        btnDiv.removeChild(editBtn)
        btnDiv.removeChild(markBtn)
    })
    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Delete"
    deleteBtn.addEventListener("click", () => {
        handelDeleteBtn(cuid)
        // need to do the below function inside the above function
        taskDiv.removeChild(onetask)
    })
    const hrShow = document.createElement("hr")
    btnDiv.appendChild(editBtn)
    btnDiv.appendChild(markBtn)
    btnDiv.appendChild(deleteBtn)
    onetask.appendChild(titleEle)
    onetask.appendChild(descEle)
    onetask.appendChild(duePriorEle)
    onetask.appendChild(btnDiv)
    onetask.appendChild(hrShow)
    taskDiv.appendChild(onetask)
    document.getElementById("title").value = ""
    document.getElementById("desc").value = ""
    document.getElementById("priority").value = "low"
}

document.getElementById("btn-sub").addEventListener("click", (e) => { handelSubmitBtn(e) })

// delete button
const handelDeleteBtn = (id) => {
    //todo need to show the modal telling that are you sure u want to delete this
    let stringifyTasks = localStorage.getItem("tasks")
    console.log(" i am runnign")
    const parsedTasks = JSON.parse(stringifyTasks)
    const taskDeleted = parsedTasks.filter((task, key) => {
        return task.id != id
    })
    stringifyTasks = JSON.stringify(taskDeleted)
    localStorage.setItem("tasks", stringifyTasks)
    console.log(parsedTasks)
    if(taskDeleted.length == 0)
        document.getElementById("showNoTasks").textContent = "No tasks are present as of now"
    // delete the chid with id of the clicked tasks
}
const handelEditBtn = (id) => {
    const onetask = document.getElementById(id)
    let titleTag = onetask.querySelector("h1")
    let title = titleTag.textContent
    let descTag = onetask.querySelector("h3")
    let desc = descTag.textContent
    let duePriorityTag = onetask.querySelector("p")
    let duePriority = duePriorityTag.textContent
    let [due, priority] = duePriority.split(" ").filter((val) => val != "")
    due = due.split("-").reverse().join("-")
    console.log(title, desc, due, priority)
    // here i need to hide the elements and need to add the form with the options to change the title  desc and 
    titleTag.style.display = "none"
    descTag.style.display = "none"
    duePriorityTag.style.display = "none"
    // i am going to create a new div so that i can delete them easily
    const divIn = document.createElement("div")
    const titleIn = document.createElement("input")
    titleIn.value = title
    titleIn.setAttribute("type", "text")
    const descIn = document.createElement("input")
    descIn.setAttribute("value", desc)
    descIn.setAttribute("type", "text")
    const dateIn = document.createElement("input")
    const priorityIn = document.createElement("select")
    const low = document.createElement("option")
    low.setAttribute("value","low")
    low.textContent = "low"
    const medium = document.createElement("option")
    medium.setAttribute("value","medium")
    medium.textContent = "medium"
    const high = document.createElement("option")
    high.setAttribute("value","high")
    high.textContent = "high"
    priority == "high" ? high.setAttribute("selected",true) : priority == "medium" ? medium.setAttribute("selected",true):low.setAttribute("selected",true)
    // push these options to the selects
    priorityIn.appendChild(low)
    priorityIn.appendChild(medium)
    priorityIn.appendChild(high)
    // need to set the min date as today
    dateIn.setAttribute("type", "date")
    dateIn.setAttribute("value", due)
    dateIn.setAttribute("min", today)
    divIn.appendChild(titleIn)
    divIn.appendChild(descIn)
    divIn.appendChild(dateIn)
    divIn.appendChild(priorityIn)
    // need to add two buttons 
    // btn save
    const saveBtn = document.createElement('button')
    saveBtn.textContent = "Save"
    // need to update the local storge values and need to take care of edge cases and update the values inside
    // btn cancels
    saveBtn.addEventListener("click", () => {
        titleTag.style.display = "block"
        descTag.style.display = "block"
        duePriorityTag.style.display = "block"
        titleTag.textContent = titleIn.value
        descTag.textContent = descIn.value
        // need to add the priority
        const showDate = dateIn.value.split("-").reverse().join("-")
        duePriorityTag.textContent = `${showDate} ${priorityIn.value}`
        // need to update the localstorage value
        let stringifyTasks = localStorage.getItem("tasks")
        let parseTasks = JSON.parse(stringifyTasks)
        parseTasks = parseTasks.map((task, key) => {
            return task.id == id ? { ...task, title: titleIn.value, id, date: dateIn.value, priority:priorityIn.value, desc: descIn.value } : task
        })
        stringifyTasks = JSON.stringify(parseTasks)
        localStorage.setItem("tasks", stringifyTasks)
        // close the div
        onetask.removeChild(divIn)
    })
    const cancelBtn = document.createElement('button')
    cancelBtn.textContent = "Cancel"
    // just need to close the divIn 
    cancelBtn.addEventListener("click", () => {
        titleTag.style.display = "block"
        descTag.style.display = "block"
        duePriorityTag.style.display = "block"
        onetask.removeChild(divIn)
    })
    divIn.appendChild(saveBtn)
    divIn.appendChild(cancelBtn)
    onetask.appendChild(divIn)
}
const handelMarkBtn = (id) => {
    let stringifyTasks = localStorage.getItem("tasks")
    let parseTasks = JSON.parse(stringifyTasks)
    console.log(id)
    parseTasks = parseTasks.map((task, key) => {
        return task.id == id ? { ...task, completed: true } : task
    })
    stringifyTasks = JSON.stringify(parseTasks)
    localStorage.setItem("tasks", stringifyTasks)
}
// filter buttons

// first button is  status works completed or the pending
const filterBtn = document.getElementById("filterBtn")
filterBtn.addEventListener("click", () => {
    console.log("Clicked")
    const status = document.getElementById("statusBtn").value
    const due = document.getElementById("dueBtn").value
    const priority = document.getElementById("priorityBtn").value
    const sDate = due == "no" ? null : due == "1" ? today : (() => {
        const newDate = new Date(today);
        newDate.setDate(newDate.getDate() + 7);
        return newDate.toISOString().split("T")[0];
    })();
    const sPriority = priority == "no" ? null : priority
    const sStatus = status == "no" ? null : status == "false" ? false : true
    const stringifyTasks = localStorage.getItem("tasks")
    const parsedTasks = JSON.parse(stringifyTasks)
    console.log(sDate)
    let showTasks = parsedTasks.filter((task, key) => {
        const priorityMatch = sPriority === null || task.priority == sPriority
        const statusmatch = sStatus === null || task.completed == sStatus
        const dateMatch = sDate == null || (today == sDate ? task.date == sDate : task.date < sDate)
        return priorityMatch && statusmatch && dateMatch
    })
    // here i need to show every things
    const taskDiv = document.getElementById("tasks")
    document.getElementById("showNoTasks").textContent  = ""
    taskDiv.textContent = ""
    if (showTasks.length == 0)
        document.getElementById("showNoTasks").textContent = "No task comes under this filter, please change the filter"
    else {
        showTasks = showTasks.sort((a, b) => new Date(a.date) - new Date(b.date) )
        showTasks.forEach((task, val) => {
            const onetask = document.createElement("div")
            onetask.setAttribute("id", task.id)
            const taskDiv = document.getElementById("tasks")
            const titleEle = document.createElement("h1")
            titleEle.textContent = task.title
            const descEle = document.createElement("h3")
            descEle.textContent = task.desc
            const duePriorEle = document.createElement("p")
            const showDate = task.date.split("-").reverse().join("-")
            duePriorEle.textContent = `${showDate}     ${task.priority}`
            const btnDiv = document.createElement("div")
            const editBtn = document.createElement("button")
            editBtn.textContent = "Edit"
            editBtn.addEventListener("click", () => {
                handelEditBtn(task.id)
            })
            const markBtn = document.createElement("button")
            markBtn.textContent = "Mark as completed"
            markBtn.addEventListener("click", () => {
                handelMarkBtn(task.id)
                btnDiv.removeChild(markBtn)
            })
            const deleteBtn = document.createElement("button")
            deleteBtn.textContent = "Delete"
            deleteBtn.addEventListener("click", () => {
                handelDeleteBtn(task.id)
                // need to do the below function inside the above function
                taskDiv.removeChild(onetask)
            })
            btnDiv.appendChild(editBtn)
            const hrShow = document.createElement("hr")
            if (task.completed == false)
                btnDiv.appendChild(markBtn)
            btnDiv.appendChild(deleteBtn)
            onetask.appendChild(titleEle)
            onetask.appendChild(descEle)
            onetask.appendChild(duePriorEle)
            onetask.appendChild(btnDiv)
            onetask.appendChild(hrShow)
            taskDiv.appendChild(onetask)
        })
    }
})