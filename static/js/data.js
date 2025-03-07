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


const uid = localStorage.getItem("uid")
document.querySelector(".upload-btn").addEventListener("click", (e) => {
    e.preventDefault()
    uploadFile()
})

// const progresscContainer = document.querySelector(".progress-container")
// const progressBar = document.getElementById('progressBar');
// const progressText = document.getElementById('progressText');
function uploadFile() {
    showTableLoader()
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        fireAlert("error", 'Please select a file.')
        hideTableLoader()
        return;
    }

    // Validate file type
    const allowedTypes = ['text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (!allowedTypes.includes(file.type)) {
        fireAlert("error", 'Invalid file type. Please upload a TXT, CSV, or Excel file.');
        hideTableLoader()
        return;
    }
    sendFIleToAnalyize(file)
}




function sendFIleToAnalyize(file) {
    // alert this will take time until the data is analyzed in arabic
    fireAlert("info", "جاري تحليل البيانات، قد يستغرق هذا بعض الوقت", 4000, 'swal-login', "top-end");
    resultsContainer.innerHTML = ""
    const formData = new FormData();
    formData.append('file', file);
    const options = {
        headers: {
            "X-CSRFToken": csrfToken,

        },
        credentials: 'include',
        method: 'POST',
        body: formData,
    };

    fetch('/analyze', options)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                let results = data.data.analysis;
                resultsContainer.classList.add("show");
                hideTableLoader()
                console.log(data.data);
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
                <!-- net_value_histogram net valueresults -->              `
            } else {
                fireAlert("error", "Failed to fetch data");
            }
        })
        .catch(error => {
            hideTableLoader()
            console.error("Error fetching data:", error);
            fireAlert("error", "An error occurred while fetching data");
        });

}
