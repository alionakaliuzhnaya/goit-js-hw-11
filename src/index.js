import './sass/main.scss';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '24387363-33de24eb2750f1937d9fd7176';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSubmitForm);

function onSubmitForm(event) {
  event.preventDefaukt();
}
