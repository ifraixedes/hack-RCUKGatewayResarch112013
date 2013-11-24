var GtR = {};

GtR.baseURL = 'http://gtr.rcuk.ac.uk/gtr/api/';

GtR.persons = function(id) {
    return GtR.baseURL+'persons/'+id;
};

GtR.personsOrganisations = function(id) {
    return GtR.baseURL+'persons/'+id+'/organisations';
};

GtR.organisations = function(id) {
    return GtR.baseURL+'organisations/'+id;
};

GtR.projects = function(id) {
    return GtR.baseURL+'projects/'+id;
};