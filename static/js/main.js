// get csrf token from meta head tag
const csrfToken = document.head.querySelector("[name~=csrf-token][content]").content; // this line will now be working as expected

// const worker = new Worker("woker.js")
// console.log(worker);
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/static/js/serviceWorker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

function updateLastActive(){
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
        credentials: 'include',
        method: 'POST',
    };
    
    fetch('/updateactivity', options)
        .then(response => response.json())
        .then(results => {
        if (results.status == 'success') {
            console.log("Last active updated successfully");
        }
        })
        .catch(error => {
        console.error("Error updating last active:", error);
        });
    })
}

// Update last active time every 5 minutes
setInterval(updateLastActive, 300000);
// Update last active time on page load
updateLastActive();
// Update last active time on page unload
window.addEventListener('beforeunload', updateLastActive);


