'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.webRequest.onBeforeRequest.addListener(function (details) {
  //return {redirectUrl: chrome.extension.getURL('html/graph.html')};
}, 
{
  urls: ['http://gtr.rcuk.ac.uk/*']
}, 
['blocking']);


chrome.webRequest.onCompleted.addListener(function (details) {
  //console.log(details);
  /*
  var headNode = document.querySelector('head');
  var scriptNode = document.createElement('script');

  scriptNode.setAttribute('src', chrome.extension.getURL('scripts/vendor/miso.ds.deps.min.0.3.0.js')); 
  headNode.appendChild(scriptNode);
  */


}, {
  urls: ['http://gtr.rcuk.ac.uk/*'],
  types: ['main_frame']
});
