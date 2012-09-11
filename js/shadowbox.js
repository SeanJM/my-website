function lightImageSize(image){
  image.removeAttr('width').removeAttr('height');
  var mask = $('.shadowbox .mask');
  var imgX = parseInt((mask.width() / 2) - (image.width() / 2));
  var imgY = parseInt((mask.height() / 2) - (image.height() / 2));
  if (image.height() > mask.height()) { imgY = 0; }
  image.css('left',imgX).css('top',imgY);
  //Adapted from http://stackoverflow.com/a/10620516
  var parH = mask.height() - 30;
  var areaH = image.height();
  var scrH = parH / (areaH/parH);
  var scrollBtn = $('.shadowbox .scrollbar .scroll');
  scrollBtn.show();
  if (scrH > parH) { scrollBtn.hide(); }
  scrollBtn.css('top','');
  function dragging(){     
      var scrPos = scrollBtn.position().top;   
      image.css({top: -(scrPos*(areaH/parH)-1)});
  }
  $('.shadowbox .scrollbar').css('height',parH);
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
  var curIndex = parseInt($('.shadowbox img').attr('shadowindex'));
  var indexSize = ($('.lightbox').size() - 1);
  var index = curIndex + i;
  if (index >= $('.lightbox').size()) { index = 0; }
  if (index < 0) { index = indexSize; }
  var image = $('.lightbox[shadowindex="' + index + '"]');
  lightbox(image);
}
function shadowSize() {
  var scroll = $(window).scrollTop();
  var maxHeight = $(window).height() - 20;
  var maxWidth = $(window).width() - 20;
  var maskHeight = maxHeight - 80;
  if ($(document).height() < $(window).height()) {
    var shadowHeight = $(window).height();
  }
  else { var shadowHeight = $(document).height(); }
  var frameY = scroll + 10;
  var shadowbox = $('.shadowbox');
  var loaderY = (maxHeight / 2) - (shadowbox.find('.loader').height() / 2);
  shadowbox.height(shadowHeight);
  shadowbox.find('.mask').css('height',maskHeight);
  shadowbox.find('.imageFrame').width(maxWidth).height(maxHeight);
  shadowbox.find('.loader').css('top',loaderY).css('width',maxWidth);
  shadowbox.find('.frameContainer').css('top',frameY);
}
function shadowConstruct() {
  var shadowbox = $('<div class="shadowbox"></div>');
  var titlebar = $('<div class="titlebar"></div>');
  var loader = $('<div class="loader"><div class="spinner"></div></div>');
  var frame = $('<div class="frameContainer"><div class="imageFrame"><div class="mask"></div></div></div>');
  var image = $('<img id="shadowImg"></img>')
  var nav = $('<div class="nav"><div class="prev btn">Prev</div><div class="next btn">Next</div></div>');
  var count = $('<div class="count"><p><span class="current"></span> of <span class="total">' + $('.lightbox').size() + '</span></p></div>');
  var close = $('<div class="close sprite"></div>');
  var scroll = $('<div class="scrollbar"><div class="scroll"></div></div>')
  titlebar.append(close);
  nav.append(count);
  frame.find('.mask').prepend(image).append(scroll);
  frame.find('.imageFrame').append(nav).prepend(loader).append(titlebar);
  shadowbox.append(frame);
  $('body').append(shadowbox);
  /* Put no animation loader into the spinner */
  if ($('html').hasClass('no-cssanimations')) {
    var progress = $('<div class="progress"></div>');
    var spinner = loader.find('.spinner');
    spinner.append(progress);
    var animationInterval = 0;
    var animationTimer = setInterval(function(){
      animationInterval++;
      if (animationInterval > 8) { animationInterval = 1; }
      // Check to see if the shadowbox is open, if not, stop the animation
      if ($('.shadowbox').size() < 1) { 
        clearInterval(animationTimer); 
      }
      // Stop the animation when the loader is not visible
      if (loader.is(':visible')) {
        var bgpos = '0 ' + animationInterval * -50 + 'px';
        progress.css('background-position',bgpos);
      }
    },80);
  }
  shadowSize();
  $(window).on('resize',function() { shadowSize(); });
  $('.shadowbox .next').on('click',function(){
    lightboxNext(1);
  });
  $('.shadowbox .prev').on('click',function(){
    lightboxNext(-1);
  });
  $(document).on('keyup',function(e){
    /*console.log(e.which);*/
    if (e.which == 39) { lightboxNext(1); }
    if (e.which == 37) { lightboxNext(-1); }
    if (e.which == 27) { $('.shadowbox').remove(); }
  });
  $('.shadowbox .close').on('click',function(){
    $('.shadowbox').remove();
  });
}
function lightbox(el){
  var shadowindex = el.attr('shadowindex');
  if (!$('.shadowbox').length) {
    shadowConstruct();
  }
  loadedImage = el.attr('href');
  /* Image Loading */
  /* Code Taken and Adapted from http://stackoverflow.com/questions/2392410/jquery-loading-images-with-complete-callback */
  $('#shadowImg').attr('src','');
  $('#shadowImg').hide();
  $('.shadowbox .loader').show(); //Show the Loader
  $('#shadowImg').attr('src', loadedImage); //Set the source so it begins fetching
  $('#shadowImg').load(function() { //Set something to run when it finishes loading
    $(window).on('resize',function() { lightImageSize($('#shadowImg')); });
    lightImageSize($('#shadowImg'));
    $('.shadowbox .loader').hide();
    $(this).fadeIn(600).attr('shadowindex',shadowindex); //Fade it in when loaded
    $('.shadowbox .count .current').text((parseInt(shadowindex) + 1));
  })
  .each(function() {
    //Cache fix for browsers that don't trigger .load()
    if(this.complete) $(this).trigger('load');
  });
}
$(function(){
  /* Preload Spinner for browsers that don't support animation */
  if (!$('html').hasClass('cssanimations')) {
    var spinner = $('img');
    spinner.attr('src','../img/home-sprites_Spinner.png');
  }
});