// Menu mobile: alterna navegação
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobile');
    const desktopMenu = document.getElementById('menu');
    burger?.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('hidden');
      burger.setAttribute('aria-expanded', String(!isOpen));
    });

    // Scroll suave com suporte a browsers antigos
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id) || document.querySelector(`[id='${id}']`);
        if(el){ e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); menu?.classList.add('hidden'); }
      });
    });

    // Ano dinâmico
    document.getElementById('year').textContent = new Date().getFullYear();