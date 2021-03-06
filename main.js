let request = new XMLHttpRequest();

let remainingFlids;
let files = [];

let numResults = 100;

request.responseType = 'json';

// tuna
//request.open("GET","https://androidfilehost.com/api/?action=developers&did=2&limit=6");
//request.open("GET", "http://afh.nonnocicala.it/remote/?action=developers&did=2");

// sailfish
//request.open("GET", "http://afh.nonnocicala.it/remote/?action=developers&did=1705");

// onyx
//request.open("GET", "http://afh.it/remote/?action=developers&did=575");

// venturi
request.open("GET", "http://afh.nonnocicala.it/remote/?action=developers&did=221");

request.send();

request.onload = function () {
    remainingFlids = this.response.DATA.length;

    this.response.DATA.forEach(element => {
        flidFiles(element.flid);
    });

}

function flidFiles(flid) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'http://afh.nonnocicala.it/remote/?action=folder&flid=' + flid);
    xhr.send(null);
    xhr.onload = function () {
        if (this.response != null) {
            if (Array.isArray(this.response.DATA.files)) {
                files.push(...this.response.DATA.files);
            }
            if (Array.isArray(this.response.DATA.folders)) {
                remainingFlids += this.response.DATA.folders.length;
                this.response.DATA.folders.forEach(element => {
                    flidFiles(element.flid)
                });
            }
        } else {
            console.log('Error: ' + this.responseURL);
        }
        --remainingFlids;
        if (remainingFlids === 0) {
            files.sort((a, b) => b.upload_date - a.upload_date);
            let table = document.querySelector('tbody');
            files.slice(0, numResults).forEach(fid => {
                let row = table.insertRow();
                let cell = row.insertCell();
                cell.appendChild(document.createTextNode(fid.name));
                cell = row.insertCell();
                cell.appendChild(document.createTextNode((new Date(fid.upload_date * 1000)).toUTCString()));
                cell = row.insertCell();
                let page = document.createElement('a');
                page.href = page.text = fid.url;
                page.target = '_blank';
                cell.appendChild(page);
            });
            console.log(files.slice(0, numResults));
        }
    }
}
