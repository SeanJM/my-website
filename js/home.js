function imgLink(link){
  if (link.indexOf('.png') >= 0) {
    var img = link.split(',');
    var html = [];
    if ($('.lightbox').size()) { var lbindex = $('.lightbox').size(); lbindex--; }
    else { lbindex = -1; }
    for (i=0;i < img.length;i++) {
      var dir = 'img/portfolio/' + img[i].split('/')[0] + '/';
      var file = img[i].split('/')[1];
      var thumb = file.split('.png')[0] + '-th.png';
      lbindex++;
      var output = '<div class="mask" index="' + (i+1) + '"><div class="lightbox" shadowindex="' + lbindex + '" href="' + dir + file + '"><img src="' + dir + thumb + '"></div></div>';
      html.push(output);
    }
    return html;
  }
}
function makeImgTag(el){
  var link, img;
  link = el.attr('imglink');
  img = imgLink(link);
  container = $('<div class="container"></div>');
  for (i = 0;i < img.length;i++) {
    var newImg = $(img[i]);
    var nav = $('<div class="btn" index="' + (i+1) + '"><div class="circle"></div></div>');
    if (i <= 0) {
      nav.addClass('active');
      newImg.addClass('active');
    }
    newImg.find('.lightbox').on('click',function(){ lightbox($(this)); });
    newImg.appendTo(container);
    imgNav = el.parent().find('.imgNav');
    nav.appendTo(imgNav);
    imgNav.find('.btn').each(function() {
      $(this).on('click',function() { 
        var index = $(this).attr('index');
        $(this).parents('.album').find('.active').removeClass('active');
        $(this).addClass('active').parents('.album').find('div.mask[index="' + index + '"]').addClass('active');
      });
    });
  }
  imgNavX = (imgNav.parent().width() / 2) - (imgNav.width() / 2);
  imgNav.css('margin-left',imgNavX);
  el.parent().prepend(container);
  el.remove();
}
function makeTechTag(el){
  if (el.attr('tech')) {
    var array, tag, li, str;
    array = el.attr('tech').split(',');
    ul = $('<ul class="tech"></ul>');
    for (i=0;i < array.length;i++) {
      li = $('<li><span class="icon sprite"></span></li>');
      if (array[i] == 'ai') { str = 'Illustrator'; }
      if (array[i] == 'jq') { str = 'jQuery'; }
      if (array[i] == 'ps') { str = 'Photoshop'; }
      if (array[i] == 'git') { str = 'Git'; }
      if (array[i] == 'html4' || array[i] == 'html5') { str = 'HTML' }
      if (array[i] == 'css2' || array[i] == 'css3') { str = 'CSS'; }
      if (array[i] == 'chrome') { str = 'Extension'; }
      $('span',li).addClass(array[i]).after(str);
      $(ul).append(li);
    }
    el.after(ul);
    el.remove();
  }
}
function makeTitle(el){
  if (el.attr('scope') == 'title') {
    var e = $(el.html());
    var title = e.find('client').attr('val');
    return console.log(title);
  }
}
$(function(){
  $('.dropdown.contact').hover(function(){
    var ul = $(this).find('ul');
    ul.show().css('opacity','0').stop().animate({'opacity':'1'},500);
  },function(){
    $(this).find('ul').stop().animate({'opacity':'0'},500,function(){
      $(this).hide();
    });
  })
  $('.contact.email').click(function(){ window.location = 'mailto:seanjmacisaac@gmail.com?subject=Business Inquiry'; });
  $('.contact.skype').click(function(){ window.location = 'skype:seanmacisaac?chat'; });
  $('.contact.twitter').click(function(){ window.open('http://www.twitter.com/SeanJMacIsaac'); });
  $('.contact.linkedin').click(function(){ window.open('http://www.linkedin.com/pub/sean-macisaac/29/255/51a'); });
  //Handing the showing and the hiding of the mini header
  $(window).scroll(function(){
    var scroll = $(window).scrollTop();
    var scrollTrigger = 330;
    var i;
    fixedHeader = $('#fixed-header');
    var fixedInitPos = fixedHeader.height() * -1;
    var fixedTop = parseInt(fixedHeader.css('top').replace('px',''));
    if (scroll < scrollTrigger && fixedTop > fixedInitPos) { i = fixedInitPos; }
    if (scroll > scrollTrigger && fixedTop <= 0) {
      i = (fixedInitPos + ((scroll - scrollTrigger) / 3));
      if (i > 0) { i = 0; }
    }
    fixedHeader.css('top',i + 'px');
  });
  $('script[class="section"]').each(function(){
    var self = $(this);
    var id = $(this).attr('id');
    var url = './' + id + '.html';
    var div = $('<div class="section" id="' + id + '"></div>');
    self.before(div);
    div.load(url,function(){
      self.remove();
      div.trigger('moduleloaded');
    });
  });
  function template(self,arr,callback) {
    for (i = 0;i < arr.length;i++) {
      var div = self.clone(true); /* Clone the template and show it */
      /* Adapted from http://stackoverflow.com/questions/377961/efficient-javascript-string-replacement */
      str = div.html();
      div
        .html(str.replace(/{{(\w*)}}/g,function(m,key){return arr[i].hasOwnProperty(key)?arr[i][key]:"";}))
        .appendTo(self.parent());
    }
    self.remove(); /* Remove the template element */
    if (typeof callback == 'function') { callback(); }
  }
  $('div.section').on('moduleloaded',function(){
    $('div[template]').each(function(){
      if ($(this).attr('template') == 'portfolio') {
        template($(this),portfolio);
      }
    });
    $('div[tech]').each(function() {
      makeTechTag($(this));
    });
    $('img[imglink]').each(function(){
      makeImgTag($(this));
    });
  });
  function quoteView(n) {
    var active = $('#quotes .quote-container.active');
    var delay = 550;
    function showQuote() { $('#quotes .quote-container[quoteIndex="' + n + '"]').addClass('active').fadeIn(delay); }
    if (active.size() <= 0) { showQuote(); }
    active.removeClass('active').fadeOut(delay,function(){showQuote();});
    $('#quotes .quote-nav .btn.active').removeClass('active');
    $('#quotes .quote-nav .btn[quoteIndex="' + n + '"]').addClass('active');
  }
  function quote() {
    template($('#quotes .quote-container'),quotes,function(){
      var i = 0;
      console.log(i);
      var quoteNav = $('#quotes .quote-nav');
      $('#quotes .quote-container').each(function(){
        var qh = ($(this).height() / 2) - ($(this).find('p.quote').height() / 2);
        i++;
        $(this).attr('quoteIndex',i).hide().find('p.quote').css('top',qh);
        var btn = $('<div class="btn" quoteIndex="' + i + '"><div class="circle"></div></div>');
        btn.on('click',function(){ quoteView($(this).attr('quoteIndex')); });
        quoteNav.append(btn);
      });
      quoteView(1);
      var qnx = ($('#quotes').width() / 2) - (quoteNav.width() / 2);
      quoteNav.css('margin-left',qnx);
    });
  }
  $(document).ready(function(){ quote(); });
});
var portfolio = [{
    "client":"Pixologic",
    "project":"Sculptris",
    "date":"Aug 2012",
    "role":"Pitch",
    "desc":"Worked a little over a week on a pitch. Took the opportunity to improve upon ZBrush's UI paradign at the same time.",
    "tech":"ai",
    "imgMain":"sculptris/Sculptris-Main-Interface-outliner-01.png,sculptris/collapsed-panels-spinners.png,sculptris/expanded-tool-shelf-search.png,sculptris/alphas.png"
  },
  {
    "client":"InfoReach",
    "project":"SendHub",
    "date":"2011 to 2012",
    "role":"Lead Designer",
    "desc":"Collaborated with the founders on the Logo, UI/UX, look &amp; feel and website design. Also trained the junior.",
    "tech":"ai,ps,html4,css2,jq,git",
    "imgMain":"sendhub/inbox.png,sendhub/contacts-group.png,sendhub/new-msg.png,sendhub/thread.png,sendhub/contacts-group.png",
  },
  {
    "client":"Socially Active",
    "project":"Socially Active",
    "date":"2011",
    "role":"UI Designer",
    "desc":"Client had pre-existing logo and poor ui/ux design. Client wanted to to fix it and improve upon the design. During our time together I ended up designing the website as well.",
    "tech":"ai,ps",
    "imgMain":"socially-active/social-profile.png,socially-active/friends.png,socially-active/friendship-page.png,socially-active/whats-popular.png",
  },
  {
    "client":"CLO",
    "project":"Habit Tracker",
    "date":"2011",
    "role":"UI/UX",
    "desc":"Client had pre-existing application with a poor design and I addressed some UX and redesigned the look &amp; feel.",
    "tech":"ai",
    "imgMain":"clo-habbit/actions.png,clo-habbit/main.png,clo-habbit/new-action.png",
  },
  {
    "client":"CLO",
    "project":"CLO Online",
    "date":"2011",
    "role":"UI/UX",
    "desc":"Client wanted to create an iPad application based on the iPhone UI I created.",
    "tech":"ai",
    "imgMain":"clo-ipad/characters.png,clo-ipad/flashcard.png,clo-ipad/vocabulary-info.png"
  },
  {
    "client":"Surfpin",
    "project":"Surfpin",
    "date":"2011",
    "role":"UI Look &amp; Feel",
    "desc":"Client already had wireframes and wanted the artistic touch on their payment gateway application.",
    "tech":"ai",
    "imgMain":"surfpin/splash.png,surfpin/item.png,surfpin/payment.png,surfpin/processing.png"
  },
  {
    "client":"mIRC Corporation",
    "project":"mIRC Scripter",
    "date":"2012",
    "role":"UI/UX Pitch",
    "desc":"Current UI is old and dated, this is my take on it.",
    "tech":"ai",
    "imgMain":"ones/mirc-scripter-after.png"
  },
  {
    "client":"Personal",
    "project":"Beer Finder",
    "date":"2012",
    "role":"UI Look &amp; Feel",
    "desc":"This is my take on a location based beer finder, the original idea was made by Nick Latreille over at <a href='http://www.swellgraphics.ca'>Swell Graphics</a>.",
    "tech":"ai",
    "imgMain":"ones/beer-finder.png"
  },
  {
    "client":"oDesk",
    "project":"Chrome Extension",
    "date":"2012",
    "role":"UI/UX",
    "desc":"A functional chrome extension for oDesk (work in progress)",
    "tech":"ai,css3,jq,html5,chrome",
    "imgMain":"ones/odesk.png"
  }];
  var quotes = [{
    "quote":"Sean is a very talented designer and the utmost professional. He took our product from some basic wireframes and helped us turn it into a world class design. He is also very consistent, communicates effectively, and is a collaborative team member. I would recommend him to anyone, and I hope to work with him again in the future.",
    "client":"Socially Active"
  },
  {
    "quote":"Sean is a very creative professional with very strong work ethic and someone who has always come through for us. His approach to projects is very refreshing and keeps us in control at all times.  Sean has become our de-facto designer for all design projects and we look forward to our next project with him soon.",
    "client":"Team Venti"
  },
  {
    "quote":"Sean is really good at taking a client's ideas and turning them into a good looking and functional design.  Be it software interfaces or web design he did it all very well.",
    "client":"SCD Lifestyle"
  },
  {
    "quote":"It was a pleasure working with Sean, he is a true professional. Sean was able to understand my request and complete the necessary tasks on-time and within my budget. I highly recommend Sean and would be happy to work with him again in the future.",
    "client":"QR Wild"
  }];