var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var url   = require('url');
var cluster = require('cluster');
var http = require('http');
var chace = []; //存取爬取到的链接
var now_url = '';
function asyncCall(path){
  now_url = path
  this.bigCall = function(u){
    var count = 0;
    var self = this;
    var requestpath = u || path;
    //这玩意连续请求会爆
    // superagent.get(requestpath).end(function(err, res){
    //   if(err) throw new Error(err);
    //   var $ = cheerio.load(res.text);
    //   $('a[href!=""][href!="javascript:;"]').map(function(){

    //     var href = $(this).attr('href');
    //     if(href && href.match('http')){
    //       return;
    //     }
    //     if(chace.indexOf(href) == -1){
    //       if(href[0] != '/'){
    //         href = '/' + href;
    //       }
    //       chace.push(href);
    //       count++;
    //     }
    //   });
    //   console.log(requestpath + '地址下爬取到----' + count + '有限链接');
    //   setTimeout(function(){
    //     var newurl = now_url + chace.shift();
    //     self.bigCall(newurl);
    //   },1000);
    // });

    var req = http.get(requestpath,function(res) {
      resultdata = '';
      res.on('data',function(chunk) {
        resultdata += chunk;
      });
      res.on('end',function() {
        var $ = cheerio.load(resultdata);
        $('a[href!=""][href!="javascript:;"]').map(function(){
          var href = $(this).attr('href');
          // console.log(href);
          if(href && href.match('http')){
            return;
          }
          if(chace.indexOf(href) == -1){

            // href = pathname + href;
            //自己写匹配规则
    
            href = url.resolve(now_url, href);
            chace.push(href);
            count++;
          }
        });
        console.log(requestpath + '地址下爬取到----' + count + '有限链接');
        setTimeout(function(){
          var newurl = chace.shift();
          self.bigCall(newurl);
        },1000);
      });
    });

  }

}

new asyncCall("http://open.iot.10086.cn/bbs/forum.php").bigCall();
process.on('uncaughtException', function (err) {
    console.log(err);
}); 

// var url = require('url');
// p = url.resolve('http://open.iot.10086.cn/bbs/forum.php', 'forum.php?mod=redirect&tid=587&goto=la') 
// console.log(p)
