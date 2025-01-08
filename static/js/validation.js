// ELEMEN TS IN HTML
// invalid email in register
let invalid_email = document.querySelector(".invalid-email");
let invalid_username = document.querySelector(".invalid-username");
let invalid_password = document.querySelector(".invalid-password");

let invalid_email_l = document.querySelector(".invalid-email-login");
let invalid_password_l = document.querySelector(".invalid-password-login");

var username_r = document.getElementById('username-r');
var email_r = document.getElementById('email-r');
var password_r = document.getElementById('password-r');

var username_r = document.getElementById('username-r');
var email_r = document.getElementById('email-r');
var password_r = document.getElementById('password-r');


var email_input = document.getElementById('email');
var password_input = document.getElementById('password');

function isEmptyRegisterfields()
{

    let isValid = true;
    if(username_r.value.trim() === "" || username_r.value.trim() === null)
    {
      showRegistererror("empty-username","you shoud enter username");
      isValid = false;
    }
    if(email_r.value.trim() === "" || email_r.value.trim() ===  null)
    {
      showRegistererror("empty-email","you shoud enter email");
      isValid = false;
    }
    if(password_r.value.trim() === "" || password_r.value.trim() ===null)
    {
      showRegistererror("empty-password","you shoud enter password");
      isValid = false;
    }

    return isValid;
}


function isNotvalidUsername()
{

    let isValid = true;
    
    const usernameRegex = /^[a-zA-Z]{2,20}[a-zA-Z-0-9-_\s]+$/
    if(usernameRegex.test(username_r.value.trim()) === false)
    {
      showRegistererror("invalid-username","username shoud letter or number");
      isValid = false;
    }

    return isValid;
}
function isEmptyLoginfields()
{

    let isValid = true;

    if(email_input.value.trim() === "" || email_input.value.trim() ===  null)
    {
      showLoginerror("empty-email-login","you shoud enter email");
      isValid = false;
    }
    if(password_input.value.trim() === "" || password_input.value.trim() ===null)
    {
      showLoginerror("empty-password-login","you shoud enter password");
      isValid = false;
    }
    return isValid;
}

function showRegistererror(errorCode,errorMessage) {


  switch (errorCode) {
    case "auth/invalid-email":
        invalid_email.style.display = "block";
        invalid_email.innerHTML = "this email is invalid"
        break;
    case "auth/email-already-in-use":
        invalid_email.style.display = "block";
        invalid_email.innerHTML = "this email is alraeady exists"
        break;
    case "EMAIL_EXISTS":
        invalid_email.style.display = "block";
        invalid_email.innerHTML = "this email is alraeady exists"
        break;

    case "auth/missing-password":
        invalid_password.style.display = "block";
        invalid_password.innerHTML = "you shoud enter password"
        break;
    case "auth/weak-password":
        invalid_password.style.display = "block";
        invalid_password.innerHTML = "you shoud enter  strong password"
        break;
    case "WEAK_PASSWORD : Password should be at least 6 characters":
        invalid_password.style.display = "block";
        invalid_password.innerHTML = "Password should be at least 6 characters"
        break;
    case "empty-username":
        invalid_username.style.display = "block";
        invalid_username.innerHTML = errorMessage
        break;
    case "invalid-username":
        invalid_username.style.display = "block";
        invalid_username.innerHTML = errorMessage
        break;
    case "empty-email":
        invalid_email.style.display = "block";
        invalid_email.innerHTML = errorMessage
        break;
    case "empty-password":
        invalid_password.style.display = "block";
        invalid_password.innerHTML = errorMessage
        break;
    default:

        break;
  }

}
function showLoginerror(errorCode,errorMessage = "") {


  switch (errorCode) {
    case "auth/invalid-email":
      invalid_email_l.style.display = "block";
      invalid_email_l.innerHTML = "this email is invalid"
        break;

    case "auth/missing-password":
      invalid_password_l.style.display = "block";
      invalid_password_l.innerHTML = "you shoud enter password"
        break;


    case "empty-email-login":
        invalid_email_l.style.display = "block";
        invalid_email_l.innerHTML = errorMessage
        break;
    case "empty-password-login":
        invalid_password_l.style.display = "block";
        invalid_password_l.innerHTML = errorMessage
        break;
    case "auth/invalid-credential":
      invalid_email_l.style.display = "block";
      invalid_email_l.innerHTML = "soory email or password is invalid"
        break;
    case "INVALID_LOGIN_CREDENTIALS":
      invalid_email_l.style.display = "block";
      invalid_email_l.innerHTML = "soory email or password is invalid"
        break;
    
    default:

        break;
  }

}


function hideRegistererror() {

  invalid_email.style.display = "none";
  invalid_email.innerHTML = ""
   
  invalid_username.style.display = "none";
  invalid_username.innerHTML = ""

  invalid_password.style.display = "none";
  invalid_password.innerHTML = ""

  invalid_email_l.style.display = "none";
  invalid_email_l.innerHTML = ""
   

  invalid_password_l.style.display = "none";
  invalid_password_l.innerHTML = ""
}
function hideLoginerror() {

  invalid_email_l.style.display = "none";
  invalid_email_l.innerHTML = ""
   
  invalid_password_l.style.display = "none";
  invalid_password_l.innerHTML = ""
}



// 
// contact form
let ContactName = document.querySelector(".contact-name");
let ContactEmail = document.querySelector(".contact-email");

let ContactPhone = document.querySelector(".contact-phone");
let ContactMsg = document.querySelector(".contact-msg");

function isEmptyContactfields()
{

  let isEmpty = false;
  if(ContactName.value.trim() === "" || ContactName.value.trim() === null)
  {
   
    showContacterror("empty-username","you shoud enter username");
    isEmpty = true;
  }
  if(ContactEmail.value.trim() === "" || ContactEmail.value.trim() ===  null)
  {
    showContacterror("empty-email","you shoud enter email");
    isEmpty = true;
  }

  if(ContactMsg.value.trim() === "" || ContactMsg.value.trim() ===null)
  {
    showContacterror("empty-msg","you shoud enter message");
    isEmpty = true;
  }

  return isEmpty;
}
function showContacterror(errorCode,errorMessage) {

  
  switch (errorCode) {

    case "empty-username":
        ContactName.classList.add("error")
        ContactName.setAttribute("placeholder",errorMessage)
        break;
    case "empty-email":
        ContactEmail.classList.add("error")
        ContactEmail.setAttribute("placeholder",errorMessage)
        break;
    case "empty-msg":
        ContactMsg.classList.add("error")
        ContactMsg.setAttribute("placeholder",errorMessage)
        break;
    default:

        break;
  }

}

function clearContactEroor()
{

  ContactName.classList.remove("error")
  ContactName.setAttribute("placeholder","write your name ..")
  ContactEmail.classList.remove("error")
  ContactEmail.setAttribute("placeholder","write your email ..")
  ContactMsg.classList.remove("error")
  ContactMsg.setAttribute("placeholder","write your message here ..")
}