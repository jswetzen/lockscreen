var fileHandler = (function($) {

  var imageUploaded = false,
      uploadedImage = undefined,
      tags = undefined;
      rotation = 0;

  return {
    hasImage: function() {
      return imageUploaded
    },
    getImage: function() {
      return uploadedImage
    },
    getInfo: function() {
      return tags
    },
    getAngle: function() {
      return rotation;
    },
    clearImage: function () {
      uploadedImage = undefined;
      imageUploaded = false;
      // Set the icon to the right image
      $('.plus').css({'background-image': ''});
    },
    rotateImageRight: function (angle) {
      angle = typeof angle !== 'undefined' ? angle : 90;
      rotation = (rotation + angle) % 360;
      return rotation;
    },
    handle: function (evt) {
      var f = evt.target.files[0];

      reader = new FileReader();

      reader.onload = function(e) {
        uploadedImage = document.createElement('img');
        uploadedImage.src = e.target.result;

        var dataURL = e.target.result;
        var byteString = atob(dataURL.split(',')[1]);
        var binary = new BinaryFile(byteString, 0, byteString.length);
        var exif = EXIF.readFromBinaryFile(binary);

        tags = EXIF.getAllTags(uploadedImage);
        // alert(tags);

        for (var name in tags) {
          // alert(name);
        }

        // Set the icon to the right image
        $('.plus').css({'background-image': 'url('+e.target.result+')'});

        imageUploaded = true;
      };

      reader.readAsDataURL(f);
    }
  };
})(jQuery);
