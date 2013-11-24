'use strict';

var width = 430;
var height = 500;

var data = {
  count: 3 
};

function personCallback(error, personData) {
  if (error) {
    return;
  }
  
  data.person = JSON.parse(personData.response);
  data.count--;
  
  if (data.count === 0) {
    transformData(data);
  }
}

function orgsCallback(error, orgsData) {
  if (error) {
    return;
  }

  data.organisations = JSON.parse(orgsData.response);
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
  var rootNode = _.extend(_.pick(data.person, ['id', 'href', 'firstName', 'otherNames', 'surname', 'email']), {objType: 'person', level: 0});
  
  nodes.push(rootNode);
  addOrganisations(nodes, links, rootNode, data.organisations); 
  addProjects(nodes, links, rootNode, data.projects);
  createGraph(nodes, links);
}


function addPersons(nodes, links, parentNode, remotePersonsData) {
  var level = parentNode.level + 1;
  var styleClass;

  switch (parentNode.objType) {
    case 'project':
      styleClass = 'link-proj-pers';
      break;
    case 'organisation':
      styleClass = 'link-org-pers';
      break;
    default:
      styleClass = '';
  }

  remotePersonsData.person.forEach(function (pers, idx) {
    var node = _.extend(_.pick(data.person, ['id', 'href', 'firstName', 'otherNames', 'surname', 'email']), {objType: 'person', level: level});
    nodes.push(node);
    links.push({source: parentNode, target: node, class: styleClass});
  });
}

function addOrganisations(nodes, links, parentNode, remoteOrgsData) {
  var level = parentNode.level + 1;
  var styleClass;

  switch (parentNode.objType) {
    case 'project':
      styleClass = 'link-proj-org';
      break;
    case 'person':
      styleClass = 'link-pers-org';
      break;
    default:
      styleClass = '';
  }

  remoteOrgsData.organisation.forEach(function (org, idx) {
    var node = _.extend(_.pick(org, ['id', 'href', 'name', 'website', 'addresses']), {objType: 'organisation', level: level});
    nodes.push(node);
    links.push({source: parentNode, target: node, class: styleClass});
  });
}

function addProjects(nodes, links, parentNode, remoteProjectsData) {
  var level = parentNode.level + 1;
  var styleClass;

  switch (parentNode.objType) {
    case 'organisation':
      styleClass = 'link-org-proj';
      break;
    case 'person':
      styleClass = 'link-org-proj';
      break;
    default:
      styleClass = '';
  }

  remoteProjectsData.project.forEach(function (project, idx) {
    var node = _.extend(_.pick(project, [
      'id', 'href', 'title', 'status', 'grantCategory', 'techAbstractText', 'potentialImpact', 'start', 'end'
    ]), {objType: 'project', level: level});
    nodes.push(node);  
    links.push({source: parentNode, target: node, class: styleClass});
  });
}

function createGraph(nodes, links) {
  var linkElem, nodeElem, force, svg, userNodesSelection = [];

  function draw() {

    if (linkElem) {
      linkElem.remove();
    }

    linkElem = svg.selectAll(".link")
      .data(links)
      .enter().append("line");

    linkElem.attr('class', function (d) { return 'link ' + d.class; });

    if (nodeElem) {
      nodeElem.remove();
    }

    nodeElem = svg.selectAll(".node")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 15)
      .call(force.drag);

    nodeElem.append("title")
      .text(function(d) { 
        var title = null;

        switch (d.objType) {
          case 'person': 
            if (d.otherNames) { 
            title = d.firstName + ' ' + d.otherNames + ' ' + d.surname;
          } else {
            title = d.firstName + ' ' + d.surname;
          }

          break;
          case 'organisation': 
            title =  d.name;
          break;
          case 'project': 
            title = d.title;
        };

        return title;
      });

    nodeElem.on('click', function (datum, idx) {
      userNodesSelection.push(datum);

      switch (datum.objType) {
        case 'organisation': 
          d3.xhr(GtR.organisationsProjects(datum.id), 'application/json', xhrRespToJSONCallback(function (projectsData) {
            addProjects(nodes, links, datum, projectsData);
            force.start();
            draw();
          }));

          break;
        case 'project':
          d3.xhr(GtR.projectsPersons(datum.id), 'application/json', xhrRespToJSONCallback(function (personsData) {
            addPersons(nodes, links, datum, personsData);
            force.start();
            draw();
          }));

        break;
        default:
          force.start();
      } 
    });

    nodeElem.attr('class', function (d) { 
      var typedClass;

      switch (d.objType) {
        case 'person': 
          typedClass = ' node-pers';
        break;
        case 'organisation': 
          typedClass = ' node-org';
        break;
        case 'project': 
          typedClass = ' node-proj';
        break;
        default:
          typedClass = ''; 
      };

      return 'node' + typedClass;
    });
  }

  force= d3.layout.force()
  .charge(-120)
  .size([width, height])
  .linkDistance(function (link, idx) {
    if (userNodesSelection.indexOf(link.target) >= 0) {
      return 120;
    } else {
      return 70;
    }
  });

  loadSidebar();

  svg = d3.select('.GtRExplorer .graph')
  .append('svg')
  .attr("height", height)
  .attr("width", width);
  
  force.nodes(nodes)
    .links(links)
    .start();

  draw();

  force.on("tick", function() {
    linkElem.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    nodeElem.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
}

function xhrRespToJSONCallback(fn) {
  return function (error, data) {
    if (error) {
      console.error(error);
      return;
    }

    fn(JSON.parse(data.response));
  };
}

var id = getID();

d3.xhr(GtR.persons(id), 'application/json', personCallback); 
d3.xhr(GtR.personsOrganisations(id), 'application/json', orgsCallback);
d3.xhr(GtR.personsProjects(id), 'application/json', projectsCallback);
