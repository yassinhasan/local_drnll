const notificationSound = '/static/sounds/azan.mp3';
let worker = new Worker("../../static/js/worker.js");
let city = 'Al Hufuf'
const notificationToggle = document.getElementById('notificationToggle');
const locationToggle     = document.getElementById('locationToggle');

// get city name from localstorage

if(localStorage.getItem('notification') === 'enabled') {
    if(localStorage.getItem('city'))
    {
        city = localStorage.getItem("city")        
    }
    worker.postMessage({ type: 'location', message: city });
    notificationToggle.checked = true;
    startWorker()
}else{
    notificationToggle.checked = false;
    worker.terminate();
    // setTimeout(() => {
    //     fireAlert('info', 'Please enable notifications to receive prayer time alerts.' , 4000,'custom-notfi','top-start');
    // }, 10000);
}

if(localStorage.getItem('location') === 'enabled') {
    locationToggle.checked = true;
}else{
    locationToggle.checked = false;
    // setTimeout(() => {
    // fireAlert('info', 'Please enable location to get correct location.', 4000,'custom-notfi','top-start');
    // }, 15000);
}

document.addEventListener('DOMContentLoaded', () => {

    if ('Notification' in window) {

        notificationToggle.addEventListener('change', () => {
            if (notificationToggle.checked) {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        console.log('Permission granted');
                        fireAlert('success', 'You granted permission to show notifications.' ,4000,'custom-notfi','top-start');
                        localStorage.setItem('notification', 'enabled');
                        startWorker();
                    } else {
                        notificationToggle.checked = false;
                        localStorage.removeItem('notification');
                        fireAlert('error', 'You denied permission to show notifications.' , 4000,'custom-notfi','top-start');
                    }
                });
            } else {
                localStorage.removeItem('notification');
                fireAlert('error', 'You denied permission to show notifications.', 4000,'custom-notfi','top-start');
                worker.terminate();
                // remove permission from browser
                Notification.permission = 'default';

            }
        });
    } else {
        notificationToggle.checked = false;
        localStorage.removeItem('notification');
        fireAlert('error', 'Your browser does not support notifications.' , 4000,'custom-notfi','top-start');

    }
    // get location permessions
    locationToggle.addEventListener('change', ()=> {
        if(locationToggle.checked)
        {
            // if user allow location permession and location is supported by browser
                if (!navigator.permissions) {
                    fireAlert('error', 'Permissions API is not supported by your browser.', 4000,'custom-notfi','top-start');
                    locationToggle.checked = false;
                    localStorage.removeItem('location');
                }
                navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
                    if (permissionStatus.state === 'granted') {
                        localStorage.setItem('location', 'enabled');
                        fireAlert('success', 'Location permission granted.', 4000,'custom-notfi','top-start');
                        navigator.geolocation.getCurrentPosition(geolocationSuccess);

                    } else if (permissionStatus.state === 'prompt' || permissionStatus.state === 'denied') {
                        navigator.geolocation.getCurrentPosition(() => {
                            localStorage.setItem('location', 'enabled');
                            fireAlert('success', 'Location permission granted.' ,  4000,'custom-notfi','top-start');
                            // get location in geolocationSuccess
                            navigator.geolocation.getCurrentPosition(geolocationSuccess);
                        }, error => {
                            locationToggle.checked = false;
                            localStorage.removeItem('location');
                            fireAlert('error', 'You denied location permission.' , 4000,'custom-notfi','top-start');

                            
                        })
                            
                    } else {
                        locationToggle.checked = false;
                        localStorage.removeItem('location');
                        fireAlert('error', 'You denied location permission.' , 4000,'custom-notfi','top-start');
                    }
                });
            

        }else{
            fireAlert('error', 'You denied location permission.');
            localStorage.removeItem('location');
            localStorage.removeItem('city');
            // remove permission from browser
            // Note: navigator.permissions.revoke is not a function, so we cannot revoke the permission programmatically.
            console.log('Location permission cannot be revoked programmatically.' );
        }
    })
});

function startWorker() {
    worker.onmessage = (event) => {
        const { type, message } = event.data;
        if (type === 'notification') {            
            showNotification(message);
        } else if (type === 'error') {
            console.error(message);
        }
    };
}

function showNotification(message) {
    
    const audio = new Audio(notificationSound);
    audio.play().catch(error => console.error('Error playing sound:', error));

    new Notification(message, {
        icon: '/static/images/praying.png',
        body: 'متبقي علي الصلاه 5 دقائق يا شباب 🕌',
    }).onclick = () => window.focus();
}

function geolocationSuccess(position) {
    const { latitude, longitude } = position.coords;
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`)
        .then(response => response.json())
        .then(data => {
            city = data.city;
            // get city in english
            localStorage.setItem('city', city);
        })
        .catch(error => console.error('Error fetching city:', error));
}



