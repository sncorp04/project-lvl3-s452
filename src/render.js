import { watch } from 'melanke-watchjs';
import $ from 'jquery';

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
        button.textContent = 'Add';
        button.disabled = false;
      },
      invalid: () => {
        addField.classList.add('is-invalid');
        button.textContent = 'Add';
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
      const description = item.querySelector('description').textContent;
      const link = item.querySelector('link').textContent;
      const a = document.createElement('a');
      a.href = link;
      a.textContent = title;
      const liChannel = document.createElement('li');
      liChannel.className = 'list-group-item';
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
      liChannel.appendChild(row);
      ulItems.appendChild(liChannel);
    });
    li.appendChild(ulItems);
    rssList.appendChild(li);
  });

  watch(state, 'error', () => {
    const errorField = document.getElementById('error');
    errorField.textContent = state.error;
  });

  const modalWindow = document.getElementById('myModal');
  $('#myModal').on('show.bs.modal', (event) => {
    const button = $(event.relatedTarget);
    modalWindow.querySelector('.modal-body').innerHTML = button.data('description');
    modalWindow.querySelector('.modal-title').innerHTML = button.data('title');
  });
};
