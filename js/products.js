function setProductID(id) {
    localStorage.setItem("productID", id); // Guarda el ID del producto en localStorage
    window.location = "product-info.html"; // Redirige a la página de información del producto
}



// Definición de constantes para los criterios de ordenamiento
const ORDER_ASC_BY_NAME = "AZ";  
const ORDER_DESC_BY_NAME = "ZA"; 
const ORDER_BY_PROD_COUNT = "Cant."; // Ordenar por cantidad vendida

// Variables globales para manejar el estado
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minPrice = undefined;
let maxPrice = undefined;

// Función para ordenar productos según el criterio seleccionado
function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        // Ordena por nombre ascendente
        result = array.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === ORDER_DESC_BY_NAME) {
        // Ordena por nombre descendente
        result = array.sort((a, b) => b.name.localeCompare(a.name));
    } else if (criteria === ORDER_BY_PROD_COUNT) {
        // Ordena por cantidad vendida
        result = array.sort((a, b) => b.soldCount - a.soldCount);
    }
    return result;
}
// Función para mostrar productos en la página
function showProducts(searchTerm = "") {
    let htmlContentToAppend = "";
    for (let product of currentProductsArray) {
        if ((minPrice === undefined || product.cost >= minPrice) &&
            (maxPrice === undefined || product.cost <= maxPrice)) {
            // Filtrar productos por nombre o descripción DESAFIATE
            if (product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm)) {
                htmlContentToAppend += `
                <div onclick="setProductID(${product.id})" class="list-group-item list-group-item-action cursor-active">
                    <div class="row">
                        <div class="col-3">
                            <img src="${product.image}" class="img-thumbnail">
                        </div>
                        <div class="col">
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                                <small class="">${product.soldCount} vendidos</small>
                            </div>
                            <p class="mb-1">${product.description}</p>
                        </div>
                    </div>
                </div>`;
            }
        }
    }
    document.getElementById("product-list").innerHTML = htmlContentToAppend;
}

// Función para obtener los datos de productos desde la API
function fetchProducts(CatID) {
    const url = `http://localhost:3001/categories/${CatID}`;

    fetch(url, {headers:{'access-token':localStorage.getItem('token')}})
        .then(response => response.json())
        .then(data => {
            currentProductsArray = data.products;
            showProducts(); // Mostrar productos iniciales
        });
}

// Función para establecer el ID del producto en el localStorage y redirigir a la página de información del producto
function setProductID(id) {
    localStorage.setItem("id", id);
    window.location = "product-info.html";
}

// Manejo de eventos al cargar la página PARTE 1 SOFI
document.addEventListener("DOMContentLoaded", () => {
    let categoryId = localStorage.getItem('catID');

    if (!categoryId) {
        categoryId = 101; // Usar 101 como predeterminado si no hay ID en el localStorage
        console.warn('No se encontró un categoryId en localStorage. Usando el ID 101 por defecto.');
    }

    fetchProducts(categoryId);
});

// Manejo de eventos de los botones de orden PARTE 2 PAU
document.getElementById('sortAsc').addEventListener('click', () => {
    currentSortCriteria = ORDER_ASC_BY_NAME;
    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);
    showProducts(document.getElementById('searchInput').value.toLowerCase());
});

document.getElementById('sortDesc').addEventListener('click', () => {
    currentSortCriteria = ORDER_DESC_BY_NAME;
    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);
    showProducts(document.getElementById('searchInput').value.toLowerCase());
});

document.getElementById('sortByCount').addEventListener('click', () => {
    currentSortCriteria = ORDER_BY_PROD_COUNT;
    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);
    showProducts(document.getElementById('searchInput').value.toLowerCase());
});

// Manejo de eventos para el filtrado por precio
document.getElementById('rangeFilterCount').addEventListener('click', () => {
    minPrice = parseFloat(document.getElementById('rangeFilterCountMin').value) || undefined;
    maxPrice = parseFloat(document.getElementById('rangeFilterCountMax').value) || undefined;
    showProducts(document.getElementById('searchInput').value.toLowerCase());
});

document.getElementById('clearRangeFilter').addEventListener('click', () => {
    minPrice = undefined;
    maxPrice = undefined;
    document.getElementById('rangeFilterCountMin').value = '';
    document.getElementById('rangeFilterCountMax').value = '';
    showProducts(document.getElementById('searchInput').value.toLowerCase());
});

// Manejo de eventos para la búsqueda de productos DESAFIATE 
document.getElementById('searchInput').addEventListener('input', () => {
    showProducts(document.getElementById('searchInput').value.toLowerCase());
});


//que "bienvenido, miPerfil" sea un enlace a my-profile.html
const miPerfilBtn = document.getElementById('miPerfil');

//creo evento click
miPerfilBtn.addEventListener('click', function() {
  //lleva a pagina de tu perfil
  window.location.href = 'my-profile.html';
});

/* Para Mi Carrito */
const miCarritoBtn = document.getElementById('miCarrito');

//creo evento click
miCarritoBtn.addEventListener('click', function() {
  //lleva a pagina de carrito
  window.location.href = 'cart.html';
});

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    // Obtener el carrito desde el localStorage (o un array vacío si no hay nada guardado)
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
    // Calcular la cantidad total de productos en el carrito
    let totalCantidad = carrito.reduce((acc, producto) => acc + (producto.quantity || 1), 0);
  
    // Actualizar el badge con la cantidad total de productos
    document.getElementById("cart-count").textContent = totalCantidad;
  }

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
    // Obtener el carrito actual del localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
    // Verificar si el producto ya está en el carrito
    let productoExistente = carrito.find(item => item.id === producto.id);
  
    if (productoExistente) {
        // Si el producto ya existe, sumar la cantidad
        productoExistente.quantity += producto.quantity || 1;
    } else {
        // Si el producto no existe, agregarlo al carrito con la cantidad proporcionada
        producto.quantity = producto.quantity || 1; // Asegurar que tenga una cantidad
        carrito.push(producto);
    }
  
    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
  
    // Actualizar el contador
    actualizarContadorCarrito();
  }
  
  // Al cargar la página, actualizar el contador con los productos ya guardados
  document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);
