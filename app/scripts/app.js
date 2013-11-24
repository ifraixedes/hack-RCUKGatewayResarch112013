'use strict';

function getID() {
    var path = window.location.pathname.split('/'),
        id;
    if(path.length>2) {
        var pageType = path[1];
        id = path[2];
    }
    return id;
};

function create(type, klass) {
    var elem = document.createElement(type);
    elem.setAttribute('class', klass);
    return elem;
}


function loadSidebar() {
    var body = document.body,
        container = create('div', 'GtRExplorer'),
        sideStrip = create('div', 'sideStrip'),
        display = create('div', 'display'),
        toggle = create('a', 'toggle'),
        heading = create('div', 'heading'),
        graph = create('div', 'graph'),
        legend = create('div', 'legend'),
        panel = create('div', 'panel');

    sideStrip.appendChild(toggle);

    heading.innerHTML = '<h1>GtR EXPLORER</h1>';

    display.appendChild(heading);
    display.appendChild(graph);
    
    legend.innerHTML = '<span class="person"> Person</span><span class="organisation"> Organisation</span><span class="project"> Project</span>';
    
    display.appendChild(legend);
    display.appendChild(panel);

    container.appendChild(sideStrip);
    container.appendChild(display);

    // Finally add the container to the DOM
    body.appendChild(container);
}