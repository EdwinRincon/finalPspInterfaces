window.onload = main;
var httpreq = new XMLHttpRequest();
var createRowa = document.createElement("tr");
var arraybtnedit = [];
var arraybtndel = [];
var i = 0;
var aux_id;
var id;
var limit=0;
var paginas = 0;
var totalRegistross = totalRegistros();
var ordenacion = "idCliente"

function main(){
    traerSoloDiez(ordenacion,limit)
}


// FILTRADO TABLA
var textbuscar = document.getElementById("inputBuscar");
textbuscar.onkeyup = function(){
    var valorabuscar = (textbuscar.value).toLowerCase().trim();
	var tabla_tr = document.getElementById("myTable").getElementsByTagName("tbody")[0].rows;
	for(var i=0; i<tabla_tr.length; i++){
		var tr = tabla_tr[i];
		var textotr = (tr.innerText).toLowerCase();
		tr.className = (textotr.indexOf(valorabuscar)>=0)?"mostrar":"ocultar";
	}
}



function totalRegistros() {
httpreq.open('GET', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes/registros', false)
    let datos; 
    httpreq.onload = function () {
        if (httpreq.readyState == 4) {
            if (httpreq.status == 200) {
                datos = parseInt(this.responseText)
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
    return datos;
}



function traerSoloDiez(ordenacion,limit) {
   
    
    // oculta los botones o los muestra si estan al final del limite de registros +- 
    if (limit <= 0) {
        document.getElementById("btnAnterior").style.display = "none"
    } else {
        document.getElementById("btnAnterior").style.display = "block"
    }
    if (limit >= (totalRegistross-10)) {
        document.getElementById("btnSiguiente").style.display = "none"
    } else {
        document.getElementById("btnSiguiente").style.display = "block"
    }


   
    // traer 10 registros, agrega eventos a los botones creados 
    httpreq.open('GET', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes?limit=' + limit + "&ordenacion=" + ordenacion)
    httpreq.onload = function () {
        if (httpreq.readyState == 4) {
            if (httpreq.status == 200) {
                let datos = JSON.parse(this.responseText)
                let res = document.getElementById("tabla_clientes");
                res.innerHTML = '';
                for (let item of datos) {
                    res.innerHTML += `
                     <tr> 
                     <td>  ${item.idCliente}  </td>
                     <td>  ${item.nombreCliente}  </td> 
                     <td>  ${item.cIFNIF}  </td> 
                     <td>  ${item.direccionFacturacion}  </td>
                     <td>  <button name="btnEditar" id="botonEditar${item.idCliente}"` + `  class="btn  btn-warning" data-toggle="modal"
                     data-target="#ModalEditCliente"> <i class="fas fa-user-edit"></i></td>
                     <td>  <button name="btnEnvio" id="botonEnvio${item.idCliente}"` + `  class="btn btn-info"> <i class="fas fa-shipping-fast"></i>  </td>
                     <td>  <button  name="btnEliminar" id="botonEliminar${item.idCliente}"` + `  class="btn btn-danger"> <i class="fas fa-user-times"></i>  
                     </tr>
                     `
                }
                /*Agrega accion click a cada boton despues de que se crean todos los registros*/
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
        httpreq.open('GET', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes?cliente=' + aux_id, true)
        httpreq.send();
        httpreq.onload = function () {
            if (httpreq.readyState == 4) {
                if (httpreq.status == 200) {
                    //rellena los datos del cliente seleccionado en los campos del model 
                    let datos = JSON.parse(httpreq.responseText)
                    document.getElementById("inputeditarcifnif").value = datos[0].cIFNIF;
                    document.getElementById("inputeditardir").value = datos[0].direccionFacturacion;
                    document.getElementById("inputeditarnombre").value = datos[0].nombreCliente;

                    // cuando le de click al boton guardar edicion del model en editar cliente
                    document.getElementById("btnModificar").addEventListener("click", function () {
                        let cifnif = document.getElementById("inputeditarcifnif").value
                        let direccion = document.getElementById("inputeditardir").value
                        let nombrecliente = document.getElementById("inputeditarnombre").value
                        var datosActualizar = {
                            "idCliente": datos.idCliente,
                            "nombreCliente": nombrecliente,
                            "cIFNIF": cifnif,
                            "direccionFacturacion": direccion
                        };
                        var datosEditados = JSON.stringify(datosActualizar)
                        httpreq.open('PUT', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes', true)
                        httpreq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
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
httpreq.open('GET', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes?cliente=' + aux_id)
httpreq.onload = llenarEnvio
httpreq.send();
})
    
function llenarEnvio() {
    if (httpreq.readyState == 4) {
        if (httpreq.status == 200) {
            let datos = JSON.parse(httpreq.responseText)
            let cliente = JSON.stringify(datos);
            localStorage.setItem("cliente", cliente);
            window.location.href = '../html/tipo_envio.html';
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
            let datos = JSON.parse(httpreq.responseText)
            if(datos == 0){
                Swal.fire({
                    title: 'Error',
                    text: 'Cliente no eliminado',
                    icon: 'error',
                    onClose: () => {
                        window.location.reload(true)
                    }
                })
            }else{
                Swal.fire({
                    title: 'Cliente Eliminado',
                    text: 'Se ha borrado un registro',
                    icon: 'success',
                    onClose: () => {
                    window.location.reload(true)
                    }})   
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
    })
}

// AÑADIR CLIENTE
/*
document.getElementById('btnInsertar').addEventListener("click", function () {
   var expNombre = new RegExp('/^[a-zA-Z0-9_]{5,30}$/');
   var expCIFNIF = new RegExp('^[0-9]+$');
   var expAddress = new RegExp('');
    if(expNombre.test(document.getElementById("inputnombre").value) && expCIFNIF.test('^[0-9]+$') && )
function addCliente(){
   
}
});
*/
document.getElementById('btnInsertar').addEventListener("click", function () {

    let cliente = {
        "idCliente": 0,
        "nombreCliente": document.getElementById("inputnombre").value,
        "cIFNIF": document.getElementById("inputcifnif").value,
        "direccionFacturacion": document.getElementById("inputdir").value        
    }
    httpreq.open('POST', 'http://localhost:8080/EjemploRestJDBC/webapi/clientes')
    httpreq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let jsonstring = JSON.stringify(cliente)
    httpreq.send(jsonstring)
    httpreq.onload = function () {
            if (httpreq.readyState == 4) {
                if (httpreq.status == 200) {
                    let datos = JSON.parse(httpreq.responseText)
                    if(datos == 0){
                        Swal.fire({
                            title: 'Error',
                            text: 'Cliente no insertado',
                            icon: 'error',
                            onClose: () => {
                                window.location.reload(true)
                            }
                        })
                    }else{
                        Swal.fire({
                            title: 'Cliente Creado',
                            text: 'Se ha hecho un nuevo registro',
                            icon: 'success',
                            onClose: () => {
                            window.location.reload(true)
                            }})   
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

});

// ORDENAR CAMPOS FLECHAS
document.getElementById("thId").addEventListener("click", function () {
    traerSoloDiez("IdCliente",limit);
});
document.getElementById("thNombre").addEventListener("click", function () {
    traerSoloDiez("nombreCliente",limit);
});
document.getElementById("thCifNif").addEventListener("click", function () {
    traerSoloDiez("cIFNIF",limit);
});

document.getElementById("thDireccionFacturacion").addEventListener("click", function () {
    traerSoloDiez("direccionFacturacion",limit);
});


// Paginacion
document.getElementById('btnSiguiente').addEventListener("click", function () {
    limit += 10;
        traerSoloDiez("idCliente",limit);
});
    
document.getElementById('btnAnterior').addEventListener("click", function () {
    limit -= 10;
    traerSoloDiez("idCliente",limit);
});
    
document.getElementById('btnFinal').addEventListener("click", function () {
    limit = totalRegistross - 10;
    traerSoloDiez("idCliente",limit);
});
document.getElementById('btnInicio').addEventListener("click", function () {
    limit = 0;
    traerSoloDiez("idCliente",limit);
});




