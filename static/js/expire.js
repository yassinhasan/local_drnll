document.getElementById('expiryForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const pharmacyNo = document.getElementById('pharmacyNo').value;
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;

    try {
        // Step 1: Login and get tokens
        const loginResponse = await fetch('https://drs.al-dawaa.com/Account/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                UserID: userId,
                Password: password,
                RememberMe: 'true',
            }),
        });

        if (!loginResponse.ok) throw new Error('Login failed');

        // Step 2: Fetch data
        const dataResponse = await fetch('https://drs.al-dawaa.com/GoodsReceived/GetGrTransactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'accept': 'application/json',
            },
            body: new URLSearchParams({
                fromDate: `${fromDate} 12:00:00 AM`,
                toDate: `${toDate} 12:00:00 AM`,
            }),
        });

        const data = await dataResponse.json();

        // Step 3: Process data and generate CSV
        const report = data.Data.map(item => ({
            ItemNumber: item.ItemNumber,
            Description: item.Description,
            Expire: item.Batch.replace('B', '').split('').join('-').substring(0, 5),
        }));

        const csvContent = report.map(row => Object.values(row).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        // Step 4: Trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = `Expire_${fromDate}_to_${toDate}.csv`;
        a.click();

        // Step 5: Show notification
        if (Notification.permission === 'granted') {
            new Notification('Finished', {
                body: 'Your expiry file is ready.',
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Finished', {
                        body: 'Your expiry file is ready.',
                    });
                }
            });
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});