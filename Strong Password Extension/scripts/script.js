document.getElementById('generate').addEventListener('click', () => {
    const length = parseInt(document.getElementById('length').value, 10);
    const password = generatePassword(length);
    
    if (password) {
      document.getElementById('password').textContent = password;
      document.getElementById('copy').disabled = false;
    }
  });
  
  document.getElementById('copy').addEventListener('click', () => {
    const password = document.getElementById('password').textContent;
    copyToClipboard(password);
  });
  
  function generatePassword(length) {
    const uppercaseCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseCharset = 'abcdefghijklmnopqrstuvwxyz';
    const numericCharset = '0123456789';
    const specialCharset = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    const allCharset = uppercaseCharset + lowercaseCharset + numericCharset + specialCharset;
  
    if (length < 8) {
      alert('Password length must be at least 8 characters to include all required character types.');
      return '';
    } 
  
    let password = '';

    password += uppercaseCharset[Math.floor(Math.random() * uppercaseCharset.length)];
    password += lowercaseCharset[Math.floor(Math.random() * lowercaseCharset.length)];
    password += numericCharset[Math.floor(Math.random() * numericCharset.length)];
    password += specialCharset[Math.floor(Math.random() * specialCharset.length)];

    for (let i = password.length; i < length; i++) {
      password += allCharset[Math.floor(Math.random() * allCharset.length)];
    }

    password = shuffleString(password);
    return password;
  }
  
  function shuffleString(string) {
    const array = string.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array.join('');
  }
  
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Password copied to clipboard');
  }