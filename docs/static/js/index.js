window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function () {

  /* ── Navbar burger toggle ── */
  $(".navbar-burger").click(function () {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  /* ── Video carousel ── */
  var carouselOptions = {
    slidesToScroll: 1,
    slidesToShow: 1,
    loop: true,
    infinite: true,
    autoplay: false,       // manual navigation; videos auto-play via HTML attribute
    autoplaySpeed: 8000,
  };
  var carousels = bulmaCarousel.attach('#video-carousel', carouselOptions);

  bulmaSlider.attach();

  /* ── Sync video pairs inside each carousel slide ──
     Each .item has two <video> elements (input + output).
     When one plays/pauses, mirror the other so they stay in sync.        */
  function syncVideoPair(v1, v2) {
    v1.addEventListener('play',   function () { if (v2.paused) v2.play(); });
    v1.addEventListener('pause',  function () { if (!v2.paused) v2.pause(); });
    v1.addEventListener('seeked', function () { v2.currentTime = v1.currentTime; });
    v2.addEventListener('play',   function () { if (v1.paused) v1.play(); });
    v2.addEventListener('pause',  function () { if (!v1.paused) v1.pause(); });
    v2.addEventListener('seeked', function () { v1.currentTime = v2.currentTime; });
  }

  document.querySelectorAll('#video-carousel .item').forEach(function (item) {
    var vids = item.querySelectorAll('video');
    if (vids.length === 2) syncVideoPair(vids[0], vids[1]);
  });

  /* ── Smooth-scroll for anchor links ── */
  $('a[href^="#"]').on('click', function (e) {
    var target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').stop().animate({ scrollTop: target.offset().top - 60 }, 500);
    }
  });

});