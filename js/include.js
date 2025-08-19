// Quando o DOM terminar de carregar (estrutura básica disponível),
// mas antes de imagens/CSS externos, executa este bloco:
document.addEventListener("DOMContentLoaded", () => {

  // Seleciona todos os elementos que possuem o atributo `data-include`
  // Exemplo no HTML: <div data-include="partials/header.html"></div>
  const includes = Array.from(document.querySelectorAll("[data-include]"));

  // Caso não exista nenhum include, já dispara o evento de finalização
  if (includes.length === 0) {
    document.dispatchEvent(new CustomEvent("includesLoaded", { 
      detail: { total: 0, ok: 0, fail: 0 } 
    }));
    return; // não tem nada pra fazer
  }

  // Detecta se a página foi aberta diretamente via "file://"
  // Ex.: clicando 2x em um .html no computador.
  const isLocal = location.protocol === "file:";

  // Cache em memória: evita refazer requisições do mesmo arquivo
  // caso seja usado em mais de um elemento.
  const memCache = new Map();


  /* 
   * ========== FUNÇÕES DE CARREGAMENTO ==========
   */

  // Função para carregar arquivo quando em ambiente local (file://).
  // Aqui usamos XMLHttpRequest de forma assíncrona.
  const loadLocal = (file) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", file, true); // true => assíncrono
      xhr.onload = () => {
        // Em file://, status pode vir como 0 mesmo quando funcionou.
        if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
          resolve(xhr.responseText);
        } else {
          reject(new Error(`Falha ao carregar ${file}: ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error(`Erro de rede ao carregar ${file}`));
      xhr.send();
    });

  // Função para carregar arquivo quando em ambiente servidor (http/https).
  // Usa o fetch moderno, retornando uma Promise.
  const loadHttp = (file) =>
    fetch(file, { cache: "default" })
      .then((res) => {
        if (!res.ok) throw new Error(`Falha ao carregar ${file}: ${res.status}`);
        return res.text();
      });

  // Função central: decide qual método usar (local ou http)
  // e aplica cache em memória para evitar downloads repetidos.
  const getFile = (file) => {
    if (memCache.has(file)) return memCache.get(file);
    const p = (isLocal ? loadLocal(file) : loadHttp(file));
    memCache.set(file, p);
    return p;
  };


  /* 
   * ========== EXECUÇÃO DE SCRIPTS ==========
   * Por padrão, se você inserir <script> dentro de innerHTML,
   * ele NÃO executa automaticamente. Esta função reexecuta os scripts.
   */
  const executeScripts = (container) => {
    container.querySelectorAll("script").forEach((oldScript) => {
      const s = document.createElement("script");

      // Copia os atributos (type, async, defer etc.)
      for (const { name, value } of Array.from(oldScript.attributes)) {
        s.setAttribute(name, value);
      }

      // Copia o conteúdo interno do script
      s.text = oldScript.textContent ?? "";

      // Substitui a tag antiga pelo novo script executável
      oldScript.replaceWith(s);
    });
  };


  /* 
   * ========== LOOP DE PROCESSAMENTO ==========
   * Para cada elemento com data-include:
   * 1. Busca o arquivo
   * 2. Insere conteúdo no DOM
   * 3. (Opcional) executa scripts que estavam no include
   * 4. Marca sucesso/falha
   */
  let ok = 0, fail = 0;

  const jobs = includes.map(async (el) => {
    const file = el.getAttribute("data-include");
    try {
      // 1. Busca o conteúdo do arquivo
      const html = await getFile(file);

      // 2. Insere no elemento
      el.innerHTML = html;

      // 3. Executa scripts internos do fragmento, se houver
      executeScripts(el);

      // 4. Marca sucesso
      ok++;
      return true;
    } catch (e) {
      // Caso haja erro, mostra no console e insere aviso visível no DOM
      console.groupCollapsed("[include] Erro");
      console.error(e);
      console.groupEnd();

      el.innerHTML = `<p role="alert" style="color:red">Não foi possível carregar <code>${file}</code></p>`;
      fail++;
      return false;
    }
  });


  /* 
   * ========== FINALIZAÇÃO ==========
   * Quando TODOS os includes terminarem (sucesso ou falha),
   * dispara o evento customizado "includesLoaded".
   * O objeto detail informa quantos deram certo e quantos falharam.
   */
  Promise.allSettled(jobs).then(() => {
    document.dispatchEvent(new CustomEvent("includesLoaded", {
      detail: { total: includes.length, ok, fail }
    }));
  });
});