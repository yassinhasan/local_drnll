
let currentTab = 0;
let userCvData = {};
// create cv
let srcImage = "../static/images/hasan.png";
let imagePreview;
let image_cv_input;
let mainFormElem;
let firstNameElem;
let middleNameElem;
let lastNameElem;
let job_cvElem;
let display_name;
let display_jop;
let display_phone;
let display_email;
let display_address;
let display_portfolio;
let display_education;
let display_work;
let display_skills;
let display_courses;
let display_lang;
let display_ref;
let userImages;

// contact
let phonNumbersElements;
let emailElements;
let addressElements;
let portfolioElements;
// let summaryElements = document.querySelectorAll(".summary_cv")
let edu_descrptionElements;
// let edu_startdateElements = document.querySelectorAll(".edu_startdate")
// let edu_endDateElements = document.querySelectorAll(".edu_enddate")

let exp_descriptionElements;
// let exp_organizationElements = document.querySelectorAll(".exp_organization")
// let exp_startDateElements = document.querySelectorAll(".exp_startdate")
// let exp_endDateElements = document.querySelectorAll(".exp_enddate")
let skillsElements;
let coursesDescElements;
let langDescElements;
let langSkillsElements;
let refDescElements;
let repeatContactForm;
let repeatEducationForm;
let repeatWorkForm;
let repeatSkillsForm;
let repeatCoursesForm;
let repeatRefForm;
let repeatLangForm;
let x = 50
let y = 50
let imagePos = {
  "x":x,"y":y
}
let fontFamily = [
  '"Poppins", sans-serif',
  '"Roboto", sans-seri',
  '"Gideon Roman", serif',
  '"Open Sans", sans-serif',
  '"Lato", sans-serif',
  '"Montserrat", sans-serif'

]
let originalHasanCV = {
  "firstname_cv": "Hasan",
  "middlename_cv": "Elhussiny",
  "lastname_cv": "Meady",
  "job_cv": "Pharamacist",
  "contact": [
    {
      "phone_cv": "+966546035917",
      "email_cv": "dr_hasan781@yahoo.com",
      "address_cv": "Al Mubarraz, Al Ahsa,Saudi Arabia",
      "portfolio_cv": "https://hasanmeady.web.app"
    },
    {
      "phone_cv": "+966575653417",
      "email_cv": "hasanmmeady781@gmail.com",
      "address_cv": "",
      "portfolio_cv": ""

    }
  ],
  "education": [
    {
      "edu_descrption": "Bachelor’s degree in pharmacy (Very Good), Tanta University, Egypt (2010)"
    },
    {
      "edu_descrption": ""
    }
  ],
  "workExperience": [
    {
      "exp_description": "Pharmacist at Aldwaa, Alahsaa, KSA (2011 - Present)"
    },
    {
      "exp_description": "Pharmacist, Ibn Alnafess Pharmacy (part-time), Tanta, Egypt, (2010 - 2011)"
    },
    {
      "exp_description": "Pharmacist, Ministry of Health hospitals (Public Duty), Tanta, Egypt (2011)"
    }
  ],
  "siklls": [
    {
      "skill_cv": "Communication Skills: Proficient in liaising and communication with stakeholders, including experience with internal and external parties. Fluent in Arabic and English."
    },
    {
      "skill_cv": "Leadership & Training Skills: Experienced in onboarding and training new staff and pharmacists, ensuring smooth transition and implementation of systems."
    },
    {
      "skill_cv": "Problem-Solving Skills: Able to identify, report and propose solutions for any bug fixing or development."
    }
  ],
  "courses": [
    {
      "courses_desc": "Web and Programming Fundamentals (PHP, JAVASCRIPT, TYPESCRIPT, PYTHON, HTML, CSS)"
    },
    {
      "courses_desc": "Advanced Database Management using MySQL Shell Scripting, Virtualization, Active Directory (MCSA)"
    },
    {
      "courses_desc": "Docker containerization"
    },
    {
      "courses_desc": "Manage Linux operating systems"
    },
    {
      "courses_desc": "Networking (CCNA)"
    },
    {
      "courses_desc": "Networking (CCNA)"
    }
  ],
  "lang": [
    {
      "lang_desc": "Arabic",
      "lang_skills": "Native"
    },
    {
      "lang_desc": "English",
      "lang_skills": "Very Good"
    }
  ],
  "References": [
    {
      "ref_desc": "Available upon request"
    }
  ],
  "image"
    : "../static/images/hasan.png"
}

let edit = false;
let hideAgain = true;
showTab(currentTab);



function showTab(n) {
  document.querySelector(".progress").style.display = n == 0 ? 'none' : 'flex'
  let x = document.getElementsByClassName("step");
  x[n].style.display = "block";
  let progress = (n / (x.length - 1)) * 100;
  document.querySelector(".progress-bar")
    .style.width = progress + "%";
  document.querySelector(".progress-bar")
    .setAttribute("aria-valuenow", progress);
  document.getElementById("prevBtn")
    .style.display = n == 0 ? "none" : "inline";
  // document.getElementById("nextBtn")
  //   .innerHTML = n == x.length - 1 ? "Submit" : "Next";
  document.getElementById("nextBtn")
    .style.display = n == x.length - 1 ? "none" : "inline";
}

function nextPrev(n) {
  let x = document.getElementsByClassName("step");
  x[currentTab].style.display = "none";
  currentTab += n;
  if (currentTab >= x.length) {
    resetForm();
    return false;
  }
  showTab(currentTab);
}

function validateForm() {
  let valid = true;
  let x = document.getElementsByClassName("step");
  let y = x[currentTab].getElementsByTagName("input");
  for (var i = 0; i < y.length; i++) {
    if (y[i].value == "") {
      y[i].className += " invalid";
      valid = false;
    }
  }
  return valid;
}

function resetForm() {
  let x = document.getElementsByClassName("step");
  for (var i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  // let inputs = document.querySelectorAll("input");
  // inputs.forEach(input => {
  //     input.value = "";
  //     input.className = "";
  // });
  currentTab = 0;
  showTab(currentTab);
  document.querySelector(".progress-bar")
    .style.width = "0%";
  document.querySelector(".progress-bar")
    .setAttribute("aria-valuenow", 0);
  document.getElementById("prevBtn")
    .style.display = "none";
}


$(document).ready(function () {
  $('.repeater').repeater({
    initEmpty: false,
    defaultValues: {
      'text-input': ''
    },
    show: function () {
      $(this).slideDown();
    },
    hide: function (deleteElement) {
      $(this).slideUp(deleteElement);
      setTimeout(() => {
        // generateCV();
      }, 500);
    },
    isFirstItemUndeletable: true
  })
})


// save screen shot


function downloadCvAsImage(element) {
  let cvNumber = element.getAttribute("data-target")
  if(cvNumber == "all") return
  showLoaderWithTitle("Creating Image CV ..")
  let cv = document.querySelector(`.cv${cvNumber}`);
  convertToImage(cv, `cv${cvNumber}`)
}


function downloadCvAsPdf(element) {
  showLoaderWithTitle("Creating Pdf CV ..")
  let cvNumber = element.getAttribute("data-target")
  if(cvNumber == "all") return
  let cv = document.querySelector(`.cv${cvNumber}`);
  // convertToImage(cv, `cv${cvNumber}`)
  const { jsPDF } = window.jspdf;
  var doc =new jsPDF(
'px','px', [500, 700],true
); 



doc.setFont("Caveat","normal");
doc.setFont("Poppins","normal");
doc.setFont("Roboto","normal");
doc.setFont("Gideon Roman","normal");
doc.setFont("Montserrat","normal");
doc.setFont("fa-regular-400","normal");
doc.setFont("fa-solid-400","normal");
doc.setFont("fa-brands-400","normal");

  doc.html(cv, {
    callback: function (doc) {
      
        doc.save(`cv${cvNumber}.pdf` );
        removeLoaderWithTitle()
        fireAlert("success", "Your CV is downloaded as Pdf","success-alert")
    },
    x: 20,
    y: 20,
    html2canvas: { scale: 0.5 },
    margin: [20, 20, 20, 20] // [left, bottom, right, top]
});

}

function printCv(element){
  let cvNumber =  element.getAttribute("data-target")
  if(cvNumber == "all") return
  document.querySelectorAll(".cv").forEach(e=>e.classList.remove("print"))
  document.querySelector(`.cv${cvNumber}`).classList.add("print")
 setTimeout(() => {
  window.print()

 }, 100);
}



async function convertToImage(element, name) {
  let scale = getComputedStyle(document.querySelector(".cv-wraper")).scale
  document.querySelector(".cv-wraper").style.scale = "1"
  const h = await html2canvas(element, {
    allowTaint: true,
    quality: 4,
    scale: 3,
  }).then(canvas => {
    const fileName = name;
    const link = document.createElement("a");
    link.download = fileName + ".png";
    canvas.toBlob(function (blob) {
      link.href = canvas.toDataURL({
        scale: .8,
        allowTaint: true,
        width: canvas.width,
        height: canvas.height,
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        format: "png",

      });
      link.click();
      document.querySelector(".cv-wraper").style.scale = scale
      removeLoaderWithTitle()
      fireAlert("success", "Your CV is downloaded as Image","success-alert")

    });
  })
  return h
}


// let downloadPdf1 = document.querySelector(".download-pdf-1")
// let downloadPdf3 = document.querySelector(".download-pdf-3")
// downloadPdf1.addEventListener("click", e => {
//   // let scale = getComputedStyle(document.querySelector(".cv-wraper")).scale
//   // document.querySelector(".cv-wraper").style.scale = "1"
//   // showLoaderWithTitle("Creating Pdf CV ..")
//   // printdoc(document.querySelector(".cv1"), "cv1", true)
//   // document.querySelector(".cv-wraper").style.scale = scale
// //  printJS({printable:'cv1', type:'html',css:'https://drnull.web.app/css/cvmaker.css'});
// document.body.classList.remove("two")
// document.body.classList.remove("three")
// document.body.classList.add("one")
// window.print()

// })
// downloadPdf3.addEventListener("click", e => {
//   // let scale = getComputedStyle(document.querySelector(".cv-wraper")).scale
//   // document.querySelector(".cv-wraper").style.scale = "1"
//   // showLoaderWithTitle("Creating Pdf CV ..")
//   // printdoc(document.querySelector(".cv1"), "cv1", true)
//   // document.querySelector(".cv-wraper").style.scale = scale
// //  printJS({printable:'cv1', type:'html',css:'https://drnull.web.app/css/cvmaker.css'});
// document.body.classList.remove("two")
// document.body.classList.remove("one")
// document.body.classList.add("three")
// window.print()

// })
// let downloadPdf2 = document.querySelector(".download-pdf-2")
// downloadPdf2.addEventListener("click", e => {
//   // let scale = getComputedStyle(document.querySelector(".cv-wraper")).scale
//   // document.querySelector(".cv-wraper").style.scale = "1"
//   // showLoaderWithTitle("Creating Pdf CV ..")
//   // printdoc(document.querySelector(".cv2"), "cv2")
//   // document.querySelector(".cv-wraper").style.scale = scale
//  // printJS({printable:'cv2', type:'html',css:'https://drnull.web.app/css/cvmaker.css'});
//  document.body.classList.remove("one")
//  document.body.classList.remove("three")
// document.body.classList.add("two")
// window.print()
// })

async function printdoc(element, name, resize = false) {
  // document.querySelector(".cv2").style.scale = "1"
  const h = await html2canvas(element, {
    allowTaint: false,
    quality: 2,
    scale: 1,
    logging: false,

  })
    .then(canvas => {

      let toData = canvas.toDataURL({ width: canvas.width, height: canvas.height, left: 0, top: 0, format: "png", multiplier: 2 });
      var doc = new jsPDF('p', 'pt', 'a4');

      // th = doc.internal.pageSize.width;    
      // var height = width * hratio
      let width = doc.internal.pageSize.width
      let height = doc.internal.pageSize.height
      let widthRatio = width / canvas.width
      let heightRatio = height / canvas.height

      let ratio = widthRatio > heightRatio ? heightRatio : widthRatio
      doc.addImage(toData, 'PNG',
        20,
        20,
        (canvas.width * ratio - 40),
        (canvas.height * ratio - 40)
      )
      doc.save(name);
      removeLoaderWithTitle()
      fireAlert("success", "Your CV is downloaded")
    })
  return h
}


function fetchValues(attr, ...nodes) {
  let elementCount = nodes.length;

  // console.log(nodes);
  let elementDataCount = nodes[0].length
  let tempArray = []
  // no of repeater
  for (let x = 0; x < elementDataCount; x++) {
    // example now phone element
    let obj = {}
    for (let j = 0; j < elementCount; j++) {

      obj[`${attr[j]}`] = nodes[j][x].value

    }
    tempArray.push(obj)

  }
  // console.log(tempArray);
  return tempArray
}
// create cv

imagePreview = document.querySelector(".image-preview")
image_cv_input = document.querySelector(".image_cv_input")
imagePreview.parentElement.style.display = "none"
imagePreview.addEventListener("click", e => {
  image_cv_input.click()
})
// form elements that has only one value
mainFormElem = document.querySelector(".main-form")
firstNameElem = mainFormElem.firstname_cv
middleNameElem = mainFormElem.middlename_cv
lastNameElem = mainFormElem.lastname_cv
job_cvElem = mainFormElem.job_cv


// elenmtns in cv template 
display_name = document.querySelectorAll(".fullname_cv")
display_jop = document.querySelectorAll(".jop-cv")
display_phone = document.querySelectorAll(".phone-container")
display_email = document.querySelectorAll(".email-container")
display_address = document.querySelectorAll(".address-container")
display_portfolio = document.querySelectorAll(".portfolio-container")
display_education = document.querySelectorAll(".education-container")
display_work = document.querySelectorAll(".work-container")
display_skills = document.querySelectorAll(".skills-container")
display_courses = document.querySelectorAll(".courses-container")
display_lang = document.querySelectorAll(".lang-container")
display_ref = document.querySelectorAll(".ref-container")
userImages = document.querySelectorAll(".image-cv");

function hideAllBeforeAddNewCV() {
  document.querySelectorAll(".item").forEach(element => {
    element.parentElement.style.display = "none"
  }
  )
}



const userInputs = () => {
  // all data from inputs and repeaters
  phonNumbersElements = document.querySelectorAll(".phone_cv")
  emailElements = document.querySelectorAll(".email_cv")
  addressElements = document.querySelectorAll(".address_cv")
  portfolioElements = document.querySelectorAll(".portfolio_cv")
  edu_descrptionElements = document.querySelectorAll(".edu_descrption")
  exp_descriptionElements = document.querySelectorAll(".exp_description")
  skillsElements = document.querySelectorAll(".skill_cv")
  coursesDescElements = document.querySelectorAll(".courses_desc")
  langDescElements = document.querySelectorAll(".lang_desc")
  langSkillsElements = document.querySelectorAll(".lang_skills")
  refDescElements = document.querySelectorAll(".ref_desc");
  repeatContactForm = document.querySelector(".repeat-contact-form")
  repeatEducationForm = document.querySelector(".repeat-education-form")
  repeatWorkForm = document.querySelector(".repeat-work-form")
  repeatSkillsForm = document.querySelector(".repeat-skills-form")
  repeatCoursesForm = document.querySelector(".repeat-courses-form")
  repeatRefForm = document.querySelector(".repeat-ref-form")
  return {
    firstname_cv: firstNameElem.value,
    middlename_cv: middleNameElem.value,
    lastname_cv: lastNameElem.value,
    job_cv: job_cvElem.value,
    contact: fetchValues(['phone_cv', 'email_cv', 'address_cv', 'portfolio_cv'], phonNumbersElements, emailElements, addressElements, portfolioElements),
    education: fetchValues(['edu_descrption'], edu_descrptionElements),
    workExperience: fetchValues(['exp_description'], exp_descriptionElements),
    siklls: fetchValues(['skill_cv'], skillsElements),
    courses: fetchValues(['courses_desc'], coursesDescElements),
    lang: fetchValues(['lang_desc', 'lang_skills'], langDescElements, langSkillsElements),
    References: fetchValues(['ref_desc'], refDescElements),
    image: srcImage,
  }
}

function fillAllCv(elements, data) {
  if (data) {
    elements.forEach(element => {
      element.parentElement.style.display = "block"
      element.innerHTML = data
    })
  }

}

let imageCvDisplay = document.querySelectorAll(".image-cv")

function previewImage() {

  let image_cv_input = document.querySelector(".image_cv_input")
  let oFReader = new FileReader();
  oFReader.readAsDataURL(image_cv_input.files[0]);
  oFReader.onload = function (ofEvent) {
    srcImage = ofEvent.target.result;

    userCvData['image'] = srcImage
    imagePreview.src = srcImage
    localStorage.setItem("userCv", JSON.stringify(userCvData))
    if (edit == false && hideAgain == true) {
      hideAllBeforeAddNewCV()
      hideAgain = false
    }
    imageCvDisplay.forEach(imageBox => {
      imageBox.src = srcImage
       imageBox.parentElement.style.display = 'flex'
    })
  }
}



function generateCV(data_target, item, category) {

  if (edit == false && hideAgain == true) {

    hideAllBeforeAddNewCV()
    hideAgain = false
  }


  userCvData = userInputs()

  localStorage.setItem("userCv", JSON.stringify(userCvData))
  if (item == 'firstname_cv' || item == 'middlename_cv' || item == 'lastname_cv' || item == 'job_cv') {

    fillAllCv(display_name, "<p>" + userCvData.firstname_cv + " " + userCvData.middlename_cv + " " + userCvData.lastname_cv + "</p>")
    fillAllCv(display_jop, "<p>" + userCvData.job_cv + "</p>")
  } else {

    fillAsList(data_target, userCvData[category], item)
  }
}


function fillAsList(data_target, dataList, item) {

  if (!dataList) return
  let divsLists = document.querySelectorAll(`.${data_target}`) //container
  let cv = 1;
  let num = ""
  divsLists.forEach((divsList, index) => {
    divsList.innerHTML = ""
    dataList.forEach((data, counter) => {

      if (data[item]) {


        divsList.parentElement.style.display = "block"
        num = counter > 0 ? `(${counter + 1})` : ''
        //  if i want to show item in list escpially in cv number 2 not one
        if (item == "email_cv") {
          if (cv == 2) {
            divsList.innerHTML += `<li><div class="text-size-bold">Email${num}: </div><a class="text-size padding-left">${data[item]}</a></li>`
          }
          else if (cv == 3 || cv == 4) {
            divsList.innerHTML += `<li class="grid-div"><i class="fa-regular fa-envelope contact-icon"></i><a class="email link-color">${data[item]}</a></li>`
          } else {
            divsList.innerHTML += `<li>${data[item]}</li>`
          }


        }
        else if (item == "phone_cv") {
          if (cv == 2) {
            divsList.innerHTML += `<li><div class="text-size-bold">Phone${num}: </div><div class="text-size padding-left">${data[item]}</div></li>`
          }
          else if (cv == 3 || cv == 4) {
            divsList.innerHTML += `<li class="grid-div"><i class="fa-solid fa-phone-flip contact-icon"></i><span class="phone">${data[item]}</span></li>`
          } else {
            divsList.innerHTML += `<li>${data[item]}</li>`
          }
        }
        else if (item == "portfolio_cv") {
          if (cv == 2) {
            divsList.innerHTML += `<li><div class="text-size-bold">Portfolio${num}: </div><a class="text-size padding-left" href="${data[item]}" target="_blank">${data[item]}</a></li>`
          }
          else if (cv == 3 || cv == 4) {
            divsList.innerHTML += `<li class="grid-div"><i class="fa-solid fa-globe contact-icon"></i><span><a class="portfolio link-color"href="${data[item]}">${data[item]}</a></span></li>`
          } else {
            divsList.innerHTML += `<li><a class="text-size link-color" href="${data[item]}" target="_blank"  !important">${data[item]}</a></li>`
          }
        }
        else if (item == "address_cv") {
          if (cv == 2) {
            divsList.innerHTML += `<li><div class="text-size-bold">Address${num}: </div><span class="text-size padding-left">${data[item]}</span></li>`
          }
          else if (cv == 3 || cv == 4) {
            console.log(cv);
            divsList.innerHTML += `<li class="grid-div"><i class="fa-solid fa-location-dot contact-icon"></i><span class="address">${data[item]}</span></li>`
          } else {
            divsList.innerHTML += `<li>${data[item]}</li>`
          }
        }

        else if (item == "lang_desc" || item == "lang_skills") {

          divsList.innerHTML += `<li><span class="lang-item">${data['lang_desc']}:</span><span class="lang-skills"> ${data['lang_skills']}</span> </li>`
        }
        else {
          divsList.innerHTML += `<li>${data[item]}</li>`
        }

      }
      else {

        if (divsList.childElementCount == 0) {

          divsList.parentElement.style.display = "none"
        }
      }


    })
    cv++
  })
}


function generateCVFromLocalStorage() {

  hideAllBeforeAddNewCV()
  let userCvData = JSON.parse(localStorage.getItem("userCv"))
  let dataWillLoaded = userCvData ? userCvData : originalHasanCV
  if (dataWillLoaded && dataWillLoaded['image'] && dataWillLoaded['image'] != null) {
    srcImage = dataWillLoaded['image']
    userImages.forEach(userImage => {

      userImage.parentElement.style.display = "flex"
      userImage.src = dataWillLoaded['image']
    })

  } else {
    userImages.forEach(userImage => {
      userImage.style.display = "none"
      userImage.src = ""
    })
  }
  // if edit(is true so do'nt hide )

  let firstName = dataWillLoaded.firstname_cv ? dataWillLoaded.firstname_cv : ""
  let middleName = dataWillLoaded.middlename_cv ? dataWillLoaded.middlename_cv : ""
  let lastName = dataWillLoaded.lastname_cv ? dataWillLoaded.lastname_cv : ""
  let job_cv = dataWillLoaded.job_cv ? dataWillLoaded.job_cv : ""

  fillAllCv(display_name, "<p>" + firstName + " " + middleName + " " + lastName + "</p>")
  fillAllCv(display_jop, "<p>" + job_cv + "</p>")
  fillAsList('phone-container', dataWillLoaded['contact'], 'phone_cv')
  fillAsList('email-container', dataWillLoaded['contact'], 'email_cv')
  fillAsList('address-container', dataWillLoaded['contact'], 'address_cv')
  fillAsList('portfolio-container', dataWillLoaded['contact'], 'portfolio_cv')
  fillAsList('education-container', dataWillLoaded['education'], 'edu_descrption')
  fillAsList('work-container', dataWillLoaded['workExperience'], 'exp_description')
  fillAsList('skills-container', dataWillLoaded['siklls'], 'skill_cv')
  fillAsList('courses-container', dataWillLoaded['courses'], 'courses_desc')
  fillAsList('lang-container', dataWillLoaded['lang'], 'lang_desc')
  fillAsList('lang-container', dataWillLoaded['lang'], 'lang_skills')
  fillAsList('ref-container', dataWillLoaded['References'], 'ref_desc')

}
generateCVFromLocalStorage()

if (localStorage.getItem("userCv") != null) {
  setTimeout(() => {
    Swal.fire({
      customClass: 'cvmaker-alert',
      title: "<strong>Create Or Edit CV</strong>",
      html: `
          Create a new CV with step-by-step expert guidance or Edit any template and simply add your information
        `,
      showCloseButton: false,
      allowOutsideClick: false,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
        <i class="fa-brands fa-creative-commons-share"></i> Create
        `,
      confirmButtonAriaLabel: "Thumbs up, Create New!",
      cancelButtonText: `
        <i class="fa-solid fa-pen-to-square"></i> Edit
        `,
      cancelButtonAriaLabel: "Edit yOU CV"
    }).then(result => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        localStorage.removeItem("userCv")
        localStorage.removeItem("stylecss-cv1")
        localStorage.removeItem("stylecss-cv2")
        localStorage.removeItem("stylecss-cv3")
        localStorage.removeItem("imagePos")
        generateCVFromLocalStorage()
      } else if (result.isDismissed) {
        edit = true
        // load data in form input
        loadDataInFormAfterSelectEditOption()
  
      }
    });
    
  }, 2000);
}
else {
  setTimeout(() => {
    Swal.fire({
      customClass: 'cvmaker-alert',
      title: "<strong>Create</strong>",
      html: `
      Create a new CV with step-by-step expert guidance or choose any template and simply add your information
      `,
      showCloseButton: false,
      allowOutsideClick: false,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: `
        <i class="fa-brands fa-creative-commons-share"></i> Create
        `,
      confirmButtonAriaLabel: "Thumbs up, Create!",
    }).then(result => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        localStorage.removeItem("userCv")
        // localStorage.removeItem("stylecss-cv1")
        // localStorage.removeItem("stylecss-cv2")
        // localStorage.removeItem("stylecss-cv3")
        //  generateCVFromLocalStorage()
      }
    });
  }, 2000);
}
function loadDataInFormAfterSelectEditOption() {
  // contact
  phonNumbersElements = document.querySelectorAll(".phone_cv")
  emailElements = document.querySelectorAll(".email_cv")
  addressElements = document.querySelectorAll(".address_cv")
  portfolioElements = document.querySelectorAll(".portfolio_cv")
  //  summaryElements = document.querySelectorAll(".summary_cv")
  edu_descrptionElements = document.querySelectorAll(".edu_descrption")
  //  edu_startdateElements = document.querySelectorAll(".edu_startdate")
  //  edu_endDateElements = document.querySelectorAll(".edu_enddate")

  exp_descriptionElements = document.querySelectorAll(".exp_description")
  //  exp_organizationElements = document.querySelectorAll(".exp_organization")
  //  exp_startDateElements = document.querySelectorAll(".exp_startdate")
  //  exp_endDateElements = document.querySelectorAll(".exp_enddate")
  skillsElements = document.querySelectorAll(".skill_cv")
  coursesDescElements = document.querySelectorAll(".courses_desc")
  langDescElements = document.querySelectorAll(".lang_desc")
  langSkillsElements = document.querySelectorAll(".lang_skills")
  refDescElements = document.querySelectorAll(".ref_desc");
  repeatContactForm = document.querySelector(".repeat-contact-form")
  repeatEducationForm = document.querySelector(".repeat-education-form")
  repeatWorkForm = document.querySelector(".repeat-work-form")
  repeatSkillsForm = document.querySelector(".repeat-skills-form")
  repeatCoursesForm = document.querySelector(".repeat-courses-form")
  repeatRefForm = document.querySelector(".repeat-ref-form")
  repeatLangForm = document.querySelector(".repeat-lang-form")
  let userCvData = JSON.parse(localStorage.getItem("userCv"))

  // try dynamic
  let counter = 0
  for (const key in userCvData) {
    if (Object.hasOwnProperty.call(userCvData, key)) {

      let _value = userCvData[key]

      if (key == "image") {
        if (_value != null) {
          imagePreview.parentElement.style.display = "flex"
          imagePreview.src = _value
        } else {
          imagePreview.parentElement.style.display = "none"
        }

      }
      else if (mainFormElem.querySelector(`.${key}`)) {
        mainFormElem.querySelector(`.${key}`).value = _value ?? ""
      } else if (key == "contact") {
        for (let _index = 0; _index < _value.length; _index++) {
          if (_index > 0) {
            document.querySelector(`.repeat-${key}-form`).click()
          }
          for (const _key in _value[_index]) {
            if (Object.hasOwnProperty.call(_value[_index], _key)) {
              let __value = _value[_index][_key]
              if (_index == 0) { document.querySelectorAll(`.${_key}`)[0].value = __value ?? "" }
              if (_index > 0) {
                document.querySelectorAll(`.${_key}`)[_index].value = _value[_index][_key]
              }
            }
          }
        }
      }
      else if( key != "lang") {
        for (let _index = 0; _index < _value.length; _index++) {
          if (_index > 0) {
            document.querySelector(`.repeat-${key}-form`).click()
          }
          // _value is array
          // _value[index] is object
          for (const _key in _value[_index]) {
            if (Object.hasOwnProperty.call(_value[_index], _key)) {

               let __value = _value[_index][_key]

              if(_value)
              {
                
                if (_index == 0) { 
                  document.querySelectorAll(`.${_key}`)[0].value = __value ?? "" 
                }

                if (_index > 0) {
                  document.querySelectorAll(`.${_key}`)[_index].value = _value[_index][_key]
                }
              }
            }
          }

        }
      }
      else if( key == "lang") {
       
       
        for (let _x = 0; _x < _value.length; _x++) {
         
          if (_x > 0) {
            document.querySelector(`.repeat-lang-form`).click()
          }
          

          for (const _key in _value[_x]) {
            
            if (Object.hasOwnProperty.call(_value[_x], _key)) {
                 let options1 = document.querySelectorAll(`.${_key}`)[_x].options;
                      
                  for (let index = 0; index < options1.length; index++) {
                    const element = options1[index];
                    if(element.value.toLowerCase() == _value[_x][_key].toLowerCase()){
                      element.selected = "selected" 
                    } else{ 
                      element.selected = ""
                    }
                  }
            }
          }

        }
      }
      
    }
  }

}


// customize template
/*
    --cv2-font-size-text: 14px;
    --cv2-font-size-title:18px;
    --cv2-font-size-heading:20px;
    --cv2-fontfamily:"Poppins", sans-serif;
    
    --cv1-bg1: #084C41;
    --cv1-bg2: #e9e9e9;
    --cv1-fc1:#fbfbfb;
    --cv1-fc2: #000;

    --cv2-bg1:#dee2e6;
    --cv2-bg2: #a8b5c7;
    --cv2-fc1:#fbfbfb;
    --cv2-fc2: #000;
*/
function getItemFromStorage(object, item) {
  let css = null
  if (localStorage.getItem(object)) {
    let style = JSON.parse(localStorage.getItem(object))
    css = style[item]
  }
  return css
}



let bg1 = ""
let bg2 = ""
let fc1 = ""
let fc2 = ""
let fFamily;
let fsize1;
let fsize2;
let fsize3;
let cvTarget = 0
// just add here new number of cv
let styleCss = {
  "1": {},
  "2": {},
  "3": {},
  "4" : {}
}


// just add here css of new cv only
let cssProps = {
  "1":
  {
    "bg1": "#084C41",
    "bg2": "#e9e9e9",
    "fc1": "#fbfbfb",
    "fc2": "#000",
    "fm": '"Roboto", sans-seri',
    "fheading": "20px",
    "ftitle": "18px",
    "ftext": "14px"
  },
  "2": {
    "bg1": "#dee2e6",
    "bg2": "#a8b5c7",
    "fc1": "#000",
    "fc2": "#000",
    "fm": '"Roboto", sans-seri',
    "fheading": "20px",
    "ftitle": "18px",
    "ftext": "14px",
  },
  "3": {
    "bg1": "#eeeeee",
    "bg2": "#a8b5c7",
    "fc1": "#6c757d",
    "fc2": "#6c757d",
    "fm": '"Poppins", sans-seri',
    "fheading": "32px",
    "ftitle": "18px",
    "ftext": "14px",
  },
  "4": {
    "bg1": "#fefefe",
    "bg2": "#000000",
    "fc1": "#000000",
    "fc2": "#6c757d",
    "fm": '"Roboto", sans-seri',
    "fheading": "34px",
    "ftitle": "18px",
    "ftext": "18px",

  }

}



function hideCv(target = null) {
  document.querySelectorAll(".cv").forEach(e => e.style.display = "none")
  if (target) {
    document.querySelector(`.cv${target}`).style.display = "block"
    document.querySelector('.cv-wraper').classList.add("zoom")
    document.querySelectorAll(".btn-select").forEach(optEle=>
      {
        for (let index = 0; index < optEle.length; index++) {
          const element = optEle[index];
          if (element.value == target) {
            element.selected = "selected"
          } else {
            element.selected = ""
          }
      
        }
      }
    )
    document.querySelectorAll(".label").forEach(e=>e.setAttribute("data-target",target))
  }
}

function selectTemplate(element,showEdit=false) {
  cvTarget = element.value
  if (element.value == "all") {

    document.querySelectorAll(".cv").forEach(e => {
      e.style.display = "block"
      document.querySelector('.cv-wraper').classList.remove("zoom")
  })
    document.querySelectorAll(".btn-select").forEach(optEle=>
      {
        for (let index = 0; index < optEle.length; index++) {
          const element = optEle[index];
          if (element.value == "all") {
            element.selected = "selected"
          } else {
            element.selected = ""
          }
      
        }
    })
    document.querySelector(".show-option").style.display ="none"
    document.querySelectorAll(".label").forEach(e=>e.setAttribute("data-target",cvTarget))
    document.querySelector(".btn-create .cv-btn").classList.remove("show")
    return
  
  }
  else {
    
    bg1 = getItemFromStorage(`stylecss-cv${cvTarget}`, `--cv${cvTarget}-bg1`) ?? cssProps[`${cvTarget}`]['bg1']
    bg2 = getItemFromStorage(`stylecss-cv${cvTarget}`, `'--cv${cvTarget}-bg2`) ?? cssProps[`${cvTarget}`]['bg2']
    fc1 = getItemFromStorage(`stylecss-cv${cvTarget}`, `'--cv${cvTarget}-fc1`) ?? cssProps[`${cvTarget}`]['fc1']
    fc2 = getItemFromStorage(`stylecss-cv${cvTarget}`, `'--cv${cvTarget}-fc2`) ?? cssProps[`${cvTarget}`]['fc2']
    fFamily = getItemFromStorage(`stylecss-cv${cvTarget}`, `'--cv${cvTarget}-fontfamily`) ?? cssProps[`${cvTarget}`]['fm']
    fsize1 = getItemFromStorage(`stylecss-cv${cvTarget}`, `'--cv${cvTarget}-font-size-heading`) ?? cssProps[`${cvTarget}`]['fheading']
    fsize2 = getItemFromStorage(`stylecss-cv${cvTarget}`, `'--cv${cvTarget}-font-size-title`) ?? cssProps[`${cvTarget}`]['ftitle']
    fsize3 = getItemFromStorage(`stylecss-cv${cvTarget}`, `'--cv${cvTarget}-font-size-text`) ?? cssProps[`${cvTarget}`]['ftext']
    hideCv(cvTarget)
    document.querySelector(".btn-create .cv-btn").classList.add("show")
    document.querySelector(".show-option").style.display = "block"

  
  document.querySelector(".bg-1").value = bg1
  document.querySelector(".bg-2").value = bg2
  document.querySelector(".fc1").value = fc1
  document.querySelector(".fc2").value = fc2
  document.querySelector(".fontsize1").value = fsize1 // input
  document.querySelector(".fontsize2").value = fsize2 // input
  document.querySelector(".fontsize3").value = fsize3 // input
  document.querySelector(".fsize-span1").innerHTML = `(${fsize1}px)`
  document.querySelector(".fsize-span2").innerHTML = `(${fsize2}px)`
  document.querySelector(".fsize-span3").innerHTML = `(${fsize3}px)`
  let opt = document.querySelector(".fontfamily").options;
  for (let index = 0; index < opt.length; index++) {
    const element = opt[index];
    if (element.value == fFamily) {
      element.selected = "selected"
    } else {
      element.selected = ""
    }

  }
}
}


const root = document.querySelector(':root');

// set css variable

function changeFontsize1(element) {

  fsize1 = element.value

  document.querySelector(".fsize-span1").innerHTML = `(${element.value}px)`
  root.style.setProperty(`--cv${cvTarget}-font-size-heading`, `${fsize1}px`)
  styleCss[`${cvTarget}`][`--cv${cvTarget}-font-size-heading`] = `${fsize1}px`
  localStorage.setItem(`stylecss-cv${cvTarget}`, JSON.stringify(styleCss[`${cvTarget}`]))

}
function changeFontsize2(element) {

  fsize2 = element.value
  document.querySelector(".fsize-span2").innerHTML = `(${element.value}px)`
  root.style.setProperty(`--cv${cvTarget}-font-size-title`, `${fsize2}px`)
  styleCss[`${cvTarget}`][`--cv${cvTarget}-font-size-title`] = `${fsize2}px`
  localStorage.setItem(`stylecss-cv${cvTarget}`, JSON.stringify(styleCss[`${cvTarget}`]))

}
function changeFontsize3(element) {

  fsize3 = element.value
  document.querySelector(".fsize-span3").innerHTML = `(${element.value}px)`

  root.style.setProperty(`--cv${cvTarget}-font-size-text`, `${fsize3}px`)
  styleCss[`${cvTarget}`][`--cv${cvTarget}-font-size-text`] = `${fsize3}px`
  localStorage.setItem(`stylecss-cv${cvTarget}`, JSON.stringify(styleCss[`${cvTarget}`]))


}

function changeFontfamily(element) {
  fFamily = element.value

  root.style.setProperty(`--cv${cvTarget}-fontfamily`, `${fFamily}`)
  styleCss[`${cvTarget}`][`--cv${cvTarget}-fontfamily`] = fFamily
  localStorage.setItem(`stylecss-cv${cvTarget}`, JSON.stringify(styleCss[`${cvTarget}`]))
}
function changeBg2(element) {
  bg2 = element.value

  root.style.setProperty(`--cv${cvTarget}-bg2`, `${bg2}`)
  styleCss[`${cvTarget}`][`--cv${cvTarget}-bg2`] = bg2
  localStorage.setItem(`stylecss-cv${cvTarget}`, JSON.stringify(styleCss[`${cvTarget}`]))
}
function changeBg1(element) {
  bg1 = element.value

  root.style.setProperty(`--cv${cvTarget}-bg1`, `${bg1}`)
  styleCss[`${cvTarget}`][`--cv${cvTarget}-bg1`] = bg1
  localStorage.setItem(`stylecss-cv${cvTarget}`, JSON.stringify(styleCss[`${cvTarget}`]))
}
function changeFc1(element) {
  fc1 = element.value
  root.style.setProperty(`--cv${cvTarget}-fc1`, `${fc1}`)
  styleCss[`${cvTarget}`][`--cv${cvTarget}-fc1`] = fc1
  localStorage.setItem(`stylecss-cv${cvTarget}`, JSON.stringify(styleCss[`${cvTarget}`]))


}
function changeFc2(element) {
  fc2 = element.value
  root.style.setProperty(`--cv${cvTarget}-fc2`, `${fc2}`)
  styleCss[`${cvTarget}`][`--cv${cvTarget}-fc2`] = fc2
  localStorage.setItem(`stylecss-cv${cvTarget}`, JSON.stringify(styleCss[`${cvTarget}`]))
}

function setCssStyleFromLocalStorage(root) {
  let styleCss = []
  let numberOfCv = document.querySelectorAll(".cv").length

  for (let index = 0; index < numberOfCv; index++) {

    if (localStorage.getItem(`stylecss-cv${index + 1}`)) {
      styleCss.push(JSON.parse(localStorage.getItem(`stylecss-cv${index + 1}`)))
    }
  }

  if (styleCss.length > 0) {
    for (let index = 0; index < styleCss.length; index++) {
      const styleCssEle = styleCss[index];
      for (const key in styleCssEle) {
        const element = styleCssEle[key];
        root.style.setProperty(key, element)

      }
    }

  }

}
setCssStyleFromLocalStorage(root)
let defaultBtn = document.querySelector(".default-btn")
  defaultBtn.addEventListener("click", e => {
  setCssProps(cvTarget)
  localStorage.removeItem(`stylecss-cv${cvTarget}`)

  document.querySelector(".bg-1").value = cssProps[`${cvTarget}`]['bg1']
  document.querySelector(".bg-2").value =  cssProps[`${cvTarget}`]['bg2']
  document.querySelector(".fc1").value = cssProps[`${cvTarget}`]['fc1']
  document.querySelector(".fc2").value = fc2
  document.querySelector(".fontsize1").value = fsize1 // input
  document.querySelector(".fontsize2").value = fsize2 // input
  document.querySelector(".fontsize3").value = fsize3 // input
  document.querySelector(".fsize-span1").innerHTML = cssProps[`${cvTarget}`]['fheading']
  document.querySelector(".fsize-span2").innerHTML = cssProps[`${cvTarget}`]['ftitle']
  document.querySelector(".fsize-span3").innerHTML =  cssProps[`${cvTarget}`]['ftext']
  let opt = document.querySelector(".fontfamily").options;
  for (let index = 0; index < opt.length; index++) {
    const element = opt[index];
    if (element.value == cssProps[`${cvTarget}`]['fm']) {
      element.selected = "selected"
    } else {
      element.selected = ""
    }

  }
}

)

function setCssProps(target) {

  root.style.setProperty(`--cv${target}-font-size-heading`, cssProps[`${cvTarget}`]['fheading']);
  root.style.setProperty(`--cv${target}-font-size-title`, cssProps[`${cvTarget}`]['ftitle']);
  root.style.setProperty(`--cv${target}-font-size-text`, cssProps[`${cvTarget}`]['ftext']);
  root.style.setProperty(`--cv${target}-fontfamily`, cssProps[`${cvTarget}`]['fm'])
  root.style.setProperty(`--cv${target}-bg1`, cssProps[`${cvTarget}`]['bg1'])
  root.style.setProperty(`--cv${target}-bg2`, cssProps[`${cvTarget}`]['bg2'])
  root.style.setProperty(`--cv${target}-fc1`, cssProps[`${cvTarget}`]['fc1'])
  root.style.setProperty(`--cv${target}-fc2`, cssProps[`${cvTarget}`]['fc2'])

}



function detectBrowser() {
  if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
    ;
  } else if (navigator.userAgent.indexOf("Edg") != -1) {

  } else if (navigator.userAgent.indexOf("Chrome") != -1) {

  } else if (navigator.userAgent.indexOf("Safari") != -1) {

  } else if (navigator.userAgent.indexOf("Firefox") != -1) {
    // document.querySelector(".cv-wraper").classList.add("browser")
  } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) //IF IE > 10
  {

  } else {
    alert('unknown');
  }
}

detectBrowser()




// adjust image position

// window.addEventListener('keyup', arrowUp)
// window.addEventListener('keydown', arrowDown)

// function arrowDown(e) {
//   const key = document.querySelector(`.arrow-key[data-key="${e.keyCode}"]`);
//   key.classList.add('press')
// }
// function arrowUp(e) {
//   const key = document.querySelector(`.arrow-key[data-key="${e.keyCode}"]`);
//    key.classList.remove('press')
// }

function changeImagePosition(arrow)
{

  let pos = arrow.getAttribute("data-target")
  switch (pos) {
    case "up":
      y +=5
      break;
    case "down":
      y -=5
      break;
    case "right":
      x +=5
      break;
    case "left":
      x-=5
      break;
  
    default:
      break;
  }
  imagePos = imagePos ?? {}
  imagePos['x'] = x
  imagePos['y'] = y
  imagePreview.style.objectPosition = `${x}% ${y}%`
  localStorage.setItem("imagePos", JSON.stringify(imagePos) )
  document.querySelectorAll(".image-cv").forEach(element=>
    {
      element.style.objectPosition = `${x}% ${y}%`
    }
  )
}

let allImages = document.querySelectorAll(".image-cv");
imagePos = JSON.parse(localStorage.getItem("imagePos"))
if(imagePos)
{
  x= imagePos['x'] 
  y = imagePos['y'] 

}
imagePreview.style.objectPosition = `${x}% ${y}%`
if(allImages)
{
allImages.forEach(element=>
    {
    if(imagePos){
        element.style.objectPosition = `${x}% ${y}%`
        element.style.ObjectFit = `"cover;"`
    }else{

    }
    element.style.objectPosition = `"${x}% ${y}% !impoerant"`
    element.style.ObjectFit = `cover;`
    }
  
)
}

$(".dragable").draggable(
  {axis: "x,y"}
)

