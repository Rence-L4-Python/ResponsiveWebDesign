function showMenu(){
    var menu_button = document.querySelector('.expandable-button');
    var menu = document.querySelector('.expandable-menu');

    menu.classList.toggle('showmenu');
    menu_button.addEventListener("click", showMenu);
}

showMenu();

function updateParagraph(){
    let paragraph = document.getElementById("change-p");
    let media_768 = window.matchMedia("(min-width: 768px)");
    let media_1200 = window.matchMedia("(min-width: 1200px)");

    if (media_1200.matches){
        paragraph.innerHTML = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam finibus erat in diam tincidunt vehicula. 
        Morbi accumsan dolor ipsum, vitae accumsan sapien condimentum consectetur.
        Etiam aliquam leo dolor, eget interdum justo feugiat id. Donec blandit ante at posuere 
        convallis. Morbi blandit arcu at facilisis maximus. Sed accumsan suscipit venenatis. 
        Vivamus pellentesque, odio sed molestie placerat, erat nibh scelerisque mi, sit amet 
        tincidunt purus lorem id mi. Sed id dolor cursus, dictum mi vel, porttitor est.`;
    } 
    else if (media_768.matches){
        paragraph.innerHTML = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam finibus erat in diam tincidunt vehicula. 
        Morbi accumsan dolor ipsum, vitae accumsan sapien condimentum consectetur. 
        Etiam aliquam leo dolor, eget interdum justo feugiat id.`;
    } 
    else{
        paragraph.innerHTML = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam finibus erat in diam tincidunt vehicula.`;
    }
}

updateParagraph();

window.addEventListener("resize", updateParagraph);