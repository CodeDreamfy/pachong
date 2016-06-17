'use strict';

$(function () {
  /* details */
  var $listItem = $('.detailsWrapper .list-wrapper');
  var $pagination = $('.pagination');
  var $back = $('.details .back');
  var path = "http://192.168.0.218:3000";
  var urlId = getParameter().id;
  var pageIndex = 1,
      pageCount;

  /*
    init
   */
  intoAjax(pageIndex, true);

  /*
    Event
   */
  /*
    * 当图片加载完毕的时候执行计算img
  */
  $listItem.on('load', '.imgWrap .smallImg img', function () {
    var $this = $(this);
    console.log("scale");
    setFull($this);
  });

  /*
    * 当窗口改变大小的时候重新计算img
  */
  var clearRs = null;
  $(window).on('resize', function () {
    if (!!clearRs) {
      clearTimeout(clearRs);
    }
    clearRs = setTimeout(function () {
      $('.imgWrap .smallImg img', $listItem).each(function (i, e) {
        var $this = $(e);
        setFull($this);
        $(window).resize();
      });
    }, 250);
  });
  /*
    分页
   */
  $pagination.on('click', 'li a', function () {
    var _this = $(this);
    var index = $(this).data('index');
    if (index == 'prev') {
      if (pageIndex - 1 <= 0) {
        _this.closest('li').addClass('disabled');
      } else {
        pageIndex--;
      }
    } else if (index == 'next') {
      if (pageIndex + 1 > pageCount) {
        _this.closest('li').addClass('disabled');
      } else {
        pageIndex++;
      }
    } else {
      pageIndex = index;
      _this.closest('li').addClass('active').siblings().removeClass('active');
    }
    intoAjax(pageIndex);
  });
  /*
    delete
   */
  $listItem.on('click', '.delete', function () {
    var _this = $(this);
    var index = _this.closest('.list-group-item').index();
    var id = _this.data('id');
    console.log(id, index);
  });

  /*
    Ajax
   */
  function intoAjax(index, flag) {
    console.log('--intoAjax', index);
    $.ajax({
      url: path + '/crawler/details',
      method: 'post',
      dataType: 'json',
      data: { 'id': urlId, page: index },
      success: function success(e) {
        console.log(e);
        setData(e);
        if (flag) {
          setPagination(e);
        }
      },
      error: function error(e) {
        console.log(e);
      }
    });
  }
  function setData(e) {
    var obj = e.data.data;
    var docFrame = document.createDocumentFragment();
    for (var i = 0; i < obj.length; i++) {
      var $item = $(['<li class="list-group-item">', '  <div class="panel-heading list-title"></div>', '  <div class="row">', '    <div class="col-md-4 col-xs-12 imgWrap">', '      <a href="javascript:;" class="smallImg"><img ></a>', '    </div>', '    <div class="col-md-8 col-xs-12 contentWrap">', '      <a href="javascript:;" class="btn btn-default delete">删除</a>', '      <div class="panel panel-default">', '        <div class="panel-heading">页面URL地址</div>', '        <div class="panel-body url"></div>', '      </div>', '      <div class="panel panel-default">', '        <div class="panel-heading">敏感词汇</div>', '        <div class="panel-body keyword"></div>', '      </div>', '    </div>', '  </div>', '</li>'].join(' '));
      $item.find('.list-title').text(obj[i].title);
      $item.find('.smallImg img').attr('src', obj[i].img);
      $item.find('.url').text(obj[i].url);
      $item.find('.keyword').text(obj[i].keyword);
      $item.find('.delete').data('id', obj[i]._id);
      $(docFrame).append($item);
    }
    $listItem.empty().append(docFrame);
    $(window).resize();
  }

  function deleteItem(index) {}

  function setPagination(e) {
    var o = e.data;
    var pageNum = Math.ceil(o.page_count / o.page_size);
    pageCount = pageNum;
    var docFrame = document.createDocumentFragment();
    for (var i = 0; i < pageNum; i++) {
      var $item = $('<li><a href="javascript:;" data-index="' + (i + 1) + '">' + (i + 1) + '</a></li>');
      if (i == 0) $item.addClass('active');
      $(docFrame).append($item);
    }
    var $prev = $(['<li>', '  <a href="javascript:;" data-index="prev" aria-label="Previous">', '    <span aria-hidden="true">&laquo;</span>', '  </a>', '</li>'].join(' '));
    var $next = $(['<li>', '  <a href="javascript:;" data-index="next" aria-label="Next">', '    <span aria-hidden="true">&raquo;</span>', '  </a>', '</li>'].join(' '));
    $pagination.empty().append($prev, docFrame, $next);
  }

  //fullImg
  function setFull(context) {
    var $obj = context.closest('a');
    var obj = { w: $obj.width(), h: $obj.height() };
    var childobj = { w: context.width(), h: context.height() };
    fullImg(obj, childobj, context);
  }
  function fullImg(obj, childobj, context) {
    var oScale = obj.w / obj.h;
    var cScale = childobj.w / childobj.h;
    if (cScale > oScale) {
      var x = Math.ceil(obj.h * cScale);
      $(context).css({ width: x, height: obj.h, marginTop: -obj.h / 2, marginLeft: -x / 2 });
    } else {
      var y = Math.ceil(obj.w / cScale);
      $(context).css({ width: obj.w, height: y, marginTop: -y / 2, marginLeft: -obj.w / 2 });
    }
  }

  function getParameter() {
    var hf = location.href;
    hf = hf.slice(hf.indexOf('?') + 1);
    var o = {};
    var shf = hf.split('&');
    shf.forEach(function (e, i) {
      var s = e.split('=');
      o[s[0]] = s[1];
    });
    return o;
  }
});