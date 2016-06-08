var phantom = require('phantom');

function phmap(url, res){
  var sitepage = null;
  var phInstance = null;
  phantom.create()
      .then(instance => {
          phInstance = instance;
          return instance.createPage();
      })
      .then(page => {
          sitepage = page;
          return page.open(url);
      })
      .then(status => {
          console.log(status);
          return sitepage.property('content');
      })
      .then(content => {
          sitepage.viewpoetSize = { width: 400, height: 200};
          sitepage.zoomFactor = 0.25;
          sitepage.render('C:/Users/codedreamfy/vagrant/devwork/todojs/public/img/data/ca.png');
          res.send({'url': '/img/data/ca.png'})
          sitepage.close();
          phInstance.exit();
      })
      .catch(error => {
          console.log(error);
          phInstance.exit();
      });
}
module.exports = phmap
