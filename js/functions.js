function generateAndShow(text, width, height, useImage, background, angle) {
  image = makeTextImage(text, width, height, useImage, background, angle);

  // Set the image
  //var img = document.getElementById('image');
  //img.src = image;
  $('#image')[0].src = image;

  $('#image').fadeIn();
  $('#help').fadeIn();
  $('#help').click(function () {
    $('#help').fadeOut();
    // Redirect to image
    //window.location.href = image;
  });
}

function makeTextImage(text, width, height, useImage, background, angle) {
  var canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d'),
  sideMargin = 20,
  topMargin = 365,
  maxWidth = (width - sideMargin),
  lineHeight = 80;

  canvas.width = width;
  canvas.height = height;

  if (useImage) {
    // alert('w:'+background.width +', h:'+ background.height);
    var x = width/2,
        y = height/2,
        w = background.width,
        h = background.height;
        radAngle = angle * Math.PI/180;

    // If rotated at a right angle, center and scale properly
    if (radAngle % 180 == 90) {
      ctx.translate(x,y);
      ctx.rotate(radAngle);
      ctx.translate(-y,-x);
      scaling = scaleToFit(w, h, height, width);
      ctx.drawImage(background, scaling.xOffset, scaling.yOffset, scaling.width, scaling.height);
      ctx.translate(y,x);
      ctx.rotate(-radAngle);
      ctx.translate(-x,-y);
    // Otherwise, just scale as if it is not rotated (only 90 degree rotation steps are handled)
    } else {
      ctx.translate(x,y);
      ctx.rotate(radAngle);
      ctx.translate(-x,-y);
      scaling = scaleToFit(w, h, width, height);
      ctx.drawImage(background, scaling.xOffset, scaling.yOffset, scaling.width, scaling.height);
      ctx.translate(x,y);
      ctx.rotate(-radAngle);
      ctx.translate(-x,-y);
    }

  } else {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.shadowColor = "black";
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 7;
  ctx.font = "bold " + (lineHeight) + "px 'Helvetica'";
  ctx.textBaseline = 'alphabetic';
  ctx.scale(1, 1);
  ctx.fillStyle = "white";

  ctx.textAlign = 'center';
  //ctx.fillText(text, 50, 100);
  // Draw the text wrapped, with x at the middle and y at the top margin
  wrapText(ctx, text, width / 2, topMargin, maxWidth, lineHeight);

  var image = canvas.toDataURL("image/png");
  //var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); //Convert image to 'octet-stream' (Just a download, really)
  //window.location.href = image;
  //var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); //Convert image to 'octet-stream' (Just a download, really)

  return image;
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  // Find newline replacement
  var i = 0;
  while(text.match('linefeed' + i) !== null) {
    i++;
  }
  var lf = 'linefeed' + i;
  text = text.replace(/\n|\r|\r\n/g, ' ' + lf + ' ');

  var words = text.split(' '),
  line = '';

  for (i = 0; i < words.length; i++) {
    if (words[i] == lf) {
      context.fillText(line, x, y);
      line = '';
      y += lineHeight;
    } else {
      var testLine = line + words[i] + ' ',
      testLineWidth = context.measureText(testLine).width;
      if ((testLineWidth > maxWidth) && i > 0) {
        context.fillText(line, x, y);
        line = words[i] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
  }
  context.fillText(line, x, y);
}

function countRenderedLines(text, width) {
  var canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d'),
  sideMargin = 20,
  maxWidth = (width - 2 * sideMargin),
  lineHeight = 80;

  canvas.width = width;
  canvas.height = width;

  ctx.shadowColor = "black";
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 7;
  ctx.font = "bold " + (lineHeight) + "px 'Helvetica'";
  ctx.textBaseline = 'alphabetic';
  ctx.scale(1, 1);
  ctx.fillStyle = "white";

  ctx.textAlign = 'center';

  // Find newline replacement
  var i = 0;
  while(text.match('linefeed' + i) !== null) {
    i++;
  }
  var lf = 'linefeed' + i;
  text = text.replace(/\n|\r|\r\n/g, ' ' + lf + ' ');

  var words = text.split(' '),
  line = '',
  lineCount = 0;

  for (i = 0; i < words.length; i++) {
    if (words[i] == lf) {
      lineCount++;
      line = '';
    } else {
      var testLine = line + words[i] + ' ',
      testLineWidth = ctx.measureText(testLine).width;
      if ((testLineWidth > maxWidth) && i > 0) {
        lineCount++;
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }
  }
  lineCount++;

  return lineCount;
}

function scaleToFit(srcWidth, srcHeight, destWidth, destHeight) {
  result = {
    'width': destWidth,
    'height': destHeight,
    'xOffset': 0,
    'yOffset': 0
  }

  newWidth = srcWidth*destHeight/srcHeight;

  if (newWidth < destWidth) {
    result.height = Math.floor(srcHeight*destWidth/srcWidth);
  } else {
    result.width = Math.floor(newWidth);
  }

  result.xOffset = Math.floor((destWidth-result.width)/2);
  result.yOffset = Math.floor((destHeight-result.height)/2);

  return result;
}
