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
    const options = {
        headers: {
        "X-CSRFToken": csrfToken,
        "ContentType": 'application/json;charset=UTF-8',
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
}

// Update last active time every 5 minutes
setInterval(updateLastActive, 300000);
// Update last active time on page load
updateLastActive();
// Update last active time on page unload
window.addEventListener('beforeunload', updateLastActive);


