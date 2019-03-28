;
jQuery(document).ready(function ($) {
  var windowWidth = $(window).width();
  var styledSelect = $('.styled-select');

  window.scrollTopOffset = 0;

  var Scrollbar = window.Scrollbar;
  var scrollbar;

  function initScrollbar() {
    scrollbar = Scrollbar.init(document.querySelector('#page'), {
      damping: .1,
      continuousScrolling: false
    });
  }

  initScrollbar();

  $.fancybox.defaults.hideScrollbar = false;
  $.fancybox.defaults.touch = false;
  $.fancybox.defaults.autoFocus = false;

  $.fancybox.defaults.btnTpl.smallBtn = '<span data-fancybox-close class="modal-close">' +
    '<svg><use xlink:href="#close-icon" /></svg>' +
    '</span>';

  $(document).on('click touchstart', function(e) {
    if ((!$(e.target.closest('.header__search')).is('.header__search')) && $('.header__search').hasClass('active')) {
      $('.header__search').removeClass('active');
    }

    if ((!$(e.target.closest('.mobile-menu')).is('.mobile-menu')) && $('.mobile-menu').hasClass('active') && (!$(e.target.closest('.header__mobile')).is('.header__mobile'))) {
      $('.mobile-menu').removeClass('active');
      $('.header__mobile').removeClass('active');
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
    }
  );

  $('.only-numbers-input').bind('keyup blur', function () {
      var node = $(this);
      node.val(node.val().replace(/[^0-9 ()-+]/g, ''));
    }
  );

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
      $(this).select2({
        dropdownParent: $(this).closest('.form__group'),
        minimumResultsForSearch: -1
      });

      $(this).on('change', function(e) {
        $(this).closest('.form__group').addClass('active');
      })

      $(this).on('select2:open', function(e) {
        var $self = $(this);
        $(this).closest('.form__group').find('.select2-dropdown').css({
          'opacity': '0',
          'visibility': 'hidden',
          'transform': 'translateY(-1rem)',
        });

        setTimeout(function() {
          $self.closest('.form__group').find('.select2-dropdown').css({
            'transition': '.45s transform ease-in-out, .45s visibility ease-in-out, .45s opacity ease-in-out, .45s box-shadow ease-in-out .18s'
          });

          $self.closest('.form__group').addClass('open');
        }, 0);
      });

      $(this).on('select2:close', function(e) {
        e.preventDefault();

        $(this).closest('.form__group').find('.select2-dropdown').css({
          'transition': '.45s transform ease-in-out, .45s visibility ease-in-out, .45s opacity ease-in-out, .1s box-shadow ease-in-out'
        });

        $(this).closest('.form__group').removeClass('open');
      });
    });
  }

  $('#header__search .header__search-icon').click(function(e) {
    $('#header__search').toggleClass('active');
  });

  $('.products__item').each(function() {
    if (window.scrollTopOffset + window.innerHeight > $(this).position().top ) {
      if (!$(this).hasClass('visible')) {
        $(this).addClass('visible');
      }
    } else {
      if ($(this).hasClass('visible')) {
        $(this).removeClass('visible');
      }
    }
  });

  function initWatcher() {
    $('.scroll-content').watch({
      properties: "transform",
      callback: function(data, i) {
        var propChanged = data.props[i];
        var newValue = data.vals[i];

        var el = this;
        var el$ = $(this);

        window.scrollTopOffset = -parseInt(newValue.split('matrix(1, 0, 0, 1, 0, ')[1].split(')')[0], 10);

        $('.products__item').each(function() {
          if (window.scrollTopOffset + window.innerHeight > $(this).position().top ) {
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
  }

  initWatcher();

  (function initReviewsSlider() {
    var $slider = $('#reviews__slider');
    var $next = $slider.find('.swiper-button-next');
    var $prev = $slider.find('.swiper-button-prev');
    var $numbers = $slider.find('.reviews__numbers');
    var $content = $('.reviews__content');

    var animateReviewsSlide = function(mySwiper) {
      $content.addClass('disabled');
      var $current = $slider.find('.swiper-slide.swiper-slide-active');

      var tl = new TimelineLite();

      tl.to($current.find('.reviews__img-inner'), .8, {x: '0%'
        })
        .to($current.find('.reviews__img-inner'), .65, {autoAlpha: 1}, '-=.65')
        .to($current.find('.reviews__img-inner'), .8, {width: '100%'})
        .to($current.find('.reviews__img-overlay'), .6, {x: '100%'}, '-=0.6')
        .to($current.find('.reviews__top-overlay'), .25, {width: '100%'}, '-=0.5')
        .to($current.find('.reviews__top-overlay'), .25, {x: '100%'})
        .to($current.find('.reviews__top-text'), .5, {x: 0, autoAlpha: 1}, '-=.25')
        .to($current.find('.reviews__text'), .5, {autoAlpha: 1,
          onComplete: function() {
            $content.removeClass('disabled');
          }
        }, '-=.05');
    }

    var mySwiper = new Swiper($slider, {
      loop: false,
      speed: 650,
      watchOverflow: true,
      autoHeight: true,
      navigation: {
        nextEl: $next,
        prevEl: $prev
      },
      pagination: {
        el: $slider.find('.swiper-pagination'),
        type: 'bullets',
        clickable: true,
        renderBullet: function (index, className) {
          return '<button class="' + className + '"><span>' + (index + 1) + '</span></button>';
        }
      },
      on: {
        init: function () {
          setTimeout(function() {
            animateReviewsSlide(mySwiper);
          }, 250);

          var res = '<span class="slider-numbers--current">' + (this.realIndex + 1) + '</span> /<span class="slider-numbers--total">' + this.slides.length +'</span>';
          $numbers.html(res);
        },
      }
    });

    mySwiper.on('slideChangeTransitionStart', function() {
      $slider.find('.slider-numbers--current').html(mySwiper.realIndex + 1);
    });

    mySwiper.on('slideChangeTransitionEnd', function() {
      var $slides = $slider.find('.swiper-slide:not(.swiper-slide-active)');

      $slides.each(function() {
        TweenMax.set([$(this).find('.reviews__img-overlay'), $(this).find('.reviews__img-inner'), $(this).find('.reviews__top-overlay'), $(this).find('.reviews__top-text'), $(this).find('.reviews__text')], {clearProps: 'opacity, width, transform'});
      });

      animateReviewsSlide(mySwiper);
    });
  })();

  (function initNewsSlider() {
    var $slider = $('#news-slider');
console.log( $slider.find('.swiper-pagination'))
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
        renderBullet: function (index, className) {
          return '<button class="' + className + '"><span>' + (index + 1) + '</span></button>';
        }
      },
      breakpoints: {
        950: {
          slidesPerView: 2,
        },
        620: {
          slidesPerView: 1,
        }
      }
    });
  })();

  (function initProductSlider() {
    var $slider = $('.product-gallery');

    $slider.each(function() {
      var mySwiper = new Swiper($(this), {
        loop: true,
        speed: 650,
        watchOverflow: true,
        navigation: {
          prevEl: $(this).find('.swiper-button-prev'),
          nextEl: $(this).find('.swiper-button-next')
        },
      });
    });
  })();

  (function initMobileMenu() {
    var $btn = $('#header-mobile');
    var $menu = $('#mobile-menu');

    var acc = document.querySelectorAll('.mobile-menu__nav i');
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener('click', function () {
        this.classList.toggle('active');
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }

    $('.mobile-menu__contacts .callback-btn').click(function() {
      $('#mobile-menu').removeClass('active');
      $btn.removeClass('active');
      initScrollbar();
      initWatcher();
    });

    $btn.click(function() {
      $(this).toggleClass('active');
      $('#mobile-menu').toggleClass('active');
      if ($(this).hasClass('active')) {
        Scrollbar.destroyAll();
      } else {
        initScrollbar();
        initWatcher();
      }
    });
  })();

  (function initFilter() {
    var $rows = $('.jc-check-options');

    $rows.each(function() {
      var $wrapper = $(this).find('.catalog__filter-options');
      var $options = $(this).find('.catalog__filter-option');
      var $btn = $(this).find('.catalog__filter-more');
      var height = 0;

      if ($options.length > 5) {
        $btn.css({
          'display': 'inline-flex'
        })
        for (var i = 0; i < 5; i++) {

          if (i !== 4) {
            height += $($options[i]).outerHeight(true);
          } else {
            height += $($options[i]).outerHeight();
          }
        }
        $wrapper.css({
          'max-height': height + 'px'
        });

        $btn.click(function(e) {
          e.preventDefault();

          $(this).closest('.catalog__filter-row').toggleClass('opened');

          if ($wrapper[0].style.maxHeight !== 'none') {
            $wrapper[0].style.maxHeight = 'none';
            $(this).find('span').text('Скрыть все');
          } else {
            $wrapper[0].style.maxHeight = height + 'px';
            $(this).find('span').text('Показать все');
          }
        });
      }
    });

    if (windowWidth < 992) {
      var $filterOpen = $('#js-filter-open');
      var $filterClose = $('#js-filter-close');

      $filterOpen.click(function(e) {
        e.preventDefault();

        Scrollbar.destroyAll();
        $(this).addClass('active');
        $filterClose.addClass('active');
        $('.catalog__filter').addClass('active');
      });

      $filterClose.click(function(e) {
        e.preventDefault();

        initScrollbar();
        initWatcher();
        $(this).removeClass('active');
        $('.catalog__filter').removeClass('active');
      });
    }
  })();

  (function initCalendars() {
    var $visible = $('#calendar-visible');
    var $calendar = $('.calendar-input');

    if ($visible.length) {
      var $parent = $visible.closest('.p-product__calendar-view');
      var $spacer = $parent.find('.p-product__calendar-spacer');

      $visible.daterangepicker({
        opens: 'left',
        parentEl: $parent,
        singleDatePicker: true,
      });

      $visible.data('daterangepicker').show();

      var w = $parent.find('.daterangepicker').outerWidth(true);
      var h = $parent.find('.daterangepicker').outerHeight(true);

      $spacer.css({
        height: h + 'px',
        width: w + 'px',
      });
    }

    if ($calendar.length) {
      $calendar.daterangepicker({
        opens: 'center',
        parentEl: $('#calendar-modal'),
        autoApply: true
      });

      $calendar.on('show.daterangepicker', function(e, picker) {
        $.fancybox.open({
          src: '#calendar-modal',
          type: 'inline',
        });

        return false;
      });

      $calendar.on('apply.daterangepicker', function(e, picker) {
        $.fancybox.close();

        return false;
      });

      $calendar.on('cancel.daterangepicker', function(e, picker) {
        $.fancybox.close();

        return false;
      });
    }

  })();

  /* OPEN MODAL AFTER BOOKING
    $.fancybox.open({
      src: '#book-success',
      type: 'inline',
    });
  */
  (function initProductVideo() {
    var $video = $('.video-item');

    $video.each(function() {
      var $controls;
      var $parent = $(this).closest('.video-player');
      var player = new Plyr($(this));

      player.on('ready', function() {
        var overlay = document.createElement('div');
        overlay.classList.add('video-player__overlay');
        $parent.find('.plyr').append(overlay);
        $parent.addClass('active');

        $controls = $parent.find('.plyr__controls');
        $controls.css({
          display: 'none'
        });
      });

      player.on('play', function() {
        if ($controls[0].style.display === 'none') {
          $controls.css({
            display: 'flex'
          });
        }

        $parent.removeClass('active');
      });

      player.on('pause', function() {
        $parent.addClass('active');
      });
    });
  })();

  function initMap() {
    $('.custom-map').each(function() {
      var map;
      map = new google.maps.Map(
        $(this)[0],
        {
          center: new google.maps.LatLng(-33.91722, 151.23064),
          zoom: 11,
          disableDefaultUI: true,
        }
      );

      //change labels on language choose
      var markers = [
        {
          position: new google.maps.LatLng(-33.91721, 151.22630),
          label: 'А',
          product: {
            title: 'TEST',
            link: '#123123',
            isSale: true,
            isRented: false,
            img: './img/item-1.jpg',
            prices: {
              current: '350$/сутки',
              sale: '500$'
            },
            info: {
              deal: 'аренда',
              type: 'апартаменты'
            },
            advantages: [
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.1 23.1"><path d="M22.7 20.8c-.2 0-.4.2-.4.4v1.1h-1.1c-.2 0-.4.2-.4.4s.2.4.4.4h1.5c.2 0 .4-.2.4-.4v-1.5c0-.2-.2-.4-.4-.4zM18.4 22.3h-2.8c-.2 0-.4.2-.4.4s.2.4.4.4h2.8c.2 0 .4-.2.4-.4s-.1-.4-.4-.4zM12.9 22.3h-2.8c-.2 0-.4.2-.4.4s.2.4.4.4h2.8c.2 0 .4-.2.4-.4s-.1-.4-.4-.4zM7.4 22.3H4.7c-.2 0-.4.2-.4.4s.2.4.4.4h2.8c.2 0 .4-.2.4-.4s-.3-.4-.5-.4zM1.9 22.3H.8v-1.1c0-.2-.2-.4-.4-.4s-.4.2-.4.4v1.5c0 .2.2.4.4.4h1.5c.2 0 .4-.2.4-.4s-.2-.4-.4-.4zM.4 18.8c.2 0 .4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4s-.4.3-.4.5v2.8c0 .2.2.3.4.3zM.4 7.8c.2 0 .4-.2.4-.4V4.7c0-.2-.2-.4-.4-.4s-.4.1-.4.4v2.8c0 .1.2.3.4.3zM.4 13.3c.2 0 .4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4s-.4.3-.4.5V13c0 .2.2.3.4.3zM1.9 0H.4C.2 0 0 .2 0 .4v1.5c0 .2.2.4.4.4s.4-.2.4-.4V.8h1.1c.2 0 .4-.2.4-.4S2.1 0 1.9 0zM4.7.8h2.8c.2 0 .4-.2.4-.4S7.6 0 7.4 0H4.7c-.3 0-.4.2-.4.4s.1.4.4.4zM10.2.8H13c.2 0 .4-.2.4-.4s-.3-.4-.5-.4h-2.8c-.1 0-.3.2-.3.4s.2.4.4.4zM15.7.8h2.8c.2 0 .4-.2.4-.4s-.2-.4-.5-.4h-2.8c-.2 0-.4.2-.4.4s.3.4.5.4zM22.7 0h-1.5c-.2 0-.4.2-.4.4s.2.4.4.4h1.1v1.1c0 .2.2.4.4.4s.4-.2.4-.4V.4c0-.2-.2-.4-.4-.4zM22.7 4.3c-.2 0-.4.2-.4.4v2.8c0 .2.2.4.4.4s.4-.2.4-.4V4.7c0-.3-.2-.4-.4-.4zM22.7 9.8c-.2 0-.4.2-.4.4V13c0 .2.2.4.4.4s.4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4zM22.7 15.3c-.2 0-.4.2-.4.4v2.8c0 .2.2.4.4.4s.4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4zM4.2 7.4c.2 0 .4-.2.4-.4V4.7H7c.2 0 .4-.2.4-.4s-.2-.4-.4-.4H4.2c-.2 0-.4.1-.4.4V7c0 .2.2.4.4.4zM7.4 18.8c0-.2-.2-.4-.4-.4H4.6V16c0-.2-.2-.4-.4-.4s-.4.2-.4.4v2.8c0 .2.2.4.4.4H7c.2 0 .4-.1.4-.4zM18.9 15.7c-.2 0-.4.2-.4.4v2.4h-2.4c-.2 0-.4.2-.4.4s.2.4.4.4h2.8c.2 0 .4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4z"/><path d="M17.9 5.8c.2-.2.2-.4 0-.6s-.4-.2-.6 0l-3.5 3.5H9.3L5.8 5.2c-.2-.2-.4-.2-.6 0s-.2.4 0 .6l3.5 3.5v4.5l-3.5 3.5c-.2.2-.2.4 0 .6.1.1.2.1.3.1s.2 0 .3-.1l3.5-3.5h4.5l3.5 3.5c.1.1.2.1.3.1s.2 0 .3-.1c.2-.2.2-.4 0-.6l-3.5-3.5V9.3l3.5-3.5zM9.6 9.6h4v4h-4v-4z"/><path d="M18.9 3.9h-2.8c-.2 0-.4.2-.4.4s.2.4.4.4h2.4V7c0 .2.2.4.4.4s.4-.2.4-.4V4.3c0-.3-.2-.4-.4-.4z"/></svg>',
                key: 'Площадь',
                val: '54 м<sup>2</sup>'
              },
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 97.9 77.4"><path d="M97.6 30.8c-6.6-5.4-6.9-14.9-6.9-15 0-.5-.5-1-1-1h-9c-.5 0-1 .4-1 1 0 .1-.3 9.6-6.9 15-.3.3-.4.7-.3 1.1.1.4.5.7.9.7h10.8v40.3c-4.8.1-8.5 1-8.5 2 0 1.1 4.3 2 9.5 2s9.5-.9 9.5-2c0-1-3.7-1.9-8.5-2V32.6h5v8.7c-.4.4-.6 1.2-.6 2.2 0 1.3.5 2.4 1.1 2.4s1.1-1.1 1.1-2.4c0-.9-.3-1.8-.6-2.2v-8.7H97c.4 0 .8-.3.9-.7.1-.4 0-.8-.3-1.1zm-21.7-.2c4.5-4.9 5.5-11.3 5.7-13.7h7.1c.3 2.3 1.3 8.8 5.8 13.7H75.9zM29.6 11.8c0-2.3 1.6-4.3 3.8-4.7-.3-.1-.7-.1-1-.1-2.7 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8c.3 0 .7 0 1-.1-2.2-.4-3.8-2.3-3.8-4.7z"/><path d="M17.1 37.3h21.1V0H17.1v37.3zM36.2 2v27.1c-1.7 0-3.5-.2-5.5-.7-7.2-2.1-10.3-.8-11.7.7v-27h17.2V2zM40.6 0v37.3h21.1V0H40.6zm19.2 2v21.6c-1.4-1.6-4-3.3-8 .1-5.1 4.4-8.3 4.7-9.2 4.7V2h17.2zM77.9 54.5c-1.2-1.5-3.3-1.6-3.3-1.6-1.5-.2-1.9-2-1.9-2-1.4-8.3-9.1-8.1-9.1-8.1H15.1c-.1 0-7.8-.2-9.1 8.1 0 0-.4 1.9-1.8 2.1-.1 0-2.1.1-3.3 1.6-.8 1-1.1 2.4-.7 4.1.9 4.4 4.1 11.9 4.2 12.2 0 .1 1.2 2.7 4.8 2.7h1.3l-.8 3.8h2.1l1.9-3.8H65l1.9 3.8H69l-.8-3.8h1.3c3.6 0 4.8-2.6 4.8-2.7.1-.3 3.3-7.8 4.2-12.2.5-1.9.2-3.2-.6-4.2zm-62.8-9.8s.1 0 0 0h48.6c.2 0 4.5-.1 6.4 4.1-.7.1-1.5.4-2.3 1-2.1 1.5-3.6 4.2-4.4 8.1-1.6-.8-3.3-1.2-5-1.2H20.5c-1.8 0-3.5.4-5 1.2-.8-3.9-2.3-6.6-4.4-8.1-.8-.6-1.6-.9-2.3-1 1.7-3.9 5.7-4.1 6.3-4.1zM14.2 61l1.4-.9c1.5-.9 3.1-1.4 4.9-1.4h37.9c1.7 0 3.4.5 4.9 1.4l1.4.9H14.2zm52.6 2v.2l-.6 2.5c-.2.5-.7.9-1.2.9H13.8c-.5 0-1-.3-1.1-.8l-.6-2.5v-.2l54.7-.1zM7.4 71.1c-.9-.4-1.2-1.1-1.2-1.1 0-.1-3.2-7.6-4.1-11.8-.2-1.1-.1-1.9.3-2.4.6-.8 1.8-.9 1.9-.9 3.1-.4 3.7-3.6 3.7-3.8 0-.1.1-.3.1-.4 1.4.2 4.2 1.6 5.5 8.3l-2 1.3c-1.1.7-1.7 2.1-1.4 3.4l.6 2.5v.1c-1 .8-2.9 2.4-3.4 4.8zm2 .4c.4-1.7 1.8-2.9 2.6-3.5.5.4 1.2.6 1.9.6H65c.7 0 1.3-.2 1.9-.6.8.6 2.2 1.8 2.6 3.5H9.4zm67.3-13.4c-.8 4.2-4 11.7-4.1 11.8 0 0-.3.7-1.2 1.1-.5-2.4-2.3-4-3.4-4.8v-.1l.6-2.5c.3-1.3-.2-2.7-1.4-3.4l-2-1.3c1.2-6.7 4.1-8 5.5-8.3 0 .1.1.3.1.4 0 .1.7 3.4 3.7 3.7 0 0 1.2.1 1.8.9.5.6.6 1.5.4 2.5z"/></svg>',
                key: 'Комнат',
                val: '3'
              },
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 58"><path d="M1 58h4c.6 0 1-.4 1-1v-2c0-1.7 1.3-3 3-3h32c1.7 0 3 1.3 3 3v2c0 .6.4 1 1 1h4c.6 0 1-.4 1-1V37c0-1.3-.8-2.4-2-2.8V25c0-2.8-2.2-5-5-5H7c-2.8 0-5 2.2-5 5v9.2c-1.2.4-2 1.5-2 2.8v20c0 .6.4 1 1 1zm3-33c0-1.7 1.3-3 3-3h36c1.7 0 3 1.3 3 3v9h-3c.7-.9 1-1.9 1-3 0-2.8-2.2-5-5-5h-8c-2.8 0-5 2.2-5 5 0 1.1.4 2.1 1 3h-4c.7-.9 1-1.9 1-3 0-2.8-2.2-5-5-5h-8c-2.8 0-5 2.2-5 5 0 1.1.4 2.1 1 3H4v-9zm38 6c0 1.7-1.3 3-3 3h-8c-1.7 0-3-1.3-3-3s1.3-3 3-3h8c1.7 0 3 1.3 3 3zm-20 0c0 1.7-1.3 3-3 3h-8c-1.7 0-3-1.3-3-3s1.3-3 3-3h8c1.7 0 3 1.3 3 3zM2 42h5c.6 0 1-.4 1-1s-.4-1-1-1H2v-3c0-.6.4-1 1-1h44c.6 0 1 .4 1 1v7H2v-2zm0 4h46v10h-2v-1c0-2.8-2.2-5-5-5H9c-2.8 0-5 2.2-5 5v1H2V46z"/><path d="M59 56h-2V5c0-2.8-2.2-5-5-5h-3c-2.4 0-4.4 1.7-4.9 4H43c-.6 0-1 .4-1 1v3.6l-3.8 4.7c-.3.4-.3 1.1.2 1.4.2.1.4.2.6.2h2.1c.5 2.1 2.7 3.4 4.8 2.9 1.4-.4 2.5-1.5 2.9-2.9H51c.6 0 1-.4 1-1 0-.2-.1-.4-.2-.6L48 8.6V5c0-.6-.4-1-1-1h-.8c.4-1.2 1.5-2 2.8-2h3c1.7 0 3 1.3 3 3v51h-2c-.6 0-1 .4-1 1s.4 1 1 1h6c.6 0 1-.4 1-1s-.4-1-1-1zM44 6h2v2h-2V6zm1 10c-.7 0-1.4-.4-1.7-1h3.5c-.4.6-1.1 1-1.8 1zm1.5-6l2.4 3h-7.8l2.4-3h3zM12 40h-1c-.6 0-1 .4-1 1s.4 1 1 1h1c.6 0 1-.4 1-1s-.4-1-1-1z"/></svg>',
                key: 'Спальни',
                val: '3'
              },
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82.7 70.1"><path class="st0" d="M41.4 37.4c8.1 0 14.7-6.6 14.7-14.7S49.5 8 41.4 8s-14.7 6.6-14.7 14.7 6.6 14.7 14.7 14.7zm0-26.7c6.6 0 12 5.4 12 12s-5.4 12-12 12-12-5.4-12-12 5.4-12 12-12zm-22.6 18l1.9.7c1.6.5 2.9 1.6 3.8 3.1.8 1.4 1.1 3.1.8 4.8l-.4 2 2-.4c1.6-.3 3.3 0 4.8.8 1.4.8 2.5 2.2 3.1 3.8l.7 1.9 1.5-1.3c1.3-1.1 2.9-1.7 4.5-1.7 1.7 0 3.3.6 4.5 1.7l1.5 1.3.6-1.9c.5-1.6 1.6-2.9 3.1-3.8 1.4-.8 3.1-1.1 4.8-.8l2 .4-.4-2c-.3-1.6 0-3.3.8-4.8.8-1.4 2.2-2.5 3.8-3.1l1.9-.7-1.3-1.5c-1.1-1.3-1.7-2.9-1.7-4.5s.6-3.3 1.7-4.5l1.3-1.5-1.9-.7c-1.6-.5-2.9-1.6-3.8-3.1-.8-1.4-1.1-3.1-.8-4.8l.4-2-2 .4c-1.6.3-3.3 0-4.8-.8s-2.5-2.2-3.1-3.8L47.4 0l-1.5 1.3C44.6 2.4 43 3 41.4 3s-3.3-.6-4.5-1.7L35.4 0l-.7 1.9c-.5 1.6-1.6 2.9-3.1 3.8-1.4.8-3.1 1.1-4.8.8l-2-.4.4 2c.3 1.6 0 3.3-.8 4.8-.8 1.4-2.2 2.5-3.8 3.1l-1.8.6 1.3 1.5c1.1 1.3 1.7 2.9 1.7 4.5s-.6 3.3-1.7 4.5l-1.3 1.6zm4.4-10.9c1.5-.8 2.7-2.1 3.6-3.6s1.3-3.2 1.3-4.9c1.7 0 3.4-.4 4.9-1.3s2.7-2.1 3.6-3.6c2.9 1.7 6.8 1.7 9.8 0 .8 1.5 2.1 2.7 3.6 3.6s3.2 1.3 4.9 1.3c0 1.7.4 3.4 1.3 4.9.9 1.5 2.1 2.7 3.6 3.6-.9 1.5-1.3 3.2-1.3 4.9s.5 3.4 1.3 4.9c-1.5.8-2.7 2.1-3.6 3.6-.9 1.5-1.3 3.2-1.3 4.9-1.7 0-3.4.4-4.9 1.3s-2.7 2.1-3.6 3.6c-2.9-1.7-6.8-1.7-9.8 0-.8-1.5-2.1-2.7-3.6-3.6-1.5-.8-3.1-1.3-4.8-1.3h-.1c0-1.7-.4-3.4-1.3-4.9-.9-1.5-2.1-2.7-3.6-3.6.9-1.5 1.3-3.2 1.3-4.9s-.4-3.4-1.3-4.9zm18.2-4.4c.2-.7.9-1.1 1.7-1 4.2 1.1 7.4 4.4 8.5 8.5.2.7-.2 1.5-1 1.7h-.3c-.6 0-1.1-.4-1.3-1-.9-3.2-3.4-5.8-6.6-6.6-.7-.1-1.1-.9-1-1.6zM.5 54.6c-.5-.5-.6-1.4-.1-2s1.3-.6 1.9-.1c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4c.6-.5 1.4-.4 1.9.1.5.6.4 1.4-.1 1.9-3 2.6-6.9 4.1-10.9 4.1-3.6 0-7.1-1.2-10-3.4-2.9 2.2-6.4 3.4-10 3.4s-7.1-1.2-10-3.4c-2.9 2.2-6.4 3.4-10 3.4s-7.1-1.2-10-3.4c-2.9 2.2-6.4 3.4-10 3.4-4 .1-7.9-1.4-10.9-4zm81.9 9.5c.5.6.4 1.4-.1 1.9-3 2.6-6.9 4.1-10.9 4.1-3.6 0-7.1-1.2-10-3.4-2.9 2.2-6.4 3.4-10 3.4s-7.1-1.2-10-3.4c-2.9 2.2-6.4 3.4-10 3.4s-7.1-1.2-10-3.4c-2.9 2.2-6.4 3.4-10 3.4-4 0-7.9-1.5-10.9-4.1-.6-.5-.6-1.3-.1-1.9s1.3-.6 1.9-.1c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4c.6-.5 1.4-.4 1.9.1z"/></svg>',
                key: 'До моря',
                val: '500 м'
              },
            ]
          }
        },
        {
          position: new google.maps.LatLng(-33.92, 151.16),
          label: 'В',
          product: {
            title: 'Ваш идеальный выбор',
            link: '#test',
            isSale: false,
            isRented: true,
            img: './img/item-1.jpg',
            prices: {
              current: '$2500',
            },
            info: {
              deal: 'аренда',
              type: 'продажа'
            },
            advantages: [
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.1 23.1"><path d="M22.7 20.8c-.2 0-.4.2-.4.4v1.1h-1.1c-.2 0-.4.2-.4.4s.2.4.4.4h1.5c.2 0 .4-.2.4-.4v-1.5c0-.2-.2-.4-.4-.4zM18.4 22.3h-2.8c-.2 0-.4.2-.4.4s.2.4.4.4h2.8c.2 0 .4-.2.4-.4s-.1-.4-.4-.4zM12.9 22.3h-2.8c-.2 0-.4.2-.4.4s.2.4.4.4h2.8c.2 0 .4-.2.4-.4s-.1-.4-.4-.4zM7.4 22.3H4.7c-.2 0-.4.2-.4.4s.2.4.4.4h2.8c.2 0 .4-.2.4-.4s-.3-.4-.5-.4zM1.9 22.3H.8v-1.1c0-.2-.2-.4-.4-.4s-.4.2-.4.4v1.5c0 .2.2.4.4.4h1.5c.2 0 .4-.2.4-.4s-.2-.4-.4-.4zM.4 18.8c.2 0 .4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4s-.4.3-.4.5v2.8c0 .2.2.3.4.3zM.4 7.8c.2 0 .4-.2.4-.4V4.7c0-.2-.2-.4-.4-.4s-.4.1-.4.4v2.8c0 .1.2.3.4.3zM.4 13.3c.2 0 .4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4s-.4.3-.4.5V13c0 .2.2.3.4.3zM1.9 0H.4C.2 0 0 .2 0 .4v1.5c0 .2.2.4.4.4s.4-.2.4-.4V.8h1.1c.2 0 .4-.2.4-.4S2.1 0 1.9 0zM4.7.8h2.8c.2 0 .4-.2.4-.4S7.6 0 7.4 0H4.7c-.3 0-.4.2-.4.4s.1.4.4.4zM10.2.8H13c.2 0 .4-.2.4-.4s-.3-.4-.5-.4h-2.8c-.1 0-.3.2-.3.4s.2.4.4.4zM15.7.8h2.8c.2 0 .4-.2.4-.4s-.2-.4-.5-.4h-2.8c-.2 0-.4.2-.4.4s.3.4.5.4zM22.7 0h-1.5c-.2 0-.4.2-.4.4s.2.4.4.4h1.1v1.1c0 .2.2.4.4.4s.4-.2.4-.4V.4c0-.2-.2-.4-.4-.4zM22.7 4.3c-.2 0-.4.2-.4.4v2.8c0 .2.2.4.4.4s.4-.2.4-.4V4.7c0-.3-.2-.4-.4-.4zM22.7 9.8c-.2 0-.4.2-.4.4V13c0 .2.2.4.4.4s.4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4zM22.7 15.3c-.2 0-.4.2-.4.4v2.8c0 .2.2.4.4.4s.4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4zM4.2 7.4c.2 0 .4-.2.4-.4V4.7H7c.2 0 .4-.2.4-.4s-.2-.4-.4-.4H4.2c-.2 0-.4.1-.4.4V7c0 .2.2.4.4.4zM7.4 18.8c0-.2-.2-.4-.4-.4H4.6V16c0-.2-.2-.4-.4-.4s-.4.2-.4.4v2.8c0 .2.2.4.4.4H7c.2 0 .4-.1.4-.4zM18.9 15.7c-.2 0-.4.2-.4.4v2.4h-2.4c-.2 0-.4.2-.4.4s.2.4.4.4h2.8c.2 0 .4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4z"/><path d="M17.9 5.8c.2-.2.2-.4 0-.6s-.4-.2-.6 0l-3.5 3.5H9.3L5.8 5.2c-.2-.2-.4-.2-.6 0s-.2.4 0 .6l3.5 3.5v4.5l-3.5 3.5c-.2.2-.2.4 0 .6.1.1.2.1.3.1s.2 0 .3-.1l3.5-3.5h4.5l3.5 3.5c.1.1.2.1.3.1s.2 0 .3-.1c.2-.2.2-.4 0-.6l-3.5-3.5V9.3l3.5-3.5zM9.6 9.6h4v4h-4v-4z"/><path d="M18.9 3.9h-2.8c-.2 0-.4.2-.4.4s.2.4.4.4h2.4V7c0 .2.2.4.4.4s.4-.2.4-.4V4.3c0-.3-.2-.4-.4-.4z"/></svg>',
                key: 'Площадь',
                val: '54 м<sup>2</sup>'
              },
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 58"><path d="M1 58h4c.6 0 1-.4 1-1v-2c0-1.7 1.3-3 3-3h32c1.7 0 3 1.3 3 3v2c0 .6.4 1 1 1h4c.6 0 1-.4 1-1V37c0-1.3-.8-2.4-2-2.8V25c0-2.8-2.2-5-5-5H7c-2.8 0-5 2.2-5 5v9.2c-1.2.4-2 1.5-2 2.8v20c0 .6.4 1 1 1zm3-33c0-1.7 1.3-3 3-3h36c1.7 0 3 1.3 3 3v9h-3c.7-.9 1-1.9 1-3 0-2.8-2.2-5-5-5h-8c-2.8 0-5 2.2-5 5 0 1.1.4 2.1 1 3h-4c.7-.9 1-1.9 1-3 0-2.8-2.2-5-5-5h-8c-2.8 0-5 2.2-5 5 0 1.1.4 2.1 1 3H4v-9zm38 6c0 1.7-1.3 3-3 3h-8c-1.7 0-3-1.3-3-3s1.3-3 3-3h8c1.7 0 3 1.3 3 3zm-20 0c0 1.7-1.3 3-3 3h-8c-1.7 0-3-1.3-3-3s1.3-3 3-3h8c1.7 0 3 1.3 3 3zM2 42h5c.6 0 1-.4 1-1s-.4-1-1-1H2v-3c0-.6.4-1 1-1h44c.6 0 1 .4 1 1v7H2v-2zm0 4h46v10h-2v-1c0-2.8-2.2-5-5-5H9c-2.8 0-5 2.2-5 5v1H2V46z"/><path d="M59 56h-2V5c0-2.8-2.2-5-5-5h-3c-2.4 0-4.4 1.7-4.9 4H43c-.6 0-1 .4-1 1v3.6l-3.8 4.7c-.3.4-.3 1.1.2 1.4.2.1.4.2.6.2h2.1c.5 2.1 2.7 3.4 4.8 2.9 1.4-.4 2.5-1.5 2.9-2.9H51c.6 0 1-.4 1-1 0-.2-.1-.4-.2-.6L48 8.6V5c0-.6-.4-1-1-1h-.8c.4-1.2 1.5-2 2.8-2h3c1.7 0 3 1.3 3 3v51h-2c-.6 0-1 .4-1 1s.4 1 1 1h6c.6 0 1-.4 1-1s-.4-1-1-1zM44 6h2v2h-2V6zm1 10c-.7 0-1.4-.4-1.7-1h3.5c-.4.6-1.1 1-1.8 1zm1.5-6l2.4 3h-7.8l2.4-3h3zM12 40h-1c-.6 0-1 .4-1 1s.4 1 1 1h1c.6 0 1-.4 1-1s-.4-1-1-1z"/></svg>',
                key: 'fdsfsdf',
                val: '23'
              },
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82.7 70.1"><path class="st0" d="M41.4 37.4c8.1 0 14.7-6.6 14.7-14.7S49.5 8 41.4 8s-14.7 6.6-14.7 14.7 6.6 14.7 14.7 14.7zm0-26.7c6.6 0 12 5.4 12 12s-5.4 12-12 12-12-5.4-12-12 5.4-12 12-12zm-22.6 18l1.9.7c1.6.5 2.9 1.6 3.8 3.1.8 1.4 1.1 3.1.8 4.8l-.4 2 2-.4c1.6-.3 3.3 0 4.8.8 1.4.8 2.5 2.2 3.1 3.8l.7 1.9 1.5-1.3c1.3-1.1 2.9-1.7 4.5-1.7 1.7 0 3.3.6 4.5 1.7l1.5 1.3.6-1.9c.5-1.6 1.6-2.9 3.1-3.8 1.4-.8 3.1-1.1 4.8-.8l2 .4-.4-2c-.3-1.6 0-3.3.8-4.8.8-1.4 2.2-2.5 3.8-3.1l1.9-.7-1.3-1.5c-1.1-1.3-1.7-2.9-1.7-4.5s.6-3.3 1.7-4.5l1.3-1.5-1.9-.7c-1.6-.5-2.9-1.6-3.8-3.1-.8-1.4-1.1-3.1-.8-4.8l.4-2-2 .4c-1.6.3-3.3 0-4.8-.8s-2.5-2.2-3.1-3.8L47.4 0l-1.5 1.3C44.6 2.4 43 3 41.4 3s-3.3-.6-4.5-1.7L35.4 0l-.7 1.9c-.5 1.6-1.6 2.9-3.1 3.8-1.4.8-3.1 1.1-4.8.8l-2-.4.4 2c.3 1.6 0 3.3-.8 4.8-.8 1.4-2.2 2.5-3.8 3.1l-1.8.6 1.3 1.5c1.1 1.3 1.7 2.9 1.7 4.5s-.6 3.3-1.7 4.5l-1.3 1.6zm4.4-10.9c1.5-.8 2.7-2.1 3.6-3.6s1.3-3.2 1.3-4.9c1.7 0 3.4-.4 4.9-1.3s2.7-2.1 3.6-3.6c2.9 1.7 6.8 1.7 9.8 0 .8 1.5 2.1 2.7 3.6 3.6s3.2 1.3 4.9 1.3c0 1.7.4 3.4 1.3 4.9.9 1.5 2.1 2.7 3.6 3.6-.9 1.5-1.3 3.2-1.3 4.9s.5 3.4 1.3 4.9c-1.5.8-2.7 2.1-3.6 3.6-.9 1.5-1.3 3.2-1.3 4.9-1.7 0-3.4.4-4.9 1.3s-2.7 2.1-3.6 3.6c-2.9-1.7-6.8-1.7-9.8 0-.8-1.5-2.1-2.7-3.6-3.6-1.5-.8-3.1-1.3-4.8-1.3h-.1c0-1.7-.4-3.4-1.3-4.9-.9-1.5-2.1-2.7-3.6-3.6.9-1.5 1.3-3.2 1.3-4.9s-.4-3.4-1.3-4.9zm18.2-4.4c.2-.7.9-1.1 1.7-1 4.2 1.1 7.4 4.4 8.5 8.5.2.7-.2 1.5-1 1.7h-.3c-.6 0-1.1-.4-1.3-1-.9-3.2-3.4-5.8-6.6-6.6-.7-.1-1.1-.9-1-1.6zM.5 54.6c-.5-.5-.6-1.4-.1-2s1.3-.6 1.9-.1c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4c.6-.5 1.4-.4 1.9.1.5.6.4 1.4-.1 1.9-3 2.6-6.9 4.1-10.9 4.1-3.6 0-7.1-1.2-10-3.4-2.9 2.2-6.4 3.4-10 3.4s-7.1-1.2-10-3.4c-2.9 2.2-6.4 3.4-10 3.4s-7.1-1.2-10-3.4c-2.9 2.2-6.4 3.4-10 3.4-4 .1-7.9-1.4-10.9-4zm81.9 9.5c.5.6.4 1.4-.1 1.9-3 2.6-6.9 4.1-10.9 4.1-3.6 0-7.1-1.2-10-3.4-2.9 2.2-6.4 3.4-10 3.4s-7.1-1.2-10-3.4c-2.9 2.2-6.4 3.4-10 3.4s-7.1-1.2-10-3.4c-2.9 2.2-6.4 3.4-10 3.4-4 0-7.9-1.5-10.9-4.1-.6-.5-.6-1.3-.1-1.9s1.3-.6 1.9-.1c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4c.6-.5 1.4-.4 1.9.1z"/></svg>',
                key: 'До моря',
                val: '500 м'
              },
            ]
          }
        },
        {
          position: new google.maps.LatLng(-33.89, 151.16),
          label: 'К',
          product: {
            title: 'Супер вилла',
            link: '#test',
            isSale: true,
            isRented: true,
            img: './img/item-1.jpg',
            prices: {
              current: '$2500',
            },
            info: {
              deal: 'аренда',
              type: 'продажа'
            },
            advantages: [
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.1 23.1"><path d="M22.7 20.8c-.2 0-.4.2-.4.4v1.1h-1.1c-.2 0-.4.2-.4.4s.2.4.4.4h1.5c.2 0 .4-.2.4-.4v-1.5c0-.2-.2-.4-.4-.4zM18.4 22.3h-2.8c-.2 0-.4.2-.4.4s.2.4.4.4h2.8c.2 0 .4-.2.4-.4s-.1-.4-.4-.4zM12.9 22.3h-2.8c-.2 0-.4.2-.4.4s.2.4.4.4h2.8c.2 0 .4-.2.4-.4s-.1-.4-.4-.4zM7.4 22.3H4.7c-.2 0-.4.2-.4.4s.2.4.4.4h2.8c.2 0 .4-.2.4-.4s-.3-.4-.5-.4zM1.9 22.3H.8v-1.1c0-.2-.2-.4-.4-.4s-.4.2-.4.4v1.5c0 .2.2.4.4.4h1.5c.2 0 .4-.2.4-.4s-.2-.4-.4-.4zM.4 18.8c.2 0 .4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4s-.4.3-.4.5v2.8c0 .2.2.3.4.3zM.4 7.8c.2 0 .4-.2.4-.4V4.7c0-.2-.2-.4-.4-.4s-.4.1-.4.4v2.8c0 .1.2.3.4.3zM.4 13.3c.2 0 .4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4s-.4.3-.4.5V13c0 .2.2.3.4.3zM1.9 0H.4C.2 0 0 .2 0 .4v1.5c0 .2.2.4.4.4s.4-.2.4-.4V.8h1.1c.2 0 .4-.2.4-.4S2.1 0 1.9 0zM4.7.8h2.8c.2 0 .4-.2.4-.4S7.6 0 7.4 0H4.7c-.3 0-.4.2-.4.4s.1.4.4.4zM10.2.8H13c.2 0 .4-.2.4-.4s-.3-.4-.5-.4h-2.8c-.1 0-.3.2-.3.4s.2.4.4.4zM15.7.8h2.8c.2 0 .4-.2.4-.4s-.2-.4-.5-.4h-2.8c-.2 0-.4.2-.4.4s.3.4.5.4zM22.7 0h-1.5c-.2 0-.4.2-.4.4s.2.4.4.4h1.1v1.1c0 .2.2.4.4.4s.4-.2.4-.4V.4c0-.2-.2-.4-.4-.4zM22.7 4.3c-.2 0-.4.2-.4.4v2.8c0 .2.2.4.4.4s.4-.2.4-.4V4.7c0-.3-.2-.4-.4-.4zM22.7 9.8c-.2 0-.4.2-.4.4V13c0 .2.2.4.4.4s.4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4zM22.7 15.3c-.2 0-.4.2-.4.4v2.8c0 .2.2.4.4.4s.4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4zM4.2 7.4c.2 0 .4-.2.4-.4V4.7H7c.2 0 .4-.2.4-.4s-.2-.4-.4-.4H4.2c-.2 0-.4.1-.4.4V7c0 .2.2.4.4.4zM7.4 18.8c0-.2-.2-.4-.4-.4H4.6V16c0-.2-.2-.4-.4-.4s-.4.2-.4.4v2.8c0 .2.2.4.4.4H7c.2 0 .4-.1.4-.4zM18.9 15.7c-.2 0-.4.2-.4.4v2.4h-2.4c-.2 0-.4.2-.4.4s.2.4.4.4h2.8c.2 0 .4-.2.4-.4v-2.8c0-.2-.2-.4-.4-.4z"/><path d="M17.9 5.8c.2-.2.2-.4 0-.6s-.4-.2-.6 0l-3.5 3.5H9.3L5.8 5.2c-.2-.2-.4-.2-.6 0s-.2.4 0 .6l3.5 3.5v4.5l-3.5 3.5c-.2.2-.2.4 0 .6.1.1.2.1.3.1s.2 0 .3-.1l3.5-3.5h4.5l3.5 3.5c.1.1.2.1.3.1s.2 0 .3-.1c.2-.2.2-.4 0-.6l-3.5-3.5V9.3l3.5-3.5zM9.6 9.6h4v4h-4v-4z"/><path d="M18.9 3.9h-2.8c-.2 0-.4.2-.4.4s.2.4.4.4h2.4V7c0 .2.2.4.4.4s.4-.2.4-.4V4.3c0-.3-.2-.4-.4-.4z"/></svg>',
                key: 'Площадь',
                val: '54 м<sup>2</sup>'
              },
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 58"><path d="M1 58h4c.6 0 1-.4 1-1v-2c0-1.7 1.3-3 3-3h32c1.7 0 3 1.3 3 3v2c0 .6.4 1 1 1h4c.6 0 1-.4 1-1V37c0-1.3-.8-2.4-2-2.8V25c0-2.8-2.2-5-5-5H7c-2.8 0-5 2.2-5 5v9.2c-1.2.4-2 1.5-2 2.8v20c0 .6.4 1 1 1zm3-33c0-1.7 1.3-3 3-3h36c1.7 0 3 1.3 3 3v9h-3c.7-.9 1-1.9 1-3 0-2.8-2.2-5-5-5h-8c-2.8 0-5 2.2-5 5 0 1.1.4 2.1 1 3h-4c.7-.9 1-1.9 1-3 0-2.8-2.2-5-5-5h-8c-2.8 0-5 2.2-5 5 0 1.1.4 2.1 1 3H4v-9zm38 6c0 1.7-1.3 3-3 3h-8c-1.7 0-3-1.3-3-3s1.3-3 3-3h8c1.7 0 3 1.3 3 3zm-20 0c0 1.7-1.3 3-3 3h-8c-1.7 0-3-1.3-3-3s1.3-3 3-3h8c1.7 0 3 1.3 3 3zM2 42h5c.6 0 1-.4 1-1s-.4-1-1-1H2v-3c0-.6.4-1 1-1h44c.6 0 1 .4 1 1v7H2v-2zm0 4h46v10h-2v-1c0-2.8-2.2-5-5-5H9c-2.8 0-5 2.2-5 5v1H2V46z"/><path d="M59 56h-2V5c0-2.8-2.2-5-5-5h-3c-2.4 0-4.4 1.7-4.9 4H43c-.6 0-1 .4-1 1v3.6l-3.8 4.7c-.3.4-.3 1.1.2 1.4.2.1.4.2.6.2h2.1c.5 2.1 2.7 3.4 4.8 2.9 1.4-.4 2.5-1.5 2.9-2.9H51c.6 0 1-.4 1-1 0-.2-.1-.4-.2-.6L48 8.6V5c0-.6-.4-1-1-1h-.8c.4-1.2 1.5-2 2.8-2h3c1.7 0 3 1.3 3 3v51h-2c-.6 0-1 .4-1 1s.4 1 1 1h6c.6 0 1-.4 1-1s-.4-1-1-1zM44 6h2v2h-2V6zm1 10c-.7 0-1.4-.4-1.7-1h3.5c-.4.6-1.1 1-1.8 1zm1.5-6l2.4 3h-7.8l2.4-3h3zM12 40h-1c-.6 0-1 .4-1 1s.4 1 1 1h1c.6 0 1-.4 1-1s-.4-1-1-1z"/></svg>',
                key: 'fdsfsdf',
                val: '23'
              },
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82.7 70.1"><path class="st0" d="M41.4 37.4c8.1 0 14.7-6.6 14.7-14.7S49.5 8 41.4 8s-14.7 6.6-14.7 14.7 6.6 14.7 14.7 14.7zm0-26.7c6.6 0 12 5.4 12 12s-5.4 12-12 12-12-5.4-12-12 5.4-12 12-12zm-22.6 18l1.9.7c1.6.5 2.9 1.6 3.8 3.1.8 1.4 1.1 3.1.8 4.8l-.4 2 2-.4c1.6-.3 3.3 0 4.8.8 1.4.8 2.5 2.2 3.1 3.8l.7 1.9 1.5-1.3c1.3-1.1 2.9-1.7 4.5-1.7 1.7 0 3.3.6 4.5 1.7l1.5 1.3.6-1.9c.5-1.6 1.6-2.9 3.1-3.8 1.4-.8 3.1-1.1 4.8-.8l2 .4-.4-2c-.3-1.6 0-3.3.8-4.8.8-1.4 2.2-2.5 3.8-3.1l1.9-.7-1.3-1.5c-1.1-1.3-1.7-2.9-1.7-4.5s.6-3.3 1.7-4.5l1.3-1.5-1.9-.7c-1.6-.5-2.9-1.6-3.8-3.1-.8-1.4-1.1-3.1-.8-4.8l.4-2-2 .4c-1.6.3-3.3 0-4.8-.8s-2.5-2.2-3.1-3.8L47.4 0l-1.5 1.3C44.6 2.4 43 3 41.4 3s-3.3-.6-4.5-1.7L35.4 0l-.7 1.9c-.5 1.6-1.6 2.9-3.1 3.8-1.4.8-3.1 1.1-4.8.8l-2-.4.4 2c.3 1.6 0 3.3-.8 4.8-.8 1.4-2.2 2.5-3.8 3.1l-1.8.6 1.3 1.5c1.1 1.3 1.7 2.9 1.7 4.5s-.6 3.3-1.7 4.5l-1.3 1.6zm4.4-10.9c1.5-.8 2.7-2.1 3.6-3.6s1.3-3.2 1.3-4.9c1.7 0 3.4-.4 4.9-1.3s2.7-2.1 3.6-3.6c2.9 1.7 6.8 1.7 9.8 0 .8 1.5 2.1 2.7 3.6 3.6s3.2 1.3 4.9 1.3c0 1.7.4 3.4 1.3 4.9.9 1.5 2.1 2.7 3.6 3.6-.9 1.5-1.3 3.2-1.3 4.9s.5 3.4 1.3 4.9c-1.5.8-2.7 2.1-3.6 3.6-.9 1.5-1.3 3.2-1.3 4.9-1.7 0-3.4.4-4.9 1.3s-2.7 2.1-3.6 3.6c-2.9-1.7-6.8-1.7-9.8 0-.8-1.5-2.1-2.7-3.6-3.6-1.5-.8-3.1-1.3-4.8-1.3h-.1c0-1.7-.4-3.4-1.3-4.9-.9-1.5-2.1-2.7-3.6-3.6.9-1.5 1.3-3.2 1.3-4.9s-.4-3.4-1.3-4.9zm18.2-4.4c.2-.7.9-1.1 1.7-1 4.2 1.1 7.4 4.4 8.5 8.5.2.7-.2 1.5-1 1.7h-.3c-.6 0-1.1-.4-1.3-1-.9-3.2-3.4-5.8-6.6-6.6-.7-.1-1.1-.9-1-1.6zM.5 54.6c-.5-.5-.6-1.4-.1-2s1.3-.6 1.9-.1c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4c.6-.5 1.4-.4 1.9.1.5.6.4 1.4-.1 1.9-3 2.6-6.9 4.1-10.9 4.1-3.6 0-7.1-1.2-10-3.4-2.9 2.2-6.4 3.4-10 3.4s-7.1-1.2-10-3.4c-2.9 2.2-6.4 3.4-10 3.4s-7.1-1.2-10-3.4c-2.9 2.2-6.4 3.4-10 3.4-4 .1-7.9-1.4-10.9-4zm81.9 9.5c.5.6.4 1.4-.1 1.9-3 2.6-6.9 4.1-10.9 4.1-3.6 0-7.1-1.2-10-3.4-2.9 2.2-6.4 3.4-10 3.4s-7.1-1.2-10-3.4c-2.9 2.2-6.4 3.4-10 3.4s-7.1-1.2-10-3.4c-2.9 2.2-6.4 3.4-10 3.4-4 0-7.9-1.5-10.9-4.1-.6-.5-.6-1.3-.1-1.9s1.3-.6 1.9-.1c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4l.9-.8.9.8c2.5 2.2 5.8 3.4 9.1 3.4s6.6-1.2 9.1-3.4c.6-.5 1.4-.4 1.9.1z"/></svg>',
                key: 'До моря',
                val: '500 м'
              },
            ]
          }
        },
      ];

      for (var i = 0; i < markers.length; i++) {
        var defaultIcon;

        let _i = i;

        if ($('.p-map').length) {
          defaultIcon = '../img/marker.svg';
        } else {
          defaultIcon = '../img/marker-active.svg';
        }

        var marker = new google.maps.Marker({
          position: markers[i].position,
          icon: new google.maps.MarkerImage(
            defaultIcon,
            new google.maps.Size(35, 35),
            new google.maps.Point(0, 0),
            new google.maps.Point(17, 34),
            new google.maps.Size(35, 35)
          ),
          map: map,
          label: {
            color: '#161616',
            fontSize: '14px',
            fontFamily: 'Muller med',
            text: markers[i].label,
          }
        });

        var $product = $('#map-product');
        var $close = $product.find('.p-map__product-close');

        $close.click(function(e) {
          $product.fadeOut(150);
          $('.gm-style img[src^="../img/marker"]').removeClass('active');
          $('.gm-style img[src^="../img/marker"]').attr('src', '../img/marker.svg');
        });

        marker.addListener('click', function(e) {
          if ($('.p-map').length) {
            var $img = $('.gm-style img[src^="../img/marker"]');
            var isActive = $(e.va.target).hasClass('active');

            $img.attr('src', '../img/marker.svg');
            $img.removeClass('active');

            var index = $(e.va.target).closest('div').css('z-index');

            if (!isActive) {
              $product.fadeOut(150, function() {
                $('.products__item-advantages').removeClass('products__item--three');
                $('.products__item-advantages').removeClass('products__item--four');
                $('.products__item-advantages')[0].innerHTML = '';
                $('.products__item-sale').removeClass('visible');
                $('.products__item-lock').removeClass('visible');

                var item = markers[_i].product;

                $product.find('.products__item-title, .products__item-img').attr('href', item.link);
                $product.find('.products__item-title > p').text(item.title);
                $product.find('.products__item-img img').attr('src', item.img);
                $product.find('.products__item-prices .products__item-price--default').text(item.prices.current);
                $product.find('.products__item-prices .products__item-price--sale').text(item.prices.sale);
                $product.find('.products__item-info .products__item-col:nth-of-type(1) .products__item-col--val').text(item.info.deal);
                $product.find('.products__item-info .products__item-col:nth-of-type(2) .products__item-col--val').text(item.info.type);

                if (item.isSale) {
                  $('.products__item-sale').addClass('visible');
                }

                if (item.isRented) {
                  $('.products__item-lock').addClass('visible');
                }

                if (item.advantages.length > 3) {
                  $('.products__item-advantages').addClass('products__item--four');
                  $('.products__item-advantages').removeClass('products__item--three');
                } else {
                  $('.products__item-advantages').removeClass('products__item--four');
                  $('.products__item-advantages').addClass('products__item--three');
                }

                for (var j = 0; j < item.advantages.length; j++) {
                  var el = document.createElement('div');
                  el.className += 'products__item-advantage inline-flex ai-c';

                  var i = document.createElement('i');
                  i.className += 'products__item-advantage-icon';

                  var svg = document.createElement('svg');
                  svg.innerHTML = item.advantages[j].icon;
                  i.appendChild(svg);

                  var details = document.createElement('div');
                  details.className += 'products__item-advantage-details';

                  var key = document.createElement('p');
                  key.className += 'products__item-advantage--key';
                  key.innerHTML = item.advantages[j].key;

                  var val = document.createElement('p');
                  val.className += 'products__item-advantage--val';
                  val.innerHTML = item.advantages[j].val;

                  details.appendChild(key);
                  details.appendChild(val);

                  el.appendChild(i);
                  el.appendChild(details);

                  $('.products__item-advantages')[0].appendChild(el);
                }
              });

              $product.fadeIn(150);

              for(var k = 0; k < $img.length; k++) {
                if ($($img[k]).closest('div').css('z-index') === index) {
                  $($img[k]).attr('src', '../img/marker-active.svg');
                  $($img[k]).addClass('active');
                }
              }
            } else {
              $product.fadeOut(150);
              $img.removeClass('active');
            }
          }
        });
      };
    });
  }

  function alignMapProduct() {
    var $product = $('#map-product');
    var cw = $('.container').width();
    var w = $(window).width();

    $product.css({
      'right': ((w - cw) / 2) + 'px'
    });
  };

  $(window).on('load', function () {
    initMap();
    alignMapProduct();
  });

  $(window).resize(function () {
    windowWidth = $(window).width();
    alignMapProduct();
  });

});