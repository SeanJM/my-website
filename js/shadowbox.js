function lightImageSize(image){
  image.removeAttr('width').removeAttr('height');
  var shadowbox = $('#shadowbox');
  var mask = shadowbox.find('.mask');
  var imgX = parseInt((mask.width() / 2) - (image.width() / 2));
  var imgY = parseInt((mask.height() / 2) - (image.height() / 2));
  if (image.height() > mask.height()) { imgY = 0; }
  image.css('left',imgX).css('top',imgY);
  //Adapted from http://stackoverflow.com/a/10620516
  var parH = mask.height() - 30;
  var areaH = image.height();
  var scrH = parH / (areaH/parH);
  var scrollBtn = shadowbox.find('.scrollbar .scroll');
  scrollBtn.show();
  if (scrH > parH) { scrollBtn.hide(); }
  scrollBtn.css('top','');
  function dragging(){     
      var scrPos = scrollBtn.position().top;   
      image.css({top: -(scrPos*(areaH/parH)-1)});
  }
  shadowbox.find('.scrollbar').css('height',parH);
  scrollBtn.height(scrH);
  scrollBtn.draggable({
      axis: 'y',
      containment: 'parent',    
      drag: function() {
           dragging();
      }   
  });
}

function lightboxNext(i){
  var shadowbox = $('#shadowbox');
  var curIndex = parseInt(shadowbox.find('img').attr('shadowindex'));
  var indexSize = ($('.lightbox').size() - 1);
  var index = curIndex + i;
  if (index >= $('.lightbox').size()) { index = 0; }
  if (index < 0) { index = indexSize; }
  var image = $('.lightbox[shadowindex="' + index + '"]');
  lightbox(image);
}
function shadowSize(shadowbox) {
  var scroll = $(window).scrollTop();
  var maxHeight = $(window).height() - 20;
  var maxWidth = $(window).width() - 20;
  var maskHeight = maxHeight - 80;
  if ($(document).height() < $(window).height()) {
    var shadowHeight = $(window).height();
  }
  else { var shadowHeight = $(document).height(); }
  var frameY = scroll + 10;
  var loaderY = (maxHeight / 2) - (shadowbox.find('.loader').height() / 2);
  shadowbox.height(shadowHeight);
  shadowbox.find('.frameContainer').css('top',frameY);
  shadowbox.find('.imageFrame').width(maxWidth).height(maxHeight);
  shadowbox.find('.mask').css('height',maskHeight);
  shadowbox.find('.loader').css('top',loaderY).css('width',maxWidth);
}
function shadowAnimate(el){
  loader = el.find('.loader');
  if ($('html').hasClass('no-cssanimations')) {
    var animationInterval = 0;
    var animationTimer = setInterval(function(){
      animationInterval++;
      if (animationInterval > 8) { animationInterval = 1; }
      if ($('#shadowbox').is('hidden')) { clearInterval(animationTimer); }
      if (loader.is(':visible')) {
        var bgpos = '0 ' + animationInterval * -50 + 'px';
        el.find('.progress').css('background-position',bgpos);
      }
    },80);
  }
}
function shadowConstruct(callback) {
  var shadowbox = $('#shadowbox');
  shadowbox.show();
  var url = './templates/shadowbox.html';
  shadowbox.load(url,function(){
    shadowbox.attr('loaded','');
    shadowAnimate(shadowbox);
    shadowSize(shadowbox);
    $(window).on('resize',function() { shadowSize(shadowbox); });
    shadowbox.find('.next').on('click',function(){ lightboxNext(1); });
    shadowbox.find('.prev').on('click',function(){ lightboxNext(-1); });
    $(document).on('keyup',function(e){
      /*console.log(e.which);*/
      if (e.which == 39) { lightboxNext(1); }
      if (e.which == 37) { lightboxNext(-1); }
      if (e.which == 27) { shadowbox.hide(); }
    });
    shadowbox.find('.close').on('click',function(){
      shadowbox.hide();
    });
    shadowbox.find('.count .total').text($('.lightbox').size());
    callback();
  }); //Load the shadowbox
  /* Put no animation loader into the spinner */
}
function loadImage(el){
  var shadowindex = el.attr('shadowindex');
  var shadowbox = $('#shadowbox');
  if (shadowbox.is(':hidden')) { shadowbox.show(); }
  loadedImage = el.attr('href');
  /* Image Loading */
  /* Code Taken and Adapted from http://stackoverflow.com/questions/2392410/jquery-loading-images-with-complete-callback */
  $('#shadowImg').attr('src','');
  $('#shadowImg').hide();
  shadowbox.find('.loader').show(); //Show the Loader
  $('#shadowImg').attr('src', loadedImage); //Set the source so it begins fetching
  $('#shadowImg').load(function() { //Set something to run when it finishes loading
    $(window).on('resize',function() { lightImageSize($('#shadowImg')); });
    lightImageSize($('#shadowImg'));
    shadowbox.find('.loader').hide();
    $(this).fadeIn(600).attr('shadowindex',shadowindex); //Fade it in when loaded
    shadowbox.find('.count .current').text((parseInt(shadowindex) + 1));
    shadowbox.find('.client').text(el.parents('.col').find('.project-client').text());
  })
  .each(function() {
    //Cache fix for browsers that don't trigger .load()
    if(this.complete) $(this).trigger('load');
  });
}
function lightbox(el){
  var shadowbox = $('#shadowbox');
  if (shadowbox.children().size() <= 0) { shadowConstruct(function() { loadImage(el); }); }
  else { loadImage(el); }
}
$(function(){
  /* Preload Spinner for browsers that don't support animation */
  if (!$('html').hasClass('cssanimations')) {
    var spinner = $('img');
    spinner.attr('src','../img/home-sprites_Spinner.png');
  }
});