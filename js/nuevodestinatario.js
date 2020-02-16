var httpreq = new XMLHttpRequest();
cliente = localStorage.getItem('cliente')
datosCliente = JSON.parse(cliente);
/**--------------------------------------------------------NUEVO DESTINATARIO FORM-----------------------------------------------------**/
document.getElementById("newsubmit").addEventListener("click", function () {
    var datosNuevos = {
        "DNINIF":document.getElementById("newindni").value,
        "codigoPostal":document.getElementById("newincp").value ,
        "direccionCompleta": document.getElementById("newindireccion").value,
        "idDestinatario": 0,
        "idcliente": datosCliente.idCliente,
        "nombreDestinatario":  document.getElementById("newinnombreDes").value
        };
        var datosCreados = JSON.stringify(datosNuevos)
        httpreq.open('POST', 'http://localhost:8080/EjemploRestJDBC/webapi/destinatarios', true)
        httpreq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        httpreq.onload = function () {
            if (httpreq.readyState == 4) {
                if (httpreq.status == 200) {
                    Swal.fire({
                        title: 'Nuevo Destinatario Creado',
                        text: 'Se ha creado un registro',
                        icon: 'success',
                        onClose: () => {
                        window.location.reload(true)}});
                            }
                }}
                httpreq.send(datosCreados)
});