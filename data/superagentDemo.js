let superagent = require('superagent');
let cheerio = require('cheerio');
let async = require('async');
const url = require('url');
let http = require('http');
let urlList = [];
let now_url = '';

function AsyncCall(path){
  let now_url = path;
  this.superCall = function(u){
    let count = 0;
    let _this = this;
    let request_path = u || path;
    //使用http-get
    let req = http.get(request_path, function(res){
      let result_data = ''
      res.on('data', function(chunk){
        result_data += chunk;
      });
      res.on('end', function(){
        let $ = cheerio.load(result_data);
        $('a[href!=""][href!="javascript:;"]').map(function(i,e){
          let _this = $(this);
          let href = _this.attr('href');
          if(!!href && href.match('http')){
            return;
          }
          if(!!href && href.match('mailto:')){
            return;
          }
          if(urlList.indexOf(href) == -1){
            href = url.resolve(now_url, href);
            urlList.push(href);
            count++;
          }
        });
        console.log(request_path + '地址下爬取到----' + count + '有限链接');
        setTimeout(function(){
          let new_url = urlList.shift();
          _this.superCall(new_url)
        }, 1000)
      })
    })
  }
}


process.on('uncaughtException', function (err) {
    console.log(err);
});

module.exports = AsyncCall;
