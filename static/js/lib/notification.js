// Path to the notification sound
const notificationSound = '/static/sounds/azan.mp3';
    // Check for Notification permission
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            startWorker();
          } else {
            alert('Please enable notifications to show praying time.');
          }
        });
      } else if (Notification.permission === 'granted') {
        startWorker();
      } else {
        alert('Please enable notifications to show praying time.');
      }
    } else {
      alert('Your browser does not support notifications.');
    }

    // Start the worker
    function startWorker() {
      const worker = new Worker("../../static/js/worker.js");      
      worker.onmessage = (event) => {
        const { type, message } = event.data;

        if (type === 'notification') {
            console.log(worker);
            
          showNotification(message);
        } else if (type === 'error') {
          console.error(message);
          console.log(worker);

        }
      };
    }

    // Show notification
    function showNotification(message) {
          // Play the notification sound
        const audio = new Audio(notificationSound);
        audio.play().catch((error) => {
            console.error('Error playing notification sound:', error);
        });
      new Notification(message, {
        icon: '/static/images/praying.png', // Replace with an appropriate icon
        body:'متبقي علي الصلاه 5 دقائق يا شباب 🕌',
      }).onclick = () => {
        window.focus(); // Focus the tab if the user clicks the notification
      };
    }

