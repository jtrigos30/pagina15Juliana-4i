document.addEventListener("DOMContentLoaded", () => {
  const canvasPixie = document.getElementById("canvas-pixie");
  const ctxPixie = canvasPixie.getContext("2d");
  let particles = [];

  function resizePixie() {
    canvasPixie.width = window.innerWidth;
    canvasPixie.height = window.innerHeight;
  }

  window.addEventListener("resize", resizePixie);
  resizePixie();

  class StarParticula {
    constructor() {
      this.x = Math.random() * canvasPixie.width;
      this.y = Math.random() * canvasPixie.height;
      this.size = Math.random() * 2 + 1;
      this.speedY = Math.random() * -0.5 - 0.2; // Flotan hacia arriba lento
      this.opacity = Math.random();
      this.blinkSpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.y += this.speedY;
      if (this.y < -10) this.y = canvasPixie.height + 10;

      // Efecto de parpadeo
      this.opacity += this.blinkSpeed;
      if (this.opacity > 1 || this.opacity < 0) this.blinkSpeed *= -1;
    }

    draw() {
      ctxPixie.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // Color Dorado
      ctxPixie.beginPath();
      ctxPixie.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctxPixie.fill();
    }
  }

  function initPixie() {
    particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push(new StarParticula());
    }
  }

  function animatePixie() {
    ctxPixie.clearRect(0, 0, canvasPixie.width, canvasPixie.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animatePixie);
  }

  initPixie();
  animatePixie();

  /* =========================================
       1. CONFIGURACIÓN DEL CANVAS (FONDO DE HADAS)
       ========================================= */
  const canvasP = document.getElementById("lienzo-magico");
  const ctxP = canvasP.getContext("2d");

  // Listas para controlar las partículas
  let hadasFiesta = [];
  let polvillo = [];

  // Variables de control de transición
  let opacidadIntro = 1.0;
  let opacidadFiesta = 0.0;

  function ajustarTamanoCanvas() {
    if (canvasP) {
      canvasP.width = window.innerWidth;
      canvasP.height = window.innerHeight;
    }
  }

  window.addEventListener("resize", () => {
    ajustarTamanoCanvas();
    inicializarRaspaditas(); // Recalcular raspaditas al cambiar tamaño
  });

  /* =========================================
       2. LÓGICA DE MÚSICA Y BOTÓN FLOTANTE
       ========================================= */

  // Función global para el botón flotante (window. para que el HTML lo vea)
  window.toggleMusic = function () {
    const audio = document.getElementById("musica-fondo");
    const btn = document.getElementById("btn-musica");
    const icono = document.getElementById("icono-musica");

    if (audio.paused) {
      audio.play();
      icono.className = "fas fa-volume-up"; // Icono Sonido
      btn.style.boxShadow = "0 0 15px rgba(255, 255, 255, 0.3)";
      btn.style.opacity = "1";
    } else {
      audio.pause();
      icono.className = "fas fa-volume-mute"; // Icono Mute
      btn.style.boxShadow = "none";
      btn.style.opacity = "0.7";
    }
  };

  /* =========================================
       3. INTERACCIÓN DE ENTRADA (SELECTOR BLINDADO)
       ========================================= */

  const inputsAsistencia = document.querySelectorAll(
    'input[name="asistencia"]',
  );
  const introScreen = document.getElementById("intro-screen");
  const contenidoPrincipal = document.getElementById("contenido-principal");
  const mainTag = document.querySelector("main");

  // Música: Intentamos con ambos IDs posibles por si acaso
  const musica =
    document.getElementById("musica-fondo") ||
    document.getElementById("audio-fondo");
  const btnMusica = document.getElementById("btn-musica");

  const ejecutarEntrada = (numeroAsistentes) => {
    console.log("Iniciando transición con asistentes:", numeroAsistentes);
    localStorage.setItem("numeroAsistentes", numeroAsistentes);

    // --- 1. HACER QUE LAS PARTÍCULAS SE DESVANEZCAN ---
    const cp = document.getElementById("canvas-pixie");
    if (cp) {
      cp.style.transition = "opacity 0.8s ease"; // Duración igual a la del libro
      cp.style.opacity = "0";
    }

    // --- 2. DETENER EL BUCLE DE ANIMACIÓN (Para ahorrar procesador) ---
    if (typeof animationId !== "undefined") {
      setTimeout(() => {
        cancelAnimationFrame(animationId);
        if (cp) cp.style.display = "none";
      }, 800); // Se oculta después de que termina el desvanecimiento
    }

    // A. DETENER ANIMACIÓN DE INTRO (PIXIE DUST)
    if (typeof animationId !== "undefined") {
      cancelAnimationFrame(animationId);
      const cp = document.getElementById("canvas-pixie");
      if (cp) cp.style.display = "none";
    }

    // B. MÚSICA (Con volumen bajo como pediste)
    if (musica) {
      musica.volume = 0.3;
      musica.play().catch((e) => console.warn("Audio no pudo iniciar:", e));
    }
    if (btnMusica) btnMusica.classList.remove("oculto");

    // C. DESVANECER LIBRO Y CONTROLES
    if (introScreen) {
      introScreen.style.transition = "opacity 0.8s ease";
      introScreen.style.opacity = "0";
      introScreen.style.pointerEvents = "none"; // Evita clics extra
    }

    // D. INICIAR HADAS (Si la función existe)
    try {
      if (typeof crearHadasFiesta === "function") {
        animacionIniciada = true;
        crearHadasFiesta();
      }
    } catch (e) {
      console.error("Error en hadas:", e);
    }

    // E. CAMBIO DE PANTALLA
    setTimeout(() => {
      if (introScreen) introScreen.style.display = "none";

      // Mostrar contenido principal y forzar visibilidad
      if (contenidoPrincipal) {
        contenidoPrincipal.classList.remove("oculto");
        contenidoPrincipal.style.display = "block";
        setTimeout(() => (contenidoPrincipal.style.opacity = "1"), 50);
      }

      if (mainTag) {
        mainTag.classList.remove("oculto");
        mainTag.style.display = "block";
      }

      // Reinicializar utilidades
      if (typeof ajustarTamanoCanvas === "function") ajustarTamanoCanvas();
      if (typeof inicializarRaspaditas === "function") inicializarRaspaditas();
    }, 800); // Un poco más rápido para que se sienta fluido
  };

  // LISTENER DEL SLIDER
  if (inputsAsistencia.length > 0) {
    inputsAsistencia.forEach((input) => {
      input.addEventListener("change", (e) => {
        if (e.target.checked) {
          const seleccion = e.target.value;
          // Pequeño delay para que el invitado vea que se movió el slider
          setTimeout(() => ejecutarEntrada(seleccion), 400);
        }
      });
    });
  }
  /* =========================================
   4. SISTEMA DE PARTÍCULAS (HADAS FIESTA)
   ========================================= */

  let animacionIniciada = false; // Interruptor principal

  // --- CLASE: POLVILLO (Estela de las hadas) ---
  class ParticulaPolvo {
    constructor(x, y, colorRGB) {
      this.x = x + (Math.random() - 0.5) * 5;
      this.y = y + (Math.random() - 0.5) * 5;
      this.color = colorRGB;
      this.size = Math.random() * 2 + 0.5;
      this.opacity = 1;
      this.fadeRate = 0.02;
    }
    update() {
      this.opacity -= this.fadeRate;
      this.y += 0.3; // Caen ligeramente
      this.x += (Math.random() - 0.5) * 0.5;
    }
    draw(ctx) {
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- CLASE: HADA FIESTA ---
  class HadaFiesta {
    constructor() {
      this.x = Math.random() * canvasP.width;
      this.y = Math.random() * canvasP.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.speedY = Math.random() * 1.5 - 0.75;
      // Colores: Azul cielo o Blanco
      this.colorStr = Math.random() > 0.5 ? "255, 255, 255" : "135, 206, 235";
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Rebote infinito (aparecen por el otro lado)
      if (this.x < 0) this.x = canvasP.width;
      if (this.x > canvasP.width) this.x = 0;
      if (this.y < 0) this.y = canvasP.height;
      if (this.y > canvasP.height) this.y = 0;

      // Dejar rastro de polvillo aleatoriamente
      if (Math.random() > 0.9) {
        polvillo.push(new ParticulaPolvo(this.x, this.y, this.colorStr));
      }
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      // Color con un poco de transparencia base (0.8)
      ctx.fillStyle = `rgba(${this.colorStr}, 0.8)`;
      ctx.shadowBlur = 5;
      ctx.shadowColor = `rgba(${this.colorStr}, 1)`;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset para no afectar otros dibujos
    }
  }

  /* =========================================
    5. MOTOR DE ANIMACIÓN
    ========================================= */

  function crearHadasFiesta() {
    hadasFiesta = [];
    for (let i = 0; i < 20; i++) hadasFiesta.push(new HadaFiesta());
  }

  function animateParticles() {
    // 1. Limpiar lienzo siempre
    ctxP.clearRect(0, 0, canvasP.width, canvasP.height);

    // 2. Solo procesar si se dio clic al botón
    if (animacionIniciada) {
      // A. Gestionar Hadas Fiesta
      for (let i = 0; i < hadasFiesta.length; i++) {
        hadasFiesta[i].update();
        hadasFiesta[i].draw(ctxP);
      }

      // B. Gestionar Polvillo (Estelas)
      for (let i = polvillo.length - 1; i >= 0; i--) {
        polvillo[i].update();
        if (polvillo[i].opacity <= 0) {
          polvillo.splice(i, 1); // Borrar si es invisible
        } else {
          polvillo[i].draw(ctxP);
        }
      }
    }

    requestAnimationFrame(animateParticles);
  }

  // Inicializar Canvas y Bucle (pero vacío hasta el clic)
  ajustarTamanoCanvas();
  animateParticles();

  /* =========================================
        6. CUENTA REGRESIVA
        ========================================= */
  const fechaEvento = new Date("Mar 21, 2026 19:00:00").getTime();
  const intervaloCuenta = setInterval(() => {
    const ahora = new Date().getTime();
    const distancia = fechaEvento - ahora;
    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    const elDias = document.getElementById("dias");
    if (elDias) {
      elDias.innerText = dias < 10 ? "0" + dias : dias;
      document.getElementById("horas").innerText =
        horas < 10 ? "0" + horas : horas;
      document.getElementById("minutos").innerText =
        minutos < 10 ? "0" + minutos : minutos;
      document.getElementById("segundos").innerText =
        segundos < 10 ? "0" + segundos : segundos;
    }
    if (distancia < 0) {
      clearInterval(intervaloCuenta);
      const countdownEl = document.getElementById("countdown");
      if (countdownEl)
        countdownEl.innerHTML = "<h3 style='color: white;'>¡Es Hoy!</h3>";
    }
  }, 1000);

  /* =========================================
        7. RASPA Y GANA
        ========================================= */
  function inicializarRaspaditas() {
    const tarjetas = document.querySelectorAll(".tarjeta-contenedor");

    // Rutas confirmadas con ./ y extensión .png
    const rutasIconos = [
      "./assets/icono1.png",
      "./assets/icono2.png",
      "./assets/icono3.png",
      "./assets/icono4.png",
    ];

    tarjetas.forEach((tarjeta, index) => {
      const canvasExistente = tarjeta.querySelector(".canvas-raspar");
      if (canvasExistente) canvasExistente.remove();

      const canvas = document.createElement("canvas");
      canvas.classList.add("canvas-raspar");

      // Ajuste de tamaño
      const width = tarjeta.offsetWidth;
      const height = tarjeta.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      tarjeta.appendChild(canvas);

      const ctx = canvas.getContext("2d");

      // --- PROCESO DE DIBUJO ---
      const imgIcono = new Image();
      imgIcono.src = rutasIconos[index];

      imgIcono.onload = function () {
        // 1. Fondo Perlado Base
        const gradient = ctx.createRadialGradient(
          width / 2,
          height / 2,
          20,
          width / 2,
          height / 2,
          width,
        );
        gradient.addColorStop(0, "#fdfdfd");
        gradient.addColorStop(0.25, "#fdfdfd"); // El blanco se mantiene puro hasta el 70% del círculo
        gradient.addColorStop(1, "#6ad2f1"); // Solo el borde final es azul
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // 2. Dibujar el Icono SOBRE el gradiente (pero en la misma capa)
        const tamanoIcono = 80;
        const posX = width / 2 - tamanoIcono / 2;
        const posY = height / 2 - tamanoIcono / 2 - 15;

        ctx.globalAlpha = 0.5; // Efecto sello sutil
        ctx.drawImage(imgIcono, posX, posY, tamanoIcono, tamanoIcono);
        ctx.globalAlpha = 1.0;

        // 3. Texto informativo
        ctx.fillStyle = "#002366";
        ctx.font = "italic 600 13px 'Montserrat', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("RASPA AQUI", width / 2, height - 25);
      };

      // --- LÓGICA DE RASPADO (No cambia, pero ahora borra todo el Canvas) ---
      let isDrawing = false;
      function raspar(x, y) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2, false);
        ctx.fill();
      }

      // Eventos de interacción
      canvas.addEventListener("mousedown", () => (isDrawing = true));
      window.addEventListener("mouseup", () => (isDrawing = false));
      canvas.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        raspar(e.clientX - rect.left, e.clientY - rect.top);
      });

      // Soporte Táctil
      canvas.addEventListener(
        "touchstart",
        (e) => {
          isDrawing = true;
          if (e.cancelable) e.preventDefault();
        },
        { passive: false },
      );
      canvas.addEventListener(
        "touchmove",
        (e) => {
          if (!isDrawing) return;
          const rect = canvas.getBoundingClientRect();
          const touch = e.touches[0];
          raspar(touch.clientX - rect.left, touch.clientY - rect.top);
        },
        { passive: false },
      );
      canvas.addEventListener("touchend", () => (isDrawing = false));
    });
  }

  /*=========================================
     8. ACTIVADOR DE LA SECCIÓN MÁGICA (FIX: PERSISTENCIA DE ESTILOS)
    ========================================= */
const seccionMagica = document.querySelector(".seccion-bienvenida-magica");
const varitaHorizontal = document.querySelector(".varita-horizontal");

// Seleccionamos todos los elementos de la sección de los padres
const elementosTexto = document.querySelectorAll(
  ".txt-padres, .julio, .marinella, .texto-bienvenida-magico"
);

if (seccionMagica && varitaHorizontal && elementosTexto.length > 0) {
  const letrasSpans = []; 

  // 1. PROCESAMIENTO DE CADA BLOQUE SIN PERDER ESTILOS
  elementosTexto.forEach((bloque) => {
    // Obtenemos el texto pero mantenemos el acceso a los estilos del bloque
    const textoOriginal = bloque.innerText.replace(/\s+/g, " ").trim();
    const palabras = textoOriginal.split(" ");

    bloque.innerHTML = ""; // Limpiamos el contenedor

    palabras.forEach((palabraTexto, index) => {
      const spanPalabra = document.createElement("span");
      spanPalabra.classList.add("palabra-magica");
      
      // IMPORTANTE: El contenedor de la palabra hereda el color del padre (.txt-padres, .julio, etc.)
      spanPalabra.style.color = "inherit";
      spanPalabra.style.fontFamily = "inherit";

      for (let letra of palabraTexto) {
        const spanLetra = document.createElement("span");
        spanLetra.textContent = letra;
        spanLetra.classList.add("letra-magica");
        
        // CADA LETRA HEREDA EL COLOR (Neón, blanco o turquesa)
        spanLetra.style.color = "inherit";
        
        spanPalabra.appendChild(spanLetra);
        letrasSpans.push(spanLetra);
      }

      bloque.appendChild(spanPalabra);

      if (index < palabras.length - 1) {
        bloque.appendChild(document.createTextNode(" "));
      }
    });
  });

  // 2. CONFIGURACIÓN DEL OBSERVADOR
  const observerOptions = {
    root: null,
    threshold: 0.4,
  };

  const magicObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        varitaHorizontal.classList.add("activa");

        letrasSpans.forEach((span, index) => {
          // Ajustamos el retraso a 30ms para que la transición sea más ágil
          const retraso = index * 45;
          setTimeout(() => {
            span.style.animation = "caerPolvillo 1.2s ease-out forwards";
          }, retraso);
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  magicObserver.observe(seccionMagica);
}

/* --- RE-INICIALIZACIÓN PARA RESPONSIVE --- */
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (document.querySelector(".canvas-raspar")) {
      inicializarRaspaditas();
    }
  }, 300);
});

});


/* =========================================
   9. ENVÍO DE CONFIRMACIÓN POR WHATSAPP
   ========================================= */
function enviarConfirmacion() {
    const telefono = "573213631953"; 
    
    // Recuperamos el dato que guardaste en ejecutarEntrada
    const numInvitados = localStorage.getItem("numeroAsistentes") || "1";
    
    const texto = `¡Hola Juliana! Confirmo mi asistencia para tus 15 años. ` +
                  `Seremos un total de ${numInvitados} personas. ¡Estamos muy emocionados!`;
    
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;

    // Abrir en pestaña nueva para PC / App en Móvil
    window.open(url, "_blank");
}