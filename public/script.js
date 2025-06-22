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
  if (cart[productId]) {
    cart[productId].quantity += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart[productId] = { ...product, quantity: 1 };
  }
  updateCart();
}
function removeFromCart(productId) {
  delete cart[productId];
  updateCart();
}
function updateCart() {
  const cartTable = document.getElementById('cartTable').getElementsByTagName('tbody')[0];
  cartTable.innerHTML = '';
  let total = 0;
  for (const productId in cart) {
    const product = cart[productId];
    const subtotal = product.price * product.quantity;
    total += subtotal;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.quantity}</td>
      <td>${product.price.toFixed(2)} €</td>
      <td>${subtotal.toFixed(2)} €</td>
      <td><button class="btn btn-sm btn-danger" data-id="${productId}">Remover</button></td>
    `;
    cartTable.appendChild(row);
  }
  document.getElementById('cartTotal').textContent = `${total.toFixed(2)} €`;
  document.querySelectorAll('.btn-danger').forEach(button => {
    button.addEventListener('click', e => {
      const id = e.currentTarget.getAttribute('data-id');
      removeFromCart(parseInt(id));
    });
  });
}
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (Object.keys(cart).length > 0) {
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
  } else {
    alert('O seu carrinho está vazio!');
  }
});
document.getElementById('checkoutForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Pedido confirmado! Obrigado pela sua compra.');
  Object.keys(cart).forEach(productId => delete cart[productId]);
  updateCart();
  bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
});
// Inicialização do mapa
function initMap() {
  const storeLocation = { lat: 39.44394147794737, lng: -8.51503536188779 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: storeLocation,
  });
  new google.maps.Marker({ position: storeLocation, map, title: 'A Riachense' });
}
// Carrega produtos ao iniciar
renderProducts();

