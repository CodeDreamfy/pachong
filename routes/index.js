module.exports = function(app){
  /* GET home page. */
  app.get('/', function(req, res){
    res.render('master', { title: 'hello Express', content: 'welcome to tosojs 博客'})
  });
  app.post('/mapsearch', function(req,res){
    setTimeout(function(){
      res.send({tit:'ok'})
    }, 3000)
  })
};
