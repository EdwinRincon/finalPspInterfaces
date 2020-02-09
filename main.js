window.onload = traerSoloDiez;
var httpreq = new XMLHttpRequest();
var createRowa = document.createElement("tr");
var arraybtnedit = [];
var arraybtndel = [];
var i = 0;
var aux_id;
var id;
var empezaren = 0


document.getElementById("inputBuscar").addEventListener("keyup", miBuscar);

// filtrar en la tabla
function miBuscar() {
    // Declare variables 
    var input, filter, table, tr, td, i, j, visible;
    input = document.getElementById("inputBuscar");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    let encabezados = document.querySelector('#encabezados');

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        visible = false;
        /* Obtenemos todas las celdas de la fila, no sólo la primera */
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j] && td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                visible = true;
            }
        }
        if (visible === true) {
            encabezados.innerHTML =""
            encabezados.innerHTML = `
            <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>CIF/NIF</th>
            <th>Dirección Facturación</th>
            <th>Editar</th>
            <th>Envío</th>
            <th>Eliminar</th>
          </tr>
                     `
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
            encabezados.innerHTML =""
            encabezados.innerHTML = `
            <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>CIF/NIF</th>
            <th>Dirección Facturación</th>
            <th>Editar</th>
            <th>Envío</th>
            <th>Eliminar</th>
          </tr>
        `
        }
    }
}

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
                     <td>  <button name="btnEditar" id="botonEditar${item.idCliente}"` + `  class="btn  btn-warning" data-toggle="modal"
                     data-target="#ModalEditCliente"> <i class="fas fa-user-edit"></i></td>
                     <td>  <button name="btnEnvio" id="botonEnvio${item.idCliente}"` + `  class="btn btn-info"> <i class="fas fa-shipping-fast"></i>  </td>
                     <td>  <button  name="btnEliminar" id="botonEliminar${item.idCliente}"` + `  class="btn btn-danger"> <i class="fas fa-user-times"></i>  
                     </tr>
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
//  EDITAR
function addActionsBtn() {


    $('[name=btnEditar]').on('click', function (e) {
        id = $(this).attr("id")
        aux_id = id.replace("botonEditar", "")

        httpreq.open('GET', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes/' + aux_id)
        httpreq.send();
        httpreq.onload = function () {
            if (httpreq.readyState == 4) {
                if (httpreq.status == 200) {
                    //rellena los datos del cliente seleccionado en los campos del model 
                    let datos = JSON.parse(httpreq.responseText)
                    document.getElementById("inputeditarcifnif").value = datos.CIFNIF;
                    document.getElementById("inputeditardir").value = datos.direccionFacturacion;
                    document.getElementById("inputeditarnombre").value = datos.nombreCliente;

                    // cuando le de click al boton guardar edicion del model en editar cliente
                    document.getElementById("btnModificar").addEventListener("click", function () {
                        var datosActualizar = {
                            "CIFNIF": document.getElementById("inputeditarcifnif").value,
                            "direccionFacturacion": document.getElementById("inputeditardir").value,
                            "idCliente": 0,
                            "nombreCliente": document.getElementById("inputeditarnombre").value
                        }

                        httpreq.open('PUT', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes')
                        httpreq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                        var datosEditados = JSON.stringify(datosActualizar)

                        httpreq.onload = function () {
                            if (httpreq.readyState == 4) {
                                if (httpreq.status == 200) {
                                    Swal.fire({

                                        title: 'Cliente Editado',
                                        text: 'Se ha editado un registro',
                                        icon: 'success',
                                        onClose: () => {
                                            window.location.reload(true)
                                        }
                                    });
                                }
                            }
                        }
                        httpreq.send(datosEditados)

                    });
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
                window.location.href = './tipo_envio.html';

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