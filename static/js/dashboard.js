import { auth, logToday,ref, createLogs,get,child ,update , set , db, getMetadata, deleteObject, listAll, storageRef, uploadBytesResumable, storage, uploadBytes, getDownloadURL, getFirestore, collection, addDoc, serverTimestamp } from "./firebase.js";

// DOM Elements
const loaderWraper = document.querySelector(".loader-wraper");
const loader = document.querySelector(".loader");
const tableLoaderWraper = document.querySelector(".table-loader-wraper");
const tableLoader = document.querySelector(".table-loader-wraper .loader");

const dashboardWrapper = document.querySelector(".dashboard-wraper");
const usersNumSpan = document.querySelector(".users .info .num");
const activeUsersNum = document.querySelector(".active-users .num");
const inactiveUsersNum = document.querySelector(".inactive-users .num");
const usersTableBody = document.querySelector(".users-table-body");
let selectEmail = document.querySelector(".email-user")
let sendemailBtn = document.querySelector(".sendemail-btn-modal")
let emailform = document.querySelector(".emailform")
const editModalElement = document.getElementById("editusersModal");
const editModal = new bootstrap.Modal(editModalElement);
let tBody = document.getElementById("tablebody");

// Initialize Google Charts
// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.load('current', { 'packages': ['timeline'] })
function drawChart(usersData) {
  // Create the data table.
  var data = new google.visualization.DataTable();
  
  
  data.addColumn('string', 'Users');
  data.addColumn('number', 'active');
  data.addRows([
    ['active', usersData.active],
    ['inactive', usersData.inactive]
  ]);


  // Set chart options
  var options = {
    'title': 'Users Active',
    'width': 400,
    'height': 350 ,
    'colors':['#138496', 'darkgray']

  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

function drawChartTimeLine(loggingData) {
  var options2 = {
    'title': 'Users Active In Days', 'width': 400,
    'height': 300, backgroundColor: '#fff'
  }
  let values = Object.values(loggingData)

  var container = document.getElementById('timeline');
  var chart = new google.visualization.Timeline(container);
  var dataTable = new google.visualization.DataTable();

  dataTable.addColumn({ type: 'string', id: 'email' });
  dataTable.addColumn({ type: 'date', id: 'Start' });
  dataTable.addColumn({ type: 'date', id: 'End' });
  dataTable.addRows(values);

  chart.draw(dataTable, options2);
}
// Fetch and display users data
function fetchUsersData() {
  showLoader();
  // fireAlert("info", "Loading users data...");
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
    method: 'POST',
  };

  fetch('/usersdata', options)
    .then(response => response.json())
    .then(results => {      
      if (results.status == 'success') {
        renderUsersData(results.data);
      }
    })
    .catch(error => {
      console.error("Error fetching users data:", error);
      fireAlert("error", "Failed to load users data");
    })
    .finally(() => {
      hideLoader();
      // dashboardWrapper.style.display = "block";
      document.querySelector(".send-email").style.display="block"
    });
  })
}

// Render users data in the table
function renderUsersData(users) {

  usersTableBody.innerHTML = ""; // Clear existing rows
  selectEmail.innerHTML = ""
  let activeUsersCount = 0;
  let inactiveUsersCount = 0;

  let emails = users.map(user => user.email)
  selectEmail.innerHTML += ` <option value="${emails}" selected>All Users</option>`
  users.forEach(user => {
  selectEmail.innerHTML += `
              <option value="${user.email}">${user.email}</option>`
    const lastLogin = user.lastActive

    // Determine if the user is active or inactive

    const active = user.is_active ? 'active' : 'inactive';
    if (active === 'active') activeUsersCount++; else inactiveUsersCount++;

    // Email verification status
    const emailVerified = user.email_verified ? 'Verified' : 'Unverified';
    
    // Add a row for each user
    usersTableBody.innerHTML += `
      <tr class="${active}">
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${user.status}</td>
        <td>${lastLogin}</td>
        <td>${active}</td>
        <td>${emailVerified}</td>
        <td>
          <i class="fa-regular fa-pen-to-square edit-user-btn" data-user-id="${user.userId}" data-email="${user.email}" data-role="${user.role}" data-status="${user.status}"></i>
          <i style="margin-left:8px" class="fa-regular fa-solid fa-trash delete-user-btn" data-user-id="${user.userId}" data-user-email="${user.email}">
          </i>
        </td>
      </tr>
    `;
  });
          // fill select email in form
  // Update user counts
  usersNumSpan.innerHTML = users.length
  activeUsersNum.innerHTML = activeUsersCount
  inactiveUsersNum.innerHTML = inactiveUsersCount
  let usersData = {
    "active": activeUsersCount,
    "inactive": inactiveUsersCount
  }

  google.charts.setOnLoadCallback(drawChart(usersData));
  // Add event listeners to the "Edit" buttons
  
  addEditUserEventListeners();
  addDeleteUserEventListeners();
}

function addDeleteUserEventListeners()
{
  document.querySelectorAll(".delete-user-btn")
  .forEach(el=>
  {
    el.addEventListener("click",()=>
    {
      let uid = el.getAttribute("data-user-id");
      let email = el.getAttribute("data-user-email")
      Swal.fire({
        title: `Do you want to delete this user ${email}?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          showSpinner()
          deleteUsersFetch(uid,email)
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });

      
     
    })
  }
  )
}
// Fetch and display logs
function fetchLogs() {
  const dbRef = ref(db);
  get(child(dbRef, `logs/${logToday}`)).then((snapshot) => {
    if (snapshot.exists()) {
      const logs = snapshot.val();
      renderLogs(logs);
    } else {
      // fireAlert("info", "No logs today");
      document.querySelector(".logs-wraper").innerHTML = "No Logs Today";
    }
  }).catch(error => {
    console.error("Error fetching logs:", error);
    fireAlert("error", "Failed to load logs");
  });
}

// Render logs in the UI
function renderLogs(logs) {
  const data = [];
  for (const key in logs) {
    const log = logs[key];
    data.push({
      Info: log.type,
      Message: log.message,
      Time: log.time,
    });
  }

  const table = new DataTable('#myTableLogs', {
    data: data,
    columns: [{ data: 'Info' }, { data: 'Message' }, { data: 'Time' }],
    createdRow: function (row, data) {
      const classInfo = data.Info === "critical" ? "row-danger" : data.Info === "info" ? "row-info" : "row-low";
      $(row).addClass(classInfo);
    },
  });

}

function openEditUserModal(userId, email, role, status) {
  const modalEmail = document.querySelector("#editusersModal .modal-email");
  const modalRole = document.querySelector("#editusersModal .modal-role");
  const modalStatus = document.querySelector("#editusersModal .modal-status");
  const userIdInput = document.querySelector("#editusersModal .modal-user-id");

  // Populate the modal with the user's data
  modalEmail.value = email;
  modalRole.value = role;
  modalStatus.value = status;
  userIdInput.value = userId;

  // Open the modal
  editModal.show();
}

// Add event listeners to the "Edit" buttons
function addEditUserEventListeners() {
  document.querySelectorAll(".edit-user-btn").forEach(button => {
    button.addEventListener("click", () => {

      const userId = button.getAttribute("data-user-id");
      const email = button.getAttribute("data-email");
      const role = button.getAttribute("data-role");
      const status = button.getAttribute("data-status");

      // Open the edit modal and populate it with the user's data
      openEditUserModal(userId, email, role, status);
    });
  });
}

// Handle form submission for updating user data
document.querySelector(".edit-user-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const userId = document.querySelector(".modal-user-id").value;
  const role = document.querySelector(".modal-role").value;
  const status = document.querySelector(".modal-status").value;

  // Send a request to update the user
  updateUser(userId, role, status);
});

function updateUser(userId, role, status) {
  editModalElement.classList.add('blur-effect');
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("role", role);
  formData.append("status", status);

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
    body: formData,
  };

  fetch('/updateuser', options)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        fireAlert("success", "User updated successfully");
      } else {
        fireAlert("error", "Failed to update user");
      }
    })
    .catch(error => {
      fireAlert("error", "An error occurred while updating the user");
    }) 
    .finally(() => {
      hideLoader();
      editModalElement.classList.remove("blur-effect");
      editModal.hide();
      fetchUsersData()
    });
  })
  
}


// Helper functions
function formatDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function showLoader() {
  loaderWraper.classList.add("show");
  loader.classList.add("show");
}

function hideLoader() {
  loader.classList.remove("show");
  loaderWraper.classList.remove("show");
}

function tableHideLoader() {
  tableLoader.classList.remove("show");
  tableLoaderWraper.classList.remove("show");
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  fetchUsersData();
  fetchLogs(); // Fetch logs
});


function CKupdate(){
  for ( let instance in CKEDITOR.instances ){
      CKEDITOR.instances[instance].updateElement();
      // CKEDITOR.instances[instance].setData('');
  }
}

CKEDITOR.replace( 'content',{
  "extraPlugins" : "filebrowser"
});

sendemailBtn.addEventListener("click", e => {
  e.preventDefault()
  showSpinner()
   CKupdate()
  let formdata = new FormData(emailform)
  
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
    body: formdata // Convert JSON data to a string and set it as the request body
  };
  fetch('/sendemailevents', options) // api for the get request
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        
        hideSpinner()
        document.querySelector(".close-email-modal").click()
        fireAlert("success","email sent succesfully")
      }
      else if(data.error)
      {
        hideSpinner()
        fireAlert("error",data.error)
        
      }
      else {
        hideSpinner()
        
        fireAlert("error","somthing error")
      }
    })
    .catch(error => {
     
      hideSpinner()
      fireAlert("error",error)

    })
  })

})

function deleteUsersFetch(uid,email) {
  let formdata = new FormData()
  formdata.append("uid",uid)
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
    body: formdata
    // Convert JSON data to a string and set it as the request body
  };
  fetch('/deleteuser', options) // api for the get request
    .then(response => response.json())
    .then(data => {

      if (data.status == 'success') {
        fireAlert("success","user deleted successfully")
        var message = ` ${localStorage.getItem("userEmail")} delete  user: ${email} `;
        createLogs("critical",message)
      }
      if(data.status == 'error')
      {
        fireAlert("error","error happened.try again later")   
      }

    })
    .catch(error => {
      console.log(error);
      fireAlert("error",error)   

    })
    .finally(() => {
      hideLoader();
      fetchUsersData()
    });
  })
}


// upload files

// no need to upload file to firebase
// change icon name to analyzie
// handle file in backend
// show loader show pending
// show stats accoring to loyality number only


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
    // const allowedTypes = ['text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    // if (!allowedTypes.includes(file.type)) {
    //     fireAlert("error", 'Invalid file type. Please upload a TXT, CSV, or Excel file.');
    //     return;
    // }

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
    const FIleRef = `uploads/info/${file.name}`
    const fileStorageRef = storageRef(storage, `uploads/info/${file.name}`); // Use a descriptive path
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
                    listAllFiles()
            } catch (error) {
                console.error("Error getting download URL:", error);
                // Handle the error
            }
        }
    );
}

listAllFiles()

function listAllFiles() {
  const listRef = storageRef(storage, `uploads/info`);
  listAll(listRef)
      .then((res) => {
          prepareListFilesHtml(res.items);
      })
      .catch((error) => {
          console.log(error);
      });

  function prepareListFilesHtml(files) {
    
    if (files.length == 0) {
        tBody.innerHTML = ""; // Clear the existing table content
          tBody.innerHTML = `<div class="empty-files">You don't have any files yet</div>`;
          return;
      }

      const dataPromises = files.map(file => {
          return getMetadata(storageRef(storage, `uploads/info/${file.name}`))
              .then((metadata) => {
                  return getDownloadURL(storageRef(storage, `uploads/info/${metadata.name}`))
                      .then((url) => {
                          let fileName = metadata.name;
                          let fileSize = (metadata.size < 1024) ? metadata.size + " KB" : (metadata.size / (1024 * 1024)).toFixed(2) + " MB";
                          let fileDate = new Date(metadata.timeCreated);
                          fileDate = fileDate.getDate() + "-" + (months[fileDate.getMonth()]) + "-" + fileDate.getFullYear()
                              + " " +
                              fileDate.getHours() + ":" + fileDate.getMinutes();

                          return {
                              filename: fileName,
                              date: fileDate,
                              size: fileSize,
                              action: `
                                  <a href="${url}" target="_blank" download class="card-link download"><i class="fa-solid fa-download"></i></a>
                                  <a href="#" class="file-delete-btn" data-filename="${fileName}"><i class="fa-solid fa-trash"></i></a>

                              `
                          };
                      });
              });
      });

      Promise.all(dataPromises)
          .then(data => {
                // Destroy existing DataTable instance if it exists
                if ($.fn.DataTable.isDataTable('#dataFilesTable')) {
                  $('#dataFilesTable').DataTable().destroy();
              }
              // Clear the table content
              tBody.innerHTML = "";
              // Reinitialize the DataTable with the new data
              initializeDataTable(data);
              tableHideLoader();
          })
          .catch(error => {
              console.log(error);
          });
  }
}

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
            targets: 0, // First column (File Name column)
            width: '20%' // Set the width to 30% of the table
          },
          {
            targets: -1, // Last column (Action column)
            orderable: false, // Disable sorting for the action column
            searchable: false // Disable searching for the action column
          }
        ],
        scrollX: true,
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
                const desertRef = storageRef(storage, `uploads/info/${fileToDeleted}`);
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


// document.querySelector(".refresh-data").addEventListener("click",()=>{
//   listAllFiles()
// })