document.addEventListener('DOMContentLoaded', function() {
    const tips = [
      "Set clear goals and priorities for each day.",
      "Break tasks into smaller, manageable steps.",
      "Eliminate distractions and focus on one task at a time.",
      "Take regular breaks to recharge and avoid burnout.",
      "Use tools like to-do lists and calendars to stay organized.",
      "Practice time-blocking to allocate specific times for tasks.",
      "Review your progress at the end of each day.",
      "Stay hydrated and maintain a healthy diet for optimal productivity.",
      "Learn to say no to avoid overcommitting.",
      "Delegate tasks when possible to lighten your load."
    ];
  
    function getDailyTip() {
      const today = new Date().toISOString().split('T')[0];
      chrome.storage.local.get(['lastTipDate', 'lastTipIndex'], function(result) {
        let lastTipDate = result.lastTipDate;
        let lastTipIndex = result.lastTipIndex !== undefined ? result.lastTipIndex : -1;
        
        if (lastTipDate !== today) {
          const newTipIndex = (lastTipIndex + 1) % tips.length;
          chrome.storage.local.set({ lastTipDate: today, lastTipIndex: newTipIndex }, function() {
            document.querySelector('.tip').innerText = tips[newTipIndex];
          });
        } else {
          document.querySelector('.tip').innerText = tips[lastTipIndex];
        }
      });
    }
  
    getDailyTip();
  });
  