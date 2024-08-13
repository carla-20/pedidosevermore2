const socket = io();

//let pedidoID = 1;
//const pedidos = [];
//let metodoPagoSeleccionado = '';

socket.on('initialData', (data) => {
    data.forEach(pedido => {
        agregarPedidoLista(pedido);
    });
    actualizarTotales();
});

socket.on('pedidoConfirmado', (pedido) => {
    agregarPedidoLista(pedido);
    actualizarTotales();
});

socket.on('pedidoEntregado', (id) => {
    const botonEntregado = document.getElementById(`entregado-${id}`);
    if (botonEntregado) {
        botonEntregado.classList.add('entregado');
        botonEntregado.style.backgroundColor = '#4caf50';
        botonEntregado.innerText = 'Entregado';
        botonEntregado.style.animation = 'none';
    }
    actualizarTotales();
});

socket.on('pedidoAnulado', (id) => {
    const pedidoIndex = pedidos.findIndex(p => p.id === id);
    if (pedidoIndex > -1) {
        pedidos.splice(pedidoIndex, 1);
        document.getElementById(`pedido-${id}`).remove();
        actualizarTotales();
    }
});

/*socket.on('totalesActualizados', (totales) => {
    // Actualiza los totales en la interfaz de usuario
    console.log('Totales recibidos:', totales);
    console.log(totales);
    document.getElementById('total-efectivo').innerHTML = totales.efectivo;
    document.getElementById('total-digital').innerHTML = totales.digital;
    document.getElementById('total-consumicion').innerHTML = totales.consumición;
    document.getElementById('total-general').innerHTML = totales.efectivo + totales.digital + totales.consumición;
    //console.log(totales);
    //document.getElementById('total-efectivo').innerHTML = totales.efectivo;
    //document.getElementById('total-digital').innerHTML = totales.digital;
    //document.getElementById('total-consumicion').innerHTML = totales.consumicion;
    //document.getElementById('total-general').innerHTML = totales.general;
});
*/
let pedidoID = 1;
const pedidos = [];
let metodoPagoSeleccionado = '';


function mostrarSeccion(seccion) {

    const secciones = document.querySelectorAll('.container');
    secciones.forEach(s => s.classList.remove('active'));
    document.getElementById(seccion).classList.add('active');

    const botonesMenu = document.querySelectorAll('.menu button');
    botonesMenu.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.menu button[onclick="mostrarSeccion('${seccion}')"]`).classList.add('active');
    }

        function cambiarCantidad(bebida, cantidad) {
            const input = document.getElementById(bebida);
            let nuevoValor = parseInt(input.value) + cantidad;
            if (nuevoValor < 0) nuevoValor = 0;
            input.value = nuevoValor;
            calcularTotal();
        }

        function calcularTotal() {
            const precios = {
                'gin-tonic': { individual: 6000, promo: 10000 },
                'vodka-speed': { individual: 6000, promo: 10000 },
                'fernet-coca': { individual: 6000, promo: 10000 },
                'lata-andes': { individual: 5000, promo: 8000 },
                'agua': { individual: 3500, promo: 6000 },
                'speed': { individual: 4000, promo: 6000 },
                'gaseosa': { individual: 3500, promo: 6000 }
  
            };

            let total = 0;

            Object.keys(precios).forEach(id => {
                const cantidad = parseInt(document.getElementById(id).value);
                if (cantidad > 0) {
                    const promos = Math.floor(cantidad / 2);
                    const individuales = cantidad % 2;
                    total += promos * precios[id].promo + individuales * precios[id].individual;
                }
            });

            document.getElementById('total-amount').textContent = total;
        }

            //let total = 0;
            //for (let key in precios) {
            //    total += document.getElementById(key).value * precios[key];
            //}
            //document.getElementById('total-amount').innerText = total;
        //}

        function seleccionarPago(tipo) {
            metodoPagoSeleccionado = tipo;
            const opciones = document.querySelectorAll('.payment-option');
            opciones.forEach(opcion => opcion.classList.remove('selected'));
            document.getElementById(`pago-${tipo}`).classList.add('selected');
            document.getElementById('payment-method').innerText = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        }

        function confirmarPedido() {
            const total = document.getElementById('total-amount').innerText;
            const metodoPago = metodoPagoSeleccionado ? metodoPagoSeleccionado.charAt(0).toUpperCase() + metodoPagoSeleccionado.slice(1) : 'Ninguno';
            const fechaHora = new Date().toLocaleString();

            if (metodoPago === 'Ninguno') {
                alert('Por favor, seleccione un método de pago.');
                return;
            }

            const bebidas = [
                { id: 'gin-tonic', nombre: 'Gin Tonic' },
                { id: 'vodka-speed', nombre: 'Vodka con Speed' },
                { id: 'fernet-coca', nombre: 'Fernet con Coca' },
                { id: 'lata-andes', nombre: 'Lata Andes' },
                { id: 'agua', nombre: 'Agua' },
                { id: 'speed', nombre: 'Speed' },
                { id: 'gaseosa', nombre: 'Gaseosa' }
            ];

            const pedido = {
                id: pedidoID,
                //total: total,
                //metodoPago: metodoPago,
                fechaHora: fechaHora,
                items: {
                    'Gin Tonic': parseInt(document.getElementById('gin-tonic').value),
                    'Vodka/Speed': parseInt(document.getElementById('vodka-speed').value),
                    'Fernet/Coca': parseInt(document.getElementById('fernet-coca').value),
                    'Lata Andes': parseInt(document.getElementById('lata-andes').value),
                    'Agua': parseInt(document.getElementById('agua').value),
                    'Speed': parseInt(document.getElementById('speed').value),
                    'Gaseosa': parseInt(document.getElementById('gaseosa').value)
                },
                metodoPago: metodoPago,
                total: total,
                entregado: false,
                //bebidas: [],
                //ginTonic: document.getElementById('gin-tonic').value,
                //vodkaSpeed: document.getElementById('vodka-speed').value,
                //fernetCoca: document.getElementById('fernet-coca').value,
                //lataAndes: document.getElementById('lata-andes').value,
                //agua: document.getElementById('agua').value,
                //speed: document.getElementById('speed').value,
                //gaseosa: document.getElementById('gaseosa').value
            };

            pedidos.push(pedido);
            
            //socket.emit('nuevoPedido', pedido);

            // Mostrar datos del pedido en ventana emergente
            alert(`Se realizó el siguiente pedido:\nNúmero de Pedido: ${pedidoID}\nBebidas:\nTotal: $${total}\nMétodo de Pago: ${metodoPago}\nFecha y Hora: ${fechaHora}`);

            // Agregar pedido a la lista de pedidos confirmados
            agregarPedidoLista(pedido);

            // Actualizar totales por tipo de pago
            actualizarTotales();

            // Resetear campos
            document.getElementById('gin-tonic').value = 0;
            document.getElementById('vodka-speed').value = 0;
            document.getElementById('fernet-coca').value = 0;
            document.getElementById('lata-andes').value = 0;
            document.getElementById('agua').value = 0;
            document.getElementById('speed').value = 0;
            document.getElementById('gaseosa').value = 0;
            metodoPagoSeleccionado = '';
            const opciones = document.querySelectorAll('.payment-option');
            opciones.forEach(opcion => opcion.classList.remove('selected'));
            document.getElementById('payment-method').innerText = 'Ninguno';
            document.getElementById('total-amount').innerText = 0;

            // Actualizar número de pedido en la interfaz
            socket.emit('nuevoPedido', pedido);
            pedidoID++;
            document.getElementById('order-number').innerText = pedidoID;
        }



        function agregarPedidoLista(pedido) {
            
            const orderList = document.getElementById('order-list');
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.id = `pedido-${pedido.id}`;
            orderItem.innerHTML = `

            <p><strong>Pedido #${pedido.id}</strong> - ${pedido.fechaHora}</p>
                    <ul>
                        ${Object.entries(pedido.items).map(([item, cantidad]) => cantidad > 0 ? `<li>${item}: ${cantidad}</li>` : '').join('')}
                    </ul>
                    <p>Total: $${pedido.total} </p>
                    <p>Pago: ${pedido.metodoPago}</p>

            
            <button class="anular" onclick="confirmarAnulacionPedido(${pedido.id})">Anular</button>
            <button class="entregado" id="entregado-${pedido.id}" onclick="marcarEntregado(${pedido.id})">En Proceso</button>
            `;
            orderList.insertBefore(orderItem, orderList.firstChild);
        }

        function confirmarAnulacionPedido(id) {
            if (confirm(`Usted está por anular el pedido N° ${id}. ¿Desea continuar?`)) {
                anularPedido(id);
                socket.emit('anularPedido', id);
            }
        }

        function anularPedido(id) {
            // Eliminar pedido de la lista de pedidos confirmados
            const pedidoIndex = pedidos.findIndex(p => p.id === id);
            if (pedidoIndex > -1) {
                pedidos.splice(pedidoIndex, 1);
                document.getElementById(`pedido-${id}`).remove();
                actualizarTotales();
                alert(`El pedido ${id} ha sido anulado.`);
            }
            //socket.emit('anularPedido', id);
        }

        function marcarEntregado(id) {
            const pedidoIndex = pedidos.findIndex(p => p.id === id);
            if (pedidoIndex > -1) {
                const pedido = pedidos[pedidoIndex];
                pedido.entregado = true;
                const botonEntregado = document.getElementById(`entregado-${id}`);
                botonEntregado.classList.add('entregado');
                botonEntregado.style.backgroundColor = '#4caf50';
                botonEntregado.innerText = 'Entregado';
                botonEntregado.style.animation = 'none';
                actualizarTotales();
            }
            socket.emit('pedidoEntregado', id);
        }

        function actualizarTotales() {
            const totalEfectivo = calcularTotalPorMetodo('Efectivo');
            const totalDigital = calcularTotalPorMetodo('Digital');
            const totalConsumicion = calcularTotalPorMetodo('Consumición');
            const totalGeneral = totalEfectivo + totalDigital + totalConsumicion;

            document.getElementById('total-efectivo').innerText = totalEfectivo;
            document.getElementById('total-digital').innerText = totalDigital;
            document.getElementById('total-consumicion').innerText = totalConsumicion;
            document.getElementById('total-general').innerText = totalGeneral;
            //socket.emit('totalesActualizados',totales);
        }

        function descargarExcel() {
            const data = [['ID Pedido', 'Fecha/Hora', 'Método de Pago', 'Total', 'Entregado', 'Gin Tonic', 'Vodka/Speed', 'Fernet/Coca', 'Lata Andes', 'Agua', 'Speed', 'Gaseosa']];

            pedidos.forEach(pedido => {
                data.push([
                    pedido.id,
                    pedido.fechaHora,
                    pedido.metodoPago,
                    pedido.total,
                    pedido.entregado,
                    pedido.items['Gin Tonic'],
                    pedido.items['Vodka/Speed'],
                    pedido.items['Fernet/Coca'],
                    pedido.items['Lata Andes'],
                    pedido.items['Agua'],
                    pedido.items['Speed'],
                    pedido.items['Gaseosa']
                ]);
            });

            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Pedidos");

            //const fechaHoraActual = new Date().toLocaleString();
            const nombreArchivo = `Pedidos.xlsx`;

            XLSX.writeFile(wb, nombreArchivo);
        }

        function calcularTotalPorMetodo(metodo) {
            return pedidos
            .filter(p => p.metodoPago === metodo)
            .reduce((total, p) => total + parseFloat(p.total), 0);
        }

        // Configuración inicial
        //mostrarSeccion('tragos');
        //document.getElementById('order-number').innerText = pedidoID;
        //actualizarTotales();

        /*function descargarExcel() {
            const wsPedidos = XLSX.utils.json_to_sheet(pedidos);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, wsPedidos, "Pedidos");

            // Agregar hoja resumen
            const resumen = [
                //["bebidas", bebidasPorPedidos(pedido,bebidas)], PARA QUE VER BEBIDAS PEDIDAS EN EL EXCEL
                ["Total Efectivo", calcularTotalPorMetodo('Efectivo')],
                ["Total Digital", calcularTotalPorMetodo('Digital')],
                ["Total Consumición", calcularTotalPorMetodo('Consumición')],
                ["Total General", calcularTotalPorMetodo('Efectivo') + calcularTotalPorMetodo('Digital') + calcularTotalPorMetodo('Consumición')]
            ];
            const wsResumen = XLSX.utils.aoa_to_sheet(resumen);
            XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

            XLSX.writeFile(wb, "Pedidos.xlsx");
        }

        function calcularTotalPorMetodo(metodo) {
            return pedidos
                .filter(p => p.metodoPago === metodo)
                .reduce((total, p) => total + parseFloat(p.total), 0);
        }*/

        function actualizarFechaHora() {
            document.getElementById('current-datetime').innerText = new Date().toLocaleString();
        }

        // Actualizar fecha y hora cada segundo
        setInterval(actualizarFechaHora, 1000);