window.onload = () => {
  document.getElementById("start").onclick = () => {
    let canvasEl = document.getElementById("canvasHidden");
    let menuEl = document.querySelector(".menu__container");

    menuEl.classList.add("menu__container_hidden");
    menuEl.classList.remove("menu__container");

    canvasEl.removeAttribute("id", "canvasHidden");
    canvasEl.setAttribute("id", "canvas");

    Game.init();
  };

  document.getElementById("restart").onclick = () => {
    Game.init();
  };

  document.getElementById("menu").onclick = () => {
    window.location.reload();
  };
};
