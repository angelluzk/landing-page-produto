document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");
  const promises = Array.from(includes).map(async (el) => {
    const file = el.getAttribute("data-include");
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`Falha ao carregar ${file}: ${res.status}`);
      const text = await res.text();
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