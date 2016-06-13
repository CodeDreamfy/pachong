//master
$(function(){
  var $resolveBtn = $('.resolveBtn');
  var $overlay = $('.overlay');

  $resolveBtn.on('click', function(){
    let $url = $('#InputUrl');
    let _this = $(this);
    _this.removeClass('btn-primary').addClass('btn-default active').prop('disabled', 'disabled');
    _this.text("正在解析");
    $overlay.fadeIn();
    $.ajax({
      url: '/mapsearch',
      method: 'post',
      dataType: 'json',
      data: { url: $url.val().trim()},
      success: function(e){
        console.log(e);
        _this.removeClass('btn-default active').addClass('btn-primary').prop('disabled', '');
        $overlay.fadeOut();
        _this.text("开始解析");
      }
    })
  })
})
