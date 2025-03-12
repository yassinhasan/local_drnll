// importScripts('/static/js/lib/xlsx.full.min.js');

// self.onmessage = function (event) {
//     const file = event.data;
    
//     const reader = new FileReader();
//     reader.onload = function (e) {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });

//         // Get the first sheet
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];

//         // Convert only specific rows/columns if needed
//         const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

//         // Send only necessary data back to the main thread
//         self.postMessage(jsonData);
//     };

//     reader.readAsArrayBuffer(file);
// };
// importScripts('https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js');
importScripts('/static/js/lib/exceljs.min.js');

self.onmessage = function (event) {
    const file = event.data;

    const reader = new FileReader();
    reader.onload = function (e) {
        const buffer = e.target.result;
        const workbook = new ExcelJS.Workbook();

        workbook.xlsx.load(buffer).then(() => {
            const sheet = workbook.getWorksheet(1); // Get the first sheet
            const jsonData = [];

            sheet.eachRow((row, rowNumber) => {
                // Remove the first element (null) and shift the array to make it 0-indexed
                const rowData = row.values.slice(1);
                jsonData.push(rowData);
            });

            self.postMessage(jsonData);
        });
    };

    reader.readAsArrayBuffer(file);
};