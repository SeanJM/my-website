// GENERAL FUNCTIONS //

function weekday(day) {
  var name = {
    0 : 'Sunday',
    1 : 'Monday',
    2 : 'Tuesday',
    3 : 'Wednesday',
    4 : 'Thursday',
    5 : 'Friday',
    6 : 'Saturday'
  }
  return name[day];
}

function monthName(month) {
  var name = {
    1 : 'January',
    2 : 'February',
    3 : 'March',
    4 : 'April',
    5 : 'May',
    6 : 'June',
    7 : 'July',
    8 : 'August',
    9 : 'September',
    10 : 'October',
    11 : 'November',
    12 : 'December'
  }
  return name[month];
}

function prevDate(num) {
  var date = new Date(),
      d = date.getDate(),
      m = date.getMonth()+1,
      y = date.getFullYear(),
      monthEnd = {
      1 : 31, 2 : 29, 3 : 31, 4 : 30, 
      5 : 31, 6 : 30, 7 : 31, 8 : 31,
      9 : 30, 10: 31, 11: 30, 12: 31
      };
  for (i = 0; num+i < 0;i++) {
    d--;
    if (d == 0) {
      m--;
      if (m == 0) { m = 12; }
      d = monthEnd[m];            
    }
  }
  return m + '-' + d + '-' + y;
}

function get_post(date) {
  var templateCache = $('<div />');
  templateCache.load('templates/blog-entry.html',function(){
    var cache = $('<div />');
    cache.load('blog/' + date + '.html',function(response, status, xhr){
      if (status == 'error') { }
      else {
        var template  = templateCache.html().replace(/{{(\w*)}}/g,function(m,key) { 
            newDate   = new Date(date.replace(/-/g,'/')),
            ddd       = weekday(newDate.getDay()),
            mmm       = monthName(newDate.getMonth()+1),
            m         = date.split('-')[0],
            d         = date.split('-')[1],
            y         = date.split('-')[2];

          if (key == 'd') { return d; }
          if (key == 'ddd') { return ddd; }
          if (key == 'm') { return m; }
          if (key == 'mmm') { return mmm; }
          if (key == 'y') { return y; }

          return cache.find(key).length?cache.find(key).html():""; 
        });
        templateCache.replaceWith(templateCache.html(template).contents())
          .appendTo($('#blog'));
      }
    });
  });
}

function get_posts(today) {
  var str = today.split('-'),
      m = str[0],
      d = str[1],
      y = str[2],
      i = 0;

  while ($('blog-entry').size() <= 10 && i <= 30) {
    get_post(prevDate(i*-1));
    i++;
  }
  console.log('loaded all posts');
}

function get_blog() {
  if ($('#blog').size() == 0) {
    var blog = $('<div id="blog" />').appendTo('#mainContainer > .container');
  }
  var date  = new Date(),
      m     = date.getMonth(),
      d     = date.getDate(),
      y     = date.getFullYear();
      today = m + '-' + d + '-' + y;
  get_posts(today);
}


function get_previous_post() {
  var prev      = {
    'day'     : $('#blog-area .entry:last').attr('day'),
    'month'   : $('#blog-area .entry:last').attr('month'),
    'year'    : $('#blog-area .entry:last').attr('year')
  },
      monthEnd  = {
    '1' : 31, '2' : 28, '3' : 31, '4' : 30, 
    '5' : 31, '6' : 30, '7' : 31, '8' : 31,
    '9' : 30, '10': 31, '11': 30, '12': 31
  }
  
  var prevD   = prev['day']-1,
      prevM   = prev['month'],
      prevY   = prev['year'];
  
  if (prevD == 0) {
    var prevMonth = prev['month']-1;
    
    if (prevMonth == 0) {
      var prevM = 12;
      var prevY = prev['year']-1;
    }

    prevD = monthEnd[prevM]; 
    // Febuary
    if (prevMonth == 2) { 
      prevD = 29;
      if (prevY != 2016) { prevD = 28 };
    }

  }

  prevPost = prevM + "" + prevD + "" + prevM;
  
  get_post(prevPost);
}

// >>>>>>>>>>>>>>>>>>>>>>>>>> //
//          PAGE LOAD         //
// >>>>>>>>>>>>>>>>>>>>>>>>>> //

$(function(){
  // As the user scrolls the blog get the 
  //previous day's post
  $(window).scroll(function(){
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
      get_previous_post();
    }
  });
  function fn_html_class(page_name,callback) {
    if (typeof page_name != 'undefined') { 
      fn_document_setup(page_name); 
      callback();
      alert(page_name);
    }
    else {
      return $('html').class();
    }
  }
  /* Give HTML document a class 
  and begin the head function */
  function fn_document_setup(page_name,callback) {
    var html = $('html');
    html.addClass(page_name);
    fn_head_construction(page_name);
    callback();
  }
  function fn_head_construction(page_name) {
    fn_add('js',page_name);
    fn_add('css',page_name);
  }
  function fn_add(type,page_name) {
    var head = $('head');
    var tag = '';
    alert(type);
    if (type == 'js') { tag = '<script type="text/javascript" src="js/' + name + '.js"></script>' }
    if (type == 'css') { tag = '<link  href="css/' + name + '.css" rel="stylesheet" type="text/css"></script>' }
    head.append(tag);
  }
});
