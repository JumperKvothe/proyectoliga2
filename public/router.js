//Routing

//Añado los listener a los elementos de navbar
$(document).on('click', '#login', goToLogin);
$(document).on('click', '#regis', goToRegis);
$(document).on('click', '#inicio', goToInicio);

//Las funciones que hacen navegar entre los archivos html
function goToLogin(){
    window.location.href = "../html/login.html"
}

function goToRegis() {
    window.location.href = "../html/registrarse.html"
}

function goToInicio(){
    window.location.href = "../html/inicio.html"
}
