$(window).load(function(){
  // Set size and padding of divs
  padding = 5;
  $('#controls').css({
    'height': '416px',//(height-2*padding) + 'px',
    'padding-top': (padding) + 'px'
  });
  $('#help').css({
    'width': (displayWidth) + 'px',
    'height': (displayHeight) + 'px',
    'padding-left': padding + 'px',
    'padding-right': padding + 'px',
    'padding-top': (displayHeight * 0.30) + 'px'
  });
  $('#image').css({
    'width': (displayWidth) + 'px',
    'height': (displayHeight) + 'px'
  });

  // Set events
  $('#rotateleft').click(function () {
    fileHandler.rotateImageRight(-90);
  });
  $('#rotateright').click(function () {
    fileHandler.rotateImageRight(90);
  });
  $('#generatebutton').click(function () {
    //$('#controls').hide();
    text = $('textarea#imagetext').val();
    if (fileHandler.hasImage()) {
      generateAndShow(text, width, height, true, fileHandler.getImage(), fileHandler.getAngle());
    } else {
      generateAndShow(text, width, height, false, backgroundColor);
    }
  });

  $('#image').click(function () {
    $('#image').hide();
    $('#controls').show();
  });

  /* Set onclick event for the swatches */
  $('.swatch').click(function () {
    // Set the background color
    backgroundColor = $(this).css('background-color');
    // Unset the background image
    if (!$(this).hasClass('plus')) {
      fileHandler.clearImage();
    }
    // Unset all other box shadows
    $('.swatch').parent().css({'box-shadow': 'none'});
    $(this).parent().css({'box-shadow': '0px 0px 3px 1px #999'});
  });

  /* Set the first swatch active */
  $('.swatch').first().parent().css({'box-shadow': '0px 0px 3px 1px #999'});

  $('.plus').click(function () {
    // Upload image
    $('#imageupload').click();
  });
  $('#imageupload').on('change', fileHandler.handle);

  // Set text change to trigger counter
  $('#imagetext').bind('input propertychange', function () {
    if ($(this).val().length > 0) {
      lines = countRenderedLines($(this).val(), width);
      $('#textlength').text( lines + ' line(s) used');
      if ( lines > 6 ) {
        $('#textlength').css({'color': 'red'});
      } else {
        $('#textlength').css({'color': 'black'});
      }
    } else {
      $('#textlength').text('0 lines used');
      $('#textlength').css({'color': 'black'});
    }
  });

});

// Scroll away from the address bar
$( document ).ready(function () {
  setTimeout(function() {
    window.scrollTo(0, 0);
  }, 0);
});
