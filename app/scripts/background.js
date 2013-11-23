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
  console.log(details);
}, {
  urls: ['http://gtr.rcuk.ac.uk/*']
});
