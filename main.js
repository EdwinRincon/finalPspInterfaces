window.onload = traerDatos;
var httpreq = new XMLHttpRequest();
var createRowa = document.createElement("tr");
var arraybtnedit = [];
var arraybtndel = [];
var i = 0;
var aux_id;
var id;



function traerDatos() {
    httpreq.open('GET', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes')
    httpreq.onload = function () {
        if (httpreq.readyState == 4) {
            if (httpreq.status == 200) {
                let datos = JSON.parse(this.responseText)
                for (let item of datos) {
                    i++;
                }
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'La conexión al servidor falló.',
                    icon: 'question',
                    onClose: () => {
                        window.location.reload(true)
                    }
                })
            }
        }
    }
    httpreq.send();
    return i;
}
function traerSoloDiez() {
    // total = traerDatos();
    if (empezaren <= 0) {
        document.getElementById("btnAnterior").style.display = "none"
    } else {
        document.getElementById("btnAnterior").style.display = "block"
    }

    httpreq.open('GET', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes/query?empezaren=' + empezaren)
    httpreq.onload = function () {
        if (httpreq.readyState == 4) {

            if (httpreq.status == 200) {
                let datos = JSON.parse(this.responseText)

                let res = document.querySelector('#tabla_clientes');
                res.innerHTML = '';

                for (let item of datos) {
                    res.innerHTML += `
                     <tr> 
                     <td>  ${item.idCliente}  </td>
                     <td>  ${item.nombreCliente}  </td> 
                     <td>  ${item.CIFNIF}  </td> 
                     <td>  ${item.direccionFacturacion}  </td>
                     <td>  <button name="btnEditar" id="botonEditar${item.idCliente}"` + `  class="btn  btn-warning"> <i class="fas fa-user-edit"></i></td>
                     <td>  <button name="btnEnvio" id="botonEnvio${item.idCliente}"` + `  class="btn btn-info"> <i class="fas fa-shipping-fast"></i>  </td>
                     
                     <td>  <button  name="btnEliminar" id="botonEliminar${item.idCliente}"` + `  class="btn btn-danger"> <i class="fas fa-user-times"></i>  </tr>
                     `
                    i++;
                }
                addActionsBtn();
            } else {
                Swal.fire({

                    title: 'Error',
                    text: 'La conexión al servidor falló.',
                    icon: 'question',
                    onClose: () => {
                        window.location.reload(true)
                    }
                })
            }
        }
    }
    httpreq.send();
}
//  EDITAR Y ELIMINAR
function addActionsBtn() {


    $('[name=btnEditar]').on('click', function (e) {

        /*  $('#ModalEditCliente').modal('show')
          $('#btnModificar').on('click', function(evento) {
                  
                      console.log("cliente editado") 
                
          })*/

        id = $(this).attr("id")
        aux_id = id.replace("botonEditar", "")

        httpreq.open('GET', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes/' + aux_id)
        httpreq.send();
        httpreq.onload = function () {
            if (httpreq.readyState == 4) {
                if (httpreq.status == 200) {



                } else {

                    Swal.fire({

                        title: 'Error',
                        text: 'La conexión al servidor falló.',
                        icon: 'question',
                        onClose: () => {
                            window.location.reload(true)
                        }
                    })
                }
            }
        }

    })

    // ENVIO
    $('[name=btnEnvio]').on('click', function (e) {

        id = $(this).attr("id")
        aux_id = id.replace("botonEnvio", "")
        httpreq.open('GET', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes/' + aux_id)
        httpreq.onload = llenarEnvio
        httpreq.send();

    })
    function llenarEnvio() {
        if (httpreq.readyState == 4) {

            if (httpreq.status == 200) {

                let datos = JSON.parse(httpreq.responseText)
                let cliente = JSON.stringify(datos);
                localStorage.setItem("cliente", cliente);
                window.location.href = './envios.html';

            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'La conexión al servidor falló.',
                    icon: 'question',
                    onClose: () => {
                        window.location.reload(true)
                    }
                })
            }
        }
    }

    // ELIMINAR CLIENTE AL CLICK BOTON
    $('[name=btnEliminar]').on('click', function (e) {

        id = $(this).attr("id")
        aux_id = id.replace("botonEliminar", "")
        httpreq.open('DELETE', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes/' + aux_id)
        httpreq.onload = function () {
            if (httpreq.readyState == 4) {
                if (httpreq.status == 200) {
                    // alert("Se ha borrado un registro")
                    Swal.fire({

                        title: 'Cliente Eliminado',
                        text: 'Se ha borrado un registro',
                        icon: 'success',
                        onClose: () => {
                            window.location.reload(true)
                        }
                    })
                } else {
                    //alert("Error al conectarse con el servidor: " + httpreq.status)
                    Swal.fire({

                        title: 'Error',
                        text: 'La conexión al servidor falló.',
                        icon: 'question',
                        onClose: () => {
                            window.location.reload(true)
                        }
                    })
                }
            }
        }
        httpreq.send();
    })
}

// AÑADIR CLIENTE
document.getElementById('btnInsertar').addEventListener("click", function () {
    let cliente = {

        "CIFNIF": document.getElementById("inputcifnif").value,
        "direccionFacturacion": document.getElementById("inputdir").value,
        "idCliente": 0,
        "nombreCliente": document.getElementById("inputnombre").value
    }
    httpreq.open('POST', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes')
    httpreq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    let jsonstring = JSON.stringify(cliente)

    httpreq.onload = function () {
        if (httpreq.readyState == 4) {
            if (httpreq.status == 200) {
                Swal.fire({

                    title: 'Cliente Creado',
                    text: 'Se ha creado un registro',
                    icon: 'success',
                    onClose: () => {
                        window.location.reload(true)
                    }
                });
            }
        }
    }
    httpreq.send(jsonstring)
});


document.getElementById('btnSiguiente').addEventListener("click", function () {
    empezaren += 10;
    traerSoloDiez();
});

document.getElementById('btnAnterior').addEventListener("click", function () {

    empezaren -= 10;
    traerSoloDiez();
})