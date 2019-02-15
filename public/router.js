//Routing

//Añado los listener a los elementos de navbar
$(document).on('click', '#login', goToLogin);
$(document).on('click', '#regis', goToRegis);
$(document).on('click', '#inicio', goToInicio);
$(document).on('click', '#clasif', goToClasi);
$(document).on('click', '#perfil', goToPerfil);

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

function goToLolIndex(){
    window.location.href = "../html/lol-index.html"
}

function goToClasi(){
    window.location.href = "../html/clasi.html"
}

function goToPerfil(){
    window.location.href = "../html/perfil.html"
}