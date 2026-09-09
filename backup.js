// backup.js - Gestión de Exportar / Importar Datos (Preservando todo sin sobrescribir)

// 1. Inyectar botones "Descargar Datos" y "Cargar Datos" en la interfaz
function injectBackupUI() {
  const mainContainer = document.querySelector('.main-container');
  if (!mainContainer || document.getElementById('backup-container-bar')) return;

  const backupBar = document.createElement('div');
  backupBar.id = 'backup-container-bar';
  backupBar.style.cssText = `
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    width: 100%;
  `;

  backupBar.innerHTML = `
    <button id="btn-export-json" class="btn-primary" style="flex:1; background: linear-gradient(135deg, #10b981 0%, #059669 100%); display:flex; align-items:center; justify-content:center; gap:6px;">
      📥 Descargar Datos
    </button>
    <button id="btn-import-json" class="btn-primary" style="flex:1; background: linear-gradient(135deg, #059669 0%, #047857 100%); display:flex; align-items:center; justify-content:center; gap:6px;">
      📤 Cargar Datos
    </button>
    <input type="file" id="file-input-json" accept=".json" style="display: none;" />
  `;

  mainContainer.insertBefore(backupBar, mainContainer.firstChild);

  // Evento: Descargar JSON
  document.getElementById('btn-export-json').addEventListener('click', exportDataJSON);

  // Evento: Cargar JSON
  const fileInput = document.getElementById('file-input-json');
  document.getElementById('btn-import-json').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', importDataJSON);
}

// 2. Función para descargar/exportar todo a un archivo .json
function exportDataJSON() {
  if (!state) {
    alert("No se encontró el estado de la aplicación.");
    return;
  }

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `inventario_check_respaldo_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// 3. Función para cargar/importar archivo .json de productos
function importDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);

      if (!importedData.warehouses && !importedData.stores) {
        alert("El archivo subido no tiene un formato válido de respaldo de inventario.");
        return;
      }

      if (confirm("¿Deseas importar estos datos? Se añadirán a tu inventario actual sin borrar nada.")) {
        // Combinar Almacenes sin duplicar IDs
        if (importedData.warehouses && Array.isArray(importedData.warehouses)) {
          importedData.warehouses.forEach(importedW => {
            const existingW = state.warehouses.find(w => w.id === importedW.id);
            if (existingW) {
              // Fusionar categorías y productos si el almacén existe
              importedW.categories?.forEach(c => {
                if (!existingW.categories.some(ec => ec.id === c.id)) existingW.categories.push(c);
              });
              importedW.products?.forEach(p => {
                if (!existingW.products.some(ep => ep.id === p.id)) existingW.products.push(p);
              });
            } else {
              state.warehouses.push(importedW);
            }
          });
        }

        // Combinar Tiendas sin duplicar IDs
        if (importedData.stores && Array.isArray(importedData.stores)) {
          importedData.stores.forEach(importedS => {
            const existingS = state.stores.find(s => s.id === importedS.id);
            if (existingS) {
              importedS.products?.forEach(p => {
                if (!existingS.products.some(ep => ep.id === p.id)) existingS.products.push(p);
              });
            } else {
              state.stores.push(importedS);
            }
          });
        }

        // Combinar Ventas/Historial
        if (importedData.sales && Array.isArray(importedData.sales)) {
          state.sales = [...state.sales, ...importedData.sales];
        }

        // Guardar cambios en IndexedDB y refrescar las vistas actuales
        saveState();
        if (typeof renderWarehouses === 'function') renderWarehouses();
        if (typeof renderStores === 'function') renderStores();
        
        alert("¡Productos e información importados con éxito!");
      }
    } catch (err) {
      alert("Error al leer el archivo JSON: " + err.message);
    }
  };

  reader.readAsText(file);
  event.target.value = ""; // Limpiar input para re-uso
}

// 4. Solución visual: Si un producto no tiene imagen, la imagen se oculta limpia y elegante sin roto
function fixMissingImages() {
  const observer = new MutationObserver(() => {
    document.querySelectorAll('.item-card img').forEach(img => {
      // Ocultar la etiqueta <img> si no hay fuente o falla
      if (!img.getAttribute('src') || img.getAttribute('src').includes('via.placeholder.com') || img.getAttribute('src') === '') {
        img.style.display = 'none';
      }

      img.onerror = function() {
        this.style.display = 'none'; // Si falla la carga, simplemente se oculta y no sale la imagen rota feo
      };
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Inicializar mejoras al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  injectBackupUI();
  fixMissingImages();
});
