function getID() {
    var path = window.location.pathname.split('/'),
        id;
    if(path.length>2) {
        var pageType = path[1];
        id = path[2];
    }
    return id;
};