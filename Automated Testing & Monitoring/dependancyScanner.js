import { exec } from 'child_process';

export function scanDependencies() {
  exec('npm audit', (error, stdout, stderr) => {
    if (error) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '../icons/icon48.png',
        title: 'Dependency Vulnerability Alert',
        message: `Vulnerabilities found: ${stderr}`
      });
      return;
    }
    chrome.storage.local.set({ lastDependencyScan: stdout });
  });
}
