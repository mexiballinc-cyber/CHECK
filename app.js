// MEMORIA LOCAL DE LA APP
let state = JSON.parse(localStorage.getItem('check_app_data')) || {
  warehouses: [],
  stores: [],
  sales: []
};

let activeWarehouseId = null;
let activeStoreId = null;
let activeProductId = null;

function saveState() {
  localStorage.setItem('check_app_data', JSON.stringify(state));
}

// CONVERTIR IMÁGENES A BASE64
function fileToBase64(file) {
  return new Promise((resolve) => {
    if (!file) resolve(null);
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// TABS DE NAVEGACIÓN
const tabs = {
  warehouses: { btn: document.getElementById('tab-btn-warehouses'), view: document.getElementById('view-warehouses') },
  stores: { btn: document.getElementById('tab-btn-stores'), view: document.getElementById('view-stores') },
  metrics: { btn: document.getElementById('tab-btn-metrics'), view: document.getElementById('view-metrics') }
};

function switchMainTab(activeTabKey) {
  Object.keys(tabs).forEach(key => {
    tabs[key].btn.classList.toggle('active', key === activeTabKey);
    tabs[key].view.classList.toggle('hidden', key !== activeTabKey);
  });
  document.getElementById('view-warehouse-detail').classList.add('hidden');
  document.getElementById('view-store-detail').classList.add('hidden');

  if (activeTabKey === 'warehouses') renderWarehouses();
  if (activeTabKey === 'stores') renderStores();
  if (activeTabKey === 'metrics') renderMetrics();
}

Object.keys(tabs).forEach(key => {
  tabs[key].btn.onclick = () => switchMainTab(key);
});

// ALMACENES
function renderWarehouses() {
  const container = document.getElementById('warehouses-grid');
  container.innerHTML = state.warehouses.length === 0
    ? `<p style="grid-column: span 2; opacity:0.6;">No tienes almacenes creados.</p>`
    : state.warehouses.map(w => `
        <div class="item-card" onclick="openWarehouse('${w.id}')">
          <div style="font-size:2rem; text-align:center; margin: 10px 0;">📦</div>
          <h4>${w.name}</h4>
          <span class="subtext">${w.categories ? w.categories.length : 0} Categorías</span>
        </div>
      `).join('');
}

function openWarehouse(id) {
  activeWarehouseId = id;
  const w = state.warehouses.find(item => item.id === id);
  document.getElementById('detail-warehouse-title').textContent = w.name;
  
  document.getElementById('view-warehouses').classList.add('hidden');
  document.getElementById('view-warehouse-detail').classList.remove('hidden');
  renderWarehouseProducts();
}

document.getElementById('btn-back-to-warehouses').onclick = () => {
  document.getElementById('view-warehouse-detail').classList.add('hidden');
  document.getElementById('view-warehouses').classList.remove('hidden');
  renderWarehouses();
};

// CATEGORÍAS Y PRODUCTOS DENTRO DEL ALMACÉN
function renderWarehouseProducts() {
  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  const container = document.getElementById('categories-products-container');
  container.innerHTML = "";

  if (!w.categories || w.categories.length === 0) {
    container.innerHTML = `<p style="opacity:0.6;">Crea una categoría primero.</p>`;
    return;
  }

  w.categories.forEach(cat => {
    const products = (w.products || []).filter(p => p.categoryId === cat.id);
    let catHTML = `<div class="category-block"><h3>${cat.name}</h3><div class="cards-grid">`;

    if (products.length === 0) {
      catHTML += `<p style="opacity:0.5; font-size:0.8rem;">Sin productos.</p>`;
    } else {
      products.forEach(p => {
        catHTML += `
          <div class="item-card" onclick="openProductSheet('${p.id}')">
            <img src="${p.image || 'https://via.placeholder.com/100?text=Sin+Foto'}">
            <h4>${p.name}</h4>
            <span class="subtext">Stock: ${p.stock}</span>
            <span class="subtext" style="color:var(--primary); font-weight:bold;">$${parseFloat(p.sellPrice).toFixed(2)}</span>
          </div>
        `;
      });
    }
    catHTML += `</div></div>`;
    container.innerHTML += catHTML;
  });
}

// BOTTOM SHEET (ACCIONES DE PRODUCTO)
const sheet = document.getElementById('bottom-sheet');
function openProductSheet(prodId) {
  activeProductId = prodId;
  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  const p = w.products.find(item => item.id === prodId);

  document.getElementById('sheet-prod-info').innerHTML = `
    <h4>${p.name}</h4>
    <p style="font-size:0.85rem; opacity:0.8;">Stock disponible: ${p.stock} pzas</p>
  `;
  sheet.classList.remove('hidden');
}

document.getElementById('close-sheet').onclick = () => sheet.classList.add('hidden');

// AÑADIR STOCK RÁPIDO
document.getElementById('sheet-btn-add-stock').onclick = () => {
  const addQty = prompt("¿Cuántas piezas deseas añadir al stock?");
  if (addQty && !isNaN(addQty) && parseInt(addQty) > 0) {
    const w = state.warehouses.find(item => item.id === activeWarehouseId);
    const p = w.products.find(item => item.id === activeProductId);
    p.stock += parseInt(addQty);
    saveState();
    renderWarehouseProducts();
    sheet.classList.add('hidden');
  }
};

// ACCIÓN CHECK: ENVIAR PRODUCTO A TIENDA
document.getElementById('sheet-btn-check').onclick = () => {
  sheet.classList.add('hidden');
  const storeSelect = document.getElementById('transfer-store-select');
  storeSelect.innerHTML = state.stores.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

  if (state.stores.length === 0) {
    alert("Primero debes crear una tienda en la pestaña de 'Tiendas'.");
    return;
  }
  document.getElementById('modal-transfer').classList.remove('hidden');
};

document.getElementById('form-transfer').onsubmit = (e) => {
  e.preventDefault();
  const targetStoreId = document.getElementById('transfer-store-select').value;
  const qty = parseInt(document.getElementById('transfer-qty').value);

  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  const p = w.products.find(item => item.id === activeProductId);

  if (qty > p.stock) {
    alert("No tienes suficiente stock en el almacén.");
    return;
  }

  p.stock -= qty; // Disminuye stock en almacén

  const store = state.stores.find(s => s.id === targetStoreId);
  if (!store.products) store.products = [];

  const existingInStore = store.products.find(sp => sp.id === p.id);
  if (existingInStore) {
    existingInStore.stock += qty;
  } else {
    store.products.push({ ...p, stock: qty });
  }

  saveState();
  document.getElementById('modal-transfer').classList.add('hidden');
  renderWarehouseProducts();
  alert("¡Producto movido a la tienda con éxito!");
};

// TIENDAS Y VENTAS
function renderStores() {
  const container = document.getElementById('stores-grid');
  container.innerHTML = state.stores.length === 0
    ? `<p style="grid-column: span 2; opacity:0.6;">No tienes tiendas creadas.</p>`
    : state.stores.map(s => `
        <div class="item-card" onclick="openStore('${s.id}')">
          <img src="${s.image || 'https://via.placeholder.com/100?text=Tienda'}">
          <h4>${s.name}</h4>
          <span class="subtext">${(s.products || []).length} Productos</span>
        </div>
      `).join('');
}

function openStore(id) {
  activeStoreId = id;
  const store = state.stores.find(s => s.id === id);
  document.getElementById('detail-store-title').textContent = store.name;
  
  document.getElementById('view-stores').classList.add('hidden');
  document.getElementById('view-store-detail').classList.remove('hidden');
  renderStoreProducts();
}

document.getElementById('btn-back-to-stores').onclick = () => {
  document.getElementById('view-store-detail').classList.add('hidden');
  document.getElementById('view-stores').classList.remove('hidden');
  renderStores();
};

function renderStoreProducts() {
  const store = state.stores.find(s => s.id === activeStoreId);
  const container = document.getElementById('store-products-container');
  container.innerHTML = "";

  if (!store.products || store.products.length === 0) {
    container.innerHTML = `<p style="opacity:0.6;">Sin productos exhibidos.</p>`;
    return;
  }

  store.products.forEach(p => {
    container.innerHTML += `
      <div class="item-card">
        <img src="${p.image || 'https://via.placeholder.com/100?text=Sin+Foto'}">
        <h4>${p.name}</h4>
        <span class="subtext">Disponible: ${p.stock}</span>
        <span class="subtext" style="color:var(--primary); font-weight:bold;">$${parseFloat(p.sellPrice).toFixed(2)}</span>
        <button class="btn-primary" onclick="sellProduct('${p.id}')" style="margin-top:8px; font-size:0.8rem;">
          ✓ Vender 1
        </button>
      </div>
    `;
  });
}

function sellProduct(prodId) {
  const store = state.stores.find(s => s.id === activeStoreId);
  const p = store.products.find(item => item.id === prodId);

  if (p.stock <= 0) return alert("Producto agotado en tienda.");

  p.stock -= 1;
  const profit = parseFloat(p.sellPrice) - parseFloat(p.buyPrice);

  state.sales.push({
    productName: p.name,
    sellPrice: parseFloat(p.sellPrice),
    profit: profit,
    date: new Date().toLocaleString()
  });

  saveState();
  renderStoreProducts();
}

// METRICAS Y UTILIDADES
function renderMetrics() {
  let totalSales = 0;
  let totalProfit = 0;

  state.sales.forEach(s => {
    totalSales += s.sellPrice;
    totalProfit += s.profit;
  });

  document.getElementById('metric-total-sales').textContent = `$${totalSales.toFixed(2)}`;
  document.getElementById('metric-total-profit').textContent = `$${totalProfit.toFixed(2)}`;

  const historyList = document.getElementById('sales-history-list');
  historyList.innerHTML = state.sales.length === 0
    ? `<p style="opacity:0.6; margin-top:10px;">Aún no se registran ventas.</p>`
    : state.sales.slice().reverse().map(s => `
        <div style="background:var(--card-bg); border:1px solid var(--border-color); padding:10px; border-radius:8px; margin-top:8px; display:flex; justify-content:space-between;">
          <div>
            <strong>${s.productName}</strong>
            <div style="font-size:0.75rem; opacity:0.7;">${s.date}</div>
          </div>
          <div style="text-align:right;">
            <div>$${s.sellPrice.toFixed(2)}</div>
            <div style="color:var(--primary); font-size:0.8rem; font-weight:bold;">+$${s.profit.toFixed(2)}</div>
          </div>
        </div>
      `).join('');
}

// CREACIÓN DE ALMACÉN, CATEGORÍA, PRODUCTO Y TIENDA
document.getElementById('btn-open-create-warehouse').onclick = () => document.getElementById('modal-warehouse').classList.remove('hidden');
document.getElementById('close-modal-warehouse').onclick = () => document.getElementById('modal-warehouse').classList.add('hidden');

document.getElementById('form-warehouse').onsubmit = (e) => {
  e.preventDefault();
  state.warehouses.push({ id: Date.now().toString(), name: document.getElementById('warehouse-name').value, categories: [], products: [] });
  saveState();
  document.getElementById('modal-warehouse').classList.add('hidden');
  document.getElementById('warehouse-name').value = "";
  renderWarehouses();
};

document.getElementById('btn-open-create-category').onclick = () => document.getElementById('modal-category').classList.remove('hidden');
document.getElementById('close-modal-category').onclick = () => document.getElementById('modal-category').classList.add('hidden');

document.getElementById('form-category').onsubmit = (e) => {
  e.preventDefault();
  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  w.categories.push({ id: Date.now().toString(), name: document.getElementById('category-name').value });
  saveState();
  document.getElementById('modal-category').classList.add('hidden');
  document.getElementById('category-name').value = "";
  renderWarehouseProducts();
};

document.getElementById('btn-open-create-product').onclick = () => {
  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  const catSelect = document.getElementById('prod-category-select');
  catSelect.innerHTML = w.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  document.getElementById('modal-product').classList.remove('hidden');
};
document.getElementById('close-modal-product').onclick = () => document.getElementById('modal-product').classList.add('hidden');

document.getElementById('form-product').onsubmit = async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('prod-image-file');
  const imageBase64 = await fileToBase64(fileInput.files[0]);

  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  w.products.push({
    id: Date.now().toString(),
    name: document.getElementById('prod-name').value,
    buyPrice: parseFloat(document.getElementById('prod-buy-price').value),
    sellPrice: parseFloat(document.getElementById('prod-sell-price').value),
    stock: parseInt(document.getElementById('prod-stock').value),
    categoryId: document.getElementById('prod-category-select').value,
    image: imageBase64
  });

  saveState();
  document.getElementById('modal-product').classList.add('hidden');
  document.getElementById('form-product').reset();
  renderWarehouseProducts();
};

document.getElementById('btn-open-create-store').onclick = () => document.getElementById('modal-store').classList.remove('hidden');
document.getElementById('close-modal-store').onclick = () => document.getElementById('modal-store').classList.add('hidden');

document.getElementById('form-store').onsubmit = async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('store-image-file');
  const imageBase64 = await fileToBase64(fileInput.files[0]);

  state.stores.push({
    id: Date.now().toString(),
    name: document.getElementById('store-name').value,
    image: imageBase64,
    products: []
  });

  saveState();
  document.getElementById('modal-store').classList.add('hidden');
  document.getElementById('form-store').reset();
  renderStores();
};

// BOTONES DE CIERRE RESTANTES
document.getElementById('close-modal-transfer').onclick = () => document.getElementById('modal-transfer').classList.add('hidden');

// MODO OSCURO / CLARO Y LOGO SWAP
document.getElementById('btn-theme-toggle').onclick = () => {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  document.getElementById('app-logo').src = isLight ? "https://i.imgur.com/UEvIK9K.png" : "https://i.imgur.com/qdIS9iU.png";
};

// INICIALIZACIÓN
renderWarehouses();
