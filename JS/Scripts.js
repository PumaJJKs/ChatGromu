function toggleMenu() {
    const sideMenu = document.getElementById("side-menu");
    const body = document.body;
    
    sideMenu.classList.toggle("open");
    body.classList.toggle("menu-open"); // Adiciona/remove a classe no body

    // Seu código anterior do footer (opcional se ainda usar)
    const footer = document.getElementById('footer');
    if(footer) footer.classList.toggle('hidden'); 
}