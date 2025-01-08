let downloadBtn = document.querySelector(".download-btn");
let results = document.querySelector(".results")
let resultSpinners = document.querySelector(".results .spinners");
let overlaySpinners = document.querySelector(".results .overlay");
let inputUrl = document.querySelector(".url-input")
let clear = document.querySelector(".url-form .clear")
// let copy = document.querySelector(".url-form .copy-div")


inputUrl.focus()

navigator.clipboard.readText()
  .then(text => {
    
    if(text != "")
    {
      inputUrl.value = ""
      inputUrl.value = text;
      clear.style.display ="block"
      inputUrl.focus()

    }
  })
  .catch(err => {
    console.error('Failed to read clipboard contents: ', err);
  });
  document.addEventListener("paste", function(event) {
    let url = event.clipboardData.getData('text/plain');
    inputUrl.value = url
    inputUrl.focus()
    clear.style.display ="block"
    downloadvideo()
  });

downloadBtn.addEventListener("click", (e) => {
   e.preventDefault()
   if(inputUrl.value == "")
   {
      showResultsError()
   }else{
        downloadvideo()
   }

  })


  inputUrl.addEventListener("focus",()=>{
    if(inputUrl.value != "")
    {
      clear.style.display ="block"
    }
   // inputUrl.style.boxShadow=" 2px 2px var(--accent-color)"
    
  })

  clear.addEventListener("click",()=>{
    inputUrl.value = ""
    clear.style.display="none"
    inputUrl.focus()
  })

  inputUrl.addEventListener("keyup",()=>{
    if(inputUrl.value.trim() == ""){
      clear.style.display ="none"
    }else{
      clear.style.display ="block"
    }
    inputUrl.style.boxShadow=" 2px 2px var(--accent-color)"  
  })

function downloadvideo() {
        downloadBtn.classList.add("disabled")
        results.style.display = "block"
        showResultSpinner()
        let form  = document.querySelector(".url-form")
        let formdata = new FormData(form)
        const options = {
          headers: {
        "X-CSRFToken" : csrfToken,
        "ContentType": 'application/json;charset=UTF-8',
          },
          credentials: 'include' ,
          method: 'POST',
          body: formdata // Convert JSON data to a string and set it as the request body
        };
        fetch('/downloadvideo', options) // api for the get request
          .then(response => response.json())
          .then(data => {
           
            if (data.success) {
              
               let resultsData = data.success;
                let thumbnail = resultsData['thumbnail']
                let duration = resultsData['duration']
                let title = resultsData['title']
                let videos = resultsData['videos']
                let audios = resultsData['audios']
                let cardWraper = document.querySelector(".card-wraper")
                let upper = `
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
                              <a href="${videos[0]['url']}&title=${title}"  download=${title} rel="noopener noreferrer" target="_blank"  class="btn btn-lg link-download heading-6">Download <i class="fa-solid fa-download"></i></a>
                            </div>
                            <div class="select">`
                  let select =  `<select class="form-select" aria-label="Default select example">`
                  for (let index = 0; index < videos.length; index++) {
                    const video = videos[index];
                     select += `
                        <option ${index == 0 ? 'selected' : ''} data-url="${video['url']}">${video['resolution']}p - ${video['filesize']}</option>

                    `
                  }
                  select += `<option>Audio</option>`
                  for (let x = 0; x < audios.length; x++) {
                    const audio = audios[x];
                     select += `
                        <option  data-url="${audio['url']}">${audio['ext']} - ${audio['filesize']}</option>

                    `
                  }
                  select += `</select>`
                  let end = `
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                `
                cardWraper.innerHTML = upper + select + end
                var selectDiv = document.querySelector(".results .form-select");
                var linkDownload = document.querySelector(".results .link-download");
                selectDiv.addEventListener("change", function(e) {
                  let option = selectDiv.options
                  [selectDiv.selectedIndex];
  
                    let url = option.getAttribute("data-url")
                    linkDownload.href =  url+"&title="+title;
                    linkDownload.setAttribute("download",title)
              });
                results.style.display = "block"

                hideResultSpinner()
            }
            else {
                showResultsError()
                hideResultSpinner()
                inputUrl.focus()
            }
          })
          .catch(error => {
            showResultsError()
            hideResultSpinner()
            inputUrl.focus()
          })

}

function showResultSpinner()
{
  results.style.display="block"
  resultSpinners.style.display="block"
  overlaySpinners.style.display="block"
}
function hideResultSpinner()
{
 
  resultSpinners.style.display="none"
  overlaySpinners.style.display="none"
  downloadBtn.classList.remove("disabled")
 
}


function showResultsError(){
  inputUrl.style.boxShadow=" 2px 2px #b52626"
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
      icon: "error",
      title: "Invalid url or somthing error !! "
    }); // end of alert
}