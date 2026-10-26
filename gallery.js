(() => {
  const viewer = document.querySelector('#photo-viewer');
  const triggers = [...document.querySelectorAll('.photo-trigger')];
  const image = document.querySelector('#viewer-image');
  const counter = document.querySelector('#photo-counter');
  const description = document.querySelector('#photo-description');
  const filters = [...document.querySelectorAll('.gallery-filter')];
  let activePhotos = [];
  let current = 0;
  let returnFocus;

  function show(index) {
    current = (index + activePhotos.length) % activePhotos.length;
    const photo = activePhotos[current];
    image.src = photo.dataset.full;
    image.alt = photo.querySelector('img').alt;
    description.textContent = image.alt;
    counter.textContent = `${current + 1} / ${activePhotos.length}`;
  }

  triggers.forEach((photo) => {
    photo.addEventListener('click', () => {
      returnFocus = photo;
      activePhotos = [...new Map(triggers
        .filter(item => item.dataset.gallery === photo.dataset.gallery && !item.hidden)
        .map(item => [item.dataset.full, item])).values()];
      show(activePhotos.findIndex(item => item.dataset.full === photo.dataset.full));
      viewer.showModal();
      document.body.classList.add('viewing-photo');
    });
  });
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const category = filter.dataset.filter;
      triggers.filter(photo => photo.dataset.gallery === 'photography').forEach(photo => {
        photo.hidden = category !== 'all' && photo.dataset.category !== category;
      });
      filters.forEach(button => button.setAttribute('aria-pressed', String(button === filter)));
      const visibleCount = triggers.filter(photo => photo.dataset.gallery === 'photography' && !photo.hidden).length;
      document.querySelector('#gallery-count').textContent = `${visibleCount} photographs`;
    });
  });
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.viewer-prev').addEventListener('click', () => show(current - 1));
  viewer.querySelector('.viewer-next').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('viewing-photo');
    returnFocus?.focus({ preventScroll: true });
  });
  viewer.addEventListener('click', (event) => {
    if (event.target !== viewer) return;
    const rect = viewer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
  });
})();
