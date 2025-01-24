
let TargetObj ;
let today ;
let currentMonth ; // Get month index (0-based)
let daysInMonth ;
let remainingDays ;

function SelectContent(element)
{
  element.select();
}
function calculateDailyTargets() {
  // global

  TargetObj = JSON.parse(localStorage.getItem('TargetObj')) || {};
   today = new Date();
   currentMonth = today.getMonth(); // Get month index (0-based)
   daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
   remainingDays = (daysInMonth - today.getDate()) + 1;
  // form

  const totalTarget = parseFloat(document.getElementById('total-target').value) ||  TargetObj.totalTarget|| 0;
  const diamondTarget = parseFloat(document.getElementById('diamond-target').value) || TargetObj.diamondTarget|| 0;
  const goldTarget = parseFloat(document.getElementById('gold-target').value) ||  TargetObj.goldTarget || 0;
  const silverTarget = parseFloat(document.getElementById('silver-target').value) ||  TargetObj.silverTarget|| 0;

  const totalSales = parseFloat(document.getElementById('total-sales').value) ||   TargetObj.totalSales || 0;
  const diamondSales = parseFloat(document.getElementById('diamond-sales').value) ||  TargetObj.diamondSales || 0;
  const goldSales = parseFloat(document.getElementById('gold-sales').value) ||  TargetObj.goldSales || 0;
  const silverSales = parseFloat(document.getElementById('silver-sales').value) ||  TargetObj.silverSales || 0;

  const totalPercentage = parseFloat(document.getElementById('total-percentage').value) ||  TargetObj.totalPercentage || 100;
  const diamondPercentage = parseFloat(document.getElementById('diamond-percentage').value) ||  TargetObj.diamondPercentage || 100;
  const goldPercentage = parseFloat(document.getElementById('gold-percentage').value) ||  TargetObj.goldPercentage || 100;
  const silverPercentage = parseFloat(document.getElementById('silver-percentage').value) ||  TargetObj.silverPercentage|| 100;



  const remainingTotalTarget = totalTarget - totalSales;
  const remainingDiamondTarget = diamondTarget - diamondSales;
  const remainingGoldTarget = goldTarget - goldSales;
  const remainingSilverTarget = silverTarget - silverSales;

  const dailyTotalTarget = Math.ceil(((remainingTotalTarget * (totalPercentage / 100)) / remainingDays).toFixed(2));
  const dailyDiamondTarget = Math.ceil(((remainingDiamondTarget * (diamondPercentage / 100)) / remainingDays).toFixed(2));
  const dailyGoldTarget = Math.ceil(((remainingGoldTarget * (goldPercentage / 100)) / remainingDays).toFixed(2));
  const dailySilverTarget = Math.ceil(((remainingSilverTarget * (silverPercentage / 100)) / remainingDays).toFixed(2));

  const resultsDiv = document.getElementById('target-results');
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = `
      <p><strong>Daily Total Target:</strong><span class="daily-target-span"> ${dailyTotalTarget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SR</span></p>
      <p><strong>Daily Diamond Target:</strong> <span class="daily-target-span"> ${dailyDiamondTarget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SR</span></p>
      <p><strong>Daily Gold Target:</strong> <span class="daily-target-span"> ${dailyGoldTarget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SR</span></p>
      <p><strong>Daily Silver Target:</strong> <span class="daily-target-span">${dailySilverTarget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SR</span></p>
    `;

  TargetObj = {
    totalTarget,
    diamondTarget,
    goldTarget,
    silverTarget,
    totalSales,
    diamondSales,
    goldSales,
    silverSales,
    totalPercentage,
    diamondPercentage,
    goldPercentage,
    silverPercentage,
    remainingDays,
    dailyTotalTarget,
    dailyDiamondTarget,
    dailyGoldTarget,
    dailySilverTarget
  }
  localStorage.setItem('TargetObj', JSON.stringify(TargetObj));

}


function atStartUp() {
  // global
  TargetObj = JSON.parse(localStorage.getItem('TargetObj'))|| {};
   today = new Date();
   daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
   remainingDays = (daysInMonth - today.getDate()) + 1;


}




// scheduleMidnightUpdate(calculateDailyTargets);
// calculateDailyTargetsWithoutUI()
atStartUp()
calculateDailyTargets()
document.addEventListener("DOMContentLoaded", function () {
  // Get the modal element
  const targetModal = document.getElementById('targetModal');

  // Listen for the "shown.bs.modal" event
  targetModal.addEventListener('shown.bs.modal', function () {
    // Perform your action here
    prepareModalWhenOpen()
    calculateDailyTargets()
  });
});

function prepareModalWhenOpen()
{
  TargetObj = JSON.parse(localStorage.getItem('TargetObj'))|| {};
  today = new Date();
  currentMonth = today.getMonth(); // Get month index (0-based)
  daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  remainingDays = (daysInMonth - today.getDate()) + 1;

 // ui
 const currentMonthShort = monthNamesShort[currentMonth];
 document.getElementById("targetModalLabel").innerHTML = `Daily Target Calculator  of ${currentMonthShort} `
 document.getElementById('remaining-days').style.display = 'block';
 document.getElementById('remaining-days').innerHTML = `Remaining Days: <span style="color:var(--accent-color");">${remainingDays}</span>`;
  if (localStorage.getItem('TargetObj') !== null && localStorage.getItem('TargetObj') !== undefined && localStorage.getItem('TargetObj') !== '' && localStorage.getItem('TargetObj') !== '{}') {

    document.getElementById('total-target').value = TargetObj.totalTarget;
    document.getElementById('diamond-target').value = TargetObj.diamondTarget;
    document.getElementById('gold-target').value = TargetObj.goldTarget;
    document.getElementById('silver-target').value = TargetObj.silverTarget;
    document.getElementById('total-sales').value = TargetObj.totalSales;
    document.getElementById('diamond-sales').value = TargetObj.diamondSales;
    document.getElementById('gold-sales').value = TargetObj.goldSales;
    document.getElementById('silver-sales').value = TargetObj.silverSales;
    document.getElementById('total-percentage').value = TargetObj.totalPercentage;
    document.getElementById('diamond-percentage').value = TargetObj.diamondPercentage;
    document.getElementById('gold-percentage').value = TargetObj.goldPercentage;
    document.getElementById('silver-percentage').value = TargetObj.silverPercentage;
  }
}


let TargetIcon = document.getElementById("target-icon");
if(TargetIcon)
  {
    TargetIcon.addEventListener("click", function() {
      TargetObj = JSON.parse(localStorage.getItem('TargetObj'))|| {};
      if (localStorage.getItem('TargetObj') !== null && localStorage.getItem('TargetObj') !== undefined && localStorage.getItem('TargetObj') !== '' && localStorage.getItem('TargetObj') !== '{}') {

        Swal.fire({
          position: "bottom-end",
          title: "Target remaining days: " + TargetObj.remainingDays,
          html:
            `<div class="custom-html">
            <p><strong>Daily Total Target:</strong> <span class="daily-target-span">${TargetObj.dailyTotalTarget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SR</span></p>
            <p><strong>Daily Diamond Target:</strong><span class="daily-target-span"> ${TargetObj.dailyDiamondTarget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SR</span></p>
            <p><strong>Daily Gold Target:</strong> <span class="daily-target-span">${TargetObj.dailyGoldTarget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SR</span></p>
            <p><strong>Daily Silver Target:</strong> <span class="daily-target-span">${TargetObj.dailySilverTarget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SR</span> </p>
            <div>
            `,
    
          showConfirmButton: false,
          customClass: {
            popup: 'my-custom-popup ',
            title: 'my-custom-title',
            html: 'my-custom-content'
          }
    
        });
    
      }
    });
  }