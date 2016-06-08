var http = require('http');
for (var i = 0; i < 1000; i++) {
  console.log(i);
  var req = http.get("http://localhost:8000",function(res) {
    resultdata = '';
    res.on('data',function(chunk) {
      resultdata += chunk;
    });

    res.on('end',function() {
      console.log('return ' + resultdata);
    });
  });

  req.on('error',function(err) {
    console.log('problem with request: ' + err.message);
  });
}