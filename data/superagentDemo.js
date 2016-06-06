let superagent = require('superagent');
let cheerio = require('cheerio');
let async = require('async');

function asyncCall(url){
  // 并发连接数的计数器
  let concurrencyCount = 0;
  let itemList = [];
  let commit = [];
  fetch(url, function(){
    async.mapLimit(itemList, itemList.length, function(url, callback){
      var hf = url.href;
      var promise = new Promise(function(resolve, reject){
        superagent.get(hf).end(function(err, res){
          if(err){
            reject(err);
          }
          // let $ = cheerio.load(res.text);
          // resolve($);
        })
      });
      // promise.then(function(e){
      //   callback(e);
      // })
    })
  })

  function callback(content){
    commit.push(content)
  }

  function fetch(url,cb){
    let items = [];
    var promise = new Promise(function(resolve, reject){
      superagent.get(url).end(function(err, sres){
        if(err){
          reject(error)
          return next(err);
        }
        let $ = cheerio.load(sres.text);
        $('a[href!="javascript:;"][href!=""]').map(function(i, e){
          let _this = $(e);
          let tit = _this.text();
          let hf = _this.attr('href');
          items[i] = { 'tit' : tit, 'href' : hf, 'active': false};
        })
        resolve(items);
      })
    })

    promise.then(function(e){
      itemList = e;
      !!cb && cb()
    })

  }
}

module.exports = asyncCall
