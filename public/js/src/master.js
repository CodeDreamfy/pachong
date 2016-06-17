//master
$(function(){
  let $resolveBtn = $('.resolveBtn');
  let $overlay = $('.overlay');
  let $content = $('.contentWrap');
  let $container = $('.container');
  let $tbody = $('.innerContent', $content);
  let url = '';
  var path = "http://192.168.0.218:3000";


  /*
    ALL Event
   */
  $resolveBtn.on('click', function(){
    let $url = $('#InputUrl').val().trim();
    let _this = $(this);
    if( $url.length == 0 ){
      return false;
    }
    _this.removeClass('btn-primary').addClass('btn-default').prop('disabled', 'disabled');
    _this.text("正在解析");
    _this.next().fadeIn();
    resolveUrl($url, _this);
  });


  /*
    ALL Ajax
   */
  intoPage(showList);
  function intoPage(cb){
    $.ajax({
      url: path + '/crawler/getcrawlerlist',
      dataType: 'json',
      method: 'post',
      success: function(e){
        if(e.data.data == 0){
          var $tr = $('<tr><td class="col-md-12" colspan="4">暂无数据</td></tr>')
          $tbody.empty().append($tr);
        }else {
          setTable(e.data, cb);
        }
      },
      error: function(err){
        console.dir(err);
      }
    })
  }

  function setTable(data, cb){
    var obj = data.data;
    var docFrame = document.createDocumentFragment();
    for(var i=0; i< obj.length; i++){
      var $item = $(['<tr>',
                    '  <td class="url"></td>',
                    '  <td class="tit"></td>',
                    '  <td class="size"></td>',
                    '  <td class="op"><a href="/details" class="btn btn-default seeall">查看详情</a><a href="javascript:;" class="btn btn-default delete">删除</a></td>',
                    '</tr>'].join(' '));
      $item.find('.url').text(obj[i].indexurl);
      $item.find('.tit').text(obj[i].title);
      $item.find('.size').text(obj[i].count);
      $item.find('.op .seeall').attr('href', "/details?id="+obj[i].id);
      $(docFrame).append($item);
    }
    $tbody.empty().append(docFrame);
    !!cb && cb();
  }

  function resolveUrl(url,context){
    $.ajax({
      url:  path + '/crawler/start',
      method: 'post',
      dataType: 'json',
      data: { 'url': url},
      success: function(e){
        if(e.errno == 0){
          console.log( '--start---', e)
          var mapData = setInterval(function(){
            $.ajax({
              url:  path + '/crawler/mapsearch',
              method: 'post',
              dataType: 'json',
              data: { 'url': url},
              success: function(e){
                if(e.errno == 0){
                  console.log(e)
                  clearTimeout(mapData);
                  context.text('开始解析');
                  context.next().fadeOut();
                  $container.data('show') ? intoPage(): intoPage(showList); //解析完重新调用list，显示出列表
                }
              }
            })
          }, 5000)
        }else if( e.errno == 1){
          alert("上一个URL正在爬取，请稍后再试！")
          return;
        }else if( e.errno == 2){
          alert("该URL已经爬过了，请从下列表格查找！");
          return;
        }
      },
      error : function(err){
        console.dir(err)
      }
    })
  }

  /*
    list显示隐藏
   */
  function showList(){
    $container.stop(true,true).animate({ "margin-top": 20}, 800);
    $container.data('show', true);
    $content.fadeIn();
  }


})
