document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");
  const promises = Array.from(includes).map(async (el) => {
    const file = el.getAttribute("data-include");

    // Detecta se está rodando via file://
    const isLocal = window.location.protocol === 'file:';


    try {
      let text;
      if (isLocal) {
        // Fallback usando XMLHttpRequest para rodar localmente
        const xhr = new XMLHttpRequest();
        xhr.open('GET', file, false); // síncrono para garantir carregamento
        xhr.send();
        if (xhr.status >= 200 && xhr.status < 300) {
          text = xhr.responseText;
        } else {
          throw new Error(`Falha ao carregar ${file}: ${xhr.status}`);
        }
      } else {
        // Fetch normal para servidor (GitHub Pages ou local com servidor)
        const res = await fetch(file);
        if (!res.ok) throw new Error(`Falha ao carregar ${file}: ${res.status}`);
        text = await res.text();
      }


      el.innerHTML = text;
      return true;
    } catch (err) {
      console.error(err);
      el.innerHTML = `<p style="color:red">Não foi possível carregar ${file}</p>`;
      return false;
    }
  });


  Promise.all(promises).then(() => {
    // sinaliza que todos os includes foram carregados
    document.dispatchEvent(new CustomEvent('includesLoaded'));
  });
});