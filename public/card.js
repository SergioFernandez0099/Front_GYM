let mainContainer;
let inputMenu;

document.addEventListener("DOMContentLoaded", () => {
    mainContainer = document.querySelector("main");
    inputMenu = document.getElementById("menu-toggle");

    inputMenu.addEventListener("click", enfocar);
});

function enfocar() {
    if (inputMenu.checked) {
      mainContainer.style.filter = "blur(2px)";
    } else {
      mainContainer.style.filter = "none";
    }
}
