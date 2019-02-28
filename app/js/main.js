;
jQuery(document).ready(function ($) {
  var windowWidth = $(window).width();
  var mobileMenu = $('#mobile-menu');
  var styledSelect = $('.styled-select');

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
          'transform': 'translateY(-3rem)'
        });

        $(this).closest('.form__group').addClass('open');
      })
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

});