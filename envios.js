
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
                let datosDestinatario = JSON.parse(this.responseText)
                let select = document.querySelector("#select")
                select.innerHTML = '';
                select.innerHTML = `<option disabled required>Elegir Destinatario</option>`;
                console.log(datosDestinatario);
                for (let item of datosDestinatario) {
                    
                    
                    select.innerHTML += `
                    <option>${item.nombreDestinatario}</option> `
                }
                select.selectedIndex = "0";
                
            } else {
            }
        }
    }
    httpreq.send();
    //localStorage.clear()
}
// A?adir a los campos de destinatario cuando cambias de destinatario en el Select
document.getElementById("select").addEventListener("change", function() {
    if(document.getElementById("select").value != "Elegir Destinatario")
    {
        var aux_nameDestinatario = document.getElementById("select").value

    httpreq.open('GET', 'http://localhost:8080/EjemploRestJDBC/webapi/destinatarios/name/'+"\""+aux_nameDestinatario+"\"" )
    httpreq.onload = function () {
        if (httpreq.readyState == 4) {
            if (httpreq.status == 200) {
                let datosDestinatario = JSON.parse(this.responseText)
                document.getElementById("dni").innerText = datosDestinatario.DNINIF;
                document.getElementById("direccion").innerText = datosDestinatario.direccionCompleta;
                document.getElementById("cp").innerText = datosDestinatario.codigoPostal;
            }
        }
    }
    httpreq.send();


    }
});


document.getElementById("submit").addEventListener("click", function () {

    if (!document.getElementById('RPendiente').checked && !document.getElementById('ROficina').checked)
    {
        alert("chekea tus checks")
    }

});