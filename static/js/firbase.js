import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {get, goOffline,getDatabase, child,update ,remove ,ref, set, onValue ,push, query, orderByChild} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { sendEmailVerification , getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getStorage, ref as storageRef, uploadString, uploadBytes, uploadBytesResumable, getDownloadURL, listAll, getMetadata , deleteObject} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase);
// Set database variable
const db = getDatabase(firebase);
const auth = getAuth();
const storage = getStorage(firebase);
let date = new Date()
let today = date.getDate()+"-"+(date.getMonth() + 1)+"-"+date.getFullYear()
let todayTime =date.getDate()+"-"+(date.getMonth() + 1)+"-"+date.getFullYear() + " "+date.getHours()+":"+date.getSeconds()

function createLogs(type,message)
{
  
  set(ref(db, `logs/${today}/`+self.crypto.randomUUID()), {
    "type": type ,
    "actualTime" : new Date().getTime(),
    "message":message,
    "time":todayTime
  }).then(data=>{
    console.log("logs added")
  })

}
 export  {today,goOffline,createLogs,uploadString,sendEmailVerification , get,child,remove ,update , query, orderByChild,push,auth,db,storage,ref,storageRef,uploadBytes,uploadBytesResumable,getDownloadURL,listAll,getMetadata,deleteObject,set,onValue,createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword}
