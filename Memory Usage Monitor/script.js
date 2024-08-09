document.addEventListener('DOMContentLoaded', () => {
    const totalMemoryElement = document.getElementById('total-memory');
    const availableMemoryElement = document.getElementById('available-memory');
    const usedMemoryElement = document.getElementById('used-memory');
  
    if (chrome.system && chrome.system.memory) {
      chrome.system.memory.getInfo((info) => {
        const totalMemory = (info.capacity / (1024 * 1024 * 1024)).toFixed(2); // Convert to GB
        const availableMemory = (info.availableCapacity / (1024 * 1024 * 1024)).toFixed(2); // Convert to GB
        const usedMemory = (totalMemory - availableMemory).toFixed(2);
  
        totalMemoryElement.textContent = `${totalMemory} GB`;
        availableMemoryElement.textContent = `${availableMemory} GB`;
        usedMemoryElement.textContent = `${usedMemory} GB`;
      });
    } else {
      totalMemoryElement.textContent = 'Not supported';
      availableMemoryElement.textContent = 'Not supported';
      usedMemoryElement.textContent = 'Not supported';
    }
  });
  