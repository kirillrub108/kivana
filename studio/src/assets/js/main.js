/**
 * Main JS
 * Точка входа: инициализация всех модулей.
 */

import { initNav } from './nav.js';
import { initAnimations } from './animations.js';

// Фильтрация кейсов на странице портфолио
const initFilter = () => {
  const filterBtns = document.querySelectorAll('.filter__btn');
  const cards = document.querySelectorAll('[data-category]');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('filter__btn--active'));
      btn.classList.add('filter__btn--active');

      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initAnimations();
  initFilter();
});
