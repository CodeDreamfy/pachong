# nodejs 爬虫
地址： 127.0.0.1/map
路由：
```js
app.post('/mapsearch', function(req,res){
    var url = req.body.url;
    supers(url);
    res.send({tit:'ok'})
  })
```
爬虫核心代码：
```bash
data/superagentDemo.js
```
