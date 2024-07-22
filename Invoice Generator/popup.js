document.getElementById('generate-invoice').addEventListener('click', generateInvoice);
document.getElementById('save-pdf').addEventListener('click', savePDF);

function generateInvoice() {
  const clientName = document.getElementById('client-name').value;
  const clientEmail = document.getElementById('client-email').value;
  const serviceDescription = document.getElementById('service-description').value;
  const amount = document.getElementById('amount').value;
  const template = document.getElementById('template').value;

  const templates = {
    template1: `
      <h2>Invoice</h2>
      <p>Client: ${clientName}</p>
      <p>Email: ${clientEmail}</p>
      <p>Service: ${serviceDescription}</p>
      <p>Amount: $${amount}</p>
    `,
    template2: `
      <h2>Invoice</h2>
      <p><strong>Client:</strong> ${clientName}</p>
      <p><strong>Email:</strong> ${clientEmail}</p>
      <p><strong>Service:</strong> ${serviceDescription}</p>
      <p><strong>Amount:</strong> $${amount}</p>
    `
  };

  document.getElementById('invoice-content').innerHTML = templates[template];
  document.getElementById('invoice-preview').style.display = 'block';

  saveInvoiceToStorage(clientName, clientEmail, serviceDescription, amount, template);
}

async function savePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const invoiceContent = document.getElementById('invoice-content');
  doc.html(invoiceContent, {
    callback: function (doc) {
      doc.save('invoice.pdf');
    },
    x: 10,
    y: 10
  });
}

function saveInvoiceToStorage(clientName, clientEmail, serviceDescription, amount, template) {
  const invoice = {
    clientName,
    clientEmail,
    serviceDescription,
    amount,
    template,
    date: new Date().toISOString()
  };

  chrome.storage.sync.get({ invoices: [] }, function(data) {
    const invoices = data.invoices;
    invoices.push(invoice);
    chrome.storage.sync.set({ invoices: invoices }, function() {
      console.log('Invoice saved');
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('reminder', { periodInMinutes: 1440 }); 
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'reminder') {
    chrome.storage.sync.get({ invoices: [] }, function(data) {
      const invoices = data.invoices;
      const pendingInvoices = invoices.filter(invoice => new Date(invoice.date) <= new Date(new Date().setDate(new Date().getDate() + 7)));
      if (pendingInvoices.length > 0) {
        chrome.notifications.create({
          type: 'basic',
          title: 'Pending Invoice Reminder',
          message: 'You have pending invoices. Please follow up.'
        });
      }
    });
  }
});
