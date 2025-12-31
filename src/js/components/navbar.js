import {router, safeNavigate} from "../router.js";
import {setForceNoCache} from "../store.js";

export function Navbar() {
    const nav = document.createElement("nav");
    nav.className = "navbar";

    nav.innerHTML = `
    <div class="navbar-container">
      <input type="checkbox" id="menu-toggle" />
      <label class="menu-btn" for="menu-toggle">
        <svg id="hamburger" class="Header__toggle-svg" viewBox="0 0 60 40">
          <g stroke="#ff0000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <path id="top-line" d="M12,10 L48,10 Z"></path>
            <path id="middle-line" d="M12,20 L48,20 Z"></path>
            <path id="bottom-line" d="M12,30 L48,30 Z"></path>
          </g>
        </svg>
      </label>

      <div class="reload-container">
          <svg fill="currentColor" height="800px" width="800px" version="1.1" id="reload" xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 489.711 489.711" xml:space="preserve" >
            <g>
                <g>
                    <path d="M112.156,97.111c72.3-65.4,180.5-66.4,253.8-6.7l-58.1,2.2c-7.5,0.3-13.3,6.5-13,14c0.3,7.3,6.3,13,13.5,13
                        c0.2,0,0.3,0,0.5,0l89.2-3.3c7.3-0.3,13-6.2,13-13.5v-1c0-0.2,0-0.3,0-0.5v-0.1l0,0l-3.3-88.2c-0.3-7.5-6.6-13.3-14-13
                        c-7.5,0.3-13.3,6.5-13,14l2.1,55.3c-36.3-29.7-81-46.9-128.8-49.3c-59.2-3-116.1,17.3-160,57.1c-60.4,54.7-86,137.9-66.8,217.1
                        c1.5,6.2,7,10.3,13.1,10.3c1.1,0,2.1-0.1,3.2-0.4c7.2-1.8,11.7-9.1,9.9-16.3C36.656,218.211,59.056,145.111,112.156,97.111z"/>
                    <path d="M462.456,195.511c-1.8-7.2-9.1-11.7-16.3-9.9c-7.2,1.8-11.7,9.1-9.9,16.3c16.9,69.6-5.6,142.7-58.7,190.7
                        c-37.3,33.7-84.1,50.3-130.7,50.3c-44.5,0-88.9-15.1-124.7-44.9l58.8-5.3c7.4-0.7,12.9-7.2,12.2-14.7s-7.2-12.9-14.7-12.2l-88.9,8
                        c-7.4,0.7-12.9,7.2-12.2,14.7l8,88.9c0.6,7,6.5,12.3,13.4,12.3c0.4,0,0.8,0,1.2-0.1c7.4-0.7,12.9-7.2,12.2-14.7l-4.8-54.1
                        c36.3,29.4,80.8,46.5,128.3,48.9c3.8,0.2,7.6,0.3,11.3,0.3c55.1,0,107.5-20.2,148.7-57.4
                        C456.056,357.911,481.656,274.811,462.456,195.511z"/>
                </g>
            </g>
          </svg>
      </div>

      <div class="menu-items-container">
        <ul class="menu-items">
          <li><a href="/">Inicio</a></li>
          <li><a href="/routine">Rutina</a></li>
          <li><a href="/sessions">Registro</a></li>
          <li><a href="/exercises">Ejercicios</a></li>
          <li><a href="/logout">Salir</a></li>
        
        </ul>
      </div>

      <div class="container-logo">
        <h1 class="border">G Y M</h1>
        <h1 class="wave">G Y M</h1>
      </div>
    </div>

     <div class="overlay"></div>
  `;

    const inputMenu = nav.querySelector("#menu-toggle");
    const mainContainer = document.querySelector("main");
    const reloadBtn = nav.querySelector("#reload");
    const overlay = nav.querySelector(".overlay");
    const logo = nav.querySelector(".container-logo");

    logo.addEventListener("click", (e) => {
        safeNavigate("/")
    })

    let angle = 0;
    let animationFrame;
    let spinning = false;
    let clickAnimation = false;

    function rotate() {
        let step = spinning ? 3 : 0;
        if (clickAnimation) step = 20;

        angle += step;
        reloadBtn.style.transform = `rotate(${angle}deg)`;

        if (spinning || clickAnimation) {
            animationFrame = requestAnimationFrame(rotate);
        } else {
            animationFrame = null;
        }
    }

    reloadBtn.addEventListener("mouseenter", () => {
        spinning = true;
        if (!animationFrame) rotate();
    });

    reloadBtn.addEventListener("mouseleave", () => {
        spinning = false;
    });

    reloadBtn.addEventListener("click", () => {
        clickAnimation = true;
        if (!animationFrame) rotate();

        reloadBtn.classList.remove("reload-clicked");
        void reloadBtn.offsetWidth; // reflow
        reloadBtn.classList.add("reload-clicked");

        // Navegación usando la ruta guardada
        const route = reloadBtn.dataset.route;
        setForceNoCache(true);
        if (route) safeNavigate(route);

        setTimeout(() => {
            clickAnimation = false;
            if (reloadBtn.matches(":hover")) {
                spinning = true;
                if (!animationFrame) rotate();
            }
        }, 400);
    });

    function handleResize() {
        if (window.innerWidth < 768) return;
        inputMenu.checked = false;
        mainContainer.style.filter = "none";
        if (overlay) overlay.style.display = "none";
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    inputMenu.addEventListener("click", () => {
        if (inputMenu.checked) {
            mainContainer.style.filter = "blur(2px)";
            overlay.style.display = "block";
        } else {
            mainContainer.style.filter = "none";
            overlay.style.display = "none";
        }
    });

    const menuLinks = nav.querySelectorAll("a");
    menuLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const href = link.getAttribute("href");
            safeNavigate(href);
            inputMenu.checked = false;
            mainContainer.style.filter = "none";
            overlay.style.display = "none";
        });
    });

    return nav;
}

export function updateReloadButton(reloadBtn) {
    const last = router.lastResolved();
    const reloadContainer = document.querySelector(".reload-container");

    if (!last) {
        reloadBtn.parentNode.style.display = "none";
        return;
    }

    const currentRoute = Array.isArray(last) ? last[last.length - 1]?.url : last?.url;
    if (currentRoute === "login" || currentRoute === "home" || currentRoute === "error" || currentRoute === "" || currentRoute === undefined) {
        reloadBtn.parentNode.style.display = "none";
    } else {
        if (currentRoute.includes("sessions") && window.innerWidth < 768) {
            reloadContainer.style.top = "1.5rem";
            reloadContainer.style.left = "4.5rem";
        } else {
            reloadContainer.style.top = "4.5rem";
            reloadContainer.style.left = "1rem";
        }
        reloadBtn.parentNode.style.display = "block";
    }

    reloadBtn.dataset.route = "/" + currentRoute;
}
