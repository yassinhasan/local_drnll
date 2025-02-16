const notificationSound = '/static/sounds/azan.mp3';
let city = 'Al Hufuf';
const notificationToggle = document.getElementById('notificationToggle');
const locationToggle = document.getElementById('locationToggle');

// Get city name from local storage
if (localStorage.getItem('notification') === 'enabled') {
  if (localStorage.getItem('city')) {
    city = localStorage.getItem("city");
  }
  notificationToggle.checked = true;
  initializeServiceWorker();
} else {
  notificationToggle.checked = false;
}

if (localStorage.getItem('location') === 'enabled') {
  locationToggle.checked = true;
} else {
  locationToggle.checked = false;
}

document.addEventListener('DOMContentLoaded', () => {
  if ('Notification' in window) {
    notificationToggle.addEventListener('change', () => {
      if (notificationToggle.checked) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Permission granted');
            localStorage.setItem('notification', 'enabled');
            initializeServiceWorker();
          } else {
            notificationToggle.checked = false;
            localStorage.removeItem('notification');
          }
        });
      } else {
        localStorage.removeItem('notification');
      }
    });
  } else {
    notificationToggle.checked = false;
    localStorage.removeItem('notification');
  }

  locationToggle.addEventListener('change', () => {
    if (locationToggle.checked) {
      if (!navigator.permissions) {
        locationToggle.checked = false;
        localStorage.removeItem('location');
      }
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
          localStorage.setItem('location', 'enabled');
          navigator.geolocation.getCurrentPosition(geolocationSuccess);
        } else if (permissionStatus.state === 'prompt' || permissionStatus.state === 'denied') {
          navigator.geolocation.getCurrentPosition(() => {
            localStorage.setItem('location', 'enabled');
            navigator.geolocation.getCurrentPosition(geolocationSuccess);
          }, error => {
            locationToggle.checked = false;
            localStorage.removeItem('location');
          });
        } else {
          locationToggle.checked = false;
          localStorage.removeItem('location');
        }
      });
    } else {
      localStorage.removeItem('location');
      localStorage.removeItem('city');
    }
  });
});

async function initializeServiceWorker() {
    try {
      const city = localStorage.getItem('city') || 'Al Hufuf'; // Get the city from local storage or use a default value
      const prayerTimes = await fetchPrayerTimes(city); // Fetch prayer times
      console.log(prayerTimes);
      
      // Ensure the Service Worker is ready
      const registration = await navigator.serviceWorker.ready;
  
      // Send prayer times to the Service Worker
      registration.active.postMessage({ type: 'schedule', prayerTimes });
    } catch (error) {
      console.error('Error initializing Service Worker:', error);
    }
  }

async function fetchPrayerTimes(city) {
  try {
    const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Saudi%20Arabia&method=2&language=ar`);
    const data = await response.json();
  
    if (data.code === 200) {
      return data.data.timings; // Return the prayer times
    } else {
      throw new Error('Failed to fetch prayer times');
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
}

function geolocationSuccess(position) {
  const { latitude, longitude } = position.coords;
  fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`)
    .then(response => response.json())
    .then(data => {
      city = data.city;
      localStorage.setItem('city', city);
      initializeServiceWorker(); // Reinitialize Service Worker with updated city
    })
    .catch(error => console.error('Error fetching city:', error));
}
function scheduleNotifications(prayerTimes) {
    // Clear existing notifications
    self.registration.getNotifications().then(notifications => {
      notifications.forEach(notification => notification.close());
    });
  
    console.log("inside service worker");
    const now = new Date();
    for (const [prayerName, prayerTime] of Object.entries(prayerTimes)) {
      const prayerDateTime = convertTimeToDateTime(prayerTime);  
      prayerDateTime.setMinutes(prayerDateTime.getMinutes() - 5); // Notify 5 minutes before
  
      const timeDifference = prayerDateTime.getTime() - now.getTime();
  
      // if (timeDifference > 0) {
       if (prayerName == 'Asr' ) {
        setTimeout(() => {
          self.registration.showNotification(prayerName, {
            icon: '/static/images/praying.png',
            body: 'متبقي علي الصلاه 5 دقائق يا شباب 🕌',
            vibrate: [200, 100, 200]
          });
        }, 3000);
      }else{
        console.log("Assssssssss");
        
      }
    }
  }
  
  // Helper function to convert time string to Date object
  function convertTimeToDateTime(timeString) {
    const now = new Date();
    const [hours, minutes] = timeString.split(':');
    
    now.setHours(parseInt(hours));
    now.setMinutes(parseInt(minutes));
    now.setSeconds(0);
    now.setMilliseconds(0);
    
    return now;
  }