import axios from 'axios';
import { isURL } from 'validator';
import render from './render';

const getAction = (listOfActions, urlString, objState) => (
  listOfActions.find(({ check }) => check(urlString, objState))
);

export default () => {
  const state = {
    formState: 'init',
    listURLs: [],
    requestURL: '',
    rssChannelsCount: 0,
    rssData: [],
    error: '',
  };

  const validationActions = [
    {
      check: url => !isURL(url),
      action: () => {
        state.formState = 'invalid';
      },
    },
    {
      check: url => state.listURLs.includes(url),
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
    axios.get(`https://cors-anywhere.herokuapp.com/${state.requestURL}`)
      .then((response) => {
        try {
          console.log(state.listURLs);
          const parser = new DOMParser();
          const data = parser.parseFromString(response.data, 'application/xml');
          const rssDataChannel = {
            title: data.querySelector('title').textContent,
            description: data.querySelector('description').textContent,
            articles: [...data.querySelectorAll('item')],
          };
          state.rssData.push(rssDataChannel);
          state.rssChannelsCount += 1;
          state.formState = 'init';
          state.listURLs.push(state.requestURL);
          state.requestURL = '';
        } catch (err) {
          state.formState = 'invalid';
          state.error = 'Invalid URL. Please check thr URL you entered';
        }
      })
      .catch(() => {
        state.error = 'Network error. Please try again later';
        state.formState = 'init';
      });
  });
  render(state);
};
