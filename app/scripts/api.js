function fetch(url, func, c) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader ("Accept", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
            func.call(c, resp);
        }
    };
    xhr.send();
}    

var GtR = {};

GtR.baseURL = 'http://gtr.rcuk.ac.uk/gtr/api/';

GtR.persons = function(id, fn) {
    fetch(GtR.baseURL+'persons/'+id, fn);
};

GtR.personsOrganisations = function(id, fn) {
    fetch(GtR.baseURL+'persons/'+id+'/organisations', fn);
};

GtR.organisations = function(id, fn) {
    fetch(GtR.baseURL+'organisations/'+id, fn);
};

GtR.projects = function(id, fn) {
    fetch(GtR.baseURL+'projects/'+id, fn);
};