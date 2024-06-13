import { exec } from 'child_process';

export function runTests() {
  exec('npm run test', (error, stdout, stderr) => {
    if (error) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '../icons/icon48.png',
        title: 'Test Runner Alert',
        message: `Test Run failed: ${stderr}`
      });
      return;
    }
    chrome.storage.local.set({ lastTestRun: stdout });
  });
}
