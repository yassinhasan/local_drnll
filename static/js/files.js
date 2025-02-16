import { auth, ref,onAuthStateChanged,storage,uploadBytesResumable,getDownloadURL, createLogs ,storageRef, uploadString, uploadBytes, listAll, getMetadata , deleteObject} from './firebase.js';
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Octr", "Nov", "Dec"];
const fileTypes = {

    file: "<img src='/images/file.png' alt='file'>",
    image: "<img src='/images/image.png' alt='image'>",
    zip: "<img src='/images/zip.png' alt='zip'>",
    doc: "<img src='/images/doc.png' alt='doc'>",
    excel: "<img src='/images/excel.png' alt='excel'>",
    pdf: "<img src='/images/pdf.png' alt='pdf'>",
    ppt: "<img src='/images/ppt.png' alt='ppt'>",
    video: "<img src='/images/mp4.png' alt='video'>",
}


const myModal = document.querySelector('.files-modal')
let cardWraper = document.querySelector(".card-wraper");

let filesBtn = document.querySelector(".files-btn");


filesBtn.addEventListener("click", () => {
    showFilesSpinner()
    $('#filesModal').modal('show')
    listFiles()
})



function listFiles() {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            if(localStorage.getItem("emailUser") == null)
                {
                  localStorage.setItem("emailUser",user.email)
                }
            // Create a reference under which you want to list
            const listRef = storageRef(storage, `users/${uid}/`);
            // Find all the prefixes and items.

            listAll(listRef)
                .then((res) => {
                    prepraListFilesHtml(uid, res)
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                    console.log(error);
                });
        } else {
            console.log("user not signed in")
            fireAlert("error","you shoud login first")
            logoutUser()
        }
    });

}




function prepraListFilesHtml(uid, res) {
    let files = res.items;
    let unsorted = []
    cardWraper.innerHTML = "";
    if (files.length == 0) {
        cardWraper.innerHTML = `<div class="empty-files">you don't have any files yes</div>`;
        hideFilseSpinner();
        return;
    }

    let prevousLen = 0
    for (let index = files.length - 1; index >= 0; index--) {


        let fileName = files[index].name;

        getMetadata(storageRef(storage, `users/${uid}/${fileName}`))
            .then((metadata) => {
                // unsorted.push(metadata)
                getDownloadURL(storageRef(storage, `users/${uid}/${metadata.name}`))
                    .then((url) => {  
                        metadata['url'] = url
                        unsorted.push(metadata)
                            let sorted = unsorted.sort((a, b) => Date.parse(b.timeCreated) - Date.parse(a.timeCreated))
                            if(files.length  == sorted.length)
                            {
                              
                                for (let x = 0; x < sorted.length; x++) {
                                    let fileSize;
                                    let fileDate;
                                    let fileExtension;
                                    let splitName = sorted[x].name.split('.');
                                    fileExtension = splitName[splitName.length - 1];
                                    let imgSrc = getFilePrivew(fileExtension)
                                    if (fileName.length >= 17) {
                                        fileName = splitName[0].substring(0, 15) + "..." + fileExtension;
                                    }
                                    (sorted[x].size < 1024) ? fileSize = sorted[x].size + " KB" : fileSize = (sorted[x].size / (1024 * 1024)).toFixed(2) + " MB";
    
                                    fileDate = new Date(sorted[x].timeCreated)
                                    fileDate = fileDate.getDate() + "-" + (months[fileDate.getMonth()]) + "-" + fileDate.getFullYear()
                                        + " " +
                                        fileDate.getHours() + ":" + fileDate.getMinutes();;
                                    let cardItem = `
                       <div class="row file-card">
                       <div class="card" style="width: 18rem;">
                          ${imgSrc}
                         <div class="card-body">
                           <h5 class="file-title">${sorted[x].name}</h5>
                           <h5 class="file-date">${fileDate}</h5>
                           <h5 class="file-size">Size:<span>${fileSize}</span></h5>
                         </div>
                         <div class="card-body">
                           <a href="${sorted[x].url}" class="card-link download" target="_blank"><i class="fa-solid fa-download"></i></a>
                           <a href="#" class="card-link delete" data-filename="${sorted[x].name}"><i class="fa-solid fa-trash"></i></a>
                           <a href="whatsapp://send?text=Helly this is download link ${encodeURIComponent(sorted[x].url)}"   target="_blank"  class="card-link share""><i class="fa-brands fa-whatsapp"></i></a>
                         </div>
                       </div>
                       </div>
                       `;
                                    cardWraper.innerHTML += cardItem;
    
                                    let fileDeleteBtns = document.querySelectorAll(".card-link.delete");
                                    fileDeleteBtns.forEach(fileDeleteBtn => {
                                        fileDeleteBtn.addEventListener("click", (e) => {
                                            let fileToDeleted = fileDeleteBtn.getAttribute("data-filename");
    
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
                                                    const desertRef = storageRef(storage, `users/${uid}/${fileToDeleted}`);
                                                    // Delete the file
                                                    deleteObject(desertRef).then(() => {
                                                        Swal.fire({
                                                            customClass: 'swal-height',
                                                            title: "Deleted!",
                                                            text: "Your file has been deleted.",
                                                            icon: "success"
                                                        });
                                                        showFilesSpinner()
                                                        cardWraper.innerHTML = "";
                                                        listFiles()
                                                        var message = ` ${localStorage.getItem("userEmail")} delete  file  ${fileToDeleted} `;
                                                        createLogs("low",message)
                                                    }).catch((error) => {
                                                        console.log(error);
                                                    });
    
                                                }
                                            });
                                        });
    
                                    });
                                }
                            }
                        hideFilseSpinner()
                    })

                    .catch((error) => {
                        // Handle any errors
                    });

            })
            .catch((error) => {
                console.log(error);
                hideFilseSpinner()
                // Uh-oh, an error occurred!
            });

    };



}



function getFilePrivew(fileExtension) {
    let imgElement;
    switch (fileExtension) {
        case "png":
        case "gif":
        case "jpeg":
        case "jpg":
        case "wep":
        case "ico":
        case "svg":
        case "ps":
        case "psd":
            imgElement = fileTypes.image
            break;
        case "zip":
        case "rar":
        case "z":
        case "dep":
        case "pkg":
            imgElement = fileTypes.zip
            break;
        case "doc":
        case "docx":
        case "txt":
        case "odt":
            imgElement = fileTypes.doc
            break;
        case "csv":
        case "xls":
        case "xlsx":
            imgElement = fileTypes.excel
            break;
        case "pdf":
            imgElement = fileTypes.pdf
            break;
        case "ppt":
        case "pptx":
        case "pps":
        case "odp":
            imgElement = fileTypes.ppt
            break;
        case "avi":
        case "h264":
        case "mp4":
        case "mpg":
        case "mpg4":
        case "webm":
        case "wmv":
        case "mov":
        case "flv":
            imgElement = fileTypes.video
            break;

        default:
            imgElement = fileTypes.file
            break;
    }

    return imgElement;
}

function logoutUser() {
    signOut(auth)
    .then(() => {
        let formdata = new FormData()
        const options = {
          headers: {
        "X-CSRFToken" : csrfToken,
        "ContentType": 'application/json;charset=UTF-8',
          },
          credentials: 'include' ,
          method: 'POST',
          body: formdata // Convert JSON data to a string and set it as the request body
        };
        fetch('/logout', options) // api for the get request
          .then(response => response.json())
          .then(data => {
            console.log(data);
            if (data.success == true) {
              localStorage.removeItem("token")
              localStorage.removeItem("uid")
              window.location.href = "/";
            }
            else {
              hideSpinner()

            }
          })
          .catch(error => {
            hideSpinner()

          })

  }).catch((error) => {
    console.log(error);
  });
}
