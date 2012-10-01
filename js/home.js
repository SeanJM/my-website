/* Check to see if the page has CSS animations */
var cssAnim = true;
if ($('html').hasClass('no-cssanimations')) { cssAnim = false; }

function loadBlog() {
  $('#home').hide();
  get_blog();
}
function loadHome() {
  $('#blog').hide();
  $('#home').show();
}

function hash(page){
  if (page == '#home') {
    console.log('home');
    loadHome();
  }

  if (page == '#blog') {
    console.log('blog');
    loadBlog();
  }

  else { 
    console.log('home'); 
    loadHome();
  }
}

function imgLink(link){
  if (link.indexOf('.png') >= 0) {
    var img       = link.split(','),
        html      = [];
    
    if ($('.lightbox').size()) { 
      var lbindex = $('.lightbox').size()-1; 
    }
    else { lbindex = -1; }
    
    for (i=0;i < img.length;i++) {
      
      var dir     = 'img/portfolio/' + img[i].split('/')[0] + '/',
          file    = img[i].split('/')[1],
          thumb   = file.split('.png')[0] + '-th.png';
      
      lbindex++;
      var output = '<div class="mask" index="' + (i+1) + '"><div class="lightbox" shadowindex="' + lbindex + '" href="' + dir + file + '"><img src="' + dir + thumb + '"></div></div>';
      html.push(output);
    }

    return html;

  }
}
function makeImgTag(el){
  
  var link        = el.attr('imglink'),
      img         = imgLink(link),
      container   = $('<div class="container"></div>');
  
  for (i = 0;i < img.length;i++) {
    
    var newImg    = $(img[i]),
        nav       = $('<div class="btn" index="' + (i+1) + '"><div class="circle"></div></div>'),
        imgNav = el.parent().find('.imgNav');
    
    if (i <= 0) {
      nav.addClass('active');
      newImg.addClass('active');
    }
    
    newImg.find('.lightbox').on('click',function(){ lightbox($(this)); });
    newImg.appendTo(container);
    nav.appendTo(imgNav);
    
    imgNav.find('.btn').each(function() {
      $(this).on('click',function() { 
        var index = $(this).attr('index');
        $(this).parents('.album').find('.active').removeClass('active');
        $(this).addClass('active').parents('.album').find('div.mask[index="' + index + '"]').addClass('active');
      });
    });

  }
  var imgNavX = (imgNav.parent().width() / 2) - (imgNav.width() / 2);
  
  imgNav.css('margin-left',imgNavX);
  
  el.parent().prepend(container);
  el.remove();
}

function techTagLabel(arr) {
  ret = {
    'ai':'Illustrator',
    'jq':'jQuery',
    'ps':'Photoshop',
    'git':'Git',
    'html4':'HTML',
    'html5':'HTML',
    'css2':'CSS',
    'css3':'CSS',
    'chrome':'Extension'
  };
  return ret[arr];
}

function makeTechTag(el){
  if (el.attr('tech')) {
    
    var array = el.attr('tech').split(','),
        ul    = $('<ul class="tech"></ul>'),
        tag,
        li, 
        str;

    for (i=0;i < array.length;i++) {
      li = $('<li><span class="icon sprite"></span></li>');
      
      str = techTagLabel(array[i]);
      
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

  /* Check window location */
  hash(window.location.hash);

  $('.dropdown.contact').hover(function(){
    var ul = $(this).find('ul');
    ul.show().css('opacity','0').stop().animate({'opacity':'1'},500);
  },function(){
    $(this).find('ul').stop().animate({'opacity':'0'},500,function(){
      $(this).hide();
    });
  })
  
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

  function template(self,arr,callback) {
    var t = arr.length;
    for (i = 0;i < arr.length;i++) {
      var div = self.clone(true); /* Clone the template and show it */
      /* Adapted from http://stackoverflow.com/questions/377961/efficient-javascript-string-replacement */
      str = div.html();
      div.html(str.replace(/{{(\w*)}}/g,function(m,key){return arr[i].hasOwnProperty(key)?arr[i][key]:"";}));
      self.before(div);
    }
    self.remove(); /* Remove the template element */
    if (typeof callback == 'function') { 
      callback(); 
    }
  }

  $('div[module]').each(function(){
    var self = $(this);
    var id = $(this).attr('id');
    var url = './templates/' + id + '.html';
    var div = $('<div class="section" id="' + id + '"></div>');
    self.before(div);
    div.load(url,function(){
      self.remove();
      div.trigger('moduleloaded');
    });
  });
  function verticalCenter(n){
    var descY = (n.parent().height() / 2) - (n.find('p').height() / 2);
    n.hide().find('p').css('top',descY);
  }
  function headerBind() {
    /* Contact */
    $('.contact.email')
      .on('click',function(){ window.location = 'mailto:seanjmacisaac@gmail.com?subject=Business Inquiry'; });
    $('.contact.skype')
      .on('click',function(){ window.location = 'skype:seanmacisaac?chat'; });
    $('.contact.twitter')
      .on('click',function(){ window.open('http://www.twitter.com/SeanJMacIsaac'); });
    $('.contact.linkedin')
      .on('click',function(){ window.open('http://www.linkedin.com/pub/sean-macisaac/29/255/51a'); });
    
    $(window).bind('hashchange',function(){
      hash(window.location.hash);
    });
    /* Header Links */
  }

  function workBind() {
    template($('#work div[template]'),work,function(){
      $('div[tech]').each(function() {
        makeTechTag($(this));
      });
      $('img[imglink]').each(function(){
        makeImgTag($(this));
      });
    });
  }
  
  function softwareBind() {
    template($('#software div[template].col'),experience,function(){
      var el = $('#software .col');
      index(el);
      el.each(function(){
        $(this).on('click',function() { 
          selectDescription($(this).attr('index'));
        });
      });
    });
    template($('#software .description-container div[template]'),experience,function(){
      var marie = $('#software .description-container .description');
      index(marie);
      marie.each(function(){
       verticalCenter($(this));
      });
      selectDescription(1);
    });
  }

  function educationBind() {
    template($('#education .col[template]'),education,function(){
      var col = $('#education .col');
      template($('#education .edu-desc .desc[template]'),education,function(){
        var desc = $('#education .edu-desc .desc');
        index(col);
        col.each(function(){
          $(this).on('click',function(){
            var n = $(this).attr('index');
            selectEduDesc({'master':col,'slave':desc},n);
          });
        });
        index(desc);
        desc.each(function(){
          verticalCenter($(this));
        });
        selectEduDesc({'master':col,'slave':desc},1);
      });
    });
  }

  /* Perform Binding on loaded modules */
  $('div.section').on('moduleloaded',function(){
    
    var id = $(this).attr('id');
    
    if (id == 'header')     { headerBind();     }
    if (id == 'work')       { workBind();       }
    if (id == 'software')   { softwareBind();   }
    if (id == 'education')  { educationBind();  }
  
  });

  function index(el){
    var i = 0;
    el.each(function(){
      i++;
      $(this).attr('index',i);
    });
  }

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
  
  $('document').ready(function(){ quote(); });
  
  function selectDescription(n){
    var el              = $('#software .description-container'),
        desc            = el.find('.description[index="' + n + '"]'),
        software        = desc.find('p').attr('class'),
        arrow           = el.find('.arrow').attr('class','arrow ' + software),
        arrowTransition = 300;
    
    function show(){
      var active = el.find('.description.active');
      if (active.size()) {
        el.find('.description.active').removeClass('active').fadeOut(300,function() { 
            desc.addClass('active').fadeIn(300);
        });
      }
      else { desc.addClass('active').show(); }
    }

    function arrowAnim(a) { 
      if (cssAnim == false) { arrow.animate(a,arrowTransition); }
      show();
    }

    if (software == 'ai') { arrowAnim({'left':'68px'}); }
    if (software == 'ps'){ arrowAnim({'left':'225px'}); }
    if (software == 'jq'){ arrowAnim({'left':'379px'}); }
    if (software == 'html'){ arrowAnim({'left':'539px'}); }
    if (software == 'css'){ arrowAnim({'left':'695px'}); }
    if (software == 'git'){ arrowAnim({'left':'852px'}); }
  }
  function selectEduDesc(el,n){
    var master = $(el.master[n-1]);
    var slave = $(el.slave[n-1]);
    var fadeTime = 400;
    oldDesc = el.slave.parent().find('.active');
    function present(){
      slave.addClass('active').fadeIn(fadeTime);
    }
    el.master.removeClass('active');
    master.addClass('active');
    if (oldDesc.size()) {
      oldDesc.removeClass('active').fadeOut(fadeTime,function(){
        present();
      });
    }
    else { present(); }
  }
});
var work = [{
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
  var experience = [{
    "software":"Illustrator",
    "icon":"ai",
    "experience":"three",
    "description":"I love <a href='http://www.adobe.com/products/illustrator.html'>illustrator</a>, vector changed everything about how I work. I have been creating <a href='http://en.wikipedia.org/wiki/Vector_graphics'>vector graphics</a> for over 5 years."
  },{
    "software":"Photoshop",
    "icon":"ps",
    "experience":"three",
    "description":"I have been using <a href='http://www.adobe.com/products/photoshop.html'>Photoshop</a> for 13 years now. It is my goto app for photo manipulation and creating textures."
  },{
    "software":"jQuery",
    "icon":"jq",
    "experience":"one",
    "description":"I have been using <a href='http://jquery.com/'>jQuery</a> for almost three years now. I started using it for it's powerful animations and transitions. At my core, I am designer and without <a href='http://stackoverflow.com/'>stackoverflow</a>, this website would not be here."
  },{
    "software":"HTML 5",
    "icon":"html",
    "experience":"three",
    "description":"I love the new features of <a href='http://www.w3.org/html/logo/'>HTML 5</a>. I can code anything you need in it. My markup is clean and semantic and will always pass the <a href='http://validator.w3.org/'>validator</a>, often on a first run."
  },{
    "software":"CSS 3",
    "icon":"css",
    "experience":"three",
    "description":"This is my favorite part of web design, getting into the CSS. I tend to favor scope when I code CSS and use ID's to delineate those scopes. I keep my CSS as clean, light and concise as possible."
  },{
    "software":"Git",
    "icon":"git",
    "experience":"two",
    "description":"I'm no stranger to version control. I was first introduced to <a href='http://git-scm.com/'>Git</a> a few years ago. I use it regularly today. If you want proof, the source for my site is available <a href='https://github.com/SeanJM/my-website'>here</a>."
  }];
  var contact = [{
    "method":"email",
  },{
    "method":"skype",
  },{
    "method":"twitter",
  },{
    "method":"linkedin"
  }];
  var platforms = [{
    "device":"tablet",
  },{
    "device":"desktop",
  },{
    "device":"mobile"
  }];
  var education = [{
    "icon":"hc",
    "school":"Humber College in Etobicoke",
    "date":"2005<span class='icon range sprite'></span>2006",
    "degree":"Post Grad Certificate in 3D Animation",
    "completion":"Graduated with Honors &amp; Presidents Letter",
    "notes":"At Humber I had focus, classes I loved that were really hands on.<br><br> There was the life drawing course where I drew beautiful nudes. The sculpting class where we made our dreams (or nightmares) come true. The acting class where we had to let loose and give up the idea of being cool. And the class that I enjoyed the most; 3D animation. <br><br> By the end of the year we had to complete a demo reel to showcase our chosen domain in 3D."
  },{
    "icon":"uqo",
    "school":"Universit&#233; du Qu&#233;bec en Outaouais",
    "date":"2003<span class='icon range sprite'></span>2004",
    "degree":"Comic Book Creation",
    "completion":"Transfered to IADT to study game design",
    "notes":"Throughout Highschool I was always drawing, and I read a lot of comic books. At the time I didn't really know what I wanted to do, and my parents recommended I try it out.<br><br>When highschool was almost over, I enrolled and I was accepted immediately into the program.<br><br>Although I loved reading comic books &amp; drawing, I discovered quickly that I wanted to try something else. The first year was filled with awesome people and boring classes. Art history, french class, a civics class and the only class I really enjoyed: Philosophy. <br><br>I was and still am in love with Philosophy, discovering the meaning of life and dying wise and content is my goal."
  },{
    "icon":"dls",
    "school":"Ecole Secondaire Publique De La Salle",
    "date":"1999<span class='icon range sprite'></span>2003",
    "degree":"High School Diploma in Arts Concentration",
    "completion":"Graduated with a Highschool diploma and great foundation in art",
    "notes":"My highschool years were formative for what I do now. I had art every day, and this was a dream come true.<br><br>My art teachers were great and pushed me to new heights. But it was the people I went to school with who really forced me to become better. Highschool was a catalyst for realizing that a career in arts was my goal.<br><br>I've had a few twists and turns since highschool ended, and still do, but that's part of being a creative person.<br><br>Thank you, Mr. Langlois and Mr. Charboneau."
  }];