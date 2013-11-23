(function() {
    var path = window.location.pathname.split('/');
    var f = {
        'person': function(id){
            console.log(id);
        },
        'organisation': function(id){
            console.log(id);
        },
        'publication': function(id){
            console.log(id);
        }
    };
    if(path.length>2) {
        var pageType = path[1];
        f[pageType].apply(this,path.slice(2,path.length));
    }
})();