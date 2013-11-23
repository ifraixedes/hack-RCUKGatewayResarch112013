function fetch(url, func, c) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
            func.call(c, resp);
        }
    };
    xhr.send();
}    

var GtR = {};

GtR.baseURL = 'http://gtr.rcuk.ac.uk/api/';

GtR.person = function(id, fn) {
    fetch(GtR.baseURL+'person/'+id, fn);
};

GtR.organisation = function(id, fn) {
    fetch(baseURL+'organisation/'+id, fn);
};

GtR.publication = function(id, fn) {
    fetch(baseURL+'publication/'+id, fn);
};