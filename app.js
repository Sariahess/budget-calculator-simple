const monthsList = [
  `January`, `February`, `March`, `April`, `May`, `June`, 
  `July`, `August`, `September`, `October`, `November`, `December`
];
const today = new Date();
const month = monthsList[today.getMonth()];
const date = today.getDate();
const titleMonth = document.querySelector(`.budget__title--month`);
titleMonth.innerHTML = `${month} ${today.getFullYear()}`;

function shortHandDate() {
  let ordinals;

  if (date === 1 || date === 21 || date === 31) {
    ordinals = `st`;
  } else if (date === 2 || date === 22) {
    ordinals = `nd`;
  } else if (date === 3 || date === 23) {
    ordinals = `rd`;
  } else {
    ordinals = `th`;
  }

  return `${month.slice(0, 3)}${month.length <= 3 ? `` : `.`} ${date}${ordinals}, ${today.getFullYear()}`;
}

let incomeTotal = 0;
let expensesTotal = 0;

class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
    this.transactionId = 0;
  }

  addNewTransaction() {
    if (addValue.value >= 0) {
      this.incomeList.push(new Transaction(addValue.value, addDescription.value, this.transactionId));
    } else {
      this.expenseList.push(new Transaction(addValue.value, addDescription.value, this.transactionId));
    }

    this.refresh();
    this.transactionId++;
  }

  removeTransaction(listId) {
    this.incomeList = this.incomeList.filter(ele => ele.id !== listId);
    this.expenseList = this.expenseList.filter(ele => ele.id !== listId);
    incomeTotal = 0;
    this.incomeList.forEach(ele => incomeTotal += ele.amount);
    expensesTotal = 0;
    this.expenseList.forEach(ele => expensesTotal += ele.amount);
    this.refresh();
  }

  refresh() {
    const incomeSide = document.querySelector(`.income__list`);
    const expenseSide = document.querySelector(`.expenses__list`);
    this.update(incomeSide, this.incomeList);
    this.update(expenseSide, this.expenseList);
    this.topPart();
  }

  update(side, list) {
    side.innerHTML = ``;

    list.forEach(ele => {
      side.insertAdjacentHTML(`beforeend`, `
      <div class="item" data-transaction-id="${ele.id}">
        <div class="item__description">${ele.description}</div>

        <div class="right">
          <div class="item__value">${ele.amount >= 0 ? `+` : `-`} $${ele.amount >= 0 ? ele.amount.toFixed(2) : Math.abs(ele.amount).toFixed(2)}</div>
          ${ele.amount >= 0 ? `` : `<div class="item__percentage">${Math.round(Math.abs(ele.amount) /incomeTotal * 100)}%</div>`}

          <div class="item__delete">
            <button class="item__delete--btn">
              <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>

        <div class="item__date">${ele.date}</div>
      </div>
      `);
    });
  }

  topPart() {
    const budgetValue = document.querySelector(`.budget__value`);
    const incomeValue = document.querySelector(`.budget__income--value`);
    const expensesValue = document.querySelector(`.budget__expenses--value`);
    const percentage = document.querySelector(`.budget__expenses--percentage`);
    budgetValue.innerHTML = `${incomeTotal + expensesTotal >= 0 ? `+` : `-`} $${Math.abs(incomeTotal + expensesTotal).toFixed(2)}`;
    incomeValue.innerHTML = `+ $${incomeTotal.toFixed(2)}`;
    expensesValue.innerHTML = `- $${Math.abs(expensesTotal).toFixed(2)}`;
    percentage.innerHTML = `${Math.round(Math.abs(expensesTotal) / incomeTotal * 100) || 0}%`;
  }
}

class Transaction {
  constructor(amount, description, id) {
    this.amount = parseFloat(amount);
    this.description = description;
    this.date = shortHandDate();
    this.id = id;
    this.amount >= 0 ? incomeTotal += this.amount : expensesTotal += this.amount;
  }
}

const addDescription = document.querySelector(`.add__description`);
const addValue = document.querySelector(`.add__value`);
const addBtn = document.querySelector(`.add__btn`);
const container = document.querySelector(`.container`);
const transactionList = new TransactionList();

addBtn.addEventListener(`click`, function(eve) {
  eve.preventDefault();

  if (addValue.value !== `` && addDescription.value !== ``) {
    transactionList.addNewTransaction();
    addValue.value = ``;
    addDescription.value = ``;    
  }
});

container.addEventListener(`click`, function(eve) {
  const idNum = parseInt(eve.target.closest(`.item`).dataset.transactionId);
  
  if (eve.target.nodeName === `I`) {
    transactionList.removeTransaction(idNum);
  }
});