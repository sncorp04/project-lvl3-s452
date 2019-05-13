import axios from 'axios';
import { isURL } from 'validator';
import _ from 'lodash';
import { watch } from 'melanke-watchjs';
import $ from 'jquery';
import { renderChannel, renderArticles } from './render';

const getAction = (listOfActions, urlString, objState) => (
  listOfActions.find(({ check }) => check(urlString, objState))
);

const loadAndParseData = (url, numberOfChannel) => (
  axios.get(`https://cors-anywhere.herokuapp.com/${url}`)
    .then((response) => {
      try {
        const parser = new DOMParser();
        const data = parser.parseFromString(response.data, 'application/xml');
        const articles = [...data.querySelectorAll('item')]
          .map(item => ({
            title: item.querySelector('title').textContent,
            description: item.querySelector('description').textContent,
            link: item.querySelector('link').textContent,
          }));
        return {
          error: '',
          title: data.querySelector('title').textContent,
          description: data.querySelector('description').textContent,
          articles,
          url,
          numberOfChannel,
        };
      } catch {
        return {
          error: 'Invalid URL. Please check the URL you entered',
        };
      }
    })
    .catch(() => ({
      error: 'Network error. Please try again later',
    }))
);

export default () => {
  const state = {
    formState: 'init',
    requestURL: '',
    rssChannelsData: [],
    rssChannelsCount: 0,
    error: '',
    updated: false,
  };

  const validationActions = [
    {
      check: url => !isURL(url),
      action: () => {
        state.formState = 'invalid';
      },
    },
    {
      check: url => state.rssChannelsData.map(channel => channel.url).includes(url),
      action: () => {
        state.error = 'RSS channel is already exist';
      },
    },
    {
      check: url => url.length === 0,
      action: () => {
        state.formState = 'init';
      },
    },
    {
      check: url => isURL(url),
      action: () => {
        state.formState = 'valid';
      },
    },
  ];
  const addField = document.getElementById('add-field');
  addField.addEventListener('input', ({ target }) => {
    state.error = '';
    const url = target.value;
    state.requestURL = url;
    const { action } = getAction(validationActions, url);
    action();
  });

  const addForm = document.getElementById('add-form');
  addForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    state.formState = 'loading';
    loadAndParseData(state.requestURL, state.rssChannelsCount)
      .then((rssDataChannel) => {
        if (rssDataChannel.error !== '') {
          state.error = rssDataChannel.error;
          state.formState = 'init';
          return;
        }
        state.rssChannelsData.push(rssDataChannel);
        state.formState = 'init';
        state.requestURL = '';
        state.rssChannelsCount += 1;
      });
  });

  const updateArticles = () => {
    const promises = state.rssChannelsData
      .map(channel => channel.url)
      .map(url => loadAndParseData(url));
    Promise.all(promises)
      .then((loaded) => {
        loaded.forEach((loadedArticle) => {
          const currentChannel = state.rssChannelsData
            .find(channel => channel.url === loadedArticle.url);
          const { articles, numberOfChannel } = currentChannel;
          const newArticle = _.differenceWith(loadedArticle.articles, articles, _.isEqual);
          if (newArticle.length > 0) {
            newArticle.forEach((article) => {
              state.rssChannelsData[numberOfChannel].articles.unshift(article);
              state.updated = true;
            });
          }
        });
      });
  };

  setInterval(updateArticles, 5000);

  watch(state, 'formState', () => {
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

  watch(state, 'rssChannelsCount', () => {
    renderChannel(state);
    renderArticles(state);
  });

  watch(state, 'updated', () => {
    renderArticles(state);
    state.updated = false;
  });
};
