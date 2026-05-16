async function loadItems() {
  const categoria = document.getElementById('filterCategoria').value;
  const url = '/itens' + (categoria ? ('?categoria=' + encodeURIComponent(categoria)) : '');
  const res = await fetch(url);
  const page = await res.json();
  const list = document.getElementById('list');
  list.innerHTML = '';
  if (page.content.length === 0) {
    list.innerHTML = '<p>Nenhum item encontrado</p>';
    return;
  }
  const table = document.createElement('table');
  const header = document.createElement('tr');
  header.innerHTML = '<th>Nome</th><th>Tipo</th><th>Categorias</th><th>Console</th><th>Retirada</th><th>Devolução</th>';
  table.appendChild(header);
  page.content.forEach(i => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i.nome}</td><td>${i.tipoMidia}</td><td>${(i.categorias||[]).join(', ')}</td><td>${i.console||''}</td><td>${i.dataRetirada||''}</td><td>${i.dataDevolucao||''}</td>`;
    table.appendChild(tr);
  });
  list.appendChild(table);
}

window.loadItems = loadItems;
window.addEventListener('load', loadItems);
