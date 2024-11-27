// Function to download data to a file
function saveAs(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function saveResultsAsCsv(headers,data)
{
    var universalBOM = "\uFEFF";
    let csvStr  = headers.join(",")+'\r\n';
    data.forEach(element => {

        csvStr += element.join(",") +"\r\n";
        })

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(universalBOM+csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'results.csv';
    hiddenElement.click();
}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
  }
// function forceDownload(blob, filename) {
// 	var a = document.createElement('a');
// 	a.download = filename;
// 	a.href = blob;
// 	// For Firefox https://stackoverflow.com/a/32226068
// 	document.body.appendChild(a);
// 	a.click();
// 	a.remove();
//   }
  
//   // Current blob size limit is around 500MB for browsers
//   function downloadResource(url, filename) {
// 	if (!filename) filename = url.split('\\').pop().split('/').pop();
// 	fetch(url, {
// 		headers: new Headers({
// 		  'Origin': location.origin
// 		}),
// 		mode: 'no-cors'
// 	  })
// 	  .then(response => response.blob())
// 	  .then(blob => {
// 		let blobUrl = window.URL.createObjectURL(blob);
// 		forceDownload(blobUrl, filename);
// 	  })
// 	  .catch(e => console.error(e));
//   }