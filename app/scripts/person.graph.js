'use strict';

var width = 960;
var height = 500;

/*
var dataset = new Miso.Dataset({
  url: chrome.extension.getURL('/data/organisations-person.json')
});

/*
dataset.fetch({
  success: function () {
    //console.log(this.columnNames());
  },
  error: function () {
    console.error(this);
  }
});
*/


var data = {
  count: 3 
};

function personCallback(error, personData) {
  if (error) {
    return;
  }
  
  data.person = personData;
  data.count--;
  
  if (data.count === 0) {
    transformData(data);
  }
}

function orgsCallback(error, orgsData) {
  if (error) {
    return;
  }
  
  data.organisations = orgsData;
  data.count--;
  
  if (data.count === 0) {
    transformData(data);
  }
}

function projectsCallback(error, projectsData) {
  if (error) {
    return;
  }
  
  data.projects = JSON.parse(projectsData.response);
  data.count--;
  
  if (data.count === 0) {
    transformData(data);
  }
}

function transformData(data) {
  var nodes = [];
  var links = [];
  var numElems = 0;

  nodes.push(_.extend(_.pick(data.person, ['id', 'href', 'firstName', 'otherNames', 'surname', 'email']), {objType: 'person'}));
  numElems++;

  data.organisations.organisation.forEach(function (org, idx) {
    nodes.push(_.extend(_.pick(org, ['id', 'href', 'name', 'website', 'addresses']), {objType: 'organisation'}));  
    links.push({source: 0, target: numElems++, class: 'link-pers-org'});
  });
  
  data.projects.project.forEach(function (project, idx) {
    nodes.push(_.extend(_.pick(project, [
      'id', 'href', 'title', 'status', 'grantCategory', 'techAbstractText', 'potentialImpact', 'start', 'end'
    ]), {objType: 'project'}));  
    links.push({source: 0, target: numElems++, class: 'link-pers-proj'});
  });

  draw(nodes, links);
}

function draw(nodes, links) {
  var link, node, force, svg;

  force= d3.layout.force()
  .charge(-120)
  .linkDistance(30)
  .size([width, height]);

  svg = d3.select('body')
  .append('svg')
  .attr("height", height)
  .attr("width", width);
  
  force.nodes(nodes)
    .links(links)
    .start();

  link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")

  link.attr('class', function (d) { return 'link ' + d.class; });

  node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 5)
      .call(force.drag);

  node.append("title")
      .text(function(d) { 
        var title = null;
        switch (d.objType) {
          case 'person': 
            if (d.otherNanes) { 
              title = d.firstName + ' ' + d.otherNanes + ' ' + d.surname;
            } else {
              title = d.firstName + ' ' d.surname;
            }
          case 'organisation': 
            title =  d.name;
          case 'project': 
            title = d.title;
        };

        return title;
      });

  node.attr('class', function (d) { 
    var typedClass;
    
    switch (d.objType) {
      case 'person': 
        typedClass = ' node-pers';
        break;
      case 'organisation': 
        typedClass = ' node-org';
        break;
      case 'project': 
        typedClass = 'node-proj';
        break;
      default:
        typedClass = ''; 
    };

    return 'node' + typedClass;
  });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

}

d3.json(chrome.extension.getURL('/data/organisations-person.json'), orgsCallback); 
d3.json(chrome.extension.getURL('/data/projects-person.json'), projectsCallback); 
d3.json(chrome.extension.getURL('/data/person.json'), personCallback); 
