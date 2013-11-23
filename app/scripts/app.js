(function() {
    var path = window.location.pathname.split('/');
    var f = {
        'person': function(id){
            GtR.persons(id, function(data) {
                console.log(data);
            });
            GtR.personsOrganisations(id, function(data) {
                console.log(data);
            });
        },
        'organisation': function(id){
            GtR.organisations(id, function(data) {
                console.log(data);
            });
        },
        'project': function(id){
            console.log(id);
        }
    };
    if(path.length>2) {
        var pageType = path[1];
        if(f.hasOwnProperty(pageType)) {
            f[pageType].apply(this,path.slice(2,path.length));
        }
    }
})();