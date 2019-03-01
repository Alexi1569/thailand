;
jQuery(document).ready(function ($) {
  var windowWidth = $(window).width();
  var mobileMenu = $('#mobile-menu');
  var styledSelect = $('.styled-select');

  var Scrollbar = window.Scrollbar;

  var scrollbar = Scrollbar.init(document.querySelector('#page'), {
    damping: .025,
    alwaysShowTracks: true
  });

  console.log(scrollbar.offset)

  $(window).resize(function () {
    windowWidth = $(window).width();
  });

  $(window).on('load', function () {

  });

  $(document).on('click touchstart', (e) => {
    if ((!$(e.target.closest('.header__search')).is('.header__search')) && $('.header__search').hasClass('active')) {
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
      node.val(node.val().replace(/[^a-zA-Zа-яА-Я]/g, ''));
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

  if ($(mobileMenu).length) {
    $(mobileMenu).mmenu({
        extensions: [
          "position-bottom",
          "fullscreen",
          "listview-50",
          "fx-panels-slide-up",
          "fx-listitems-drop",
          "border-offset"
        ],
        navbar: {
          title: ""
        },
        navbars: [
          {
            height: 2,
            content: [
              ''
            ]
          },
          {
            content: ["prev", "title", "close"]
          }
        ]
      },
      {});
  }

  $('#header__search .header__search-icon').click((e) => {
    $('#header__search').toggleClass('active');
  });

  // (() => {
  //   $('.products__item').each(function() {
  //     $(this).onScreen({
  //       container: '.products__content',
  //       toggleClass: 'try',
  //       tolerance: 50,
  //       doIn() {
  //         console.log('in')
  //       }
  //     })
  //   });
  // })();

});