document.addEventListener('DOMContentLoaded', function() {
    const devotionalElement = document.getElementById('devotional');
    const refreshButton = document.getElementById('refresh');
  
    function fetchDevotional() {
      // Simulate fetching a daily devotional
      const devotionals = [
        "Start your day with a grateful heart.",
        "God's love never fails.",
        "You are blessed beyond measure.",
        "Faith can move mountains.",
        "Be strong and courageous."
      ];
      const devotional = devotionals[Math.floor(Math.random() * devotionals.length)];
      devotionalElement.innerHTML = `<p>${devotional}</p>`;
    }
  
    refreshButton.addEventListener('click', fetchDevotional);
  
    // Fetch a devotional when the popup is opened
    fetchDevotional();
  });
  