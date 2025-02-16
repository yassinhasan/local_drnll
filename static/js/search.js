let downloadBtn = document.querySelector(".download-btn");
let results = document.querySelector(".results")
let inputUrl = document.querySelector(".url-input")
let searchForm = document.querySelector(".url-form")
let loader = document.querySelector(".loader");
let msgShow = document.querySelector(".msg");
let timeDiv = document.querySelector(".time-div");
let formRange = document.querySelector(".form-range")
let filterNameInput = document.querySelector(".filter-name")
let filterForm = document.querySelector(".filter-form")
let minValueSpan = document.querySelector(".price-value-span")
let maxValueSpan = document.querySelector(".max-value-span")
let minValue = 0
let maxValue = 0
let start = 0
let end = 0
let csvData = []
let searchItemWithSpace = ""
let innerWraper = document.querySelector(".inner-wraper")
inputUrl.focus()
let downloadResults = document.querySelector(".download-results");
let showGid = document.querySelector(".show-grid")
let showBars= document.querySelector(".show-bars")
let showList = document.querySelector(".show-list")
let webWesults = document.querySelector(".web-results")
let restrictedSearch = document.querySelector(".restricted-search")
let ascBtn = document.querySelector(".asc")
let descBtn = document.querySelector(".desc")
let dessSorting = true;
let searchItem = ""
let resultWtapers = document.querySelectorAll(".result-wraper")
let innerResults = document.querySelectorAll(".inner-results")
// fot filter
let selectedName = null
let selectedPrice = null
let filrerdDawaResults = []
let filrerdNahdiResults = []
let filrerdUnitedResults = []
let viewIcons = document.querySelectorAll(".view-icon")
let sortIcon = document.querySelectorAll(".sort-icon")
let sessionExp = false;
downloadBtn.addEventListener("click", (e) => {
   e.preventDefault()
   searchItem = inputUrl.value;
   if(searchItem == "")
   {
    inputUrl.focus()
      return
   }else{
    results.style.display = "none"
    start = performance.now()   
    getResult()
   }

  })


  // show grid
  showGid.addEventListener("click",()=>{
   
    viewIcons.forEach(el=>{
      el.classList.remove("active")})
    showGid.classList.add("active")
     webWesults.setAttribute("class","web-results grid")

  })
  // show bars
  showBars.addEventListener("click",()=>{
    viewIcons.forEach(el=>{
      el.classList.remove("active")})
    showBars.classList.add("active")
    webWesults.setAttribute("class","web-results")
  })

  // show bars
  showList.addEventListener("click",()=>{
    viewIcons.forEach(el=>{
      el.classList.remove("active")})
    showList.classList.add("active")
    webWesults.setAttribute("class","web-results list")
  })

function getResult() {
        selectedPrice = null 
         selectedName = null
         innerWraper.classList.add("show")
         innerResults.forEach(e=>e.classList.remove("hide"))
        // reset results
        csvData = []
        maxValue = 0
        innerWraper.classList.remove("show")
        loader.classList.add("show")
        maxValue = 0
        resultWtapers.forEach(el=>{el.innerHTML = ""})
        filterForm.reset()
        minValueSpan.innerHTML="0"
        // maxValueSpan.innerHTML="0"
        downloadBtn.classList.add("disabled")
        timeDiv.innerHTML =""
        searchItemWithSpace =  searchItem.trim();
        repareFetch(encodeURI(searchItem))

    
}




//  get result data and make them card

function repareDate(web_name,web_results,filter=false,sort='asc')
{


  // minValue = parseInt(results['facets_stats']["price.SAR.default"]["min"])
  let newTitle = ""
  let searchItemValues = ""
  let splittedStringForSearch = []
  if(selectedName)
  {
     searchItemValues = selectedName.replace(/[^a-zA-Z0-9\s ]/g, "")
  }else{
     searchItemValues = searchItemWithSpace.replace(/[^a-zA-Z0-9\s ]/g, "")
  }
  splittedStringForSearch = searchItemValues.split(" ")
  let pattern = generatePattern(searchItemValues)

  let titleOffer = ""
  let beforOffer = ""
  let title = ""
  let price = ""
  let sortedWebResults = []
  let code = ""
  let insStock = 1
  let exclusive = ""
  if(web_results.length == 0)
  {
   let elem =  document.getElementById(web_name).parentElement;
   elem.classList.add("hide")
  }else{
    let elem =  document.getElementById(web_name).parentElement;
    elem.classList.remove("hide")
    document.getElementById(web_name).innerHTML = ""
    if(dessSorting == true)
    {
      sortedWebResults = web_results.sort((p1, p2) => (p1['price']["SAR"]["default"] < p2['price']["SAR"]["default"] )  ? 1 : (p1['price']["SAR"]["default"] > p2['price']["SAR"]["default"] ) ? -1 : 0);

    }else{
      sortedWebResults = web_results.sort((p1, p2) => (p1['price']["SAR"]["default"] > p2['price']["SAR"]["default"] )  ? 1 : (p1['price']["SAR"]["default"] < p2['price']["SAR"]["default"] ) ? -1 : 0);
    }

    for (let index = 0; index < sortedWebResults.length; index++) {
     
      if(web_name == "dawaa")
      {
        code = Array.isArray(sortedWebResults[index]['sku']) ? "" : sortedWebResults[index]['sku']

        exclusive = (sortedWebResults[index]['labels'] && sortedWebResults[index]['labels'].length > 0)  ? sortedWebResults[index]['labels'][0]["prod_txt"]  : ""
      }
    

      if(web_name == "united"){
      
        title = sortedWebResults[index]['name_locally_en']
        newTitle = sortedWebResults[index]['name_locally_en']
        titleOffer = sortedWebResults[index]['offer_label'] == null ? "" : sortedWebResults[index]['offer_label'] 
        insStock =  sortedWebResults[index]['custom_in_stock'] 
      } 
      else{
        title = sortedWebResults[index]['name']
        newTitle = sortedWebResults[index]['name']
        titleOffer = sortedWebResults[index]['offer_text_notag'] == null ? "" :  sortedWebResults[index]['offer_text_notag']
        insStock = sortedWebResults[index]['in_stock']
      }
      
      insStock = insStock == true ? "IN STOCK" : "OUT STOCK"
      let card = ""
      splittedStringForSearch.forEach(searchItemValue=>{
          searchItemValue.trim()
          if(searchItemValue.length > 0)
          {
            
            newTitle =  newTitle.replace(new RegExp(searchItemValue, 'gmi'),`<mark style="font-weight:bold">${searchItemValue}</mark>`)
          }
        })
      

      if(Array.isArray(titleOffer))
      {
        titleOffer = titleOffer[0]
      }


      beforOffer = sortedWebResults[index]['price']["SAR"]["default_original_formated"] == null ? "": sortedWebResults[index]['price']["SAR"]["default_original_formated"]
      if(titleOffer != "" && sortedWebResults[index]['price']["SAR"]["default"] == "")
      {
        price =   titleOffer.match(/\w(\d.*)(?=sar)/gmi)[0].trim() 
      }else{
        price =  sortedWebResults[index]['price']["SAR"]["default"]
      }
       
      // temp = 10 // price = 10 //minv = 10
      if(filter == false)
      {
        maxValue = Math.floor(price) > maxValue ? Math.floor(price) : maxValue
      }

      let image = sortedWebResults[index]['image_url']
      let link = sortedWebResults[index]['url']
      csvData.push([web_name,title.replace(/,/g,"-"),titleOffer.replace(/,/g,"-"),beforOffer,price,link])
      card += 
      `
            <div class="card" >
              <!-- <span class="hint-name ${web_name}">${web_name}</span> -->
              <div class="image-wraper">
              <img src="${image}" referrerPolicy="no-referrer"   class="card-img-top" alt="...">
              </div>
                <div class="card-body">
              
                <a href="${link}" target="_blank" class="card-title">${newTitle}</a>
              <p class="title-offer">${titleOffer}</p>
              ${web_name == "dawaa" ? `<span style="" class="code-span">Code: <span class="code-number">${code}</span></span>`: ''}
              <p class="card-text"><span>${price} SAR</span> <span class="before-price">${beforOffer}</span></p>
              <br>
              <span class="stock-span">AVAILABILITY : <span class="stock-value ${insStock == "IN STOCK" ? "active" : 'inactive'}">${insStock}</span></span>
              ${exclusive == "Exclusive Online"  ? `<span class="exclusive-span">${exclusive}</span>`: ''}
              </div>
          </div>
      `
      document.getElementById(web_name).innerHTML +=card
    }
    if(document.getElementById(web_name).innerHTML.trim() == "")
    {
      document.getElementById(web_name).parentElement.classList.add("hide")
    }

  }

}
// download data as csv

downloadResults.addEventListener("click",e=>{
    e.preventDefault()
    let headers = ["company","item" , "promotion_title","before offer", "after offer","link"]
    saveResultsAsCsv(headers,csvData)
})


function generateDataFromCard(card)
{
  let selectedPricesPAN = card.querySelector(".card-text span:nth-child(1)") 
  let selectedIntprice = parseInt(selectedPricesPAN.innerHTML)
  let titleOffer = card.querySelector(".title-offer").innerHTML 
  let beforOffer = card.querySelector(".before-price").innerHTML 
  let web_name = card.querySelector(".hint-name").innerHTML
  let selectedCardTitleNameAnchor = card.querySelector(".card-title")
  let selectedCardTitleName = selectedCardTitleNameAnchor.textContent
  let link = selectedCardTitleNameAnchor.getAttribute("href")
  csvData.push([web_name,selectedCardTitleName.replace(/,/g,"-"),titleOffer.replace(/,/g,"-"),beforOffer.replace(/,/g,"-"),selectedIntprice,link])
}




function showResultsError(){
  inputUrl.style.boxShadow=" 2px 2px #b52626"
  const Toast = Swal.mixin({
    customClass: 'swal-upload',
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      color: "#b58126",
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "error",
      title: "No Items Found"
    }); // end of alert
}

let arrow = document.querySelector(".arrow")

window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 800) {
    arrow.style.display = "block";
  } else {
    arrow.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

arrow.addEventListener("click",e=>{
  e.preventDefault()
  topFunction()
})




function generatePattern(item)
{
    //  hasan(?=.*hasan)
    let filterName= item.split(" ")
    let firstWord = filterName.shift()
    let pattern = ""
    if(filterName.length > 0)
    {
      pattern += firstWord+".*"
      for (let index = 0; index < filterName.length; index++) {
        pattern += "(?:.*"+filterName[index]+")"
        
      }
      

    }else{
      pattern =firstWord
    }

    return pattern
}


function repareFetch(searchItem)
{
// fetch
let dawaurl ="https://l1p3f2vbnf-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.13.1)%3B%20Browser%3B%20instantsearch.js%20(4.41.0)%3B%20Magento2%20integration%20(3.10.5)%3B%20JS%20Helper%20(3.8.2)"
let dawarequest = {
    requests: [
      {
        indexName: "magento2_productionenglish_products",
        params: `highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&ruleContexts=%5B%22magento_filters%22%5D&hitsPerPage=18&query=${searchItem}&maxValuesPerFacet=10&facets=%5B%22brand%22%2C%22diaper_size%22%2C%22advisory%22%2C%22features%22%2C%22product_function%22%2C%22duration%22%2C%22gender%22%2C%22package%22%2C%22product_form%22%2C%22area_covered%22%2C%22color%22%2C%22skin_concern%22%2C%22age%22%2C%22volume%22%2C%22ingredients%22%2C%22scent%22%2C%22hair_type%22%2C%22skin_type%22%2C%22diaper_number%22%2C%22milk_number%22%2C%22price.SAR.default%22%2C%22categories.level0%22%5D&tagFilters=&numericFilters=%5B%22visibility_search%3D1%22%5D`
      }
    ]
  }

const dawaOptions = {
    headers: {
  "X-Algolia-Api-Key" : "MWQzMjEzYTYyOGNhM2M4MzkwM2E1M2U3MTZmOTM3MGY1ZDIyYjhiMTk1NGU5NDk0MmI2ZDZjZjdmOTAyODU2M3RhZ0ZpbHRlcnM9",
  "X-Algolia-Application-Id": "L1P3F2VBNF",
  "Content-Type": "application/json;charset=UTF-8"
    },
    method: 'POST',
    body: JSON.stringify(dawarequest) // Convert JSON data to a string and set it as the request body
  };



let nahdiUrl = "https://h9x4ih7m99-1.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.13.1)%3B%20Browser%3B%20instantsearch.js%20(4.41.0)%3B%20Magento2%20integration%20(3.11.0)%3B%20JS%20Helper%20(3.8.2)"
let nahdiRequest = {
    requests: [
      {
        indexName: "prod_en_products",
        params: `highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&ruleContexts=%5B%22magento_filters%22%5D&hitsPerPage=7&query=${searchItem}&page=0&maxValuesPerFacet=100&analyticsTags=%5B%22Desktop%22%2C%22search-page%22%5D&facets=%5B%22consumption_size%22%2C%22skin_type%22%2C%22serving_size%22%2C%22hidden_item%22%2C%22sku%22%2C%22landing_categories%22%2C%22global_filter%22%2C%22manufacturer%22%2C%22item_has_offer%22%2C%22product_type_string%22%2C%22product_form%22%2C%22size%22%2C%22pack_size_volume%22%2C%22gender%22%2C%22age_range%22%2C%22ingredient%22%2C%22scent%22%2C%22concentration%22%2C%22special_features%22%2C%22quantity%22%2C%22flavor%22%2C%22hair_type%22%2C%22lense_power%22%2C%22country_of_origin%22%2C%22product_function%22%2C%22color%22%2C%22finish%22%2C%22lens_type%22%2C%22hair_goal%22%2C%22shade%22%2C%22free_from%22%2C%22price.SAR.default%22%2C%22categories.level0%22%5D&tagFilters=&numericFilters=%5B%22visibility_search%3D1%22%5D`
      }
    ]
  }

const nahdioptions = {
    headers: {
  "X-Algolia-Api-Key" : "YTVlMDc5OGNmZGM4YzhiNTBhNzg0MTc3ZDBlYWU1NjQ3NzQzNTE5YTFhOGM4OTc5MGM1MzE3MjBlZDk0YzhmMnRhZ0ZpbHRlcnM9",
  "X-Algolia-Application-Id": "H9X4IH7M99",
  "Content-Type": "application/json;charset=UTF-8"
    },
    method: 'POST',
    body: JSON.stringify(nahdiRequest) // Convert JSON data to a string and set it as the request body
  };



let muthdaUrl = "https://y1goq9dtv8-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.14.3)%3B%20Browser%3B%20instantsearch.js%20(4.41.0)%3B%20Magento2%20integration%20(3.12.1)%3B%20JS%20Helper%20(3.8.2)"
  let muthdRequest = {
    requests: [
      {
        indexName: "unitedpharmacy_livear_products",
        params: `highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&ruleContexts=%5B%22magento_filters%22%5D&hitsPerPage=10&clickAnalytics=true&query=${searchItem}&page=0&maxValuesPerFacet=10&facets=%5B%22price.SAR.default%22%2C%22categories.level0%22%5D&tagFilters=&numericFilters=%5B%22visibility_search%3D1%22%5D`
      }
    ]
  }

  const muthdoptions = {
    headers: {
  "X-Algolia-Api-Key" : "NGFkYzM5MDgzYjA0YmI2YzdlYjk4YjIwNDFjZjQzZTg2ZDQ4M2Q0ZGM5ZTVjYTgxYTNjZWRlMjllZDg0YTg3Y3RhZ0ZpbHRlcnM9",
  "X-Algolia-Application-Id": "Y1GOQ9DTV8",
  "Content-Type": "application/json;charset=UTF-8" ,
    },
   
    method: 'POST',
   
    body: JSON.stringify(muthdRequest) // Convert JSON data to a string and set it as the request body
  };
        // fetch dawaa
        Promise.all([
          fetch(dawaurl, dawaOptions).then(response => response.json()),
          fetch(nahdiUrl, nahdioptions).then(response => response.json()) ,// api for the get request,
          fetch(muthdaUrl, muthdoptions).then(response => response.json()) // api for the get request
        ])
        .then(data => {
              let [dawaResults, nahdiResults, unitedResults] = data;   
              // filter data 
              dawaResults = dawaResults.results ? dawaResults.results[0]['hits'] : []
              nahdiResults = nahdiResults.results ? nahdiResults.results[0]['hits'] : []
              unitedResults = unitedResults.results ? unitedResults.results[0]['hits'] : []
            
              // console.log(dawaResults);
              // console.log(nahdiResults);
              // console.log(unitedResults);
              // fetch results 
              if(restrictedSearch.checked)
              {
               
                let pattern =  generatePattern(searchItemWithSpace)
                dawaResults = dawaResults.filter(dawaResult=>  new RegExp(pattern,"gmi").test(dawaResult['name']))
                nahdiResults = nahdiResults.filter(nahdiResult=>  new RegExp(pattern,"gmi").test(nahdiResult['name']))
                unitedResults = unitedResults.filter(unitedResult=> new RegExp(pattern,"gmi").test(unitedResult['name_locally_en']))               
              }
              showAllResultsCards(dawaResults,nahdiResults,unitedResults)
                // minValueSpan.innerHTML=minValue
              maxValueSpan.innerHTML= maxValue
              formRange.setAttribute("max",maxValue)
              // formRange.setAttribute("value",minValue)
               // after get one result
              downloadBtn.classList.remove("disabled")
              innerWraper.classList.add("show")
              loader.classList.remove("show")
              results.style.display = "block"
              window.scroll({
                top: 408,
                left: 0,
                behavior: "smooth",
              });
              // document.querySelector(".dawaa-results").scrollIntoView();
              end = performance.now()
              timeDiv.innerHTML = `these results took <span class="time-span">${parseFloat( (end - start)/1000 ).toFixed(2)}</span>  sec `
              // end of fetch datat
              // filter data
              // filter data cards
              formRange.addEventListener("change",e=>{
                  selectedPrice = e.target.value
                  csvData = []
                
                  minValueSpan.innerHTML = selectedPrice
                      if(selectedName != null)
                      {
                        let pattern =  generatePattern(selectedName)
                        {
                          filrerdDawaResults = dawaResults.filter(dawaResult=>dawaResult['price']['SAR']['default'] >= selectedPrice &&  new RegExp(pattern,"gmi").test(dawaResult['name'])  )
                          filrerdNahdiResults = nahdiResults.filter(nahdiResult=>nahdiResult['price']['SAR']['default'] >= selectedPrice &&  new RegExp(pattern,"gmi").test(nahdiResult['name'])  )
                          filrerdUnitedResults = unitedResults.filter(unitedResult=>unitedResult['price']['SAR']['default'] >= selectedPrice &&  new RegExp(pattern,"gmi").test(unitedResult['name_locally_en'])  )
                        } 
                      }else{

                           filrerdDawaResults = dawaResults.filter(dawaResult=> dawaResult['price']['SAR']['default'] >= selectedPrice)
                           filrerdNahdiResults = nahdiResults.filter(nahdiResult=> nahdiResult['price']['SAR']['default'] >= selectedPrice)
                           filrerdUnitedResults = unitedResults.filter(unitedResult=> unitedResult['price']['SAR']['default'] >= selectedPrice)
                      }
                      showAllResultsCards(filrerdDawaResults,filrerdNahdiResults,filrerdUnitedResults)
                      // formRange.focus()
               })
              // filter data cards by name
              
              filterNameInput.addEventListener("input",e=>{
                 csvData = []
                  selectedName = e.target.value.trim()
                  let pattern =  generatePattern(selectedName)
                  if(selectedPrice != null)
                  {
                   
                      filrerdDawaResults = dawaResults.filter(dawaResult=>dawaResult['price']['SAR']['default'] >= selectedPrice &&  new RegExp(pattern,"gmi").test(dawaResult['name'])  )
                      filrerdNahdiResults = nahdiResults.filter(nahdiResult=>nahdiResult['price']['SAR']['default'] >= selectedPrice &&  new RegExp(pattern,"gmi").test(nahdiResult['name'])  )
                      filrerdUnitedResults = unitedResults.filter(unitedResult=>unitedResult['price']['SAR']['default'] >= selectedPrice &&  new RegExp(pattern,"gmi").test(unitedResult['name_locally_en'])  )
                  }else{

                       filrerdDawaResults = dawaResults.filter(dawaResult=>  new RegExp(pattern,"gmi").test(dawaResult['name']))
                       filrerdNahdiResults = nahdiResults.filter(nahdiResult=>  new RegExp(pattern,"gmi").test(nahdiResult['name']))
                       filrerdUnitedResults = unitedResults.filter(unitedResult=> new RegExp(pattern,"gmi").test(unitedResult['name_locally_en']))
                  }
                  showAllResultsCards(filrerdDawaResults,filrerdNahdiResults,filrerdUnitedResults)
               })
              //  sorting
              ascBtn.addEventListener("click",()=>{
                dessSorting = false;
                sortIcon.forEach(el=>{
                  el.classList.remove("active")})
                  ascBtn.classList.add("active")
                resultWtapers.forEach(el=>{el.innerHTML = ""})
                // filterForm.reset()

                if(selectedPrice != null || selectedName != null)
                {
                  showAllResultsCards(filrerdDawaResults,filrerdNahdiResults,filrerdUnitedResults)
                }else{
                  minValueSpan.innerHTML = 0
                  showAllResultsCards(dawaResults,nahdiResults,unitedResults)
                }

              })
              descBtn.addEventListener("click",()=>{
                dessSorting = true
                sortIcon.forEach(el=>{
                  el.classList.remove("active")})
                  descBtn.classList.add("active")
                resultWtapers.forEach(el=>{el.innerHTML = ""})
                // filterForm.reset()
                if(selectedPrice != null || selectedName != null)
                {
                 
                  showAllResultsCards(filrerdDawaResults,filrerdNahdiResults,filrerdUnitedResults)
                }else{
                  minValueSpan.innerHTML = 0
                  showAllResultsCards(dawaResults,nahdiResults,unitedResults)
                }
              })
            })
 
        .catch(error => {
          console.log(error);
          fireAlert("error","error happened ..refresh page")
        })
}


function showAllResultsCards(dawa,nahdi,united)
{
  repareDate("dawaa",dawa) 
  repareDate("nahdi",nahdi) 
  repareDate("united",united) 
}





function autocomplete(inp ,val, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
      var a, b, i
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", inp.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      inp.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "' class='active-input'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              
              inp.value = e.target.querySelector(".active-input").value;
               
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var autocompleteListDiv = document.getElementById(inp.id + "autocomplete-list");
      var allDivs;
      if (autocompleteListDiv) allDivs = autocompleteListDiv.getElementsByTagName("div");
      
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        // console.log("before");
        // console.log(currentFocus);
        currentFocus++;
        // console.log("after");
        // console.log(currentFocus);
        /*and and make the current item more visible:*/
        addActive(allDivs);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(allDivs);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/

          if (allDivs && allDivs !="undefined") {
            // console.log("inside");
            // // console.log(currentFocus);
            // console.log( allDivs[currentFocus]);
            allDivs[currentFocus].click();
          }
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}
inputUrl.addEventListener("input",e=>
{
  e.preventDefault()

  if(sessionExp == true) 
  {
    searchForm.setAttribute("autocomplete","on")
    return
  }
  searchForm.setAttribute("autocomplete","off")
  let  keyword = inputUrl.value
 if(keyword != "" )
 {
  const formdata = new FormData();
  formdata.append("keyword", keyword);
  formdata.append("cookie", "PHPSESSID=47e4b4bfc62fddc7ef096ac141d6299c");
  
  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow" ,
    headers: {
      "X-CSRFToken" : csrfToken
    }
  };
  
  fetch("/searchItem", requestOptions)
    .then((response) => response.json())
    .then((data) =>{
      if(data.success){
        if(data.result)
        {
          let results  = JSON.parse(data.result)
          let items = results.map(result=> result['desc'])
          autocomplete(inputUrl,keyword, items);
        }
      }else{
        console.log("may be session expired");
      }
    })
    .catch((error) => console.error(error));
 }else{
  let x = document.getElementById("myInputautocomplete-list")
  if(x)x.remove()
 }

})


function testSession(){
  
  const formdata = new FormData();
  formdata.append("test", "test");
  formdata.append("cookie", "PHPSESSID=47e4b4bfc62fddc7ef096ac141d6299c");
  
  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow" ,
    headers: {
      "X-CSRFToken" : csrfToken
    }
  };
  
  fetch("/testSession", requestOptions)
  .then((response) => response.json())
  .then((data) =>{
   
    if(data.success && data.result == "200"){
      
      sessionExp = false
    }else{
      sessionExp = true
    }
   
  })
  .catch((error) => {
    sessionExp = true
   
  });
}

// testSession()