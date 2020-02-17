
window.onload = traerNombre;
var httpreq = new XMLHttpRequest();
var idDestinatario
var estadoEnvioChecked


function traerNombre() {
cliente = localStorage.getItem('cliente')
datosCliente = JSON.parse(cliente);
document.getElementById("nombre").innerText = datosCliente.nombreCliente

httpreq.open('GET', 'http://localhost:8080/EjemploRestJDBC/webapi/destinatarios/' + datosCliente.idCliente)
httpreq.onload = function () {
    if (httpreq.readyState == 4) {
        if (httpreq.status == 200) {
            let datosDestinatario = JSON.parse(this.responseText)
            let select = document.querySelector("#select")
            select.innerHTML = '';
            select.innerHTML = `<option disabled>Elegir Destinatario</option>`;
            for (let item of datosDestinatario) {
                select.innerHTML += `
                <option>${item.nombreDestinatario}</option> `}
                select.selectedIndex = "0";
            } else {
            }
        }
    }
    httpreq.send();
}
// A?adir a los campos de destinatario cuando cambias de destinatario en el Select
document.getElementById("select").addEventListener("change", function() {
    if(document.getElementById("select").value != "Elegir Destinatario")
    {
    var aux_nameDestinatario = document.getElementById("select").value
    httpreq.open('GET', 'http://localhost:8080/EjemploRestJDBC/webapi/destinatarios/name/'+"\""+aux_nameDestinatario+"\"")
    httpreq.onload = function () {
        if (httpreq.readyState == 4) {
            if (httpreq.status == 200) {
                let datosDestinatario = JSON.parse(this.responseText)
                document.getElementById("innombreDes").value = datosDestinatario.nombreDestinatario;
                document.getElementById("indni").value = datosDestinatario.DNINIF;
                document.getElementById("indireccion").value = datosDestinatario.direccionCompleta;
                document.getElementById("incp").value = datosDestinatario.codigoPostal; 
                idDestinatario= datosDestinatario.idDestinatario
            }
        }
    }
    httpreq.send();
    }
});


document.getElementById("submit").addEventListener("click", function () {    
    if (!document.getElementById('RPendiente').checked && !document.getElementById('ROficina').checked )
    {
        Swal.fire({
            title: 'Error',
            text: 'Elige un estado de envio',
            icon: 'error',
            
        })
    }else if(document.getElementById("indni").value=="" || document.getElementById("indireccion").value=="" || document.getElementById("incp").value=="")
    {
        Swal.fire({
            title: 'Error',
            text: 'Completa los campos vacios ',
            icon: 'error',
        })
    }else{
        if (document.getElementById('RPendiente').checked){
            estadoEnvioChecked = "PR"
        }else if(document.getElementById('ROficina').checked ){
            estadoEnvioChecked = "OO"
        }


var datosActualizar = {
"DNINIF":document.getElementById("indni").value,
"codigoPostal":document.getElementById("incp").value ,
"direccionCompleta": document.getElementById("indireccion").value,
"idDestinatario": idDestinatario,
"idcliente":  0,
"nombreDestinatario":  document.getElementById("innombreDes").value
};
var datosEditados = JSON.stringify(datosActualizar)
httpreq.open('PUT', 'http://localhost:8080/EjemploRestJDBC/webapi/destinatarios', true)
httpreq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
httpreq.onload = function () {
    if (httpreq.readyState == 4) {
        if (httpreq.status == 200) {}}}
        httpreq.send(datosEditados)
        /*actualizar destinatarios*/

// INSERT nuevo envio
let envio = {
"DNINIF": document.getElementById("indni").value,
"codigoPostal": document.getElementById("incp").value,
"direccionCompleta": document.getElementById("indireccion").value,
"idCliente": datosCliente.idCliente,
"idEnvio": 0,
"idEstadoEnvio": estadoEnvioChecked,
"nombreDestinatario":  document.getElementById("innombreDes").value,
"numIntentosEntrega": 0}

httpreq.open('POST', 'http://localhost:8080/EjemploRestJDBC/webapi/envios')
httpreq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
let jsonstring = JSON.stringify(envio)
httpreq.onload = function () {
    if (httpreq.readyState == 4) {
        if (httpreq.status == 200) {
        Swal.fire({
            title: 'Envio Creado',
            text: 'Se ha creado un registro',
            icon: 'success',
            onClose: () => {
            window.location.reload(true)}});
                }
            }
        }
        httpreq.send(jsonstring)
    }
localStorage.clear()

    
});