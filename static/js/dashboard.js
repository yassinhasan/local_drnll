import * as firbase from "./firbase.js";

// todo 
  // add method to change pending or verify user when select or change user from user to admin popup confim will show change user from state to another then confirm 
  // make method form backup database
  // add images in send emails
  // add tab for change user password or email
let loader = document.querySelector(".loader")
let dashboardWraper = document.querySelector(".dashboard-wraper")
let usersNumSpan = document.querySelector(".users .info .num")
let emailItems = document.querySelector(".email-items")
let inactiveUsersNum = document.querySelector(".inactive-users .num")
let activeUsersNum = document.querySelector(".active-users .num")
let selectEmail = document.querySelector(".email-user")
let sendemailBtn = document.querySelector(".sendemail-btn-modal")
let emailform = document.querySelector(".emailform")
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
    ['inactive', usersData.inactive],
  ]);


  // Set chart options
  var options = {
    'title': 'Users Active',
    'width': 400,
    'height': 350
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
getUsersData()

function getUsersData() {

  loader.classList.add("show")
  fireAlert("info","loading users data ...")
  const options = {
    headers: {
      "X-CSRFToken": csrfToken,
      "ContentType": 'application/json;charset=UTF-8',
    },
    credentials: 'include',
    method: 'POST',
    // Convert JSON data to a string and set it as the request body
  };
  fetch('/usersdata', options) // api for the get request
    .then(response => response.json())
    .then(data => {
     
      const currentDateIndays = new Date().getTime()
      let activeUsersCount = 0
      let inactiveUsersCount = 0
      if (data.results) {
        
        let  lastLogin ;
        let lastLoginInDays = 0;
        emailItems.innerHTML = ""
        selectEmail.innerHTML = ""
        let emails = data.users.map(user => user.email)

        selectEmail.innerHTML += ` <option value="${emails}" selected>All Users</option>`
        data.users.forEach((user, index) => {
          let uid = localStorage.getItem("uid");

          if(uid == user.userId)
          {

             lastLogin = new Date();
            lastLoginInDays = new Date().getTime()
          }else{
            lastLogin = new Date(user.lastLogin)
            lastLoginInDays = lastLogin.getTime()
          }
          // loggingData[index] = [
          //   user.email,
          //   new Date(user.lastLogin),
          //   new Date(),
          // ]
          // fill select email in form
          selectEmail.innerHTML += `
                   <option value="${user.email}">${user.email}</option>
                   `
          // console.log(userDetails);
          const creationTime = new Date(user.creationTime);
          const creationTimeFormatted = creationTime.getDate() + '/' + (creationTime.getMonth() + 1) + '/' + creationTime.getFullYear();
          const lastLoginFormatted = lastLogin.getDate() + '/' + (lastLogin.getMonth() + 1) + '/' + lastLogin.getFullYear();
          let diffInLogin =Math.abs(Math.ceil((currentDateIndays - lastLoginInDays) / (24 * 3600 * 1000)))
  
        
          
          let active = ''
          let email_verified = ''
          if (diffInLogin <= 7) {
            active = 'active'
            activeUsersCount++
          } else {
            active = 'inactive'
            inactiveUsersCount++
          }

          emailItems.innerHTML += `
                    <div class='user-data'>
                    <li class="list-group-item user-email">${user.email} <span class='status ${active}'>${active}</span>
                    <span class='status ${user.email_verified == true ? 'verified' : 'unverified'}'>[${user.email_verified == true ? 'Verified' : 'Unverified'}]</span></li>
                    <p class="create-at"><span class='title-span'>creationTime:</span> <span class='span-data'>${creationTimeFormatted}</span></p>
                    <p class="last-login"><span class='title-span'>last Login  </span>: <span class='span-data ${active}'>${lastLoginFormatted}</span></p>
                    </div>
                    `
        });
        usersNumSpan.innerHTML = data.users.length
        activeUsersNum.innerHTML = activeUsersCount
        inactiveUsersNum.innerHTML = inactiveUsersCount
        let usersData = {
          "active": activeUsersCount,
          "inactive": inactiveUsersCount
        }

        google.charts.setOnLoadCallback(drawChart(usersData));
        // google.charts.setOnLoadCallback(drawChartTimeLine(loggingData));
        dashboardWraper.style.display = "block"
        loader.classList.remove("show")
        getLogs()
      }

    })
    .catch(error => {
      console.log(error);

    })

}



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
  
  const options = {
    headers: {
      "X-CSRFToken": csrfToken,
    },
    credentials: 'include',
    method: 'POST',
    body: formdata // Convert JSON data to a string and set it as the request body
  };
  fetch('/sendemailevents', options) // api for the get request
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.success) {
        
        hideSpinner()
        document.querySelector(".close-email-modal").click()
        fireAlert("success","email sent succesfully")
      }
      else if(data.error)
      {
        console.log(data.error);
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


// edit users
editUsersFetch()

function editUsersFetch() {

  const options = {
    headers: {
      "X-CSRFToken": csrfToken,
      "ContentType": 'application/json;charset=UTF-8',
    },
    credentials: 'include',
    method: 'POST',
    // Convert JSON data to a string and set it as the request body
  };
  fetch('/editusers', options) // api for the get request
    .then(response => response.json())
    .then(data => {

      if (data.results) {
          let users = data.users
          let editUsersContainer = document.querySelector(".edit-users-ul")
          editUsersContainer.innerHTML = ""
          for (const key in users) {
             
              let user = users[key]
              let editUser =  user['role'] != 'admin' ? `<div class="edit-users-action">
              <a class="edit-users-delete" data-target="${key}" data-username="${user['username']}">
                <i class="fa-solid fa-trash"></i>
              </a>
            </div>`: ""

            let role = user['role'] != 'admin' ? 'user' : 'admin'
            let roleClass = user['role'] == 'admin'  ? 'active-role' : 'inactive-role'
            let statusClass = user['status'] == 'approved'  ? 'active-status' : 'inactive-status'
            let status = user['status'] == 'approved' ? 'approved' : 'pending'

                editUsersContainer.innerHTML +=`
                <li class="list-group-item edit-users-list">
                    <div class="edit-users-email">${user['email']}</div>
                    <div class="user-edit-wraper">
                    <select class="form-select role-user ${roleClass}"  name="role-user" id="role-user"  data-target="${key}" data-username="${user['username']}">
                      <option style="color:red"  value='user' ${role == 'user' ? 'selected' : ''} >User</option>
                      <option style="color:green"  value='admin'  ${role == 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                    <select class="form-select status-user ${statusClass}"  name="status-user" id="status-user" data-target="${key}" data-username="${user['username']}" >
                      <option style="color:green" value='approved' ${status == 'approved' ? 'selected' : ''}>Approved</option>
                      <option style="color:red"  value='pending'  ${status == 'pending' ? 'selected' : '' }>Pending</option>
                    </select>
                    ${editUser}
                    </div>
                </li>
                `
             
            }
          
      }

      let editUsersDelete  = document.querySelectorAll(".edit-users-delete");
      editUsersDelete.forEach(el=>
      {
        el.addEventListener("click",()=>
        {
          let uid = el.getAttribute("data-target");
         
          Swal.fire({
            title: "Do you want to delete this user?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              showSpinner()
              deleteUsersFetch(uid,el)
            } else if (result.isDenied) {
              Swal.fire("Changes are not saved", "", "info");
            }
          });

          
         
        })
      }
      )
      // edit user role
      let editUsersRole  = document.querySelectorAll(".role-user");
      editUsersRole.forEach(el=>
      {
        el.addEventListener("change",()=>
        {
          let uid = el.getAttribute("data-target");
          let userName= el.getAttribute("data-username");
          let role = el.value
          Swal.fire({
            title: "Do you want to change role of  this user ?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
               showSpinner()
              //  update
               firbase.update(firbase.ref(firbase.db, 'users/' + uid), {
                "role": role
              }).then(data=>{
                hideSpinner()  
                fireAlert("success","user role successfully")
              })
              // write log
              var message = ` ${localStorage.getItem("userEmail")} change role of ${userName} to ${role}`;
              firbase.createLogs("critical",message)
            } else if (result.isDenied) {
              Swal.fire("Changes are not saved", "", "info");
            }
          });

          
         
        })
      }
      )
      // edit user status
      let editUsersStatus  = document.querySelectorAll(".status-user");
      editUsersStatus.forEach(el=>
      {
        el.addEventListener("change",()=>
        {
          let uid = el.getAttribute("data-target");
          let userName= el.getAttribute("data-username");
          let status = el.value
          Swal.fire({
            title: "Do you want to change status of  this user?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
               showSpinner()
               firbase.update(firbase.ref(firbase.db, 'users/' + uid), {
                "status": status
              }).then(data=>{
                hideSpinner()  
                fireAlert("success","user status successfully")
              })
              var message = ` ${localStorage.getItem("userEmail")} change status of ${userName} to ${status}`;
              firbase.createLogs("critical",message)
              
            } else if (result.isDenied) {
              Swal.fire("Changes are not saved", "", "info");
            }
          });

          
         
        })
      }
      )

    })
    .catch(error => {
      console.log(error);

    })

}


function deleteUsersFetch(uid,element) {
  let userName= element.getAttribute("data-username");
  let formdata = new FormData()
  formdata.append("uid",uid)
  const options = {
    headers: {
      "X-CSRFToken": csrfToken,
      "ContentType": 'application/json;charset=UTF-8',
    },
    credentials: 'include',
    method: 'POST',
    body: formdata
    // Convert JSON data to a string and set it as the request body
  };
  fetch('/deleteuser', options) // api for the get request
    .then(response => response.json())
    .then(data => {

      if (data.results) {
        hideSpinner()  
        element.parentElement.parentElement.parentElement.remove()
        fireAlert("success","user deleted successfully")
        getUsersData()
        var message = ` ${localStorage.getItem("userEmail")} delete  user: ${userName} `;
        firbase.createLogs("critical",message)
      }
      if(data.error)
      {
        hideSpinner()
        fireAlert("error","error happened.try again later")   
      }

    })
    .catch(error => {
      console.log(error);
      hideSpinner()
      fireAlert("error",error)   

    })

}




var columns = [{data:'Info'},{data:'Message'},{data:'Time'}];
var data =[];


function getLogs()
{
  fireAlert("info","loading logs for today today")
  const dbRef = firbase.ref(firbase.db)
  let tableBody = document.querySelector(".table-body")
  tableBody.innerHTML = ""
  firbase.get(firbase.child(dbRef,`logs/${firbase.today}`)).then((snapshot) => {
    if (snapshot.exists()) {
     
     let logs = snapshot.val()
     for (const key in logs) {
 
      const log = logs[key];
        let logData = {
          "Info" : log.type,
          "Message" :log.message,
          "Time" : log.time,
        }

        data.push(logData)
     }
     let classInfo;
     let table = new DataTable('#myTableLogs',{
      "data": data,
      "columns": columns ,
      createdRow: function (row, data, dataIndex) {
        switch (data['Info']) {
          case "critical": classInfo = "row-danger"
            break;
          case "info": classInfo = "row-info"
            break;
          case "low": classInfo = "row-low"
            break;
        
          default:
            classInfo = ""
            break;
        }
        $(row).addClass(classInfo);
    },
    });
    fireAlert("info","loading logs fenished")
    } else {
      fireAlert("info","no logs today")
      document.querySelector(".logs-wraper").innerHTML = "No Logs Today";
      console.log("no logs");
    }
})
}

