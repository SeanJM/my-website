$(function(){
  // GENERAL FUNCTIONS //
  function get_post(date) {
    $('#blog-area').append('<div class="entry" date="' + date + '" />');
    $('#blog-area .entry[date="' + date + '"]').load('blog/' + date + '.html',function(response, status, xhr){
      if (status == 'error') { $('#blog-area .entry[date="' + date + '"]').remove(); }
      else {
        var day = date.substring(2,4);
        var month = date.substring(0,2);
        var year = date.substring(5,8);
        $('#blog-area .entry[date="' + date + '"]')
          .attr('day',day)
          .attr('month',month)
          .attr('year',year);
      }
    });
  }
  function get_previous_post() {
    var previousEntry = new Object();
    previousEntry.day= $('#blog-area .entry:last').attr('day') - 1;
    previousEntry.month= $('#blog-area .entry:last').attr('month');
    previousEntry.year= $('#blog-area .entry:last').attr('year');
    if (previousEntry.day == 0) {
      previousEntry.month = previousEntry.month - 1;
      if (previousEntry.month == 1 || previousEntry.month == 3 || previousEntry.month == 5 || previousEntry.month == 7 || previousEntry.month == 8 || previousEntry.month == 10 || previousEntry.month == 12) { previousEntry.day = 31; }
      // Febuary
      if (previousEntry.month == 2) { 
        previousEntry.day = 29;
        if (previousEntry.year != 2016) { previousEntry.day = 28 };
      }
      if (previousEntry.month == 4 || previousEntry.month == 6 || previousEntry.month == 9 || previousEntry.month == 11) {
        previousEntry.day = 30; 
      }
    }
    previousEntry.date = previousEntry.month + "" + previousEntry.day + "" + previousEntry.month;
    console.log(previousEntry.day);
    get_post(previousEntry.date);
  }
  // ///////// //
  // PAGE LOAD //
  // ///////// //
  // Get todays post (script this)
  get_post('08142012');
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
