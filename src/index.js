import './sass/main.scss';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewsApiService from './js/api';
import cardsImgsTpl from './templates/cards.hbs';

import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const newsApiService = new NewsApiService();
refs.loadMoreBtn.classList.add('is-hidden');

async function onSearch(e) {
  e.preventDefault();
  clearImagesContainer();
  newsApiService.resetPage();

  newsApiService.query = e.currentTarget.elements.searchQuery.value;

  try {
    const result = await newsApiService.fetchImages();
    let gallery = new SimpleLightbox('.gallery a');
    gallery.refresh();

    if (newsApiService.query === '' || result.hits.length === 0) {
      clearImagesContainer();
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    } else {
      refs.loadMoreBtn.classList.remove('is-hidden');
      Notiflix.Notify.success(`"Hooray! We found ${result.totalHits} images."`);
      appendImagesMarkup(result.hits);
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  try {
    const result = await newsApiService.fetchImages();
    appendImagesMarkup(result.hits);
    let gallery = new SimpleLightbox('.gallery a');
    gallery.refresh();

    const lenghtHits = refs.gallery.querySelectorAll('.photo-card').length;

    if (lenghtHits >= result.totalHits) {
      Notiflix.Notify.failure('"We are sorry, but you have reached the end of search results."');
      refs.loadMoreBtn.classList.add('is-hidden');
    }

    const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();

    refs.gallery.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.log(error);
  }
}

function appendImagesMarkup(images) {
  refs.gallery.insertAdjacentHTML('beforeend', cardsImgsTpl(images));
  newsApiService.createGallery();
}

function clearImagesContainer() {
  refs.gallery.innerHTML = '';
}
