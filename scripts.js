document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq .faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            // Закриваємо всі відкриті елементи
            faqItems.forEach(el => {
                if (el !== item && el.classList.contains('active')) {
                    el.classList.remove('active');
                }
            });
            
            // Переключаємо поточний елемент
            item.classList.toggle('active');
        });
    });
});


const carousel = document.querySelector('.testimonials-carousel');

let isMouseDown = false;
let startX;
let scrollLeft;

carousel.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
  carousel.classList.add('grabbing');
});

carousel.addEventListener('mouseleave', () => {
  isMouseDown = false;
  carousel.classList.remove('grabbing');
  carousel.classList.remove('grabbing', 'noselect');
});

carousel.addEventListener('mouseup', () => {
  isMouseDown = false;
  carousel.classList.remove('grabbing');
  carousel.classList.remove('grabbing', 'noselect');
});

carousel.addEventListener('mousemove', (e) => {
  if (!isMouseDown) return; // только если мышь зажата
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 2; // коэффициент для увеличения скорости прокрутки
  carousel.scrollLeft = scrollLeft - walk;
  carousel.classList.add('grabbing', 'noselect');
});



// форма отправки




// слайдер карточки=========================================================================== 
const serviceSlider = document.querySelector('.services-slider');

let isServiceSliderActive = false;
let serviceSliderStartX;
let serviceSliderScrollLeft;

serviceSlider.addEventListener('mousedown', (e) => {
  isServiceSliderActive = true;
  serviceSliderStartX = e.pageX - serviceSlider.offsetLeft;
  serviceSliderScrollLeft = serviceSlider.scrollLeft;
  serviceSlider.classList.add('grabbing', 'noselect');
});

serviceSlider.addEventListener('mouseleave', () => {
  isServiceSliderActive = false;
  serviceSlider.classList.remove('grabbing', 'noselect');
});

serviceSlider.addEventListener('mouseup', () => {
  isServiceSliderActive = false;
  serviceSlider.classList.remove('grabbing', 'noselect');
});

serviceSlider.addEventListener('mousemove', (e) => {
  if (!isServiceSliderActive) return;
  e.preventDefault();
  const x = e.pageX - serviceSlider.offsetLeft;
  const walk = (x - serviceSliderStartX) * 2;
  serviceSlider.scrollLeft = serviceSliderScrollLeft - walk;
});

// БургерМеню========================================================

document.addEventListener('DOMContentLoaded', function() {
  const burgerBtn = document.querySelector('.burger');
  const burgerMenu = document.getElementById('burgerMenu');
  const closeBtn = document.querySelector('.burger-close');
  const body = document.body;
  
  // Открытие меню
  burgerBtn.addEventListener('click', function() {
    burgerMenu.classList.add('active');
    body.style.overflow = 'hidden';
  });
  
  // Закрытие меню
  closeBtn.addEventListener('click', function() {
    burgerMenu.classList.remove('active');
    body.style.overflow = '';
  });
  
  // Закрытие при клике вне меню
  document.addEventListener('click', function(e) {
    if (!burgerMenu.contains(e.target) && 
        e.target !== burgerBtn && 
        !burgerBtn.contains(e.target)) {
      burgerMenu.classList.remove('active');
      body.style.overflow = '';
    }
  });
  
  // Закрытие по Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      burgerMenu.classList.remove('active');
      body.style.overflow = '';
    }
  });
});
// скрытие скрола в футере
document.addEventListener('DOMContentLoaded', function() {
  const socialsBlock = document.querySelector('.socials-sticky');
  const footer = document.querySelector('footer');
  
  if (!socialsBlock || !footer) return;

  function handleScroll() {
    const footerRect = footer.getBoundingClientRect();
    const socialsHeight = socialsBlock.offsetHeight;
    const triggerPoint = window.innerHeight - socialsHeight - 20; // 20px отступ
    
    // Если верх футера выше точки срабатывания (зашли в футер)
    if (footerRect.top < triggerPoint) {
      socialsBlock.style.opacity = '0';
      socialsBlock.style.pointerEvents = 'none';
      socialsBlock.style.transition = 'opacity 0.3s ease';
    } else {
      socialsBlock.style.opacity = '1';
      socialsBlock.style.pointerEvents = 'auto';
    }
  }

  // Оптимизация производительности
  let isTicking = false;
  window.addEventListener('scroll', function() {
    if (!isTicking) {
      window.requestAnimationFrame(function() {
        handleScroll();
        isTicking = false;
      });
      isTicking = true;
    }
  });

  // Инициализация при загрузке
  handleScroll();
});

