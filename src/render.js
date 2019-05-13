export const renderChannel = (state) => {
  const rssList = document.getElementById('rssList');
  const li = document.createElement('li');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');
  const ul = document.createElement('ul');
  const numberOfChannel = state.rssChannelsData.length - 1;
  p.textContent = state.rssChannelsData[numberOfChannel].description;
  h2.textContent = state.rssChannelsData[numberOfChannel].title;
  ul.id = `channel${numberOfChannel}`;
  ul.className = 'list-group';
  li.className = 'list-group-item';
  li.appendChild(h2);
  li.appendChild(p);
  li.appendChild(ul);
  rssList.appendChild(li);
};

export const renderArticles = (state) => {
  state.rssChannelsData.forEach((channel, index) => {
    const { articles } = channel;
    const ul = document.getElementById(`channel${index}`);
    ul.innerHTML = '';
    articles.forEach((item) => {
      const { title, description, link } = item;
      const a = document.createElement('a');
      a.href = link;
      a.textContent = title;
      const li = document.createElement('li');
      li.className = 'list-group-item';
      const div = document.createElement('div');
      div.classList.add('col-10');
      div.appendChild(a);
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-primary');
      button.setAttribute('type', 'button');
      button.setAttribute('data-toggle', 'modal');
      button.setAttribute('data-target', '#myModal');
      button.setAttribute('data-title', title);
      button.setAttribute('data-description', description);
      button.textContent = 'Detail';
      const divBtn = document.createElement('div');
      divBtn.className = 'col';
      divBtn.appendChild(button);
      const row = document.createElement('div');
      row.className = 'row';
      row.appendChild(div);
      row.appendChild(divBtn);
      li.appendChild(row);
      ul.appendChild(li);
    });
  });
};
