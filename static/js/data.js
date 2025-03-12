import { db, getMetadata, deleteObject, listAll, storageRef, uploadBytesResumable, storage, uploadBytes, getDownloadURL, getFirestore, collection, addDoc, serverTimestamp } from "./firebase.js";

const tableLoaderWraper = document.querySelector(".table-loader-wraper");
const tableLoader = document.querySelector(".table-loader-wraper .loader");
//   add heading to the each results
const resultsContainer = document.getElementById("results-container");

function showTableLoader() {
    tableLoader.classList.add("show");
    tableLoaderWraper.classList.add("show");
}
function hideTableLoader() {
    tableLoader.classList.remove("show");
    tableLoaderWraper.classList.remove("show");
}

let file;

document.getElementById('upload-btn').addEventListener('click', function(e) {
    e.preventDefault()
    uploadFile(file)
});

document.getElementById('fileInput').addEventListener('change', (event)=> {
   event.preventDefault()
    file = event.target.files[0]; 

})

// data.js
function handleFIleUsingLib(file) {
        // Create a new Web Worker
        showTableLoader();
        const worker = new Worker('/static/js/fileProcessor.js');

        // Send the file to the worker
        worker.postMessage(file);

        // Handle the response from the worker
        worker.onmessage = function (event) {
            const jsonData = event.data;
            sendDataToBackend(jsonData)
            worker.terminate(); // Clean up the worker
        };

        // Handle errors
        worker.onerror = function (error) {
            console.log(error);
            
         worker.terminate(); // Clean up the worker
        };
}

async function uploadFile(file) {
    showTableLoader();
    if (!file) {
        fireAlert("error", 'Please select a file.');
        hideTableLoader();
        return;
    }

    // Validate file type
    const allowedTypes = ['text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (!allowedTypes.includes(file.type)) {
        fireAlert("error", 'Invalid file type. Please upload a TXT, CSV, or Excel file.');
        hideTableLoader();
        return;
    }

    try {
        // Process the file using the Web Worker
        // Send the processed data to the backend
        handleFIleUsingLib(file);
    } catch (error) {
        console.error("Error processing file:", error);
        fireAlert("error", 'An error occurred while processing the file.');
    } 
}
// send data to backend /analyze with post method
function sendDataToBackend(json_data)
{
    fetch('/get_csrf', {
        method: 'GET',
        credentials: 'include',  // Include cookies in the request
    }).then(response => response.json())
    .then(data => {
        const csrfToken = data.data.csrf_token;
     const options = {
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(json_data),
    };

    fetch('/analyze', options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.status === "success") {
                repareResultInHtml(data)
            } else {
                fireAlert("error", "Failed to fetch data");
            }
        })
        .catch(error => {
            hideTableLoader()
            console.error("Error fetching data:", error);
            fireAlert("error", "An error occurred while fetching data");
        });
    })
    .catch(error => {
        console.error("Error fetching CSRF token:", error);
    });
}

function repareResultInHtml(data)
{
    console.log(data.data);
    let results = data.data.analysis;
    resultsContainer.classList.add("show");
    let net_value_histogram_img = `data:image/png;base64,${results.net_value_histogram_img}`
    let net_value_per_day_img = `data:image/png;base64,${results.net_value_per_day_img}`
    resultsContainer.innerHTML =
        `
    <div class="result-heading">
        <h2 class="heading-3">Results</h2>
    </div>
   <!-- net_value_perday  -->
   <div class="result-image">
        <img class="results-img" src="${net_value_per_day_img}" alt="${net_value_per_day_img}">
    </div>
   <!--end net_value_perday  -->
    <!-- net_value_histogram net valueresults -->
    <div class="result-image">
        <img class="results-img" src="${net_value_histogram_img}" alt="${net_value_histogram_img}">
    </div> 
    <!-- net_value_histogram net valueresults -->   
    `
    hideTableLoader()

}