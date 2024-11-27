// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
// import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
// import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword ,getIdToken} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
// import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional

// // Initialize Firebase
// const firebase = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebase);
// // Set database variable
// const db = getDatabase(firebase);
// const auth = getAuth();
// const storage = getStorage(firebase);

// let freshLogged = false;
// // check if user logged or not
// isLogged()
// function isLogged() {
//   showSpinner()
//   onAuthStateChanged(auth, (user) => {

//     if (user) {

//         var homepages = ['/download' , "/" ]; 
//         if (homepages.indexOf(window.location.pathname) >= 0) {
//           // here replace register and login icon with logout only
//           console.log("here replace register and login icon with logout only");
//         }
//       // User is signed in, see docs for a list of available properties
//       // https://firebase.google.com/docs/reference/js/auth.user
//       const uid = user.uid;
//       user.getIdToken().then(function(idToken) {  // <------ Check this line
//         console.log(idToken); // It shows the Firebase token now        user.getIdToken().then(function(idToken) {  // <------ Check this line
//       })
//       getUserDataFromDatabase(uid ,freshLogged=false)
//     } else {
//         var homepages = [ '/upload']; 
//           // you can here show login modal
//         if (homepages.indexOf(window.location.pathname) >= 0 ) {
//         //  window.location.href = "/"
//         }
//       hideSpinner()
//       //  console.log("not logged")
//     }
//   });
// }
// async function getUserDataFromDatabase(uid ,freshLogged=false) {

 
//   let myPromise = new Promise(function (resolve) {
//     const userData = ref(db, 'users/' + uid);
//     onValue(userData, (snapshot) => {
//       resolve(snapshot.val());
//     });
//   });
//   myPromise.then(user =>{
//     let profile_wraper = document.querySelector(".profile-wraper");
//     let username = profile_wraper.querySelector(".username");
//     username.innerHTML = user.username;
//     hideSpinner()
//     if(freshLogged == true)
//     {
//       const Toast = Swal.mixin({
//         customClass: 'swal-login',
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//         color: "#b58126",
//         timerProgressBar: true,
//         didOpen: (toast) => {
//           toast.onmouseenter = Swal.stopTimer;
//           toast.onmouseleave = Swal.resumeTimer;
//         }
//       });
//       Toast.fire({
//         icon: "success",
//         title: "wellcome back "+user.username
//       }); // end of alert
//     }
//   } ).catch(error=>console.log(error))
 
  
// }




