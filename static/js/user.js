import {createLogs,db, sendEmailVerification ,auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, goOffline ,ref, set, onValue  } from "./firebase.js"
const togglePassword = document
  .querySelector('#togglePassword');
const togglePassword1 = document
  .querySelector('#togglePassword1');
  const password = document.querySelector('#password');
  const passwordR = document.querySelector('#password-r');
function showHidePass(element,pass)
{
  if(!element) return
  
element.addEventListener('click', () => {
  // Toggle the type attribute using
  // getAttribure() method
  const type = pass
      .getAttribute('type') === 'password' ?
      'text' : 'password';
      pass.setAttribute('type', type);
  // Toggle the eye and bi-eye icon
 
  
  element.classList.toggle('bi-eye');
});
}
showHidePass(togglePassword,password)
showHidePass(togglePassword1,passwordR)
// sign in
let sign_in_btn = document.querySelector(".login-btn-modal");
if(sign_in_btn)
{

  sign_in_btn.addEventListener("click", (e) => {
    e.preventDefault();
    login()
  })
}

function login() {
    showSpinner();
    hideRegistererror();
    if (!isEmptyLoginfields()) {

      hideSpinner()
      return;
    }

  let emailLoggedValue = email_input.value.trim();
  let passwordLoggedValue = password_input.value.trim();
  signInWithEmailAndPassword(auth, emailLoggedValue, passwordLoggedValue)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // read from database check if user approved or pending  if pending fire message not allowed if approved go login page
      // make button to copy data
      const data = ref(db, 'users/' + user.uid );
      onValue(data, (snapshot) => {
        const loggedUser = snapshot.val();
        if(user.emailVerified)         
            {
              if(loggedUser.status == 'pending')
              {
                hideSpinner()
                fireAlert("error" , "Sorry you are panned contact dr hasan to get approved for this ")
               
              }else{
                user.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                  // check if user is admin
                  // goto dashboard
                  // Send token to your backend via HTTPS
                  localStorage.setItem("token",idToken)
                  localStorage.setItem("uid",user.uid)
                  localStorage.setItem("userEmail",user.email)
                  var message = `${user.email} has been logged`;
                  createLogs("info",message)
                    if(loggedUser.role === "admin")
                      {
                        window.location.href= "/dashboard?token="+idToken
                      }else{
                        window.location.href= "/upload?token="+idToken
                      }
                    });
              }

        }else{
              hideSpinner()

              Swal.fire({
                customClass: 'verify-alert',
                title: "<strong>Attention!!</strong>",
                html: `
                Your email address is not verified or you are panned, click verify now
                `,
                showCloseButton: false,
                allowOutsideClick: false,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: `Send Verification Email`,
                confirmButtonAriaLabel: "Send Verification Email",
              }).then(result => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  sendEmailVerification(user)
                  .then(()=>{
                    Swal.fire({
                      title: "Success!",
                      text: "Verification email sent successfully!",
                      icon: "success"
                    });
                   
                  }).catch(error=>{
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "can not send email verification",
                    
                    });
                  })
      
                }
              else if (result.isDismissed) {
              
          // close modal
              }
              });
            }
       
      })


    })
    .catch((error) => {
      hideSpinner()
      const errorCode = error.code;
      const errorMessage = error.message;
      showLoginerror(errorCode, errorMessage)
    });
}



// register
let register_btn = document.querySelector(".register-btn-modal");
if(register_btn)
{

  register_btn.addEventListener("click", (e) => {
    e.preventDefault();
    register()
  })
}

function register() {
      showSpinner();
      hideRegistererror();
      if (!isEmptyRegisterfields()) {
        hideSpinner()
        return;
      }
      if (!isNotvalidUsername()) {
        hideSpinner()
        return;
      }
      let emailValue = email_r.value.trim();
      let passwordValue = passwordR.value.trim();
      createUserWithEmailAndPassword(auth, emailValue,passwordValue)
        .then((userCredential) => {
          const user = userCredential.user;
          sendEmailVerification(user)
          .then(() => {
            // Email verification sent!
            saveUserinDatabase(user)
            var message = `${emailValue} regsiter new account`;
            createLogs("info",message)
          }).catch(error=>fireAlert("error","error in creating account try again later"));
         
        })
        .catch((error) => {
          hideSpinner()
          const errorCode = error.code;
          //   console.log(errorCode);
          const errorMessage = error.message;
          showRegistererror(errorCode, errorMessage)
        });

  }
function saveUserinDatabase(user) {
    set(ref(db, 'users/' + user.uid), {
      username: username_r.value,
      email: user.email,
      password: password_r.value ,
      "role" : "user" ,
      "status": "approved"

    })
      .then(() => {        
        hideSpinner()
        Swal.fire({
          title: "<strong>Success</strong>",
          icon: "success",
          html: 
          `<p>An email verification link has been sent to  <a href="mailto:${user.email}">${user.email}</a></p>`,
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
        });
        document.querySelector(".close-register-modal").click()
        goOffline()
      })

  }





