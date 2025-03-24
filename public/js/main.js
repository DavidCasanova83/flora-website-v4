//mobile nav
// Sélection des éléments
const mobileNav = document.querySelector('.mnav');
const closeBtn = document.querySelector('.mnav__close-btn');
const closeBtnIcon = document.querySelector('.mnav__close-btn-icon');

// Ajout du gestionnaire d'événements pour ouvrir/fermer la nav
closeBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('mnav--open');
  closeBtnIcon.classList.toggle('rotate-90'); // Animation de rotation de l'icône
});


//swiper
const swiper = new Swiper('.swiper', {
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  speed: 2000, // Vitesse de transition en millisecondes (1 seconde ici)
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  effect: 'slide', // Effet de transition (optionnel, pour un effet plus fluide)
});


//faq
const faqItems = document.querySelectorAll('.faq__itm');

faqItems.forEach((item) => {
   const faqBtn = item.querySelector('.faq__btn');

   item.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      const iconClass = isOpen ? 'ri-substract-fill' : 'ri-add-fill';
      const iconElement = faqBtn.querySelector('i');
      iconElement.classList = `${iconClass} text-2xl`;
   });
});


//scroll reveal animations
const sr = ScrollReveal({
  origin: 'bottom',
  distance: '60px',
  duration : 3000,
  delay: 400,
  //reset: true // resets animation
});

//hero
sr.reveal('.hero__text', { origin: 'top',delay: 50,  duration : 3000});
sr.reveal('.hero__img');


// //slider photo home
// sr.reveal('.slider__photo');


//stats
sr.reveal('.stats__item', { delay: 600, distance: '100px', interval: 100, origin: 'top'});

// services
sr.reveal('.services');
sr.reveal('.services__top');
sr.reveal('.services__item', {
  delay: 600,
  distance :'100px',
  interval:100,
  origin:'top'
});

// appointment
sr.reveal('.appointment__title', { origin: 'top',delay: 50,  duration : 3000});
sr.reveal('.appointment__form');

// testimonials
sr.reveal('.testimonials');
sr.reveal('.testimonials_container');

// team
sr.reveal('.team__title');
sr.reveal('.team__slider');

// faq
sr.reveal('.faq__title');
sr.reveal('.faq__item',{
  delay: 600,
  distance :'100px',
  interval:100,
  origin:'top'
});

// departments
sr.reveal('.departments__bg');
sr.reveal('.departments__container');


// blog
sr.reveal('.blog__title');
sr.reveal('.blog__post',{
  delay: 600,
  distance :'100px',
  interval:100,
  origin:'top'
});

// brands
sr.reveal('.brands__logo',{
  delay: 600,
  distance :'100px',
  interval:100,
  origin:'top'
});


// newsletter
sr.reveal('.newsletter');
sr.reveal('.newsletter__container');

// // footer

// sr.reveal('.footer__item',{
//   delay: 600,
//   distance :'100px',
//   interval:100,
//   origin:'top'
// });
