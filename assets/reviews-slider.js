// Initialize Swiper for the reviews slider
document.addEventListener('DOMContentLoaded', function () {
  var swiper = new Swiper('.swiper', {
    loop: true,
    navigation: {
      nextEl: '.reviews__arrow--next',
      prevEl: '.reviews__arrow--prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      // Make pagination more visible
      bulletClass: 'swiper-pagination-bullet',
      bulletActiveClass: 'swiper-pagination-bullet-active',
      // Ensure it's always rendered
      renderBullet: function (index, className) {
        return '<span class="' + className + '"></span>';
      },
    },
    breakpoints: {
      // Mobile view
      0: {
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: true,
      },
      // Tablet/small desktop view
      480: {
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: true,
      },
      // Desktop view
      1024: {
        slidesPerView: 4,
        spaceBetween: 0,
      },
    },
  });
});
