/**
 * Lightbox
 * Открывает изображения галереи кейса в полноэкранном оверлее с навигацией
 * и поддержкой зума (колесо, двойной клик, pinch, drag, кнопки).
 */

export const initLightbox = () => {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;

  const img = overlay.querySelector('.lightbox__img');
  const stage = overlay.querySelector('.lightbox__stage');
  const counter = overlay.querySelector('.lightbox__counter');
  const btnPrev = overlay.querySelector('.lightbox__btn--prev');
  const btnNext = overlay.querySelector('.lightbox__btn--next');
  const btnClose = overlay.querySelector('.lightbox__close');
  const btnZoomIn = overlay.querySelector('.lightbox__zoom-btn--in');
  const btnZoomOut = overlay.querySelector('.lightbox__zoom-btn--out');
  const btnZoomReset = overlay.querySelector('.lightbox__zoom-btn--reset');

  const MIN_SCALE = 1;
  const MAX_SCALE_CAP = 5;
  const MIN_MAX_SCALE = 2;
  const UPSCALE_HEADROOM = 1.25; // допустимое превышение native-пикселей для удобства

  let images = [];
  let current = 0;
  let scale = 1;
  let tx = 0;
  let ty = 0;
  let maxScale = MAX_SCALE_CAP;

  const recomputeMaxScale = () => {
    // Ограничиваем zoom так, чтобы не растягивать картинку сильно выше native-разрешения
    if (!img.naturalWidth || !img.offsetWidth) {
      maxScale = MAX_SCALE_CAP;
      return;
    }
    const ratio = Math.min(
      img.naturalWidth / img.offsetWidth,
      img.naturalHeight / img.offsetHeight
    );
    const limit = ratio * UPSCALE_HEADROOM;
    maxScale = Math.max(MIN_MAX_SCALE, Math.min(MAX_SCALE_CAP, limit));
  };

  const applyTransform = () => {
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    img.classList.toggle('lightbox__img--zoomed', scale > 1);
  };

  const clampPan = () => {
    // Ограничиваем смещение, чтобы картинку нельзя было утащить далеко за границы сцены
    const stageRect = stage.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    // imgRect уже учитывает текущий scale/translate — вычислим допустимые границы
    const maxX = Math.max(0, (imgRect.width - stageRect.width) / 2);
    const maxY = Math.max(0, (imgRect.height - stageRect.height) / 2);
    tx = Math.max(-maxX, Math.min(maxX, tx));
    ty = Math.max(-maxY, Math.min(maxY, ty));
  };

  const resetZoom = () => {
    scale = 1;
    tx = 0;
    ty = 0;
    applyTransform();
  };

  const setScale = (newScale, originX = 0, originY = 0) => {
    newScale = Math.max(MIN_SCALE, Math.min(maxScale, newScale));
    if (newScale === scale) return;
    const f = newScale / scale;
    // originX/Y — координаты точки в системе сцены (центр = 0,0)
    tx = originX - f * (originX - tx);
    ty = originY - f * (originY - ty);
    scale = newScale;
    if (scale <= 1.001) {
      scale = 1;
      tx = 0;
      ty = 0;
    } else {
      clampPan();
    }
    applyTransform();
  };

  const stageCoords = (clientX, clientY) => {
    const r = stage.getBoundingClientRect();
    return { x: clientX - r.left - r.width / 2, y: clientY - r.top - r.height / 2 };
  };

  const show = (index) => {
    current = (index + images.length) % images.length;
    img.src = images[current].src;
    img.alt = images[current].alt;
    counter.textContent = `${current + 1} / ${images.length}`;
    btnPrev.style.display = images.length > 1 ? '' : 'none';
    btnNext.style.display = images.length > 1 ? '' : 'none';
    resetZoom();
    if (img.complete && img.naturalWidth) {
      recomputeMaxScale();
    } else {
      img.addEventListener('load', recomputeMaxScale, { once: true });
    }
  };

  window.addEventListener('resize', () => {
    if (overlay.classList.contains('lightbox--open')) recomputeMaxScale();
  });

  const open = (index) => {
    show(index);
    overlay.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay.classList.remove('lightbox--open');
    document.body.style.overflow = '';
    setTimeout(() => { img.src = ''; resetZoom(); }, 300);
  };

  // Клик по миниатюрам
  document.querySelectorAll('.case-gallery__img').forEach((el, i) => {
    el.addEventListener('click', () => {
      images = [...document.querySelectorAll('.case-gallery__img')];
      open(i);
    });
  });

  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
  btnClose.addEventListener('click', close);

  // Кнопки зума
  btnZoomIn.addEventListener('click', (e) => { e.stopPropagation(); setScale(scale * 1.4); });
  btnZoomOut.addEventListener('click', (e) => { e.stopPropagation(); setScale(scale / 1.4); });
  btnZoomReset.addEventListener('click', (e) => { e.stopPropagation(); resetZoom(); });

  // Клик по оверлею вне картинки — закрытие
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('lightbox__backdrop')) close();
  });

  // Клавиатурная навигация
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('lightbox--open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
    else if (e.key === '+' || e.key === '=') setScale(scale * 1.4);
    else if (e.key === '-' || e.key === '_') setScale(scale / 1.4);
    else if (e.key === '0') resetZoom();
  });

  // Колесо мыши — зум в точку курсора
  stage.addEventListener('wheel', (e) => {
    if (!overlay.classList.contains('lightbox--open')) return;
    e.preventDefault();
    const { x, y } = stageCoords(e.clientX, e.clientY);
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    setScale(scale * factor, x, y);
  }, { passive: false });

  // Двойной клик — toggle зум 1x / 2.5x
  img.addEventListener('dblclick', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (scale > 1) {
      resetZoom();
    } else {
      const { x, y } = stageCoords(e.clientX, e.clientY);
      setScale(2.5, x, y);
    }
  });

  // Drag для перемещения и pinch для зума (pointer events)
  const pointers = new Map();
  let dragStart = null; // { x, y, tx, ty }
  let pinchStart = null; // { dist, scale, cx, cy }

  const onPointerDown = (e) => {
    if (!overlay.classList.contains('lightbox--open')) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    stage.setPointerCapture(e.pointerId);

    if (pointers.size === 1 && scale > 1) {
      dragStart = { x: e.clientX, y: e.clientY, tx, ty };
      img.classList.add('lightbox__img--dragging');
    } else if (pointers.size === 2) {
      const pts = [...pointers.values()];
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const dist = Math.hypot(dx, dy);
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const { x, y } = stageCoords(midX, midY);
      pinchStart = { dist, scale, cx: x, cy: y };
      dragStart = null;
    }
  };

  const onPointerMove = (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2 && pinchStart) {
      const pts = [...pointers.values()];
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const dist = Math.hypot(dx, dy);
      const newScale = pinchStart.scale * (dist / pinchStart.dist);
      setScale(newScale, pinchStart.cx, pinchStart.cy);
    } else if (pointers.size === 1 && dragStart && scale > 1) {
      tx = dragStart.tx + (e.clientX - dragStart.x);
      ty = dragStart.ty + (e.clientY - dragStart.y);
      clampPan();
      applyTransform();
    }
  };

  const onPointerUp = (e) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchStart = null;
    if (pointers.size === 0) {
      dragStart = null;
      img.classList.remove('lightbox__img--dragging');
    }
  };

  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', onPointerUp);
  stage.addEventListener('pointercancel', onPointerUp);

  // Предотвращаем нативный drag
  img.addEventListener('dragstart', (e) => e.preventDefault());
};
