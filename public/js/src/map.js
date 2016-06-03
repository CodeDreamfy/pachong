+function(){
  let $btn = $(".map .btn");
  let $imgshow = $(".imgshow");

  $btn.on('click', function(){
    var $params = $('#url');
    sendAjax($params.val())
  });

  function sendAjax(params){
    $.ajax({
      url: '/mapsearch',
      type: 'post',
      dataType: 'json',
      data: {url: params},
      success: function (e){
        var $img = $(`<img />`);
        $img.attr('src',e.url);
        $imgshow.append($img)
      },
      error: function(error){
        console.dir(error)
      }
    })
  }


}()
