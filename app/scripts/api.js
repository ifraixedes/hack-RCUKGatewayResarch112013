var GtR = {};

GtR.baseURL = 'http://gtr.rcuk.ac.uk/gtr/api/';

GtR.persons = function(id) {
    return GtR.baseURL+'persons/'+id;
};

GtR.personsOrganisations = function(id) {
    return GtR.baseURL+'persons/'+id+'/organisations';
};

GtR.personsProjects = function(id) {
    return GtR.baseURL+'persons/'+id+'/projects';
};

GtR.organisations = function(id) {
    return GtR.baseURL+'organisations/'+id;
};

GtR.organisationsPersons = function(id) {
    return GtR.baseURL+'organisations/'+id+'/persons';
};

GtR.organisationsProjects = function(id) {
    return GtR.baseURL+'organisations/'+id+'/projects';
};

GtR.projects = function(id) {
    return GtR.baseURL+'projects/'+id;
};

GtR.projectsOrganisations = function(id) {
    return GtR.baseURL+'projects/'+id+'/organisations';
};

GtR.projectsPersons = function(id) {
    return GtR.baseURL+'projects/'+id+'/persons';
};