// Produtos e carrinho
const products = [
  { id: 1, category: 'Tabaco', name: 'Cigarros XXX', price: 5.5, img: 'images/tobacco.jpg', description: 'Descrição do produto' },
  { id: 2, category: 'Papelaria', name: 'Caderno A4', price: 2.0, img: 'images/stationery.jpg', description: 'Descrição do produto' },
  { id: 3, category: 'Jornais', name: 'Último Jornal', price: 1.5, img: 'images/newspaper.jpg', description: 'Descrição do produto' },
];
const cart = {};
function renderProducts() {
  const shopSection = document.getElementById('shop');
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
      <div class="card h-100 product-card">
        <img src="${product.img}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <p><strong>${product.price.toFixed(2)} €</strong></p>
          <button class="btn btn-outline-success" 
            data-id="${product.id}">Adicionar ao Carrinho</button>
        </div>
      </div>
    `;
    shopSection.appendChild(card);
  });
  document.querySelectorAll('.btn-outline-success').forEach(button => {
    button.addEventListener('click', e => {
      const id = parseInt(e.currentTarget.getAttribute('data-id'));
      addToCart(id);
    });
  });
}
function addToCart(productId) {
  const product = products.find(p => p._id === productId);
  if (!product) return;

  if (!cart[productId]) {
    cart[productId] = { ...product, quantity: 1 };
  } else {
    cart[productId].quantity++;
  }
  updateCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  updateCart();
}

function updateCart() {
  const cartTable = document.querySelector('#cartTable tbody');
  cartTable.innerHTML = '';
  total = 0;

  for (let id in cart) {
    const item = cart[id];
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toFixed(2)} €</td>
      <td>${itemTotal.toFixed(2)} €</td>
      <td><button class="btn btn-danger btn-sm" data-remove="${id}">Remover</button></td>
    `;
    cartTable.appendChild(tr);
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutForm = document.getElementById('checkoutForm');

checkoutBtn.addEventListener('click', () => {
  const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
  modal.show();
});

checkoutForm.addEventListener('submit', async e => {
  e.preventDefault();

  const orderData = {
    items: Object.values(cart).map(item => ({
      productId: item._id,
      quantity: item.quantity,
      price: item.price
    })),
    total,
    customer: {
      name: document.getElementById('name').value,
      address: document.getElementById('address').value,
      paymentMethod: document.getElementById('paymentMethod').value,
      deliveryMethod: document.getElementById('deliveryMethod').value
    }
  };
  
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();

  alert(data.message);
  cart = {};
  total = 0;
  updateCart();
  bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
});

let products = [];
let cart = {};
let total = 0;

async function loadProducts() {
  const res = await fetch('/api/products');
  products = await res.json();
  renderProducts();
}

function renderProducts() {
  const shop = document.getElementById('shop');
  shop.innerHTML = '';
  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'col';
    div.innerHTML = `
      <div class="card h-100 product-card">
        <img src="${product.img}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text"><strong>${product.price.toFixed(2)} €</strong></p>
          <button class="btn btn-success" data-id="${product._id}">Adicionar</button>
        </div>
      </div>
    `;
    shop.appendChild(div);
  });
  document.querySelectorAll('.btn-success[data-id]').forEach(button => {
    button.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      addToCart(id);
    });
  });
}

// Carrega produtos ao iniciar
loadProducts();

// Inicialização do mapa
function initMap() {
  const storeLocation = { lat: 39.44394147794737, lng: -8.51503536188779 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: storeLocation,
  });
  new google.maps.Marker({ position: storeLocation, map, title: 'A Riachense' });
}
