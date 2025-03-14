import {signOut,auth} from "./firebase.js"
let logoutBtns = document.querySelectorAll(".logout");
logoutBtns.forEach(logoutBtn=>{
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault()
    showSpinner()
    logoutUser()
  })
})


function logoutUser() {
    signOut(auth)
    .then(() => {
        let formdata = new FormData()
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
})
}
