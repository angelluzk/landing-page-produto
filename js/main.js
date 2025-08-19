// Aguarda o evento "includesLoaded" (ou seja, todos os includes já foram carregados)
document.addEventListener("includesLoaded", () => {

  /* =========================
   *  ELEMENTOS DO DOM
   * ========================= */
  const burger = document.getElementById('burger');   // Botão hamburguer
  const menu = document.getElementById('mobile');     // Menu mobile
  const header = document.querySelector('header');    // Header principal
  const yearEl = document.getElementById('year');     // Elemento para mostrar o ano atual
  const progress = document.getElementById('progress'); // Barra de progresso de leitura


  /* =========================
   *  MENU MOBILE (toggle)
   * ========================= */
  burger?.addEventListener('click', () => {
    // Alterna a visibilidade do menu
    const isHidden = menu.classList.toggle('hidden');

    // Atualiza atributos de acessibilidade
    burger.setAttribute('aria-expanded', String(!isHidden)); 
    menu.setAttribute('aria-hidden', String(isHidden));

    // Alterna classe para animar o ícone hamburguer (se houver <span> dentro dele)
    burger.querySelector('span')?.classList.toggle('rotate-45');
  });


  /* =========================
   *  SCROLL SUAVE EM ÂNCORAS
   * ========================= */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1); // Ex.: "#sobre" -> "sobre"
      const el = document.getElementById(id);

      if (el) {
        e.preventDefault(); // Evita pulo instantâneo
        el.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Rolagem suave

        // Fecha o menu mobile após clicar
        menu?.classList.add('hidden');
        menu?.setAttribute('aria-hidden', "true");
        burger?.setAttribute('aria-expanded', "false");
      }
    });
  });


  /* =========================
   *  ANO DINÂMICO NO RODAPÉ
   * ========================= */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* =========================
   *  BARRA DE PROGRESSO DE SCROLL
   * ========================= */
  const updateProgress = () => {
    if (progress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = document.documentElement.scrollTop;
      progress.style.width = (scrollTop / docHeight * 100) + "%";
    }
  };


  /* =========================
   *  HEADER ESCONDE/APARECE
   * ========================= */
  let lastScroll = 0;
  const updateHeader = () => {
    const currentScroll = window.scrollY;

    if (header) {
      // Esconde o header ao descer, mostra ao subir
      header.style.transform = currentScroll > lastScroll && currentScroll > 100
        ? 'translateY(-100%)'
        : 'translateY(0)';
    }

    lastScroll = currentScroll;
  };


  /* =========================
   *  OTIMIZAÇÃO DE SCROLL
   * =========================
   * Ouvintes de scroll disparam MUITAS vezes por segundo.
   * Para evitar travar a performance, usamos requestAnimationFrame
   * como "debounce" natural: só executa uma vez por frame (~60fps).
   */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  });


  /* =========================
   *  ANIMAÇÕES AOS
   * ========================= */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,     // duração das animações (ms)
      easing: 'ease-out',// suavização
      once: true,        // só anima na primeira vez
      mirror: false      // não anima ao voltar no scroll
    });
  } else {
    console.warn("AOS não encontrado. As animações não foram inicializadas.");
  }

});