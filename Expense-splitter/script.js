document.getElementById('add').addEventListener('click', function() {
  addPerson();
});

document.getElementById('calculate').addEventListener('click', function() {
  calculateExpenses();
});

document.getElementById('inputs').addEventListener('click', function(event) {
  if (event.target.classList.contains('remove')) {
      event.target.parentElement.remove();
  }
});

function addPerson() {
  const inputsDiv = document.getElementById('inputs');
  const div = document.createElement('div');
  div.className = 'input-group';
  div.innerHTML = `
      <input type="text" placeholder="Name" class="name">
      <input type="number" placeholder="Amount Paid" class="amount">
      <button class="remove">Remove</button>
  `;
  inputsDiv.appendChild(div);
}

function calculateExpenses() {
  const names = document.querySelectorAll('.name');
  const amounts = document.querySelectorAll('.amount');
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  let totalAmount = 0;
  const people = [];

  for (let i = 0; i < names.length; i++) {
      const name = names[i].value.trim();
      const amount = parseFloat(amounts[i].value);
      if (name && !isNaN(amount)) {
          people.push({ name, amount });
          totalAmount += amount;
      }
  }

  const average = totalAmount / people.length;

  const balance = people.map(person => ({
      name: person.name,
      balance: person.amount - average
  }));

  const owes = [];
  const owed = [];

  balance.forEach(person => {
      if (person.balance < 0) {
          owes.push(person);
      } else if (person.balance > 0) {
          owed.push(person);
      }
  });

  while (owes.length && owed.length) {
      const ower = owes[0];
      const creditor = owed[0];

      const amount = Math.min(-ower.balance, creditor.balance);

      resultsDiv.innerHTML += `<p>${ower.name} owes ${creditor.name} Rs.${amount.toFixed(2)}</p><br>`;

      ower.balance += amount;
      creditor.balance -= amount;

      if (ower.balance === 0) {
          owes.shift();
      }
      if (creditor.balance === 0) {
          owed.shift();
      }
  }
}
