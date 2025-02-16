import { auth, ref, createLogs,db,get,child ,remove,update , set} from './firebase.js';

// DOM Elements
const container = document.querySelector(".sticky-notes");
const addNoteBtn = document.querySelector(".add-note");
const textareaNote = document.querySelector(".textarea-note");
const stickyNotes = document.querySelector(".sticky-notes");
const loader = document.querySelector(".loader");
const showEditText = document.querySelector(".show-edit-text");
const showTime = document.querySelector(".show-time");
const syncBtn = document.querySelector(".sync");

// Global Variables
let uid = localStorage.getItem("uid");
let order = 10000;
let edit = false;
let notes = [];
let selectedStickyNoteId;
let editColor;
let selectedStickyNoteValueBeforeEdit = "";
let notesName = "notes-" + uid;

// Initialize time display and update every minute
showTime.innerHTML = getTime().time;
setInterval(() => {
  showTime.innerHTML = getTime().time;
}, 60000);

// Event Listeners
addNoteBtn.addEventListener("click", handleAddNoteClick);
syncBtn.addEventListener("click", syncNotes);

// Initialize notes from local storage and Firebase
generateNotesFromLocalstorage();
syncNotes();

// Functions

/**
 * Handles the "Add Note" button click event.
 */
function handleAddNoteClick() {
  notes = JSON.parse(localStorage.getItem(notesName)) ?? [];
  let content = textareaNote.value;

  if (content.trim() === "") return;

  loader.classList.add("show");

  if (edit) {
    handleEditNote(content);
  } else {
    handleAddNewNote(content);
  }

  textareaNote.value = "";
}

/**
 * Handles editing an existing note.
 * @param {string} content - The updated content of the note.
 */
function handleEditNote(content) {
  let selectedStickyNote = document.getElementById(selectedStickyNoteId);

  if (selectedStickyNote == null) {
    loader.classList.remove("show");
    return fireAlert("error", "Something went wrong");
  }

  // Cancel edit if the content hasn't changed
  if (content.trim() === selectedStickyNoteValueBeforeEdit) {
    resetEditMode();
    return;
  }

  let noteContentDiv = selectedStickyNote.querySelector(".note-content");
  let deleteNoteBtn = selectedStickyNote.querySelector(".delete-note");
  deleteNoteBtn.classList.remove("disabled");
  let noteTime = selectedStickyNote.querySelector(".note-time");

  const time = getTime();

  // Update note in local storage
  let indexed = notes.findIndex(obj => obj.id === selectedStickyNoteId);
  if (indexed < 0) return console.error("This note was not found");

  noteContentDiv.innerHTML = content;
  noteTime.innerHTML = time.time;
  selectedStickyNote.style.order = 1;

  notes[indexed].content = content;
  notes[indexed].time = time.time;
  notes[indexed].actualTime = time.actualTime;
  localStorage.setItem(notesName, JSON.stringify(notes));

  // Update note in Firebase
  const dbRef = ref(db, `users/${uid}/notes/${selectedStickyNoteId}`);
  update(dbRef, {
    content: content,
    color: editColor,
    actualTime: time.actualTime,
    time: time.time,
    id: selectedStickyNoteId
  })
    .then(() => {
      loader.classList.remove("show");
    })
    .catch((error) => {
      console.log(error);
    });

  resetEditMode();
}

/**
 * Resets the edit mode and UI.
 */
function resetEditMode() {
  addNoteBtn.classList.remove("edit");
  textareaNote.classList.remove("edit");
  edit = false;
  showEditText.innerHTML = "New Note";
  loader.classList.remove("show");
  textareaNote.value = "";
  textareaNote.focus();
}

/**
 * Handles adding a new note.
 * @param {string} content - The content of the new note.
 */
function handleAddNewNote(content) {
  showEditText.innerHTML = "New";
  const id = 'id' + (new Date()).getTime();
  const color = generateRandomLightColor();
  const time = getTime();

  // Save note to local storage
  let note = {
    content: content,
    color: color,
    time: time.time,
    actualTime: time.actualTime,
    id: id
  };
  notes.push(note);
  localStorage.setItem(notesName, JSON.stringify(notes));

  // Create and display the new sticky note
  const stickyNote = createStickyNote(note);
  stickyNote.style.order = order;
  container.prepend(stickyNote);

  // Save note to Firebase
  const dbRef = ref(db, `users/${uid}/notes/${id}`);
  set(dbRef, {
    content: content,
    color: color,
    actualTime: time.actualTime,
    time: time.time,
    id: id
  })
    .then(() => {
      loader.classList.remove("show");
      var message = `${localStorage.getItem("userEmail")} added a new note`;
      createLogs("low", message);
    })
    .catch((error) => {
      console.log(error);
      fireAlert("error", error);
    });
}

/**
 * Creates a new sticky note element.
 * @param {Object} note - The note object containing content, color, time, and id.
 * @returns {HTMLElement} - The created sticky note element.
 */
function createStickyNote(note) {
  const stickyNote = document.createElement("div");
  stickyNote.classList.add("sticky-note", "animate-in");
  stickyNote.style.setProperty("--note-color", note.color);
  stickyNote.style.order = order;
  stickyNote.setAttribute("data-time", note.time);
  stickyNote.id = note.id;

  const noteContent = document.createElement("div");
  noteContent.classList.add("note-content");
  noteContent.innerText = note.content;

  const stickyNoteTime = document.createElement("div");
  stickyNoteTime.classList.add("note-time");
  stickyNoteTime.innerHTML = note.time;

  const deleteBtn = document.createElement("i");
  deleteBtn.className = "fa-solid fa-xmark delete-note";
  deleteBtn.addEventListener("click", deleteNote);

  const saveBtn = document.createElement("i");
  saveBtn.className = "fa-regular fa-floppy-disk save-file";
  saveBtn.addEventListener("click", saveNote);

  stickyNote.addEventListener("dblclick", () => {
    showEditText.innerHTML = "Editing";
    editNote(stickyNote);
  });

  stickyNote.appendChild(noteContent);
  stickyNote.appendChild(deleteBtn);
  stickyNote.appendChild(saveBtn);
  stickyNote.appendChild(stickyNoteTime);

  return stickyNote;
}

/**
 * Generates sticky notes from local storage.
 */
function generateNotesFromLocalstorage() {
  stickyNotes.innerHTML = "";
  notes = JSON.parse(localStorage.getItem(notesName));
  let newNotes = sortNotes(notes);

  if (newNotes) {
    newNotes.forEach((note) => {
      const stickyNote = createStickyNote(note);
      container.append(stickyNote);
    });
  }
}

/**
 * Deletes a sticky note.
 * @param {Event} event - The click event.
 */
function deleteNote(event) {
  loader.classList.add("show");
  const stickyNote = event.target.parentElement;
  stickyNote.classList.add("animate-out");

  const deletedId = stickyNote.id;
  const noteIndex = notes.findIndex((note) => note.id === deletedId);

  if (noteIndex < 0) {
    return console.error("This note was not found");
  }

  notes.splice(noteIndex, 1);
  localStorage.setItem(notesName, JSON.stringify(notes));

  setTimeout(() => {
    container.removeChild(stickyNote);
  }, 500);

  const dbRef = ref(db, `users/${uid}/notes/${deletedId}`);
  remove(dbRef)
    .then(() => {
      loader.classList.remove("show");
    })
    .catch((error) => {
      console.log(error);
    });
}

/**
 * Saves a sticky note as a file.
 * @param {Event} event - The click event.
 */
function saveNote(event) {
  const stickyNote = event.target.parentElement;
  let noteContent = stickyNote.querySelector(".note-content");
  let content = noteContent.innerText;
  const id = stickyNote.id;

  saveAs(content, id, "text/plain;charset=UTF-8");
  fireAlert("success", "Note has been saved as a file");
}

/**
 * Generates a random light color.
 * @returns {string} - The generated color in hexadecimal format.
 */
function generateRandomLightColor() {
  const r = Math.floor(Math.random() * 56) + 200;
  const g = Math.floor(Math.random() * 56) + 200;
  const b = Math.floor(Math.random() * 56) + 200;

  const color = "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  return color;
}

/**
 * Edits a sticky note.
 * @param {HTMLElement} stickyNote - The sticky note element to edit.
 */
function editNote(stickyNote) {
  let deleteNoteBtn = stickyNote.querySelector(".delete-note");
  deleteNoteBtn.classList.add("disabled");

  selectedStickyNoteId = stickyNote.getAttribute("id");
  let selectedNoteContent = stickyNote.querySelector(".note-content");
  selectedStickyNoteValueBeforeEdit = selectedNoteContent.innerHTML.trim();
  editColor = stickyNote.style.getPropertyValue("--note-color");

  let noteContent = stickyNote.querySelector(".note-content");
  let content = noteContent.innerText;

  textareaNote.classList.add("edit");
  textareaNote.value = content;
  addNoteBtn.classList.add("edit");
  edit = true;
  textareaNote.focus();
}

/**
 * Gets the current time in a formatted string.
 * @returns {Object} - An object containing the formatted time and actual timestamp.
 */
function getTime() {
  var time = new Date();
  var options = {
    day: "numeric",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    hour: '2-digit',
    minute: '2-digit',
  };
  time = time.toLocaleString('en-TT', { options });
  return {
    time: time,
    actualTime: Date.now()
  };
}

/**
 * Syncs notes from Firebase to local storage.
 */
function syncNotes() {
  loader.classList.add("show");
  const dbRef = ref(db);
  get(child(dbRef, `users/${uid}/notes`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let notes = snapshot.val();
        localStorage.setItem(notesName, JSON.stringify(Object.values(notes)));
        generateNotesFromLocalstorage();
      } else {
        localStorage.removeItem(notesName);
        generateNotesFromLocalstorage();
        fireAlert("info", "You don't have any notes");
      }
      loader.classList.remove("show");
    })
    .catch((error) => {
      console.error(error);
      loader.classList.remove("show");
    });
}

/**
 * Sorts notes by their actual time.
 * @param {Array} notes - The array of notes to sort.
 * @returns {Array} - The sorted array of notes.
 */
function sortNotes(notes) {
  if (notes != null) {
    let sortedNotes = notes.sort((p1, p2) => (p1.actualTime < p2.actualTime) ? 1 : (p1.actualTime > p2.actualTime) ? -1 : 0);
    return sortedNotes;
  } else {
    return [];
  }
}

// Focus on the textarea when the page loads
textareaNote.focus();