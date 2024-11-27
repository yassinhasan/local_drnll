import * as firbase from "./firbase.js";

// Get the container element and the "Add Note" button
let uid = localStorage.getItem("uid")

const container = document.querySelector(".sticky-notes");
const addNoteBtn = document.querySelector(".add-note");
const textareaNote = document.querySelector(".textarea-note");
let stickyNotes = document.querySelector(".sticky-notes")
let loader = document.querySelector(".loader");
let showEditText = document.querySelector(".show-edit-text")
let showTime = document.querySelector(".show-time")
let selectedStickyNoteValueBeforeEdit = ""


showTime.innerHTML = getTime().time
setInterval(()=>{
  showTime.innerHTML = getTime().time
},60000)
let order = 10000

let edit = false;
let notes = [];
let selectedStickyNoteId;
let editColor;
let notesName = "notes-"+uid

// Add event listener to the "Add Note" button
addNoteBtn.addEventListener("click", ()=>{

  notes = JSON.parse(localStorage.getItem(notesName)) ?? []
  let content = textareaNote.value
  if(content.trim() === ""  ) return
  loader.classList.add("show")
  if(edit == true)
  {
    let selectedStickyNote = document.getElementById(selectedStickyNoteId)
    
    if(selectedStickyNote == null ) { 
      loader.classList.remove("show")
      return  fireAlert("error", "somthing error happened")}

    // cancel edit if not edit in value
    if(textareaNote.value.trim() == selectedStickyNoteValueBeforeEdit )
    {
      addNoteBtn.classList.remove("edit")
      textareaNote.classList.remove("edit")
      edit = false;
      showEditText.innerHTML = "New Note";
      loader.classList.remove("show")
      textareaNote.value =""
      textareaNote.focus()
      let deleteNoteBtn = selectedStickyNote.querySelector(".delete-note");
      deleteNoteBtn.classList.remove("disabled")
      return
    }
    
    let noteContentDiv = selectedStickyNote.querySelector(".note-content")
    let deleteNoteBtn = selectedStickyNote.querySelector(".delete-note");
    deleteNoteBtn.classList.remove("disabled")
    let noteTime = selectedStickyNote.querySelector(".note-time")
  
    const time =  getTime()
    // save in local storrage
    let indexed = notes.findIndex(obj => obj.id == selectedStickyNoteId);
    if(indexed < 0 ) {return console.error("this note not found");}
    // save direct first to local storage
    noteContentDiv.innerHTML = content;
    noteTime.innerHTML = time.time
    selectedStickyNote.style.order = 1
    notes[indexed]['content'] = content
    notes[indexed]['time'] = time.time
    notes[indexed]['actualTime'] = time.actualTime
    localStorage.setItem(notesName, JSON.stringify(notes));
    addNoteBtn.classList.remove("edit")
    textareaNote.classList.remove("edit")
    edit = false;
    showEditText.innerHTML = "New Note"
    // then save to database
    const dbRef = firbase.ref(firbase.db, "users/" + uid+"/notes/"+selectedStickyNoteId);
    firbase.update(dbRef, {
      "content": content,
      "color": editColor,
      "actualTime": time.actualTime, 
      "time": time.time, 
      "id": selectedStickyNoteId
    })
    .then(() => {
        // here show data is syncronized
        loader.classList.remove("show")
    })
    .catch((error) => {
      console.log(error);
    });

      // add new note
  }else{
    showEditText.innerHTML = "New"
    const id = 'id' + (new Date()).getTime();
    const color = generateRandomLightColor();
    const time = getTime()
    // direct save to localstorage
    let note = {
      "content": content,
      "color": color,
      "time": time.time, 
      "actualTime" : time.actualTime,
      "id": id
    }
    notes.push(note)
    localStorage.setItem(notesName, JSON.stringify(notes));
    const stickyNote = createStickyNote(note);
    stickyNote.style.order = order
    container.prepend(stickyNote);
    // then save to database
    const dbRef = firbase.ref(firbase.db, "users/" + uid+"/notes/"+id);
    firbase.set(dbRef,{
      "content": content,
      "color": color,
      "actualTime": time.actualTime, 
      "time" : time.time,
      "id": id
    })
  
    .then(() => {
        // here show syncroized data
        loader.classList.remove("show")
        var message = ` ${localStorage.getItem("userEmail")} add new note  `;
        firbase.createLogs("low",message)
    })
    .catch((error) => {
      console.log(error);
      fireAlert("error",error)
    });
    
   
  }
  textareaNote.value = ""
  
 
});

// Function to create a new sticky note element
function createStickyNote(note) {
  const stickyNote = document.createElement("div");
  stickyNote.classList.add("sticky-note", "animate-in");
  stickyNote.style.setProperty("--note-color", note.color);
  stickyNote.style.order = order
  stickyNote.setAttribute("data-time" , note.time)
    // add id to stickyNote
    stickyNote.id = note.id;
    const noteContent = document.createElement("div");
    noteContent.classList.add("note-content");
    noteContent.innerText = note.content;

  const stickyNoteTime = document.createElement("div"); 
  stickyNoteTime.classList.add("note-time"); 
  stickyNoteTime.innerHTML = note.time

  const deleteBtn = document.createElement("i");
  deleteBtn.className ="fa-solid fa-xmark delete-note";
  deleteBtn.addEventListener("click", deleteNote);

  const saveBtn = document.createElement("i"); 
  saveBtn.className = "fa-regular fa-floppy-disk save-file";
  saveBtn.addEventListener("click", saveNote);

  stickyNote.addEventListener("dblclick",()=>{
    showEditText.innerHTML = "Editing"
    editNote(stickyNote)
  })

  stickyNote.appendChild(noteContent);
  stickyNote.appendChild(deleteBtn);
  stickyNote.appendChild(saveBtn);
  stickyNote.appendChild(stickyNoteTime);
  return stickyNote;
}


// generateNotesFromLocalstorage()
function generateNotesFromLocalstorage()
{
  
  stickyNotes.innerHTML = ""
  notes = JSON.parse(localStorage.getItem(notesName));
  let newNotes =sortNotes(notes)
  if (newNotes) {
    newNotes.forEach((note) => {
      const stickyNote = createStickyNote(
       note
      );
      container.append(stickyNote);
    });
  }
}


// Function to delete a sticky note
function deleteNote(event) {
  loader.classList.add("show")
  const stickyNote = event.target.parentElement;
  stickyNote.classList.add("animate-out"); // Add animate-out class
  const deletedId = stickyNote.id;
  const noteIndex = notes.findIndex((note) => note.id === deletedId);
  // here check if notindex != -1
  if(noteIndex < 0 ) {
      return console.error("this note not found");
  }
  
  notes.splice(noteIndex, 1);
  localStorage.setItem(notesName, JSON.stringify(notes));

  // Wait for the animation to complete before removing the sticky note from the DOM
  setTimeout(() => {
    container.removeChild(stickyNote);
  }, 500);

  const dbRef = firbase.ref(firbase.db, "users/" + uid+"/notes/"+deletedId);
  firbase.remove(dbRef)
  .then(()=>{
    // syncroized data
    loader.classList.remove("show")
  })
  .catch((error) => {
    console.log(error);
  });

}
// Function to delete a sticky note
function saveNote(event) {
  const stickyNote = event.target.parentElement;
  let noteContent = stickyNote.querySelector(".note-content")
  let content = noteContent.innerText;
   const id = stickyNote.id;
  saveAs(content,id,"text/plain;charset=UTF-8")
    fireAlert("success","Note has been saved as afile") 
  
}

// Function to generate a random light background color
function generateRandomLightColor() {
  // Generate random RGB values within the light color range (200-255)
  const r = Math.floor(Math.random() * 56) + 200;
  const g = Math.floor(Math.random() * 56) + 200;
  const b = Math.floor(Math.random() * 56) + 200;

  // Convert RGB values to hexadecimal
  const color =
    "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);

  return color;
}

// Function to calculate the lightness of a color
function calculateLightness(color) {
  // Remove the leading '#' if present
  color = color.replace("#", "");

  // Convert the color to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  // Convert RGB to HSL
  const hsl = rgbToHsl(r, g, b);

  // Extract the lightness value
  const lightness = Math.round(hsl[2] * 100);

  return lightness;
}

// Function to convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = (max + min) / 2 > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  l = (max + min) / 2;

  return [h, s, l];
}




function editNote(stickyNote)
{
  let deleteNoteBtn = stickyNote.querySelector(".delete-note");
  deleteNoteBtn.classList.add("disabled")
  selectedStickyNoteId = stickyNote.getAttribute("id")
  let selectedNoteContent = stickyNote.querySelector(".note-content");
  selectedStickyNoteValueBeforeEdit = selectedNoteContent.innerHTML.trim()
  editColor = stickyNote.style.getPropertyValue("--note-color");
  let noteContent = stickyNote.querySelector(".note-content")
  let content = noteContent.innerText;
  textareaNote.classList.add("edit")
  textareaNote.value = content
  addNoteBtn.classList.add("edit")
  edit = true
  textareaNote.focus()
}


function getTime()
{
  var time = new Date();
  var options = {
    day: "numeric" ,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    hour :  '2-digit' ,
    minute :  '2-digit' ,        
};
  time = time.toLocaleString('en-TT', {options})
  return {
    "time" : time ,
    "actualTime" :Date.now()
  }
}




let syncBtn = document.querySelector(".sync");
syncBtn.addEventListener("click",()=>{
  syncNotes()   
})

syncNotes()

function syncNotes()
{
  loader.classList.add("show")
  const dbRef = firbase.ref(firbase.db)
  firbase.get(firbase.child(dbRef,`users/${uid}/notes`)).then((snapshot) => {
    if (snapshot.exists()) {
      let notes = snapshot.val();
      localStorage.setItem(notesName,JSON.stringify(Object.values(notes)))
      generateNotesFromLocalstorage()
      loader.classList.remove("show")
    } else {
      localStorage.removeItem(notesName)
      generateNotesFromLocalstorage()
      fireAlert("info","You don't have notes")
      loader.classList.remove("show")
    }
  }).catch((error) => {
    console.error(error);
    loader.classList.remove("show")
  });
}
function sortNotes(notes)
{
  if(notes != null)
  {
   
    let sortedNotes = notes.sort((p1, p2) => (p1.actualTime) < p2.actualTime  ? 1 : (p1.actualTime > p2.actualTime) ? -1 : 0);
    return sortedNotes    
  }else{
    return []
  }

}


textareaNote.focus()