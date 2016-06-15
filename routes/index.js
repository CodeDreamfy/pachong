
module.exports = function(app){
  /* GET home page. */
  app.get('/', function(req, res){
    res.render('master', { title: 'hello Express', content: 'welcome to tosojs 博客'})
  });
  app.post('/mapsearch', function(req,res){
    // var async_call = new asyncCall("http://open.iot.10086.cn/bbs/forum.php");
    // async_call.superCall();
    // res.json({date: new Date()})
    setTimeout(function(){
      res.send({tit:'ok'})
    }, 3000)
  })
};
