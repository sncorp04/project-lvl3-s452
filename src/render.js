import { watch } from 'melanke-watchjs';

export default (state) => {
  watch(state, 'formState', () => {
    const addField = document.getElementById('add-field');
    const button = document.getElementById('add-button');
    const formActions = {
      init: () => {
        addField.classList.remove('is-invalid', 'is-valid');
        button.disabled = true;
        button.textContent = 'Add';
        addField.value = '';
      },
      valid: () => {
        addField.classList.remove('is-invalid');
        addField.classList.add('is-valid');
        button.disabled = false;
      },
      invalid: () => {
        addField.classList.add('is-invalid');
        button.disabled = true;
      },
      loading: () => {
        button.disabled = true;
        button.textContent = 'Loading...';
      },
    };
    formActions[state.formState]();
  });

  watch(state, 'rssChannelsCount', () => {
    const rssList = document.getElementById('rssList');
    const li = document.createElement('li');
    const h2 = document.createElement('h2');
    const numberOfRss = state.rssChannelsCount - 1;
    h2.textContent = state.rssData[numberOfRss].title;
    li.className = 'list-group-item';
    li.appendChild(h2);
    const p = document.createElement('p');
    p.textContent = state.rssData[numberOfRss].description;
    li.appendChild(p);
    const articles = [...state.rssData[numberOfRss].articles];
    const ulItems = document.createElement('ul');
    ulItems.className = 'list-group';
    articles.forEach((item) => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const a = document.createElement('a');
      a.href = link;
      a.textContent = title;
      const liChannel = document.createElement('li');
      liChannel.className = 'list-group-item';
      liChannel.appendChild(a);
      ulItems.appendChild(liChannel);
    });
    li.appendChild(ulItems);
    rssList.appendChild(li);
  });

  watch(state, 'error', () => {
    const errorField = document.getElementById('error');
    errorField.textContent = state.error;
  });
};
