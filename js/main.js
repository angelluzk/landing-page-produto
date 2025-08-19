document.addEventListener("includesLoaded", () => {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile');
  const header = document.querySelector('header');

  // Menu mobile toggle
  burger?.addEventListener('click', () => {
    const isHidden = menu.classList.toggle('hidden');
    burger.setAttribute('aria-expanded', String(!isHidden));
    burger.querySelector('span')?.classList.toggle('rotate-45');
  });

  // Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el){
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        menu?.classList.add('hidden');
      }
    });
  });

  // Ano dinâmico
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Barra de progresso scroll
  const progress = document.getElementById('progress');
  window.addEventListener('scroll', () => {
    if(progress){
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = document.documentElement.scrollTop;
      progress.style.width = (scrollTop / docHeight * 100) + "%";
    }
  });

  // Header aparece/esconde ao rolar
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if(header){
      header.style.transform = currentScroll > lastScroll && currentScroll > 100 ? 'translateY(-100%)' : 'translateY(0)';
    }
    lastScroll = currentScroll;
  });

  // Inicializa AOS
  if(typeof AOS !== 'undefined') AOS.init({ duration:800, easing:'ease-out', once:true, mirror:false });
});