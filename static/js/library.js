import {  getMetadata, deleteObject, listAll, storageRef,  storage,  getDownloadURL} from "./firebase.js";
const tableLoaderWraper = document.querySelector(".table-loader-wraper");
const tableLoader = document.querySelector(".table-loader-wraper .loader");
function tableHideLoader() {
    tableLoader.classList.remove("show");
    tableLoaderWraper.classList.remove("show");
  }
listAllFiles()
function listAllFiles() {
    const listRef = storageRef(storage, `uploads/info`);
    listAll(listRef)
        .then((res) => {
            prepareListFilesHtml(res.items);
        })
        .catch((error) => {
            console.log(error);
        });

    function prepareListFilesHtml(files) {
        let tBody = document.getElementById("tablebody");
        tBody.innerHTML = ""; // Clear the existing table content

        if (files.length == 0) {
            tBody.innerHTML = `<div class="empty-files">You don't have any files yet</div>`;
            return;
        }

        const dataPromises = files.map(file => {
            return getMetadata(storageRef(storage, `uploads/info/${file.name}`))
                .then((metadata) => {
                    return getDownloadURL(storageRef(storage, `uploads/info/${metadata.name}`))
                        .then((url) => {
                            let fileName = metadata.name;
                            let fileSize = (metadata.size < 1024) ? metadata.size + " KB" : (metadata.size / (1024 * 1024)).toFixed(2) + " MB";
                            let fileDate = new Date(metadata.timeCreated);
                            fileDate = fileDate.getDate() + "-" + (months[fileDate.getMonth()]) + "-" + fileDate.getFullYear()
                                + " " +
                                fileDate.getHours() + ":" + fileDate.getMinutes();

                            return {
                                filename: fileName,
                                size: fileSize,
                                action: `
                                    <a href="${url}" target="_blank" download class="card-link download"><i class="fa-solid fa-download"></i></a>
                                `
                            };
                        });
                });
        });

        Promise.all(dataPromises)
            .then(data => {
                // Destroy existing DataTable instance if it exists
                if ($.fn.DataTable.isDataTable('#dataFilesTable')) {
                    $('#dataFilesTable').DataTable().destroy();
                }
                // Clear the table content
                tBody.innerHTML = "";
                // Reinitialize the DataTable with the new data
                initializeDataTable(data);
                tableHideLoader();
            })
            .catch(error => {
                console.log(error);
            });
    }
}
// Render logs in the UI
function initializeDataTable(data) {
    const table = $('#dataFilesTable').DataTable({
        data: data,
        columns: [
          { data: 'filename', title: 'File Name' },
          { data: 'size', title: 'File Size' },
          { data: 'action', title: 'Action' }
        ],
        columnDefs: [
          {
            targets: 0, // First column (File Name column)
            width: '20%' // Set the width to 30% of the table
          },
          {
            targets: -1, // Last column (Action column)
            orderable: false, // Disable sorting for the action column
            searchable: false // Disable searching for the action column
          }
        ],
        scrollX: true,
      });


}
