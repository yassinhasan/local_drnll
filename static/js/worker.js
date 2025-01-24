// worker.js

async function fetchPrayerTimes() {
    try {
      const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Al-Hofuf&country=Saudi%20Arabia&method=2&language=ar');
      const data = await response.json();
  
      if (data.code === 200) {
        const prayerTimes = data.data.timings;
        scheduleNotifications(prayerTimes);
      } else {
        postMessage({ type: 'error', message: 'Failed to fetch prayer times' });
      }
    } catch (error) {
      postMessage({ type: 'error', message: 'Error fetching prayer times' });
    }
  }
  
  function scheduleNotifications(prayerTimes) {
    const now = new Date();
  
    for (const [prayer, time] of Object.entries(prayerTimes)) {
      const prayerTime = new Date(`${now.toISOString().split('T')[0]}T${time}:00`);
      prayerTime.setMinutes(prayerTime.getMinutes() - 5); // Notify 5 minutes before
  
      const timeDifference = prayerTime.getTime() - now.getTime();
  
      if (timeDifference > 0 ) {
        setTimeout(() => {
          postMessage({ type: 'notification', message: `It's almost time for ${prayer} 🕋 🕌` });
        },timeDifference);
      }
    }
  }
  
  fetchPrayerTimes();
  