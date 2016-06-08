var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');

function asyncCall(url){

  var concurrencyCount = 0; // 并发连接数的计数器
  var itemList = [];
  var commit = [];
  fetch(url, function(list){
    async.mapLimit(list, 26, function(item, callback){
      concurrencyCount++;
      var promise2 = new Promise(function(resolve, reject){
        superagent
          .get(item.href)
          .end(function(err,res){
            if(err){
              reject(item)
            }
            if( res.status == 200){
              console.log(concurrencyCount," --正在连接：",item.tit)
              if(!!res.text){
                var $ = cheerio.load(res.text);
                var c = $('a[href*="http://"]')
                // console.log(c.length)
                resolve(c)
              }
            }
          })
      })
      promise2.then(function(d){
        callback(null, d.length)
      }, function(){
        callback(null, "Error");
      })
    }, function(err, results){ console.log(results)})
  })

  function fetch(url, cb){
    var items = [];
    var promise = new Promise(function(resolve, reject){
      superagent.get(url).end(function(err, sres){
        if(err){
          return console.error(err);
        }
        var $ = cheerio.load(sres.text);
        $('a[href!=""][href!="javascript:;"][href*="http://"]').map(function(i, e){
          var _this = $(e);
          var tit = _this.text();
          var hf = _this.attr('href');
          if(hf.indexOf('.exe'))
          items[i] = { 'tit' : tit, 'href' : hf, 'active': false};
        })
        resolve(items);
      })
    })

    promise.then(function(e){
      itemList = e;
      !!cb && cb(itemList)
    }, function(err){
      console.log("error:", err)
    })

  }
}

module.exports = asyncCall
