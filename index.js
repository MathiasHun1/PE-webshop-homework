const shopItems = [
  {
    id: 1,
    image: "assets/images/image-baklava.jpg",
    name: "Baklava",
    price: 800,
    description: "Pisztáciás Baklava",
    inCartCount: 0
  },
  {
    id: 2,
    image: "assets/images/image-brownie.jpg",
    name: "Brownie",
    price: 1200,
    description: "Sós-karamellás Brownie",
    inCartCount: 0
  },
  {
    id: 3,
    image: "assets/images/image-cake.jpg",
    name: "Torta",
    price: 950,
    description: "Epres Krém-Torta",
    inCartCount: 0
  },
  {
    id: 4,
    image: "assets/images/image-creme-brulee.jpg",
    name: "Creme Brülée",
    price: 1500,
    description: "Vinlia Creme Brülée",
    inCartCount: 0
  },
  {
    id: 5,
    image: "assets/images/image-macaron.jpg",
    name: "Makaron",
    price: 2000,
    description: "Makaron-mix 5db",
    inCartCount: 0
  },
  {
    id: 6,
    image: "assets/images/image-meringue.jpg",
    name: "Meringue",
    price: 1490,
    description: "Citromos Merinque pite",
    inCartCount: 0
  },
  {
    id: 7,
    image: "assets/images/image-panna-cotta.jpg",
    name: "Panna Cotta",
    price: 1490,
    description: "Vaniliás Panna Cotta",
    inCartCount: 0
  },
  {
    id: 9,
    image: "assets/images/image-waffle.jpg",
    name: "Gofri",
    price: 1490,
    description: "Epres Gofri",
    inCartCount: 0
  },
  {
    id: 10,
    image: "assets/images/image-tiramisu.jpg",
    name: "Tiramisu",
    price: 1490,
    description: "Klasszikus Tiramisu",
    inCartCount: 0
  },
]

const totalElement = document.querySelector('.total-wrapper');
const totalAmountElement = document.querySelector('.total-amount');
const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
const errorMessage = document.querySelector('.error');
const cardsContainer = document.querySelector('.content-wrapper');
const contSumElement = document.querySelector('.summary-count');
const listElement = document.querySelector('.summary-list');
const discountTextElement = document.getElementById('discount-text');
const summaryConfirmButton = document.querySelector('.summary-confirm-button');
const priceSummaryElement = document.querySelector('.modal-price');
const closeModalButton = document.querySelector('.close-modal-button');
const form = document.querySelector('.form');
const balanceElement = document.querySelector('.balance-value');
let balance = 12000;

const renderCard = (item) => {
  const cardElement = document.createElement("div");
  cardElement.classList.add('card');
  cardElement.dataset.id = item.id;
  cardElement.innerHTML = `
          <div class="card-content-wrapper">
            <img src="${item.image}" alt="">
            <div class="buttons-wrapper">
              <button class="button-remove" data-id="${item.id}">-</button>
              <span class="card-amount" id="card-amount-${item.id}">${item.inCartCount}</span>
              <button class="button-add" data-id="${item.id}">+</button>
            </div>
          </div>
          <div class="card-description-wrapper">
            <h2 class="desc-title">${item.name}</h2>
            <p class="desc-desc">${item.description}</p>
            <p class="desc-price">${item.price} Ft</p>
          </div>`
  return cardElement;
}

const renderCards = () => {
  const cards = shopItems.map(item => renderCard(item));

  cards.forEach(card => {
    cardsContainer.appendChild(card);
  });
  cards.forEach(card => {
    const buttonAdd = card.querySelector('.button-add');
    const buttonRemove = card.querySelector('.button-remove');
    buttonAdd.addEventListener('click', (e) => {
      addToCart(buttonAdd.dataset.id);
    })
    buttonRemove.addEventListener('click', (e) => {
      removeFromCart(buttonRemove.dataset.id);
    })
  })
}

const highlightCards = () => {
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => {
    const shopItem = shopItems.find(item => item.id.toString() === card.dataset.id);
    if (shopItem.inCartCount !== 0 && !card.classList.contains("highlight")) {
      card.classList.add("highlight");
    } else if (shopItem.inCartCount === 0 && card.classList.contains("highlight")) {
      card.classList.remove("highlight");
    }
  })
}

const renderSummaryItem = (item) => {
  const listItemElement = document.createElement("li");
  listItemElement.classList.add('list-item');
  listItemElement.classList.add('list-group-item');
  listItemElement.innerHTML = `
    <span class="list-item-title">${item.description}</span>
    <p>
      <span class="list-item-cartCount">${item.inCartCount}x</span>
      <span class="list-item-price">${item.price} Ft</span>
      <span class="list-item-pricesum">${item.inCartCount * item.price} Ft</span>
    </p>`
  return listItemElement;
}

const renderSummaryList = () => {
  const countSum = shopItems.reduce((total, item) => total + item.inCartCount, 0);
  contSumElement.textContent = countSum.toString();
  listElement.innerHTML = '';

  shopItems.forEach(item => {
    if (item.inCartCount !== 0) {
      listElement.appendChild(renderSummaryItem(item))
    }
  })

  if (countSum === 0 && !totalElement.classList.contains('hidden')) {
    totalElement.classList.add('hidden');
  } else {
    totalElement.classList.remove('hidden');
  }
}

const addToCart = (itemId) => {
  const selectedItem = shopItems.find(item => item.id === Number(itemId));
  if (balance - selectedItem.price < 0) {
    return alert("Az egyeleged nem elegendő a művelethez")    
  }
  balance = balance - selectedItem.price;

  const cardAmountText = document.getElementById(`card-amount-${selectedItem.id}`);
  selectedItem.inCartCount = selectedItem.inCartCount + 1;
  cardAmountText.innerHTML = selectedItem.inCartCount;
  renderSummaryList();
  highlightCards();
  totalAmountElement.textContent = calculateTotalAmount();
  renderBalance();
}

const removeFromCart = (itemId) => {
  const selectedItem = shopItems.find(item => item.id === Number(itemId));
  if(selectedItem.inCartCount <= 0) {
    return
  }
  balance = balance + selectedItem.price;
  const cardAmountText = document.getElementById(`card-amount-${selectedItem.id}`);
  selectedItem.inCartCount = selectedItem.inCartCount - 1;
  cardAmountText.innerHTML = selectedItem.inCartCount;
  renderSummaryList();
  highlightCards();
  totalAmountElement.textContent = calculateTotalAmount().toString();
  renderBalance();
}

const getCartItemsAmount = () => shopItems.reduce((total, item) => total + item.inCartCount, 0);

const calculateTotalAmount = (isDiscount=false) => {
  const result = shopItems.reduce((total, item) => total + item.inCartCount*item.price, 0);
    if(isDiscount) {
      return `${(result * 0.7).toFixed(0).toString()} Ft`;
    }
  return `${result.toString()} Ft`;
}

const renderBalance = () => {
  balanceElement.innerHTML = "";
  balanceElement.innerHTML = `${balance}`;
}

const clearState = () => {
  shopItems.forEach(item => item.inCartCount = 0);
  cardsContainer.innerHTML = '';
  contSumElement.textContent = '';
  listElement.innerHTML = '';
  totalAmountElement.innerHTML = '';
  totalElement.classList.add('hidden');
  discountTextElement.classList.add('hidden');
  balance = 12000;
  renderBalance();
  renderCards();
}

document.addEventListener('DOMContentLoaded', () => {
  balanceElement.innerHTML = `${balance} Ft`
  renderCards();

  summaryConfirmButton.addEventListener('click', () => {
    if (getCartItemsAmount() === 0) {
      errorMessage.classList.remove('custom-invisible');
      setTimeout(() => {
        errorMessage.classList.add('custom-invisible');
      }, 3000);
      return
    }
    priceSummaryElement.textContent = calculateTotalAmount();
    modal.show();
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.checkValidity()) {
      discountTextElement.classList.remove('hidden');
      priceSummaryElement.textContent = calculateTotalAmount(true);
    }
  })

  closeModalButton.addEventListener('click', () => {
    clearState();
  })
})
