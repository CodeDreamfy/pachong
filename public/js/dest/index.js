'use strict';

+function () {
  $('.menu').pjax('a', '#pjax-container', { timeout: 10000 });
  $.pjax.reload('#pjax-container');
}();