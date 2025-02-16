
let toggleChatboxBtn = document.querySelector(".toggle-chatbox-btn");
let chat_box = document.querySelector(".chat-box");
let send_msg = document.querySelector(".send_msg");
let loader = document.querySelector(".contact-loader")
let container =document.querySelector(".container")

let closeChatboxBtn = document.querySelector(".close-chatbox");

toggleChatboxBtn.addEventListener("click", () => {
   container.classList.add("blur")
   chat_box.classList.toggle("scale");
   toggleChatboxBtn.classList.toggle("scale");
   
})

closeChatboxBtn.addEventListener("click", () => {
   container.classList.remove("blur")
   toggleChatboxBtn.classList.toggle("scale");
   chat_box.classList.toggle("scale");

})




function hideChatBox() {
   toggleChatboxBtn.classList.add("scale");
   chat_box.classList.remove("scale");

   container.classList.remove("blur")
}
// send message
// form


let form_msg = document.querySelector(".form_msg");
send_msg.addEventListener("click", (e) => {
   e.preventDefault();

   loader.classList.add("show");
   clearContactEroor()
   if(!isEmptyContactfields())
   {
      hideChatBoxBeforeSendMesg()
      sendMessage()
   }else{
      loader.classList.remove("show");
      console.log("empty");
   }
})

const sendMessage = async () => {
   let contactForm = document.querySelector(".form_msg")
   let formdata = new FormData(contactForm)
   const options = {
     headers: {
   "X-CSRFToken" : csrfToken,
   "ContentType": 'application/json;charset=UTF-8',
     },
     credentials: 'include' ,
     method: 'POST',
     body: formdata // Convert JSON data to a string and set it as the request body
   };
   fetch('/contactme', options) // api for the get request
     .then(response => response.json())
     .then(result => {
       if (result.status == 'success') {
         showChatBoxAfterSendMesg()
         fireAlert("success",result.data.message)
       }
       else {
         console.log(result);
         showChatBoxAfterSendMesg()
         fireAlert("error",result.error)
       }
     })
     .catch(error => {
      console.log(error);
      showChatBoxAfterSendMesg()
      fireAlert("error","somthing error try later")
     })
};


function hideChatBoxBeforeSendMesg()
{
   
   toggleChatboxBtn.style.display = "none"
   chat_box.classList.remove("scale");
 


}
function showChatBoxAfterSendMesg()
{
   loader.classList.remove("show");
   toggleChatboxBtn.style.display = "block"
   toggleChatboxBtn.classList.remove("scale")
   chat_box.classList.remove("scale");
   container.classList.remove("blur")
}



