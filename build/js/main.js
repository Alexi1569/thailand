"use strict";

;
jQuery(document).ready(function ($) {
  var windowWidth = $(window).width();
  var mobileMenu = $('#mobile-menu');
  var styledSelect = $('.styled-select');
  window.scrollTopOffset = 0;
  var Scrollbar = window.Scrollbar; // var scrollbar = Scrollbar.init(document.querySelector('#page'), {
  //   damping: .025,
  //   alwaysShowTracks: true
  // });

  $.fancybox.defaults.hideScrollbar = false;
  $.fancybox.defaults.touch = false;
  $.fancybox.defaults.btnTpl.smallBtn = '<span data-fancybox-close class="modal-close">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.642 15.642"><path fill-rule="evenodd" d="M8.882 7.821l6.541-6.541A.75.75 0 1 0 14.362.219L7.821 6.76 1.28.22A.75.75 0 1 0 .219 1.281L6.76 7.822l-6.54 6.54a.75.75 0 0 0 1.06 1.061l6.541-6.541 6.541 6.541a.75.75 0 1 0 1.06-1.061l-6.54-6.541z"/></svg>' + '</span>';
  $(window).resize(function () {
    windowWidth = $(window).width();
  });
  $(window).on('load', function () {});
  $(document).on('click touchstart', function (e) {
    if (!$(e.target.closest('.header__search')).is('.header__search') && $('.header__search').hasClass('active')) {
      $('.header__search').removeClass('active');
    }
  });

  if ("ontouchstart" in document.documentElement) {
    $('body').addClass('touch-device');
  } else {
    $('body').removeClass('touch-device');
  }

  $('.only-text-input').bind('keyup blur', function () {
    var node = $(this);
    node.val(node.val().replace(/[^a-zA-Zа-яА-Я ]/g, ''));
  });
  $('.only-numbers-input').bind('keyup blur', function () {
    var node = $(this);
    node.val(node.val().replace(/[^0-9 ()-+]/g, ''));
  });

  (function () {
    var acc = document.getElementsByClassName("faq__item-question");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;

        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  })();

  if ($(styledSelect).length) {
    $(styledSelect).each(function () {
      var _this = this;

      $(this).select2({
        dropdownParent: $(this).closest('.form__group'),
        minimumResultsForSearch: -1
      });
      $(this).on('change', function (e) {
        $(_this).closest('.form__group').addClass('active');
      });
      $(this).on('select2:open', function (e) {
        $(_this).closest('.form__group').find('.select2-dropdown').css({
          'opacity': '0',
          'visibility': 'hidden',
          'transform': 'translateY(-1rem)'
        });
        setTimeout(function () {
          $(_this).closest('.form__group').find('.select2-dropdown').css({
            'transition': '.45s transform ease-in-out, .45s visibility ease-in-out, .45s opacity ease-in-out, .45s box-shadow ease-in-out .18s'
          });
          $(_this).closest('.form__group').addClass('open');
        }, 0);
      });
      $(this).on('select2:close', function (e) {
        e.preventDefault();
        $(_this).closest('.form__group').find('.select2-dropdown').css({
          'transition': '.45s transform ease-in-out, .45s visibility ease-in-out, .45s opacity ease-in-out, .1s box-shadow ease-in-out'
        });
        $(_this).closest('.form__group').removeClass('open');
      });
    });
  }

  if ($(mobileMenu).length) {
    $(mobileMenu).mmenu({
      extensions: ["position-bottom", "fullscreen", "listview-50", "fx-panels-slide-up", "fx-listitems-drop", "border-offset"],
      navbar: {
        title: ""
      },
      navbars: [{
        height: 2,
        content: ['']
      }, {
        content: ["prev", "title", "close"]
      }]
    }, {});
  }

  $('#header__search .header__search-icon').click(function (e) {
    $('#header__search').toggleClass('active');
  });
  $('.scroll-content').watch({
    properties: "transform",
    callback: function callback(data, i) {
      var propChanged = data.props[i];
      var newValue = data.vals[i];
      var el = this;
      var el$ = $(this);
      window.scrollTopOffset = -parseInt(newValue.split('matrix(1, 0, 0, 1, 0, ')[1].split(')')[0], 10);
      $('.products__item').each(function () {
        if (window.scrollTopOffset + window.innerHeight > $(this).position().top) {
          if (!$(this).hasClass('visible')) {
            $(this).addClass('visible');
          }
        } else {
          if ($(this).hasClass('visible')) {
            $(this).removeClass('visible');
          }
        }
      });
    }
  });

  (function initReviewsSlider() {
    var $slider = $('#reviews__slider');
    var $next = $slider.find('.swiper-button-next');
    var $prev = $slider.find('.swiper-button-prev');
    var $numbers = $slider.find('.reviews__numbers');

    var animateReviewsSlide = function animateReviewsSlide(mySwiper) {
      var $current = $slider.find('.swiper-slide.swiper-slide-active');
      var tl = new TimelineLite();
      tl.to($current.find('.reviews__img-inner'), .8, {
        x: '0%',
        onStart: function onStart() {
          mySwiper.detachEvents();
        }
      }).to($current.find('.reviews__img-inner'), .65, {
        autoAlpha: 1
      }, '-=.65').to($current.find('.reviews__img-inner'), .8, {
        width: '100%'
      }).to($current.find('.reviews__img-overlay'), .6, {
        x: '100%'
      }, '-=0.6').to($current.find('.reviews__top-overlay'), .25, {
        width: '100%'
      }, '-=0.5').to($current.find('.reviews__top-overlay'), .25, {
        x: '100%'
      }).to($current.find('.reviews__top-text'), .5, {
        x: 0,
        autoAlpha: 1
      }, '-=.25').to($current.find('.reviews__text'), .5, {
        autoAlpha: 1,
        onComplete: function onComplete() {
          mySwiper.attachEvents();
        }
      }, '-=.05');
    };

    var mySwiper = new Swiper($slider, {
      loop: false,
      speed: 650,
      watchOverflow: true,
      navigation: {
        nextEl: $next,
        prevEl: $prev
      },
      pagination: {
        el: $slider.find('.swiper-pagination'),
        type: 'bullets',
        clickable: true,
        renderBullet: function renderBullet(index, className) {
          return '<button class="' + className + '"><span>' + (index + 1) + '</span></button>';
        }
      },
      on: {
        init: function init() {
          setTimeout(function () {
            animateReviewsSlide(mySwiper);
          }, 250);
          var res = '<span class="slider-numbers--current">' + (this.realIndex + 1) + '</span> /<span class="slider-numbers--total">' + this.slides.length + '</span>';
          $numbers.html(res);
        }
      }
    });
    mySwiper.on('slideChangeTransitionStart', function () {
      $slider.find('.slider-numbers--current').html(mySwiper.realIndex + 1);
    });
    mySwiper.on('slideChangeTransitionEnd', function () {
      var $slides = $slider.find('.swiper-slide:not(.swiper-slide-active)');
      $slides.each(function () {
        TweenMax.set([$(this).find('.reviews__img-overlay'), $(this).find('.reviews__img-inner'), $(this).find('.reviews__top-overlay'), $(this).find('.reviews__top-text'), $(this).find('.reviews__text')], {
          clearProps: 'opacity, width, transform'
        });
      });
      animateReviewsSlide(mySwiper);
    });
  })();

  (function initNewsSlider() {
    var $slider = $('#news-slider');
    var mySwiper = new Swiper($slider, {
      loop: false,
      speed: 650,
      watchOverflow: true,
      spaceBetween: 30,
      slidesPerView: 3,
      pagination: {
        el: $slider.find('.swiper-pagination'),
        type: 'bullets',
        clickable: true,
        renderBullet: function renderBullet(index, className) {
          return '<button class="' + className + '"><span>' + (index + 1) + '</span></button>';
        }
      }
    });
  })();
});