import { db, getMetadata, deleteObject, listAll, storageRef, uploadBytesResumable, storage, uploadBytes, getDownloadURL, getFirestore, collection, addDoc, serverTimestamp } from "./firebase.js";

// no need to upload file to firebase
// change icon name to analyzie
// handle file in backend
// show loader show pending
// show stats accoring to loyality number only


const uid = localStorage.getItem("uid")
document.querySelector(".upload-btn").addEventListener("click", (e) => {
    e.preventDefault()
    uploadFile()
})

const progresscContainer = document.querySelector(".progress-container")
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        fireAlert("error", 'Please select a file.')
        return;
    }

    // Validate file type
    const allowedTypes = ['text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (!allowedTypes.includes(file.type)) {
        fireAlert("error", 'Invalid file type. Please upload a TXT, CSV, or Excel file.');
        return;
    }

    // Read the file
    const reader = new FileReader();
    reader.onload = function (e) {
        const fileContent = e.target.result;

        // Upload to Firestore
        // Reset progress and message
        progresscContainer.style.display = "block"
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        storeFireData(file)

    };

    reader.readAsText(file); // Read as text for simplicity
}

async function storeFireData(file) {

    // Upload to Firebase Storage
    const FIleRef = `uploads/data/${uid}/${file.name}`
    const fileStorageRef = storageRef(storage, `uploads/data/${uid}/${file.name}`); // Use a descriptive path
    const uploadTask = uploadBytesResumable(fileStorageRef, file);
    // Track upload progress
    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        },
        (error) => {
            console.log('Error uploading file: ' + error.message)
        },
         () => { // Make this callback async
            try {
                    fireAlert("success" , "FIle Uploaded Successfully")
                    progresscContainer.style.display = "none"
                    progressBar.textContent=``
                    // listAllFiles()
                    // send fetch to backend to analyze data 
                    sendFIleToAnalyize(FIleRef)

            } catch (error) {
                console.error("Error getting download URL:", error);
                // Handle the error
            }
        }
    );
}



function sendFIleToAnalyize(path)
{
    const data   = {
        "path" : path
    }
    const options = {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",  // Set the Content-Type header

        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(data),
      };
    
      fetch('/analyze', options)
      .then(response => response.json())
      .then(data => {
          if (data.status === "success") {
              console.log(data.data);
  
              // Clear the container before adding new content
              const container = document.getElementById("results-container");
              container.innerHTML = "";
  
              // Create and append the histogram image
              const histogramImg = document.createElement("img");
              histogramImg.src = `data:image/png;base64,${data.data.analysis.net_value_histogram}`;
              histogramImg.alt = "Gross Value Histogram";
              container.appendChild(histogramImg);
  
              // Create and append the top customers data as cards
              const topCustomers = data.data.analysis.top_customers;
              for (const [customer, value] of Object.entries(topCustomers)) {
                  const card = document.createElement("div");
                  card.className = "customer-card";
  
                  const customerName = document.createElement("h3");
                  customerName.textContent = customer;
                  card.appendChild(customerName);
  
                  const customerValue = document.createElement("p");
                  customerValue.textContent = `Gross Value: ${value}`;
                  card.appendChild(customerValue);
  
                  container.appendChild(card);
              }
  
              fireAlert("success", "Data fetched and displayed successfully");
          } else {
              fireAlert("error", "Failed to fetch data");
          }
      })
      .catch(error => {
          console.error("Error fetching data:", error);
          fireAlert("error", "An error occurred while fetching data");
      });
    
}
// listAllFiles()
function listAllFiles() {


    const listRef = storageRef(storage, `uploads/data/${uid}`);
    listAll(listRef)
        .then((res) => {
            prepraListFilesHtml(res.items)

        }).catch((error) => {
            // Uh-oh, an error occurred!
            console.log(error);
        });

        function prepraListFilesHtml(files) {
            let tBody = document.getElementById("tablebody");
            tBody.innerHTML = ""; // Clear the existing table content
        
            if (files.length == 0) {
                tBody.innerHTML = `<div class="empty-files">You don't have any files yet</div>`;
                return;
            }
        
            const data = []; // Array to hold the data for DataTables
        
            for (let index = files.length - 1; index >= 0; index--) {
                let fileName = files[index].name;
                getMetadata(storageRef(storage, `uploads/data/${uid}/${fileName}`))
                    .then((metadata) => {
                        getDownloadURL(storageRef(storage, `uploads/data/${uid}/${metadata.name}`))
                            .then((url) => {
                                let fileName = metadata.name;
                                let fileSize = (metadata.size < 1024) ? metadata.size + " KB" : (metadata.size / (1024 * 1024)).toFixed(2) + " MB";
                                let fileDate = new Date(metadata.timeCreated);
                                fileDate = fileDate.getDate() + "-" + (months[fileDate.getMonth()]) + "-" + fileDate.getFullYear()
                                    + " " +
                                    fileDate.getHours() + ":" + fileDate.getMinutes();
        
                                // Push the data into the array
                                data.push({
                                    filename: fileName,
                                    date: fileDate,
                                    size: fileSize,
                                    action: `
                                        <a href="${url}" target="_blank" download class="card-link download"><i class="fa-solid fa-download"></i></a>
                                        <a href="#" class="file-delete-btn" data-filename="${fileName}"><i class="fa-solid fa-trash"></i></a>
                                    `
                                });
        
                                // If this is the last file, initialize the DataTable
                                if (index === 0) {
                                    // initializeDataTable(data);
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
}

// Render logs in the UI
function initializeDataTable(data) {
    const table = $('#dataFilesTable').DataTable({
        data: data,
        columns: [
            { data: 'filename', title: 'File Name' },
            { data: 'date', title: 'Date' },
            { data: 'size', title: 'File Size' },
            { data: 'action', title: 'Action' }
        ],
        columnDefs: [
            {
                targets: -1, // Last column (Action column)
                orderable: false, // Disable sorting for the action column
                searchable: false // Disable searching for the action column
            }
        ]
    });

    // Add event listeners for delete buttons
    $('#dataFilesTable').on('click', '.file-delete-btn', function (e) {
        e.preventDefault();
        let fileToDeleted = $(this).data('filename');
        Swal.fire({
            customClass: 'swal-height',
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const desertRef = storageRef(storage, `uploads/data/${uid}/${fileToDeleted}`);
                deleteObject(desertRef).then(() => {
                    Swal.fire({
                        customClass: 'swal-height',
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                    table.row($(this).parents('tr')).remove().draw(); // Remove the row from the table
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
    });
}