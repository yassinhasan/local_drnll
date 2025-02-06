


// worker.js
let city = 'test worker'

async function fetchPrayerTimes() {
  try {
    self.onmessage = async (event) => {
      const { type, message } = event.data;
      if (type === 'location') {
        city = message;
        console.log('city after post', city);
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Saudi%20Arabia&method=2&language=ar`);
        const data = await response.json();
        
        if (data.code === 200) {
          const prayerTimes = data.data.timings;
          scheduleNotifications(prayerTimes);
        } else {
          postMessage({ type: 'error', message: 'Failed to fetch prayer times' });
        }
      }
    };
  } catch (error) {
    postMessage({ type: 'error', message: 'Error fetching prayer times' });
  }
}





function scheduleNotifications(prayerTimes) {
  const now = new Date();

  for (const [prayer, time] of Object.entries(prayerTimes)) {
    
    const prayerTime = convertTimeToDateTime(time);
    prayerTime.setMinutes(prayerTime.getMinutes() - 5); // Notify 5 minutes before

    const timeDifference = prayerTime.getTime() - now.getTime();
    
    if (timeDifference > 0  ) {      
      setTimeout(() => {
        postMessage({ type: 'notification', message: `It's almost time for ${prayer} 🕋 🕌` });
      }, timeDifference);
    }
  }
}


fetchPrayerTimes();

function convertTimeToDateTime(timeString) {
  const now = new Date();
  const [hours, minutes] = timeString.split(':');

  now.setHours(parseInt(hours));
  now.setMinutes(parseInt(minutes));
  now.setSeconds(0);
  now.setMilliseconds(0);

  return now;
}

function convertMilliseconds(milliseconds) {
  // Calculate hours
  const hours = Math.floor(milliseconds / 3600000);

  // Calculate remaining milliseconds after subtracting hours
  const remainingMilliseconds = milliseconds % 3600000;

  // Calculate minutes
  const minutes = Math.floor(remainingMilliseconds / 60000);

  return `${hours} hours ${minutes} minutes`;
}




