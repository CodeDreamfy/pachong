//master
$(function(){
  let $resolveBtn = $('.resolveBtn');
  let $overlay = $('.overlay');
  let $content = $('.contentWrap');
  let $container = $('.container');
  let path = '';

  $resolveBtn.on('click', function(){
    var _this = $(this);
    _this.text("正在解析");
    _this.removeClass('btn-primary').addClass('btn-default').prop('disabled', 'disabled');
    _this.next().fadeIn();
    setTimeout(function(){
      setSearchEnd(_this, true);
    }, 2000)
  });

  /*
  $resolveBtn.on('click', function(){
    let $url = $('#InputUrl');
    path = $url.val().trim();
    let _this = $(this);
    if($url.val().length == 0){
      return false;
    }
    _this.removeClass('btn-primary').addClass('btn-default active').prop('disabled', 'disabled');
    _this.text("正在解析");
    $overlay.fadeIn();
    $.ajax({
      url: 'http://192.168.0.218:3000/crawler/start',
      method: 'post',
      dataType: 'json',
      data: { url: path},
      success: function(e){
        if(e.errno == 200){
          setSearchEnd(_this, true);
          // var mapData = setInterval(function(){
          //   $.ajax({
          //     url: 'http://192.168.0.218:3000/crawler/mapsearch',
          //     method: 'post',
          //     dataType: 'json',
          //     data: { url: path},
          //     success: function(e){
          //       if(e.errno == 200){
          //         clearTimeout(mapData);
          //         setData(e);
          //       }
          //     }
          //   })
          // }, 5000)
        }else {
          setSearchEnd(_this);
        }
      }
    })
  });
  */

  function setSearchEnd(context){
    context.removeClass('btn-default').addClass('btn-primary').prop('disabled', '');
    context.next().fadeOut();
    if(arguments[1]){
      context.text("开始解析");
      $container.animate({ "margin-top": 20}, 800, function(){
        $content.find('.load-data').show();
        $content.fadeIn(300);
      });
    }else{
      alert("地址解析出错！")
      context.text("重新解析");
    }
  };

  function setData(e){
    // console.log(data);
    var obj = e.data.data;
    if(obj.length == 0){
      $content.find('.panel-body .load-data>span ').fadeOut();
      $content.find('.panel-body .load-data p ').text('暂无数据')
      return;
    }
    var docFrame = document.createDocumentFragment();
    console.log(obj)
    for(var i=0; i< obj.length; i++){
      var $item = $(['<div class="col-sm-4 col-md-3 item">',
                    '  <div class="thumbnail">',
                    '    <a class="img-show"></a>',
                    '    <div class="caption">',
                    '      <h3></h3>',
                    '      <p class="keyword"></p>',
                    '      <p><a href="#" class="btn btn-primary info-detail"  role="button" >查看详情</a></p>',
                    '    </div>',
                    '  </div>',
                    '</div>'].join(' '));
      $item.find('.img-show').css({"background": obj.img, "background-size": 'cover'});
      $item.find('.caption h3').text(obj.title);
      $item.find('.caption .keyword').text(obj.keyword);
      $(docFrame).append($item);
    }
    console.log("---append---")
    var $row = $('<div class="row"></div>');
    $row.append(docFrame);
    console.log($row)
    $content.find('.panel-body .load-data').fadeOut();
    $content.find('.panel-body').append($row);
  }

  var model_index;
  $content.on('click', '.info-detail', function(){
    var _this = $(this);
    model_index = _this.closest('.item').index();
    $('#myModal').modal();
  });
  $('#myModal').on('show.bs.modal', function (event) {
    var modal = $(this);
    modal.find('.modal-title').text();
    modal.find('.modal-body').text();
  })
  $('#myModal').on('hide.bs.modal', function (event) {
    var modal = $(this);
    modal.find('.modal-title').text('');
    modal.find('.modal-body').text('');
  })



  /* details */
  var $listItem = $('.detailsWrapper .list-wrapper');
  var $listActive = $listItem.find('.smallImg');
  var $img = $('img', $listActive);

  /*
    * 当图片加载完毕的时候执行计算img
  */
  $img.on('load', function(){
    var $this = $(this);
    setFull($this)
  })

  /*
    * 当窗口改变大小的时候重新计算img
  */
  var clearRs = null;
  $(window).on('resize', function(){
    if(!!clearRs){
      clearTimeout(clearRs);
    }
    clearRs = setTimeout(function(){
      $img.each(function(i,e){
        var $this= $(e)
        setFull($this);
      })
    }, 250)
  })



  //fullImg
  function setFull(context){
    var $obj = context.closest('a')
    var obj = {w: $obj.width(), h: $obj.height()}
    var childobj = { w: context.width(), h: context.height() }
    fullImg(obj, childobj, context);
  }
  function fullImg(obj, childobj, context){
    var oScale = obj.w/obj.h;
    var cScale = childobj.w/childobj.h;
    if( cScale > oScale ){
      var x = Math.ceil(obj.h*cScale);
      $(context).css({ width: x, height: obj.h, marginTop: -obj.h/2, marginLeft: -x/2})
    }else {
      var y = Math.ceil(obj.w/cScale);
      $(context).css({ width: obj.w, height: y, marginTop: -y/2, marginLeft: -obj.w/2})
    }
  }
})
