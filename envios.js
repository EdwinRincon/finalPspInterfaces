
window.onload = traerNombre;
var httpreq = new XMLHttpRequest();
function traerNombre() {
    cliente = localStorage.getItem('cliente')
    datosCliente = JSON.parse(cliente);
    document.getElementById("nombre").innerHTML = datosCliente.nombreCliente



    httpreq.open('GET', 'http://localhost:8080/EjemploRestJDBC/webapi/destinatarios/' + datosCliente.idCliente)
    httpreq.onload = function () {
        if (httpreq.readyState == 4) {
            if (httpreq.status == 200) {
                let datos = JSON.parse(this.responseText)

                let res = document.querySelector('#dropdown');
                res.innerHTML = '';

                for (let item of datos) {
                    res.innerHTML += `
                    <option>${item.nombreCliente}</option> `
                }
            } else {
                /* Swal.fire({
    
                     title: 'Error',
                     text:'La conexión al servidor falló.',
                     icon:'question',
                     onClose: () => {
                         window.location.reload(true)
                     }
                 })*/
            }
        }
    }
    httpreq.send();


    //localStorage.clear()

}


document.getElementById("submit").addEventListener("click", function () {

    if (!document.getElementById('RPendiente').checked && !document.getElementById('ROficina').checked)
    {
        alert("chekea tus checks")
    }

});