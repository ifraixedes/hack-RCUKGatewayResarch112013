'use strict';


var dataset = new Miso.Dataset({
  url: chrome.extension.getURL('/data/organisations-person.json')
});

dataset.fetch({
  success: function () {
    //console.log(this.columnNames());
  },
  error: function () {
    console.error(this);
  }
});


