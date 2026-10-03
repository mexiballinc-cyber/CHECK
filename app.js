// ESTADO GLOBAL
let state = {
  warehouses: [],
  stores: [],
  sales: []
};

// TRADUCCIONES COMPLETAS
let currentLang = localStorage.getItem('check_lang') || 'es';

const translations = {
  es: {
    warehousesTab: "Almacenes",
    storesTab: "Tiendas",
    metricsTab: "Utilidades",
    myWarehouses: "Mis Almacenes",
    myStores: "Mis Tiendas",
    salesReport: "Reporte de Ventas y Utilidades",
    
    addWarehouse: "+ Almacén",
    addStore: "+ Tienda",
    addCategory: "+ Categoría",
    addProduct: "+ Producto",
    backToWarehouses: "← Volver a almacenes",
    backToStores: "← Volver a tiendas",
    sellOne: "✓ Vender 1",
    
    productsInDisplay: "Productos en exhibición",
    categoriesCount: "Categorías",
    noWarehouses: "No tienes almacenes creados.",
    noStores: "No tienes tiendas creadas.",
    noCategories: "Crea una categoría primero para organizar tus productos.",
    noProductsInCat: "Sin productos en esta categoría.",
    noProductsInStore: "Sin productos para vender. Manda algunos desde un almacén usando la opción Check.",
    stock: "Stock",
    available: "Disponible",
    stockInWarehouse: "Stock en almacén",
    pieces: "pzas",
    
    filterDates: "📅 Filtrar por Fechas",
    from: "Desde:",
    to: "Hasta:",
    filterBtn: "🔍 Filtrar",
    seeAll: "Ver Todo",
    totalSales: "Venta Total",
    realProfit: "Utilidad Real",
    salesHistory: "Historial de Ventas",
    noSalesPeriod: "No hay ventas registradas en este periodo.",
    
    addEmailTitle: "Añadir Correo",
    addEmailSub: "Ingresa tu correo para continuar.",
    saveBtn: "Añadir",
    save: "Guardar",
    cancel: "Cancelar",
    
    editProduct: "✏️ Editar Producto",
    addStock: "➕ Añadir Stock",
    checkSend: "✓ Check (Mandar a Tienda)",
    deleteProduct: "🗑️ Eliminar Producto",
    
    createWarehouse: "Crear Almacén",
    editWarehouse: "Editar Almacén",
    createCategory: "Crear Categoría",
    editCategory: "Editar Categoría",
    createStore: "Crear Tienda",
    editStore: "Editar Tienda",
    createProductTitle: "Agregar Producto",
    editProductTitle: "Editar Producto",
    moveToStore: "Mover a Tienda (Check)",
    selectTargetStore: "Selecciona la Tienda Destino:",
    galleryPhoto: "Foto desde Galería:",
    confirmShipment: "Confirmar Envío",
    
    phWarehouseName: "Nombre del Almacén",
    phCategoryName: "Nombre de Categoría",
    phStoreName: "Nombre de la Tienda",
    phProductName: "Nombre del producto",
    phBuyPrice: "Precio Compra ($)",
    phSellPrice: "Precio Venta ($)",
    phInitialStock: "Cantidad Inicial",
    phQtyToSend: "Cantidad a enviar",
    phEmail: "ejemplo@correo.com",
    
    confirmDeleteWarehouse: "¿Estás seguro de eliminar este almacén y sus productos?",
    confirmDeleteCategory: "¿Eliminar categoría?",
    confirmDeleteProduct: "¿Eliminar este producto?",
    confirmDeleteStore: "¿Estás seguro de eliminar esta tienda?",
    promptAddStock: "¿Cuántas piezas deseas añadir?",
    alertNoStore: "Primero debes crear una tienda.",
    alertNotEnoughStock: "No tienes suficiente stock disponible.",
    alertSoldOut: "Producto agotado en tienda."
  },
  en: {
    warehousesTab: "Warehouses",
    storesTab: "Stores",
    metricsTab: "Metrics",
    myWarehouses: "My Warehouses",
    myStores: "My Stores",
    salesReport: "Sales & Profit Report",
    
    addWarehouse: "+ Warehouse",
    addStore: "+ Store",
    addCategory: "+ Category",
    addProduct: "+ Product",
    backToWarehouses: "← Back to warehouses",
    backToStores: "← Back to stores",
    sellOne: "✓ Sell 1",
    
    productsInDisplay: "Products on display",
    categoriesCount: "Categories",
    noWarehouses: "No warehouses created.",
    noStores: "No stores created.",
    noCategories: "Create a category first to organize your products.",
    noProductsInCat: "No products in this category.",
    noProductsInStore: "No products to sell. Send some from a warehouse using the Check option.",
    stock: "Stock",
    available: "Available",
    stockInWarehouse: "Warehouse stock",
    pieces: "pcs",
    
    filterDates: "📅 Filter by Dates",
    from: "From:",
    to: "To:",
    filterBtn: "🔍 Filter",
    seeAll: "View All",
    totalSales: "Total Sales",
    realProfit: "Net Profit",
    salesHistory: "Sales History",
    noSalesPeriod: "No sales recorded in this period.",
    
    addEmailTitle: "Add Email",
    addEmailSub: "Enter your email to continue.",
    saveBtn: "Add",
    save: "Save",
    cancel: "Cancel",
    
    editProduct: "✏️ Edit Product",
    addStock: "➕ Add Stock",
    checkSend: "✓ Check (Send to Store)",
    deleteProduct: "🗑️ Delete Product",
    
    createWarehouse: "Create Warehouse",
    editWarehouse: "Edit Warehouse",
    createCategory: "Create Category",
    editCategory: "Edit Category",
    createStore: "Create Store",
    editStore: "Edit Store",
    createProductTitle: "Add Product",
    editProductTitle: "Edit Product",
    moveToStore: "Move to Store (Check)",
    selectTargetStore: "Select Destination Store:",
    galleryPhoto: "Photo from Gallery:",
    confirmShipment: "Confirm Shipment",
    
    phWarehouseName: "Warehouse Name",
    phCategoryName: "Category Name",
    phStoreName: "Store Name",
    phProductName: "Product Name",
    phBuyPrice: "Buy Price ($)",
    phSellPrice: "Sell Price ($)",
    phInitialStock: "Initial Quantity",
    phQtyToSend: "Quantity to send",
    phEmail: "example@email.com",
    
    confirmDeleteWarehouse: "Are you sure you want to delete this warehouse and its products?",
    confirmDeleteCategory: "Delete category?",
    confirmDeleteProduct: "Delete this product?",
    confirmDeleteStore: "Are you sure you want to delete this store?",
    promptAddStock: "How many pieces do you want to add?",
    alertNoStore: "You must create a store first.",
    alertNotEnoughStock: "You do not have enough available stock.",
    alertSoldOut: "Product sold out in store."
  }
};

function updateLanguageUI() {
  const t = translations[currentLang];

  // NAVEGACIÓN Y TÍTULOS
  document.getElementById('tab-btn-warehouses').textContent = t.warehousesTab;
  document.getElementById('tab-btn-stores').textContent = t.storesTab;
  document.getElementById('tab-btn-metrics').textContent = t.metricsTab;

  document.getElementById('txt-title-warehouses').textContent = t.myWarehouses;
  document.getElementById('txt-title-stores').textContent = t.myStores;
  document.getElementById('txt-title-metrics').textContent = t.salesReport;

  document.getElementById('btn-open-create-warehouse').textContent = t.addWarehouse;
  document.getElementById('btn-open-create-store').textContent = t.addStore;
  document.getElementById('btn-open-create-category').textContent = t.addCategory;
  document.getElementById('btn-open-create-product').textContent = t.addProduct;

  document.getElementById('btn-back-to-warehouses').textContent = t.backToWarehouses;
  document.getElementById('btn-back-to-stores').textContent = t.backToStores;

  // FILTROS Y MÉTRICAS
  document.getElementById('txt-filter-title').textContent = t.filterDates;
  document.getElementById('txt-filter-from').textContent = t.from;
  document.getElementById('txt-filter-to').textContent = t.to;
  document.getElementById('btn-apply-date-filter').textContent = t.filterBtn;
  document.getElementById('btn-clear-date-filter').textContent = t.seeAll;

  document.getElementById('txt-total-sales').textContent = t.totalSales;
  document.getElementById('txt-total-profit').textContent = t.realProfit;
  document.getElementById('txt-sales-history').textContent = t.salesHistory;

  // LOGIN CORREO
  document.getElementById('txt-email-title').textContent = t.addEmailTitle;
  document.getElementById('txt-email-subtitle').textContent = t.addEmailSub;
  document.getElementById('btn-save-email').textContent = t.saveBtn;
  document.getElementById('input-user-email').placeholder = t.phEmail;

  // BOTTOM SHEET Y MODALES
  document.getElementById('sheet-btn-edit').textContent = t.editProduct;
  document.getElementById('sheet-btn-add-stock').textContent = t.addStock;
  document.getElementById('sheet-btn-check').textContent = t.checkSend;
  document.getElementById('sheet-btn-delete').textContent = t.deleteProduct;
  document.getElementById('close-sheet').textContent = t.cancel;

  document.getElementById('txt-transfer-title').textContent = t.moveToStore;
  document.getElementById('txt-transfer-select-label').textContent = t.selectTargetStore;
  document.getElementById('btn-confirm-transfer').textContent = t.confirmShipment;
  document.getElementById('transfer-qty').placeholder = t.phQtyToSend;

  document.getElementById('txt-label-prod-img').textContent = t.galleryPhoto;
  document.getElementById('txt-label-store-img').textContent = t.galleryPhoto;

  document.getElementById('btn-save-warehouse').textContent = t.save;
  document.getElementById('btn-save-category').textContent = t.save;
  document.getElementById('btn-save-product').textContent = t.save;
  document.getElementById('btn-save-store').textContent = t.save;

  document.getElementById('warehouse-name').placeholder = t.phWarehouseName;
  document.getElementById('category-name').placeholder = t.phCategoryName;
  document.getElementById('store-name').placeholder = t.phStoreName;
  document.getElementById('prod-name').placeholder = t.phProductName;
  document.getElementById('prod-buy-price').placeholder = t.phBuyPrice;
  document.getElementById('prod-sell-price').placeholder = t.phSellPrice;
  document.getElementById('prod-stock').placeholder = t.phInitialStock;
}

// CONTROL DE SELECCIÓN DE IDIOMA CON MODAL
document.getElementById('btn-lang-toggle').onclick = () => {
  document.getElementById('modal-language').classList.remove('hidden');
};
document.getElementById('close-modal-lang').onclick = () => {
  document.getElementById('modal-language').classList.add('hidden');
};

document.getElementById('btn-lang-es').onclick = () => setLanguage('es');
document.getElementById('btn-lang-en').onclick = () => setLanguage('en');

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('check_lang', currentLang);
  document.getElementById('modal-language').classList.add('hidden');
  updateLanguageUI();
  
  // Re-renderizar la vista activa inmediatamente
  if (!document.getElementById('view-warehouses').classList.contains('hidden')) renderWarehouses();
  if (!document.getElementById('view-warehouse-detail').classList.contains('hidden')) renderWarehouseProducts();
  if (!document.getElementById('view-stores').classList.contains('hidden')) renderStores();
  if (!document.getElementById('view-store-detail').classList.contains('hidden')) renderStoreProducts();
  if (!document.getElementById('view-metrics').classList.contains('hidden')) renderMetrics();
}

// COMPROBACIÓN DEL CORREO AL INICIAR
function checkUserEmail() {
  const savedEmail = localStorage.getItem('check_user_email');
  const screen = document.getElementById('email-setup-screen');

  if (!savedEmail) {
    screen.classList.remove('hidden');
  } else {
    screen.classList.add('hidden');
  }
}

document.getElementById('form-email-setup').onsubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('input-user-email').value.trim().toLowerCase();

  if (email) {
    localStorage.setItem('check_user_email', email);

    if (window.db && window.setDoc && window.doc) {
      window.setDoc(window.doc(window.db, "user_keys", email), {
        email: email,
        createdAt: new Date().toISOString()
      }).catch(err => console.log("Guardado local registrado, Firestore diferido:", err));
    }

    document.getElementById('email-setup-screen').classList.add('hidden');
  }
};

// BASE DE DATOS INDEXEDDB
let db;
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CheckAppDB', 1);
    request.onupgradeneeded = (e) => {
      db = e.target.result;
      if (!db.objectStoreNames.contains('appState')) {
        db.createObjectStore('appState');
      }
    };
    request.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };
    request.onerror = (e) => reject(e);
  });
}

async function loadState() {
  await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction('appState', 'readonly');
    const store = tx.objectStore('appState');
    const request = store.get('main_data');

    request.onsuccess = () => {
      if (request.result) {
        state = {
          warehouses: request.result.warehouses || [],
          stores: request.result.stores || [],
          sales: request.result.sales || []
        };
      }
      resolve();
    };
    request.onerror = () => resolve();
  });
}

function saveState() {
  if (!db) return;
  try {
    const tx = db.transaction('appState', 'readwrite');
    const store = tx.objectStore('appState');
    store.put(state, 'main_data');
  } catch (e) {
    console.error("Error guardando en IndexedDB:", e);
  }
}

function processImage(file) {
  return new Promise((resolve) => {
    if (!file) return resolve(null);
    const timer = setTimeout(() => resolve(null), 500);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        clearTimeout(timer);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxDim = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.4));
      };
      img.onerror = () => { clearTimeout(timer); resolve(null); };
      img.src = e.target.result;
    };
    reader.onerror = () => { clearTimeout(timer); resolve(null); };
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
  const t = translations[currentLang];
  const container = document.getElementById('warehouses-grid');
  container.innerHTML = state.warehouses.length === 0
    ? `<p style="grid-column: span 2; opacity:0.6;">${t.noWarehouses}</p>`
    : state.warehouses.map(w => `
        <div class="item-card glass-card" onclick="openWarehouse('${w.id}')">
          <div class="card-top-actions">
            <button class="btn-mini-action" onclick="event.stopPropagation(); editWarehouse('${w.id}')">✏️</button>
            <button class="btn-mini-action" onclick="event.stopPropagation(); deleteWarehouse('${w.id}')">🗑️</button>
          </div>
          <div style="font-size:2.2rem; text-align:center; margin: 12px 0;">📦</div>
          <h4>${w.name}</h4>
          <span class="subtext">${(w.categories || []).length} ${t.categoriesCount}</span>
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
  const t = translations[currentLang];
  const w = state.warehouses.find(item => item.id === id);
  document.getElementById('modal-warehouse-title').textContent = t.editWarehouse;
  document.getElementById('warehouse-id-edit').value = w.id;
  document.getElementById('warehouse-name').value = w.name;
  document.getElementById('modal-warehouse').classList.remove('hidden');
};

window.deleteWarehouse = function(id) {
  const t = translations[currentLang];
  if (confirm(t.confirmDeleteWarehouse)) {
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
  const t = translations[currentLang];
  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  const container = document.getElementById('categories-products-container');
  container.innerHTML = "";

  if (!w || !w.categories || w.categories.length === 0) {
    container.innerHTML = `<p style="opacity:0.6;">${t.noCategories}</p>`;
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
            <button class="btn-icon-action" onclick="deleteCategory('${cat.id}')">🗑</button>
          </div>
        </div>
        <div class="cards-grid">
    `;

    if (products.length === 0) {
      catHTML += `<p style="opacity:0.5; font-size:0.8rem; grid-column: span 2;">${t.noProductsInCat}</p>`;
    } else {
      products.forEach(p => {
        catHTML += `
          <div class="item-card glass-card" onclick="openProductSheet('${p.id}')">
            <img src="${p.image || 'https://via.placeholder.com/100?text=Sin+Foto'}">
            <h4>${p.name}</h4>
            <span class="subtext">${t.stock}: <strong>${p.stock}</strong></span>
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
  const t = translations[currentLang];
  document.getElementById('modal-category-title').textContent = t.editCategory;
  document.getElementById('cat-id-edit').value = catId;
  document.getElementById('category-name').value = catName;
  document.getElementById('modal-category').classList.remove('hidden');
};

window.deleteCategory = function(catId) {
  const t = translations[currentLang];
  if (confirm(t.confirmDeleteCategory)) {
    const w = state.warehouses.find(item => item.id === activeWarehouseId);
    w.categories = w.categories.filter(c => c.id !== catId);
    saveState();
    renderWarehouseProducts();
  }
};

// BOTTOM SHEET DE OPCIONES
const sheet = document.getElementById('bottom-sheet');

function openProductSheet(prodId) {
  const t = translations[currentLang];
  activeProductId = prodId;
  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  const p = w.products.find(item => item.id === prodId);

  document.getElementById('sheet-prod-info').innerHTML = `
    <h3 style="margin-bottom:4px;">${p.name}</h3>
    <p style="font-size:0.85rem; opacity:0.8;">${t.stockInWarehouse}: <strong>${p.stock} ${t.pieces}</strong></p>
  `;
  sheet.classList.remove('hidden');
}

document.getElementById('close-sheet').onclick = () => sheet.classList.add('hidden');

document.getElementById('sheet-btn-edit').onclick = () => {
  const t = translations[currentLang];
  sheet.classList.add('hidden');
  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  const p = w.products.find(item => item.id === activeProductId);

  document.getElementById('modal-product-title').textContent = t.editProductTitle;
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
  const t = translations[currentLang];
  sheet.classList.add('hidden');
  if (confirm(t.confirmDeleteProduct)) {
    const w = state.warehouses.find(item => item.id === activeWarehouseId);
    w.products = w.products.filter(p => p.id !== activeProductId);
    saveState();
    renderWarehouseProducts();
  }
};

document.getElementById('sheet-btn-add-stock').onclick = () => {
  const t = translations[currentLang];
  sheet.classList.add('hidden');
  const addQty = prompt(t.promptAddStock);
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
  const t = translations[currentLang];
  sheet.classList.add('hidden');
  if (state.stores.length === 0) {
    alert(t.alertNoStore);
    return;
  }
  const storeSelect = document.getElementById('transfer-store-select');
  storeSelect.innerHTML = state.stores.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  document.getElementById('modal-transfer').classList.remove('hidden');
};

document.getElementById('form-transfer').onsubmit = (e) => {
  e.preventDefault();
  const t = translations[currentLang];
  const targetStoreId = document.getElementById('transfer-store-select').value;
  const qty = parseInt(document.getElementById('transfer-qty').value);

  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  const p = w.products.find(item => item.id === activeProductId);

  if (qty > p.stock) {
    alert(t.alertNotEnoughStock);
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

// TIENDAS Y VENTAS
function renderStores() {
  const t = translations[currentLang];
  const container = document.getElementById('stores-grid');
  container.innerHTML = state.stores.length === 0
    ? `<p style="grid-column: span 2; opacity:0.6;">${t.noStores}</p>`
    : state.stores.map(s => `
        <div class="item-card glass-card" onclick="openStore('${s.id}')">
          <div class="card-top-actions">
            <button class="btn-mini-action" onclick="event.stopPropagation(); editStore('${s.id}')">✏️</button>
            <button class="btn-mini-action" onclick="event.stopPropagation(); deleteStore('${s.id}')">🗑️</button>
          </div>
          <img src="${s.image || 'https://via.placeholder.com/100?text=Tienda'}">
          <h4>${s.name}</h4>
          <span class="subtext">${(s.products || []).length} ${t.productsInDisplay}</span>
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
  const t = translations[currentLang];
  const s = state.stores.find(item => item.id === id);
  document.getElementById('modal-store-title').textContent = t.editStore;
  document.getElementById('store-id-edit').value = s.id;
  document.getElementById('store-name').value = s.name;
  document.getElementById('modal-store').classList.remove('hidden');
};

window.deleteStore = function(id) {
  const t = translations[currentLang];
  if (confirm(t.confirmDeleteStore)) {
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
  const t = translations[currentLang];
  const store = state.stores.find(s => s.id === activeStoreId);
  const container = document.getElementById('store-products-container');
  container.innerHTML = "";

  if (!store || !store.products || store.products.length === 0) {
    container.innerHTML = `<p style="opacity:0.6; grid-column: span 2;">${t.noProductsInStore}</p>`;
    return;
  }

  store.products.forEach(p => {
    container.innerHTML += `
      <div class="item-card glass-card">
        <img src="${p.image || 'https://via.placeholder.com/100?text=Sin+Foto'}">
        <h4>${p.name}</h4>
        <span class="subtext">${t.available}: <strong>${p.stock}</strong></span>
        <span class="subtext" style="color:#22c55e; font-weight:bold;">$${parseFloat(p.sellPrice).toFixed(2)}</span>
        <button class="btn-primary" onclick="sellProduct('${p.id}')" style="margin-top:8px; font-size:0.8rem;">
          ${t.sellOne}
        </button>
      </div>
    `;
  });
}

// REGISTRAR VENTA
window.sellProduct = function(prodId) {
  const t = translations[currentLang];
  const store = state.stores.find(s => s.id === activeStoreId);
  const p = store.products.find(item => item.id === prodId);

  if (!p || p.stock <= 0) return alert(t.alertSoldOut);

  p.stock -= 1;
  const profit = parseFloat(p.sellPrice) - parseFloat(p.buyPrice);

  const now = new Date();
  const isoDate = now.toISOString().split('T')[0];

  state.sales.push({
    productName: p.name,
    sellPrice: parseFloat(p.sellPrice),
    profit: profit,
    rawDate: isoDate,
    date: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + now.toLocaleDateString()
  });

  saveState();
  renderStoreProducts();
};

// REPORTES Y UTILIDADES
function renderMetrics() {
  const t = translations[currentLang];
  const startDate = document.getElementById('filter-date-start')?.value;
  const endDate = document.getElementById('filter-date-end')?.value;

  let filteredSales = state.sales;

  if (startDate || endDate) {
    filteredSales = filteredSales.filter(s => {
      const saleDate = s.rawDate || s.date.split(' - ')[1].split('/').reverse().join('-');
      if (startDate && saleDate < startDate) return false;
      if (endDate && saleDate > endDate) return false;
      return true;
    });
  }

  let totalSales = 0;
  let totalProfit = 0;

  filteredSales.forEach(s => {
    totalSales += s.sellPrice;
    totalProfit += s.profit;
  });

  document.getElementById('metric-total-sales').textContent = `$${totalSales.toFixed(2)}`;
  document.getElementById('metric-total-profit').textContent = `$${totalProfit.toFixed(2)}`;

  const historyList = document.getElementById('sales-history-list');
  historyList.innerHTML = filteredSales.length === 0
    ? `<p style="opacity:0.6; margin-top:10px;">${t.noSalesPeriod}</p>`
    : filteredSales.slice().reverse().map(s => `
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

// EVENTOS DE FILTROS DE FECHAS
document.getElementById('btn-apply-date-filter').onclick = renderMetrics;
document.getElementById('btn-clear-date-filter').onclick = () => {
  document.getElementById('filter-date-start').value = "";
  document.getElementById('filter-date-end').value = "";
  renderMetrics();
};

// EVENTOS DE MODALES
document.getElementById('btn-open-create-warehouse').onclick = () => {
  const t = translations[currentLang];
  document.getElementById('modal-warehouse-title').textContent = t.createWarehouse;
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
  const t = translations[currentLang];
  document.getElementById('modal-category-title').textContent = t.createCategory;
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
  const t = translations[currentLang];
  const w = state.warehouses.find(item => item.id === activeWarehouseId);
  if (!w.categories || w.categories.length === 0) {
    alert(t.noCategories);
    return;
  }
  document.getElementById('modal-product-title').textContent = t.createProductTitle;
  document.getElementById('prod-id-edit').value = "";
  document.getElementById('form-product').reset();

  const catSelect = document.getElementById('prod-category-select');
  catSelect.innerHTML = w.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  document.getElementById('modal-product').classList.remove('hidden');
};
document.getElementById('close-modal-product').onclick = () => document.getElementById('modal-product').classList.add('hidden');

document.getElementById('form-product').onsubmit = function(e) {
  e.preventDefault();
  const fileInput = document.getElementById('prod-image-file');
  const file = fileInput.files ? fileInput.files[0] : null;

  processImage(file).then(imageBase64 => {
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
  });
};

document.getElementById('btn-open-create-store').onclick = () => {
  const t = translations[currentLang];
  document.getElementById('modal-store-title').textContent = t.createStore;
  document.getElementById('store-id-edit').value = "";
  document.getElementById('form-store').reset();
  document.getElementById('modal-store').classList.remove('hidden');
};
document.getElementById('close-modal-store').onclick = () => document.getElementById('modal-store').classList.add('hidden');

document.getElementById('form-store').onsubmit = function(e) {
  e.preventDefault();
  const fileInput = document.getElementById('store-image-file');
  const file = fileInput.files ? fileInput.files[0] : null;

  processImage(file).then(imageBase64 => {
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
  });
};

document.getElementById('close-modal-transfer').onclick = () => document.getElementById('modal-transfer').classList.add('hidden');

// MODO OSCURO / CLARO
document.getElementById('btn-theme-toggle').onclick = () => {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  document.getElementById('app-logo').src = isLight ? "https://i.imgur.com/UEvIK9K.png" : "https://i.imgur.com/qdIS9iU.png";
};

// INICIALIZACIÓN
loadState().then(() => {
  checkUserEmail();
  updateLanguageUI();
  renderWarehouses();
});
