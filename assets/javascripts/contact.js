(function() {
  var map;

  if ($('#map').length > 0) {
    map = new L.mapbox.map("mapbox", "nasercafi.g99p0nel", {
      center: [43.650097, -79.375151],
      zoom: 17,
      zoomControl: false,
      attributionControl: false,
      tileLayer: {
        detectRetina: true
      }
    });
    if (Modernizr.touch) {
      map.dragging.disable();
      map.tap.disable();
    }
  }

  $.fn.funciSelect = function() {
    var $options, arrow, select, selectedOption, toggleArrow, ul;
    select = this;
    select.hide();
    selectedOption = $('<span id="selected-option"><a></a></span>');
    select.before(selectedOption);
    arrow = $('<span id="expand-arrow"><a><i class="fa fa-caret-down"></i></a></span>');
    selectedOption.after(arrow);
    ul = $('<ul></ul>');
    select.after(ul);
    ul.hide();
    $options = select.find('option');
    $options.each(function() {
      var optionText;
      optionText = $(this).text();
      return ul.append("<li><a>" + optionText + "</a></li>");
    });
    selectedOption.find('a').text($options.first().text());
    toggleArrow = function() {
      if (ul.is(":visible")) {
        return arrow.find('a i').removeClass('fa-caret-up').addClass('fa-caret-down');
      } else {
        return arrow.find('a i').removeClass('fa-caret-down').addClass('fa-caret-up');
      }
    };
    ul.find('a').click(function() {
      var text;
      text = $(this).text();
      select.find('option').each(function() {
        if ($(this).attr('value') === text) {
          return $(this).attr('selected', true);
        } else {
          return $(this).attr('selected', false);
        }
      });
      selectedOption.find('a').text(text);
      toggleArrow();
      return ul.slideToggle();
    });
    selectedOption.click(function() {
      toggleArrow();
      return ul.slideToggle();
    });
    return arrow.click(function() {
      toggleArrow();
      return ul.slideToggle();
    });
  };

  $(function() {
    $('#contact select').funciSelect();
    $('#contact textarea').keydown(function(ev) {
      if (ev.which === 13) {
        return ev.preventDefault();
      }
    });
    return $('#contact form').submit(function(ev) {
      var body, email, interest, mailToLink, message, name;
      ev.preventDefault();
      $(this).hide();
      $('#form-success').show();
      ResizeHelper.handleResize();
      name = $('[name="name"]').val();
      email = $('[name="email-address"]').val();
      interest = $('[name="interest"]').val();
      message = $('[name="message"]').val();
      body = encodeURIComponent("" + message + "\n\n- " + name + "\n" + email);
      mailToLink = ("mailto:info@functionalimperative.com?subject=" + interest + "&body=") + body + "&target=_blank";
      if (Modernizr.touch) {
        return window.location = mailToLink;
      } else {
        return window.open(mailToLink, '_blank');
      }
    });
  });

}).call(this);
