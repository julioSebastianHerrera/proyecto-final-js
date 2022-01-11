$(document).ready(function(){
    //Llamo al archivo json en una variable
    const URLJSON = './productos.json'
    //Uso Ajax
    $.getJSON(URLJSON,function(data,estado){
        if(estado === 'success'){
            localStorage.setItem('stock', JSON.stringify(data));
            obtenerProductos();
            renderizarProductos(data);
            obtenerLocal();
        }
    })
});
/*  Slider  */

window.addEventListener('load', function () {
    console.log('el contenido cargo correctamente!');
     
    var imagenes = [];

    imagenes[0] ='multimedia/slide1.png';
    imagenes[1] ='multimedia/slide2.png';
    imagenes[2] ='multimedia/slide3.png';
    
    var indiceImagenes = 0;
    var tiempoSlide = 3000;

    function cambiarImagenes(){
      document.slider.src = imagenes[indiceImagenes];;  

      if(indiceImagenes < 2){
          indiceImagenes++;
      } else{
          indiceImagenes = 0;
      }
    }
    setInterval(cambiarImagenes, tiempoSlide); 
});




let carrito = []

let productos = []

function obtenerProductos() {
    let stock = JSON.parse(localStorage.getItem('stock'))
    if(stock){
        stock.forEach(el => productos.push(el))
    }
}

function renderizarProductos(productos){
    $('#productos').empty()
    for(const producto of productos){
        $('#productos').append(` <div class="productoContenedor">
                                <h4>${producto.modelo}</h4>
                                <img src="${producto.img}">
                                <p>${producto.precio}</p>
                                <button id="boton${producto.id}">comprar</button>
                                </div>`)
        $(`#boton${producto.id}`).click(function(){
            console.log(`Hiciste click en el boton ${producto.id}`)
            $('.productoAgregado').append(` <div class="contenedorProductoAgregado">
                                                <p>Su producto fue agregado correctamente!</p>
                                            </div>`)
            $('.contenedorProductoAgregado').fadeIn('fast').delay(1000).fadeOut('fast');
            agregarAlCarrito(producto.id)
        })
                                
    }
} 


function agregarAlCarrito(id){
    let productoRepetido = carrito.find(productoRep => productoRep.id == id);
    if(productoRepetido){
        productoRepetido.cantidad = productoRepetido.cantidad + 1;
        $(`#cantidad${productoRepetido.id}`).html(`cantidad: ${productoRepetido.cantidad}`)
        actualizarCarrito();
        guardarLocal();
    }else{
        let productoAgregar = productos.find(item => item.id == id);
        carrito.push(productoAgregar)
        productoAgregar.cantidad =1;
        actualizarCarrito();
        $('#carrito-contenedor').append(`<div class="productoEnCarrito">
                                            <div class="img-carrito">
                                                <img src="${productoAgregar.img}">
                                            </div>
                                            <p>${productoAgregar.modelo}</p>
                                            <p>Precio: $${productoAgregar.precio}</p>
                                            <p id="cantidad${productoAgregar.id}">cantidad: ${productoAgregar.cantidad}</p>
                                            <button id="eliminar${productoAgregar.id}" class="boton-eliminar">QUITAR</button>
                                        </div>`)
                                        
        $(`#eliminar${productoAgregar.id}`).click(function(){
            $(this).parent().remove();
            carrito = carrito.filter(productoEliminado => productoEliminado.id != productoAgregar.id)
            actualizarCarrito();
            guardarLocal();
        })
    }
}

//Actualizar carrito

function actualizarCarrito(){
    precioTotal = carrito.reduce((acumulador,elemento) => acumulador + (elemento.precio * elemento.cantidad),0);
    $('#precioTotal').text(precioTotal)
}

//Guardar LocalStorage

function guardarLocal (){
    const guardarProductos = JSON.stringify(carrito)
    const guardarEnStorage = localStorage.setItem('Producto',guardarProductos)
}

//ObtenerLocalStorage

function obtenerLocal(){
    const obtenerEnStorage = localStorage.getItem('Producto')
    const obtenerProductos = JSON.parse(obtenerEnStorage);
    if(obtenerProductos){
        obtenerProductos.forEach(element => {
            agregarAlCarrito(element.id); 
        });
    }    
}

/* Modal Carrito */
const carritoAbrir = document.getElementById('btnCarrito');
const carritoCerrar = document.getElementById('carritoCerrar');

const contenedorModal = document.getElementsByClassName('modal-contenedor')[0]
const modalCarrito = document.getElementsByClassName('modal-carrito')[0]

carritoAbrir.addEventListener('click', ()=> {
    contenedorModal.classList.toggle('modal-active')
})
carritoCerrar.addEventListener('click', ()=> {
    contenedorModal.classList.toggle('modal-active')
})
modalCarrito.addEventListener('click',(e)=>{
    e.stopPropagation()
})
contenedorModal.addEventListener('click', ()=>{
    carritoCerrar.click()
})