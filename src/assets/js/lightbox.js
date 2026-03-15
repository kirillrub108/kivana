/**
 * Lightbox
 * Открывает изображения галереи кейса в полноэкранном оверлее с навигацией.
 */

export const initLightbox = () => {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;

  const img = overlay.querySelector('.lightbox__img');
  const counter = overlay.querySelector('.lightbox__counter');
  const btnPrev = overlay.querySelector('.lightbox__btn--prev');
  const btnNext = overlay.querySelector('.lightbox__btn--next');
  const btnClose = overlay.querySelector('.lightbox__close');

  let images = [];
  let current = 0;

  const show = (index) => {
    current = (index + images.length) % images.length;
    img.src = images[current].src;
    img.alt = images[current].alt;
    counter.textContent = `${current + 1} / ${images.length}`;
    btnPrev.style.display = images.length > 1 ? '' : 'none';
    btnNext.style.display = images.length > 1 ? '' : 'none';
  };

  const open = (index) => {
    show(index);
    overlay.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay.classList.remove('lightbox--open');
    document.body.style.overflow = '';
    // Небольшая задержка чтобы не мигало при закрытии
    setTimeout(() => { img.src = ''; }, 300);
  };

  // Собираем все изображения галереи
  document.querySelectorAll('.case-gallery__img').forEach((el, i) => {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', () => {
      images = [...document.querySelectorAll('.case-gallery__img')];
      open(i);
    });
  });

  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
  btnClose.addEventListener('click', close);

  // Клик по оверлею вне картинки закрывает
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('lightbox__backdrop')) close();
  });

  // Клавиатурная навигация
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('lightbox--open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
};
