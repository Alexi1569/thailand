;
jQuery(document).ready(function ($) {
  var windowWidth = $(window).width();
  var styledSelect = $('.styled-select');

  window.scrollTopOffset = 0;

  var Scrollbar = window.Scrollbar;

  // var scrollbar = Scrollbar.init(document.querySelector('#page'), {
  //   damping: .025,
  //   alwaysShowTracks: true
  // });

  $.fancybox.defaults.hideScrollbar = false;
  $.fancybox.defaults.touch = false;
  $.fancybox.defaults.autoFocus = false;

  $.fancybox.defaults.btnTpl.smallBtn = '<span data-fancybox-close class="modal-close">' +
    '<svg><use xlink:href="#close-icon" /></svg>' +
    '</span>';

  $(window).resize(function () {
    windowWidth = $(window).width();
  });

  $(window).on('load', function () {

  });

  $(document).on('click touchstart', (e) => {
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

      $(this).on('change', (e) => {
        $(this).closest('.form__group').addClass('active');
      })

      $(this).on('select2:open', (e) => {
        $(this).closest('.form__group').find('.select2-dropdown').css({
          'opacity': '0',
          'visibility': 'hidden',
          'transform': 'translateY(-1rem)',
        });

        setTimeout(() => {
          $(this).closest('.form__group').find('.select2-dropdown').css({
            'transition': '.45s transform ease-in-out, .45s visibility ease-in-out, .45s opacity ease-in-out, .45s box-shadow ease-in-out .18s'
          });

          $(this).closest('.form__group').addClass('open');
        }, 0);
      });

      $(this).on('select2:close', (e) => {
        e.preventDefault();

        $(this).closest('.form__group').find('.select2-dropdown').css({
          'transition': '.45s transform ease-in-out, .45s visibility ease-in-out, .45s opacity ease-in-out, .1s box-shadow ease-in-out'
        });

        $(this).closest('.form__group').removeClass('open');
      });
    });
  }

  $('#header__search .header__search-icon').click((e) => {
    $('#header__search').toggleClass('active');
  });

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

  (function initReviewsSlider() {
    var $slider = $('#reviews__slider');
    var $next = $slider.find('.swiper-button-next');
    var $prev = $slider.find('.swiper-button-prev');
    var $numbers = $slider.find('.reviews__numbers');

    var animateReviewsSlide = (mySwiper) => {
      var $current = $slider.find('.swiper-slide.swiper-slide-active');

      var tl = new TimelineLite();

      tl.to($current.find('.reviews__img-inner'), .8, {x: '0%',
          onStart: function() {
            mySwiper.detachEvents();
          }
        })
        .to($current.find('.reviews__img-inner'), .65, {autoAlpha: 1}, '-=.65')
        .to($current.find('.reviews__img-inner'), .8, {width: '100%'})
        .to($current.find('.reviews__img-overlay'), .6, {x: '100%'}, '-=0.6')
        .to($current.find('.reviews__top-overlay'), .25, {width: '100%'}, '-=0.5')
        .to($current.find('.reviews__top-overlay'), .25, {x: '100%'})
        .to($current.find('.reviews__top-text'), .5, {x: 0, autoAlpha: 1}, '-=.25')
        .to($current.find('.reviews__text'), .5, {autoAlpha: 1,
          onComplete: function() {
            mySwiper.attachEvents();
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

    var acc = document.querySelectorAll('.mobile-menu__nav svg');
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
    });

    $btn.click(function() {
      $(this).toggleClass('active');
      $('#mobile-menu').toggleClass('active');
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
        for (let i = 0; i < 5; i++) {

          if (i !== 4) {
            height += $($options[i]).outerHeight(true);
          } else {
            height += $($options[i]).outerHeight();
          }
        }
        $wrapper.css({
          'max-height': `${height}px`
        });

        $btn.click(function(e) {
          e.preventDefault();

          $(this).closest('.catalog__filter-row').toggleClass('opened');

          if ($wrapper[0].style.maxHeight !== 'none') {
            $wrapper[0].style.maxHeight = 'none';
            $(this).find('span').text('Скрыть все');
          } else {
            $wrapper[0].style.maxHeight = `${height}px`;
            $(this).find('span').text('Показать все');
          }
        });
      }
    });

    if (windowWidth < 992) {
      var $filterOpen = $('#js-filter-open');
      var $filterClose = $('#js-filter-close');

      $filterOpen.click(function(e) {
        $(this).addClass('active');
        $filterClose.addClass('active');
        $('.catalog__filter').addClass('active');
      });

      $filterClose.click(function(e) {
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
        height: `${h}px`,
        width: `${w}px`,
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
      const player = new Plyr($(this));

      player.on('ready', function() {
        let overlay = document.createElement('div');
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

});