'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.webRequest.onBeforeRequest.addListener(function (details) {
  return {redirectUrl: chrome.extension.getURL('html/graph.html')};
}, 
{
  urls: ['http://hack.gtr.rcuk.ac.uk/*']
}, 
['blocking']);

