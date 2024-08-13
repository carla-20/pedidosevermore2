const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Carpeta donde estará tu HTML

let pedidos = [];
let pedidoID = 1;

/*function calcularTotales(pedidos) {
    //console.log('Calculando totales...');
    const totales = {};
    pedidos.forEach((pedido) => {
      if (!totales[pedido.tipoPago]) {
        totales[pedido.tipoPago] = 0;
      }
      totales[pedido.tipoPago] += pedido.total;
    });
    console.log('Totales calculados:', totales);
    return totales;
}

function actualizarTotales() {
    console.log('Actualizando totales...');
    const totales = calcularTotales(pedidos);
    io.emit('totalesActualizados', totales);
    console.log('Totales emitidos:', totales);
}
*/

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar pedidos existentes al nuevo cliente
    socket.emit('initialData', pedidos);

    socket.on('nuevoPedido', (pedido) => {
        pedido.id = pedidoID++;
        pedidos.push(pedido);
        io.emit('pedidoConfirmado', pedido);
        //actualizarTotales();
    });

    socket.on('pedidoEntregado', (id) => {
        const pedido = pedidos.find(p => p.id === id);
        if (pedido) {
            pedido.entregado = true;
            io.emit('pedidoEntregado', id);
            //actualizarTotales();
        }
        //actualizarTotales();
    });

    socket.on('anularPedido', (id) => {
        pedidos = pedidos.filter(p => p.id !== id);
        io.emit('pedidoAnulado', id);
        //actualizarTotales();
    });


});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
