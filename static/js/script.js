

let fa_moon = document.querySelector(".fa-moon");
let logo = document.querySelector(".logo");

if (localStorage.getItem("light_theme") === null) {
    localStorage.setItem("light_theme","light")
    fa_moon.classList.remove("day")
}
if(localStorage.getItem("light_theme") === "")
{
    document.body.classList.remove("light")
    fa_moon.classList.add("day")
}else{
    document.body.classList.add("light")
}

let bgColor = "#fff"
fa_moon.addEventListener("click",()=>{
   
    if (localStorage.getItem("light_theme") === "light") {
        localStorage.setItem("light_theme","")
        bgColor = "#000"
    }else{
        localStorage.setItem("light_theme","light")
        bgColor = "#fff"
    }
    document.body.classList.toggle("light");
    fa_moon.classList.toggle("day")
   

  
})

logo.addEventListener("click",()=>{
    window.location.href="/"
})

let menu_btn = document.querySelector(".menu-btn");
let inner_links = document.querySelector(".inner-links");
menu_btn.addEventListener("click",()=>{
    inner_links.classList.toggle("show")
    menu_btn.classList.toggle("open")
})



// permesssion notification prevent ater click on dropdown- item to be dissapear
document.querySelectorAll('.permssion-dropdown .dropdown-item').forEach(el => {
    el.addEventListener('click',(e)=>{
        e.stopPropagation();
    })
})