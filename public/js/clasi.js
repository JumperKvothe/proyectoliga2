//onload function
//No se puede llamar a funcionesdb(3) en el html (hay que arreglar)

//Cambiar páginas clasificación
function arrow(bool){
    if (bool){
        document.getElementById('tablita').value = parseInt(document.getElementById('tablita').value) +1
        funcionesdb(3)
    }else{
        if (parseInt(document.getElementById('tablita').value) != 1) {
            document.getElementById('tablita').value = parseInt(document.getElementById('tablita').value) -1
            funcionesdb(3)
        }
    }
}