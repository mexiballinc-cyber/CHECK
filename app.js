// ESTADO GLOBAL CON ESTRUCTURA BLINDADA
let state = {
  warehouses: [],
  stores: [],
  sales: []
};

// CARGAR DATOS SIN PÉRDIDA
function loadState() {
  const saved = localStorage.getItem('check_app_data_v2');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state = {
        warehouses: parsed.warehouses || [],
        stores: parsed.stores || [],
        sales: parsed.sales || []
      };
    } catch (e) {
      console.error("Error al leer localStorage", e);
    }
  }
}

// GUARDADO AUTOMÁTICO INMEDIATO
function saveState() {
  localStorage.setItem('check_app_data_v2', JSON.stringify(state));
}

// CONVERTIR IMÁGENES A BASE64
function fileToBase64(file) {
  return new Promise((resolve) => {
    if (!file) resolve(null);
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

// CONTROL DE PESTAÑAS (TABS)
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

let activeWarehouseId = null;
let activeStoreId = null;
let activeProductId = null;

// GESTIÓN DE ALMACENES
function renderWarehouses() {
  const container = document.getElementById('warehouses-grid');
  container.innerHTML = state.warehouses.length === 0
    ? `<p style="grid-column: span 2; opacity:0.6;">No tienes almacenes creados.</p>`
    : state.warehouses.map(w => `
        <div class="item-card glass-card" onclick="openWarehouse('${w.id}')">
          <div class="card-top-actions">
            <button class="btn-mini-action" onclick="event.stopPropagation(); editWarehouse('${w.id}')">✏️</button>
            <button class="btn-mini-action" onclick="event.stopPropagation(); deleteWarehouse('${w.id}')">🗑️</button>
          </div>
          <div style="font-size:2.2rem; text-align:center; margin: 12px 0;">📦</div>
          <h4>${w.name}</h4>
          <span class="subtext">${(w.categories || []).length} Categorías</span>
        </div>
      `).join('');
}

function openWarehouse(id) {
  activeWarehouseId = id;
  const w = state.warehouses.find(item => item.id === id);
  if (!w) return;
  if (!w.categories) w.categories = [];
  if (!w.products) w.products = [];

  document.getElementById('detail-warehouse-title').textContent = w.name;
  document.getElementById('view-warehouses').classList.add('hidden');
  document.getElementById('view-warehouse-detail').classList.remove('hidden');
  renderWarehouseProducts();
}

window.editWarehouse = function(id) {
  const w = state.warehouses.find(item => item.id === id);
  document.getElementById('modal-warehouse-title').textContent = "Editar Almacén";
  document.getElementById('warehouse-id-edit').value = w.id;
  document.getElementById('warehouse-name').value = w.name;
  document.getElementById('modal-warehouse').classList.remove('hidden');
};

window.deleteWarehouse = function(id) {
  if (confirm("¿Estás seguro de eliminar este almacén y sus productos?")) {
    state.warehouses = state.warehouses.filter(w => w.id !== id);
    saveState();
    renderWarehouses();
  }
};

document.getElementById('btn-back-to-warehouses').onclick = () => {
  document.getElementById('view-warehouse-detail').classList.add('hidden');
  document.getElementById('view-warehouses').classList.remove('hidden');
  renderWarehouses();
};

// CATEGORÍAS Y PRODUCTOS EN ALMACÉN
function renderWarehouseProducts() {
  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  const container = document.getElementById('categories-products-container');
  container.innerHTML = "";

  if (!w || !w.categories || w.categories.length === 0) {
    container.innerHTML = `<p style="opacity:0.6;">Crea una categoría primero para organizar tus productos.</p>`;
    return;
  }

  w.categories.forEach(cat => {
    const products = (w.products || []).filter(p => p.categoryId === cat.id);
    let catHTML = `
      <div class="category-block">
        <div class="category-header">
          <h3>${cat.name}</h3>
          <div class="category-actions">
            <button class="btn-icon-action" onclick="editCategory('${cat.id}', '${cat.name}')">✏️</button>
            <button class="btn-icon-action" onclick="deleteCategory('${cat.id}')">🗑️</button>
          </div>
        </div>
        <div class="cards-grid">
    `;

    if (products.length === 0) {
      catHTML += `<p style="opacity:0.5; font-size:0.8rem; grid-column: span 2;">Sin productos en esta categoría.</p>`;
    } else {
      products.forEach(p => {
        catHTML += `
          <div class="item-card glass-card" onclick="openProductSheet('${p.id}')">
            <img src="${p.image || 'https://via.placeholder.com/100?text=Sin+Foto'}">
            <h4>${p.name}</h4>
            <span class="subtext">Stock: <strong>${p.stock}</strong></span>
            <span class="subtext" style="color:#22c55e; font-weight:bold;">$${parseFloat(p.sellPrice).toFixed(2)}</span>
          </div>
        `;
      });
    }
    catHTML += `</div></div>`;
    container.innerHTML += catHTML;
  });
}

window.editCategory = function(catId, catName) {
  document.getElementById('modal-category-title').textContent = "Editar Categoría";
  document.getElementById('cat-id-edit').value = catId;
  document.getElementById('category-name').value = catName;
  document.getElementById('modal-category').classList.remove('hidden');
};

window.deleteCategory = function(catId) {
  if (confirm("¿Eliminar categoría?")) {
    const w = state.warehouses.find(item => item.id === activeWarehouseId);
    w.categories = w.categories.filter(c => c.id !== catId);
    saveState();
    renderWarehouseProducts();
  }
};

// BOTTOM SHEET DE OPCIONES
const sheet = document.getElementById('bottom-sheet');

function openProductSheet(prodId) {
  activeProductId = prodId;
  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  const p = w.products.find(item => item.id === prodId);

  document.getElementById('sheet-prod-info').innerHTML = `
    <h3 style="margin-bottom:4px;">${p.name}</h3>
    <p style="font-size:0.85rem; opacity:0.8;">Stock en almacén: <strong>${p.stock} pzas</strong></p>
  `;
  sheet.classList.remove('hidden');
}

document.getElementById('close-sheet').onclick = () => sheet.classList.add('hidden');

document.getElementById('sheet-btn-edit').onclick = () => {
  sheet.classList.add('hidden');
  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  const p = w.products.find(item => item.id === activeProductId);

  document.getElementById('modal-product-title').textContent = "Editar Producto";
  document.getElementById('prod-id-edit').value = p.id;
  document.getElementById('prod-name').value = p.name;
  document.getElementById('prod-buy-price').value = p.buyPrice;
  document.getElementById('prod-sell-price').value = p.sellPrice;
  document.getElementById('prod-stock').value = p.stock;

  const catSelect = document.getElementById('prod-category-select');
  catSelect.innerHTML = w.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  catSelect.value = p.categoryId;

  document.getElementById('modal-product').classList.remove('hidden');
};

document.getElementById('sheet-btn-delete').onclick = () => {
  sheet.classList.add('hidden');
  if (confirm("¿Eliminar este producto?")) {
    const w = state.warehouses.find(item => item.id === activeWarehouseId);
    w.products = w.products.filter(p => p.id !== activeProductId);
    saveState();
    renderWarehouseProducts();
  }
};

document.getElementById('sheet-btn-add-stock').onclick = () => {
  sheet.classList.add('hidden');
  const addQty = prompt("¿Cuántas piezas deseas añadir?");
  if (addQty && !isNaN(addQty) && parseInt(addQty) > 0) {
    const w = state.warehouses.find(item => item.id === activeWarehouseId);
    const p = w.products.find(item => item.id === activeProductId);
    p.stock += parseInt(addQty);
    saveState();
    renderWarehouseProducts();
  }
};

// MODAL CHECK: ENVIAR PRODUCTO A TIENDA
document.getElementById('sheet-btn-check').onclick = () => {
  sheet.classList.add('hidden');
  if (state.stores.length === 0) {
    alert("Primero debes crear una tienda.");
    return;
  }
  const storeSelect = document.getElementById('transfer-store-select');
  storeSelect.innerHTML = state.stores.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  document.getElementById('modal-transfer').classList.remove('hidden');
};

document.getElementById('form-transfer').onsubmit = (e) => {
  e.preventDefault();
  const targetStoreId = document.getElementById('transfer-store-select').value;
  const qty = parseInt(document.getElementById('transfer-qty').value);

  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  const p = w.products.find(item => item.id === activeProductId);

  if (qty > p.stock) {
    alert("No tienes suficiente stock disponible.");
    return;
  }

  p.stock -= qty;

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
  document.getElementById('form-transfer').reset();
  renderWarehouseProducts();
};

// TIENDAS Y VENTAS EN TIEMPO REAL
function renderStores() {
  const container = document.getElementById('stores-grid');
  container.innerHTML = state.stores.length === 0
    ? `<p style="grid-column: span 2; opacity:0.6;">No tienes tiendas creadas.</p>`
    : state.stores.map(s => `
        <div class="item-card glass-card" onclick="openStore('${s.id}')">
          <div class="card-top-actions">
            <button class="btn-mini-action" onclick="event.stopPropagation(); editStore('${s.id}')">✏️</button>
            <button class="btn-mini-action" onclick="event.stopPropagation(); deleteStore('${s.id}')">🗑️</button>
          </div>
          <img src="${s.image || 'https://via.placeholder.com/100?text=Tienda'}">
          <h4>${s.name}</h4>
          <span class="subtext">${(s.products || []).length} Productos en exhibición</span>
        </div>
      `).join('');
}

function openStore(id) {
  activeStoreId = id;
  const store = state.stores.find(s => s.id === id);
  if (!store) return;
  if (!store.products) store.products = [];

  document.getElementById('detail-store-title').textContent = store.name;
  document.getElementById('view-stores').classList.add('hidden');
  document.getElementById('view-store-detail').classList.remove('hidden');
  renderStoreProducts();
}

window.editStore = function(id) {
  const s = state.stores.find(item => item.id === id);
  document.getElementById('modal-store-title').textContent = "Editar Tienda";
  document.getElementById('store-id-edit').value = s.id;
  document.getElementById('store-name').value = s.name;
  document.getElementById('modal-store').classList.remove('hidden');
};

window.deleteStore = function(id) {
  if (confirm("¿Estás seguro de eliminar esta tienda?")) {
    state.stores = state.stores.filter(s => s.id !== id);
    saveState();
    renderStores();
  }
};

document.getElementById('btn-back-to-stores').onclick = () => {
  document.getElementById('view-store-detail').classList.add('hidden');
  document.getElementById('view-stores').classList.remove('hidden');
  renderStores();
};

function renderStoreProducts() {
  const store = state.stores.find(s => s.id === activeStoreId);
  const container = document.getElementById('store-products-container');
  container.innerHTML = "";

  if (!store || !store.products || store.products.length === 0) {
    container.innerHTML = `<p style="opacity:0.6; grid-column: span 2;">Sin productos para vender. Manda algunos desde un almacén usando la opción Check.</p>`;
    return;
  }

  store.products.forEach(p => {
    container.innerHTML += `
      <div class="item-card glass-card">
        <img src="${p.image || 'https://via.placeholder.com/100?text=Sin+Foto'}">
        <h4>${p.name}</h4>
        <span class="subtext">Disponible: <strong>${p.stock}</strong></span>
        <span class="subtext" style="color:#22c55e; font-weight:bold;">$${parseFloat(p.sellPrice).toFixed(2)}</span>
        <button class="btn-primary" onclick="sellProduct('${p.id}')" style="margin-top:8px; font-size:0.8rem;">
          ✓ Vender 1
        </button>
      </div>
    `;
  });
}

// REGISTRAR VENTA
window.sellProduct = function(prodId) {
  const store = state.stores.find(s => s.id === activeStoreId);
  const p = store.products.find(item => item.id === prodId);

  if (!p || p.stock <= 0) return alert("Producto agotado en tienda.");

  p.stock -= 1;
  const profit = parseFloat(p.sellPrice) - parseFloat(p.buyPrice);

  state.sales.push({
    productName: p.name,
    sellPrice: parseFloat(p.sellPrice),
    profit: profit,
    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString()
  });

  saveState();
  renderStoreProducts();
};

// REPORTES Y UTILIDADES
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
        <div style="background:var(--glass-bg); border:1px solid var(--glass-border); padding:12px; border-radius:12px; margin-top:8px; display:flex; justify-content:space-between; backdrop-filter:blur(8px);">
          <div>
            <strong>${s.productName}</strong>
            <div style="font-size:0.75rem; opacity:0.7;">${s.date}</div>
          </div>
          <div style="text-align:right;">
            <div>$${s.sellPrice.toFixed(2)}</div>
            <div style="color:#22c55e; font-size:0.8rem; font-weight:bold;">+$${s.profit.toFixed(2)}</div>
          </div>
        </div>
      `).join('');
}

// EVENTOS DE CREACIÓN DE MODALES Y FORMULARIOS
document.getElementById('btn-open-create-warehouse').onclick = () => {
  document.getElementById('modal-warehouse-title').textContent = "Crear Almacén";
  document.getElementById('warehouse-id-edit').value = "";
  document.getElementById('form-warehouse').reset();
  document.getElementById('modal-warehouse').classList.remove('hidden');
};
document.getElementById('close-modal-warehouse').onclick = () => document.getElementById('modal-warehouse').classList.add('hidden');

document.getElementById('form-warehouse').onsubmit = (e) => {
  e.preventDefault();
  const idEdit = document.getElementById('warehouse-id-edit').value;
  const name = document.getElementById('warehouse-name').value;

  if (idEdit) {
    const w = state.warehouses.find(item => item.id === idEdit);
    if (w) w.name = name;
  } else {
    state.warehouses.push({ id: Date.now().toString(), name, categories: [], products: [] });
  }

  saveState();
  document.getElementById('modal-warehouse').classList.add('hidden');
  document.getElementById('form-warehouse').reset();
  renderWarehouses();
};

document.getElementById('btn-open-create-category').onclick = () => {
  document.getElementById('modal-category-title').textContent = "Crear Categoría";
  document.getElementById('cat-id-edit').value = "";
  document.getElementById('form-category').reset();
  document.getElementById('modal-category').classList.remove('hidden');
};
document.getElementById('close-modal-category').onclick = () => document.getElementById('modal-category').classList.add('hidden');

document.getElementById('form-category').onsubmit = (e) => {
  e.preventDefault();
  const catIdEdit = document.getElementById('cat-id-edit').value;
  const catName = document.getElementById('category-name').value;
  const w = state.warehouses.find(item => item.id === activeWarehouseId);

  if (catIdEdit) {
    const c = w.categories.find(item => item.id === catIdEdit);
    if (c) c.name = catName;
  } else {
    w.categories.push({ id: Date.now().toString(), name: catName });
  }

  saveState();
  document.getElementById('modal-category').classList.add('hidden');
  document.getElementById('form-category').reset();
  renderWarehouseProducts();
};

document.getElementById('btn-open-create-product').onclick = () => {
  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  if (!w.categories || w.categories.length === 0) {
    alert("Debes crear al menos una categoría primero.");
    return;
  }
  document.getElementById('modal-product-title').textContent = "Agregar Producto";
  document.getElementById('prod-id-edit').value = "";
  document.getElementById('form-product').reset();

  const catSelect = document.getElementById('prod-category-select');
  catSelect.innerHTML = w.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  document.getElementById('modal-product').classList.remove('hidden');
};
document.getElementById('close-modal-product').onclick = () => document.getElementById('modal-product').classList.add('hidden');

document.getElementById('form-product').onsubmit = async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('prod-image-file');
  const imageBase64 = fileInput.files[0] ? await fileToBase64(fileInput.files[0]) : null;

  const editId = document.getElementById('prod-id-edit').value;
  const w = state.warehouses.find(item => item.id === activeWarehouseId);

  if (editId) {
    const p = w.products.find(item => item.id === editId);
    p.name = document.getElementById('prod-name').value;
    p.buyPrice = parseFloat(document.getElementById('prod-buy-price').value);
    p.sellPrice = parseFloat(document.getElementById('prod-sell-price').value);
    p.stock = parseInt(document.getElementById('prod-stock').value);
    p.categoryId = document.getElementById('prod-category-select').value;
    if (imageBase64) p.image = imageBase64;
  } else {
    w.products.push({
      id: Date.now().toString(),
      name: document.getElementById('prod-name').value,
      buyPrice: parseFloat(document.getElementById('prod-buy-price').value),
      sellPrice: parseFloat(document.getElementById('prod-sell-price').value),
      stock: parseInt(document.getElementById('prod-stock').value),
      categoryId: document.getElementById('prod-category-select').value,
      image: imageBase64
    });
  }

  saveState();
  document.getElementById('modal-product').classList.add('hidden');
  document.getElementById('form-product').reset();
  renderWarehouseProducts();
};

document.getElementById('btn-open-create-store').onclick = () => {
  document.getElementById('modal-store-title').textContent = "Crear Tienda";
  document.getElementById('store-id-edit').value = "";
  document.getElementById('form-store').reset();
  document.getElementById('modal-store').classList.remove('hidden');
};
document.getElementById('close-modal-store').onclick = () => document.getElementById('modal-store').classList.add('hidden');

document.getElementById('form-store').onsubmit = async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('store-image-file');
  const imageBase64 = fileInput.files[0] ? await fileToBase64(fileInput.files[0]) : null;
  const editId = document.getElementById('store-id-edit').value;

  if (editId) {
    const s = state.stores.find(item => item.id === editId);
    s.name = document.getElementById('store-name').value;
    if (imageBase64) s.image = imageBase64;
  } else {
    state.stores.push({
      id: Date.now().toString(),
      name: document.getElementById('store-name').value,
      image: imageBase64,
      products: []
    });
  }

  saveState();
  document.getElementById('modal-store').classList.add('hidden');
  document.getElementById('form-store').reset();
  renderStores();
};

document.getElementById('close-modal-transfer').onclick = () => document.getElementById('modal-transfer').classList.add('hidden');

// MODO OSCURO
document.getElementById('btn-theme-toggle').onclick = () => {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  document.getElementById('app-logo').src = isLight ? "https://i.imgur.com/UEvIK9K.png" : "https://i.imgur.com/qdIS9iU.png";
};

// INICIALIZACIÓN
loadState();
renderWarehouses();
