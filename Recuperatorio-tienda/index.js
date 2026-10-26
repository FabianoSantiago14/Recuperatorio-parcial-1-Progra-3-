const productosJSON = `[
  { "id": 1, "nombre": "Cheeseburger", "descripcion": "Medallón de carne, cheddar, pepinos y ketchup", "categoria": "Clásicas", "precio": 7500, "stock": 10, "imagen": "img/1.jpg" },
  { "id": 2, "nombre": "Clásica Completa", "descripcion": "Carne, lechuga, tomate y cebolla", "categoria": "Clásicas", "precio": 8200, "stock": 8, "imagen": "img/2.jpg" },
  { "id": 3, "nombre": "Cuarto de Libra", "descripcion": "Carne de 200 g, cheddar, cebolla y tomate", "categoria": "Clásicas", "precio": 9900, "stock": 0, "imagen": "img/3.jpg" },
  { "id": 4, "nombre": "Bacon BBQ", "descripcion": "Carne, panceta crocante, cheddar y salsa barbacoa", "categoria": "Especiales", "precio": 12500, "stock": 5, "imagen": "img/4.jpg" },
  { "id": 5, "nombre": "Provoleta", "descripcion": "Carne, provoleta fundida y cebolla caramelizada", "categoria": "Especiales", "precio": 13200, "stock": 4, "imagen": "img/5.jpg" },
  { "id": 6, "nombre": "Doble Cheddar", "descripcion": "Doble carne, doble cheddar, cebolla y lechuga", "categoria": "Especiales", "precio": 14000, "stock": 3, "imagen": "img/6.jpg" },
  { "id": 7, "nombre": "Combo Clásico", "descripcion": "Hamburguesa completa con papas fritas", "categoria": "Combos", "precio": 15900, "stock": 6, "imagen": "img/7.jpg" },
  { "id": 8, "nombre": "Combo Crispy", "descripcion": "Pollo crispy, coleslaw y papas fritas", "categoria": "Combos", "precio": 16500, "stock": 2, "imagen": "img/8.jpg" },
  { "id": 9, "nombre": "Combo Onion", "descripcion": "Carne, aros de cebolla, cheddar y papas fritas", "categoria": "Combos", "precio": 17800, "stock": 1, "imagen": "img/9.jpg" }
]`;

const productosArray = JSON.parse(productosJSON);

localStorage.setItem("productos", JSON.stringify(productosArray));

const productos = JSON.parse(localStorage.getItem("productos"));

console.table(productos);

const contenedor = document.getElementById("products-container");
const titulo = document.get("titulo");
const buscador = document.getElementById("buscador");
const orden = document.getElementById("orden");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const contador = document.getElementById("contador");
const btnVaciar = document.getElementById("vaciar");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
  function renderizarProductos(lista) {
    if (lista.length === 0) {
      contenedor.innerHTML = "<p>No se encontro ningun producto</p>";
      return;
    }
    // Despues agregar algo para cuando no tenga nada el coso
    const tarjetas = lista.map(function (p) {
      const sinStock = p.stock === 0;

      return `
        <article class="tarjeta">
          <img src="${p.imagen}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          <p class"precio"> ${p.precio.toLocalString()}</p>
          <button class="btn-agregar" data-id=${p.id}" </button>
        </article>
        `;
    
    });

    contenedor.innerHTML = tarjetas.join("");

    contenedor.querySelectorAll(".btn-agregar").forEach(function(boton) {
      boton.addEventListener("Click", function() {
        agregarAlCarrito(Number(boton.dataset.id));
      });
    });

 }




  function aplicarFiltros() {
    const categoria = document.querySelector('input[name=categoria]:checked').value;
    const texto = buscador.value.toLowerCase();

    let resultado = productos;

    if (categoria !== "todas") {
      resultado = resultado.filter(p => p.categoria === categoria);
    }

    resultado = resultado.filter(p => 
      p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto)
    );

    if (orden.value === "menor") {
      resultado = [...resultado].sort((a, b) => a.precio - b.precio);
    } else if (orden.value === "mayor") {
      resultado = [...resultado].sort((a, b) => b.precio - a.precio);
    }

    renderizarProductos(resultado);

  }

  function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const enCarrito = carrito.find(item => item.id === id);

    if (enCarrito) {
      if (enCarrito.cantidad < producto.stock) {
        enCarrito.cantidad++;
      } else {
        alert("no hay mas stock");
      }
    } else {
      carrito.push({
        id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1
      });
    }

    actualizarCarrito();

  }

  function quitarDelCarrito(id) {
    const item = carrito.find(i => i.id === id);
    item.cantidad--;

    if (item.cantidad === 0) {
      carrito = carrito.filter(i => i.id === id);
    }

    actualizarCarrito();

  }

  btnVaciar.addEventListener("click",function() {
    carrito = [];
    actualizarCarrito();
  })

  function actualizarCarrito() {
    if(carrito.length === 0) {
      cartList.innerHTML = "<li> Tu carrito esta vacio</li>"
    }
  }

