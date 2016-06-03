"use strict";

+function () {}();
"use strict";

+function () {
  var $btn = $(".map .btn");
  var $imgshow = $(".imgshow");

  $btn.on('click', function () {
    var $params = $('#url');
    sendAjax($params.val());
  });

  function sendAjax(params) {
    $.ajax({
      url: '/mapsearch',
      type: 'post',
      dataType: 'json',
      data: { url: params },
      success: function success(e) {
        var $img = $("<img />");
        $img.attr('src', e.url);
        $imgshow.append($img);
      },
      error: function error(_error) {
        console.dir(_error);
      }
    });
  }
}();