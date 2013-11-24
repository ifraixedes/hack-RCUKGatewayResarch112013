'use strict';

var width = 960;
var height = 500;

var data = {};

function personCallback(error, personData) {
  if (error) {
    return;
  }

  data.person = JSON.parse(personData.response);
  
  if (data.organisations) {
    transformData(data);
  }
}

function orgsCallback(error, orgsData) {
  if (error) {
    return;
  }

  data.organisations = JSON.parse(orgsData.response);
  
  if (data.person) {
    transformData(data);
  }
}

function transformData(data) {
  var nodes = [];
  var links = [];

  nodes.push(_.extend(_.pick(data.person, ['id', 'href', 'firstName', 'otherNames', 'surname', 'email']), {objType: 'person'}));

  data.organisations.organisation.forEach(function (org, idx) {
    nodes.push(_.extend(_.pick(org, ['id', 'href', 'name', 'website', 'addresses']), {objType: 'organisation'}));  
    links.push({source: 0, target: idx + 1, class: 'link-pers-org'});
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
  .append('div')
  .attr('class', 'GtRExplorer')
  .append('svg')
  .attr("height", height)
  .attr("width", width);
  
  force.nodes(nodes)
    .links(links)
    .start();

  link = svg.selectAll(".link")
      .data(links)
      .enter().append("line");

  link.attr('class', function (d) { return 'link ' + d.class; });

  node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 5)
      .call(force.drag);

  node.append("title")
      .text(function(d) { 
        switch (d.objType) {
          case 'person': 
            return d.firstName + ' ' + d.otherNanes + ' ' + d.surname;
          case 'organisation': 
            return d.name;
          default:
            return null; 
        };
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

var id = getID();

d3.xhr(GtR.persons(id), 'application/json', personCallback); 
d3.xhr(GtR.personsOrganisations(id), 'application/json', orgsCallback);