var phmap = require('../data/phantomjsDemo.js');
var asyncCall = require('../data/superagentDemo.js');

module.exports = function(app){
  /* GET home page. */
  app.get('/', function(req, res){
    res.render('index', { title: 'hello Express', content: 'welcome to tosojs 博客'})
  })
  app.get('/map', function(req,res){
    res.render('map', { title: 'hello Express', content: ""})
  })
  app.post('/mapsearch', function(req,res){
    var async_call = new asyncCall("http://open.iot.10086.cn/bbs/forum.php");
    async_call.superCall();
    res.json({date: new Date()})
  })
};
