import { monitorCI } from './ciMonitor.js';
import { runTests } from '../scripts/testRunner.js';
import { monitorCodeQuality } from '../scripts/codeQualityMonitor.js';
import { scanDependencies } from '../scripts/dependencyScanner.js';

// Set alarms for periodic tasks
chrome.alarms.create('ciMonitor', { periodInMinutes: 10 });
chrome.alarms.create('runTests', { periodInMinutes: 30 });
chrome.alarms.create('monitorCodeQuality', { periodInMinutes: 60 });
chrome.alarms.create('scanDependencies', { periodInMinutes: 1440 });

// Listen for alarm triggers
chrome.alarms.onAlarm.addListener(alarm => {
  switch (alarm.name) {
    case 'ciMonitor':
      monitorCI();
      break;
    case 'runTests':
      runTests();
      break;
    case 'monitorCodeQuality':
      monitorCodeQuality();
      break;
    case 'scanDependencies':
      scanDependencies();
      break;
  }
});
