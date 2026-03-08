/**
 * Navigation
 * Мобильное меню, скролл-поведение хедера.
 */

export const initNav = () => {
  const header = document.querySelector('.header');
  const burger = document.querySelector('.header__burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');

  if (!header) return;

  // Скролл-тень хедера
  const onScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Мобильное меню
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('mobile-nav--open');
      burger.classList.toggle('header__burger--open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('mobile-nav--open');
        burger.classList.remove('header__burger--open');
        document.body.style.overflow = '';
      });
    });
  }
};
