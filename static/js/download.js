const downloadYBtn = document.querySelector(".download-btn");
const results = document.querySelector(".results");
const resultSpinners = document.querySelector(".results .spinners");
const overlaySpinners = document.querySelector(".results .overlay");
const inputUrl = document.querySelector(".url-input");
const clearYBtn = document.querySelector(".url-form .clear"); // More descriptive name

// Initialize
inputUrl.focus();
clearYBtn.style.display = inputUrl.value.trim() ? "block" : "none"; // Set initial visibility

// Clipboard paste (async/await for cleaner code)
async function handleClipboardPaste() {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      inputUrl.value = text;
      clearYBtn.style.display = "block";
      inputUrl.focus();
    }
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err);
  }
}

handleClipboardPaste(); // Call the async function

// Paste event listener
document.addEventListener("paste", (event) => {
  const url = event.clipboardData.getData('text/plain');
  inputUrl.value = url;
  inputUrl.focus();
  clearYBtn.style.display = "block";
  downloadVideo();  // Call download function immediately after paste
});

// Download button click
downloadYBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputUrl.value.trim() === "") {
    showError("Please enter a URL."); // More specific error message
  } else {
    downloadVideo();
  }
});

// Input focus and clear button visibility
inputUrl.addEventListener("focus", () => {
  clearYBtn.style.display = inputUrl.value.trim() ? "block" : "none";
});

// Clear button click
clearYBtn.addEventListener("click", () => {
  inputUrl.value = "";
  clearYBtn.style.display = "none";
  inputUrl.focus();
});

// Input change and clear button visibility
inputUrl.addEventListener("input", () => { // Use 'input' event for more immediate feedback
  clearYBtn.style.display = inputUrl.value.trim() ? "block" : "none";
});


// Download video function (renamed for clarity)
async function downloadVideo() {
  downloadYBtn.classList.add("disabled");
  results.style.display = "block";
  showSpinner();

  const form = document.querySelector(".url-form");
  const formData = new FormData(form); // Use formData consistently

  try {
    const response = await fetch("/downloadvideo", {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken, // Assuming csrfToken is defined elsewhere
      },
      body: formData, // Send FormData directly
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      const resultsData = data.success;
      const { thumbnail, duration, title, videos = [], audios = [] } = resultsData; // Destructuring for cleaner code
      const cardWraper = document.querySelector(".card-wraper");

      if (videos.length === 0 && audios.length === 0) {
        throw new Error("No video or audio formats available.");
      }

      // Template literal for HTML generation (cleaner and more readable)
      cardWraper.innerHTML = `
        <div class="row g-0">
          <div class="col-md-4 image-box">
            <img src="${thumbnail}" class="img-fluid rounded-start image" alt="${thumbnail}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title heading-5">${title}</h5>
              <p class="card-text">${duration}</p>
              <div class="download-area">
                <div class="download-box">
                  <div class="link">
                    <a href="${videos.length ? videos[0].url + "&title=" + title : "#"}" 
                       download="${title}" 
                       rel="noopener noreferrer" 
                       target="_blank" 
                       class="btn btn-lg link-download heading-6">
                       Download <i class="fa-solid fa-download"></i>
                    </a>
                  </div>
                  <div class="select">
                    <select class="form-select" aria-label="Default select example">
                      ${videos.map((video, index) => `
                        <option ${index === 0 ? "selected" : ""} data-url="${video.url}">${video.resolution}p - ${video.filesize}</option>
                      `).join('')}
                      ${audios.map(audio => `
                        <option data-url="${audio.url}">${audio.ext} - ${audio.filesize}</option>
                      `).join('')}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Event listener for select change (after setting innerHTML)
      const selectDiv = document.querySelector(".results .form-select");
      const linkDownload = document.querySelector(".results .link-download");

      selectDiv.addEventListener("change", (e) => { // Use arrow function
        const selectedOption = selectDiv.options[selectDiv.selectedIndex];
        const url = selectedOption.getAttribute("data-url");
        if (url) {
          linkDownload.href = url + "&title=" + title;
          linkDownload.download = title; // Use .download directly
        }
      });

      results.style.display = "block";
      hideSpinner();

    } else {
      throw new Error("Invalid response from server.");
    }

  } catch (error) {
    console.error("Error:", error);
    showError("An error occurred during download."); // Generic error message for the user
    hideSpinner();
    inputUrl.focus();
  }
}



// Spinner functions
function showSpinner() {
  results.style.display = "block";
  resultSpinners.style.display = "block";
  overlaySpinners.style.display = "block";
}

function hideSpinner() {
  resultSpinners.style.display = "none";
  overlaySpinners.style.display = "none";
  downloadYBtn.classList.remove("disabled");
}

// Error handling function
function showError(message) {
  inputUrl.style.boxShadow = "2px 2px #b52626"; // Or use a CSS class for styling
  Swal.fire({  // Use Swal.fire directly
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon: "error",
    title: message, // Display the provided error message
    customClass: "swal-upload",
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
}