import { exec } from 'child_process';

export function monitorCodeQuality() {
  exec('npm run lint', (error, stdout, stderr) => {
    if (error) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '../icons/icon48.png',
        title: 'Code Quality Alert',
        message: `Code Quality Issues: ${stderr}`
      });
      return;
    }
    chrome.storage.local.set({ lastCodeQualityCheck: stdout });
  });
}
