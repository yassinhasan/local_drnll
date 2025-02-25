import { auth, ref, onAuthStateChanged, storage, uploadBytesResumable, getDownloadURL, createLogs, storageRef } from './firebase.js';

const dropArea = document.querySelector(".upload-form"),
    dropText = dropArea.querySelector(".drop-text"),
    fileInput = document.querySelector(".file-input"),
    progressArea = document.querySelector(".progress-area");

let files = [];


dropArea.addEventListener("click", () => {
    fileInput.click();
});

fileInput.onchange = ({ target }) => {
    files = Array.from(target.files);
    if (files.length > 0) {
        files.forEach((file) => {
            handleFile(file);
        });
    }
};

function handleFile(file) {
    let fullFileName = file.name;
    let splitName = fullFileName.split('.');
    let fileExtension = splitName[splitName.length - 1];
    let shortFileName = fullFileName.length >= 17 ? splitName[0].substring(0, 15) + "..." + fileExtension : fullFileName;
    let fileSize = file.size < 1024 ? file.size + " KB" : (file.size / (1024 * 1024)).toFixed(2) + " MB";

        let index = new Date().getTime() - Math.floor(10000 + Math.random() * 90000);
    uploadFile(file, shortFileName, fullFileName, fileSize,index);
}

function uploadFile(file, shortFileName, fullFileName, fileSize,index) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            if (localStorage.getItem("userEmail") == null) {
                localStorage.setItem("userEmail", user.email);
            }
            const usersRef = storageRef(storage, `users/${uid}/${fullFileName}`);
            const uploadTask = uploadBytesResumable(usersRef, file);
            createProgressDiv(shortFileName, fileSize,index);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    progressDownload(progress,index);
                },
                (error) => {
                    console.error("Upload failed:", error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        completeDownload(downloadURL , index, shortFileName,fileSize);
                    });
                }
            );
        } else {
            console.log("User not signed in");
        }
    });
}

function createProgressDiv(shortFileName, fileSize,index) {
    let progressHTML = `<li class="upload-row upload-row-${index}">
                            <i class="fas fa-file-alt"></i>
                            <div class="content">
                              <div class="details">
                                <span class="name">${shortFileName} (${fileSize})</span>
                                <span class="percent">0%</span>
                              </div>
                              <div class="progress-bar">
                                <div class="progress" style="width: 0%"></div>
                              </div>
                            </div>
                          </li>`;
    progressArea.insertAdjacentHTML("beforeend", progressHTML);
}
function progressDownload(progress,index) {
  document.querySelector(`.upload-row-${index} .percent`).innerHTML = `${progress}%`
  document.querySelector(`.upload-row-${index} .progress`).style.width = `${progress}%`
}

function completeDownload(link, index ,shortFileName , fileSize) {
    let uploadedHTML = `    <div class="finished">
                              <i class="fas fa-check"></i>
                              </div>
                              `;
    let uploadRow = document.querySelector(`.upload-row-${index}`);    
    uploadRow.insertAdjacentHTML("beforeend",uploadedHTML);
    
    const Toast = Swal.mixin({
        customClass: 'swal-upload',
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        color: "#b58126",
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: "File Uploaded successfully"
    });

    var message = ` ${localStorage.getItem("userEmail")} added new file ${shortFileName} Size: ${fileSize}`;
    createLogs("low", message);
}

dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("active");
    dropText.textContent = "Release to Upload File";
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    dropText.textContent = "Drag & Drop to Upload File";
});

dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("active");
    dropText.textContent = "Drag & Drop to Upload File";
    files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
        files.forEach(file => {
            handleFile(file);
        });
    }
});