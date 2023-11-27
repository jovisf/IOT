var http = require("http");
var port = 8686;

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}


http.createServer(function(req,res){
  console.log('New incoming client request for ' + req.url);

  if (req.url.endsWith('.xml')){
    var ContentType = 'application/xml';
  } else {
    ContentType = 'application/json';
  }

  const temperature = 20

  res.writeHeader(200, {'Content-Type': ContentType}); //#A
  switch(req.url) { //#B
    case '/temperature':
    case '/temperature/c':
        var responseObject = {
            temperature: temperature,
            unit: 'C'
          };
        var jsonResponse = JSON.stringify(responseObject);
        res.write(jsonResponse);
      break;
    case '/temperature/f':
        var responseObject = {
            temperature: (temperature*1.8 + 32) ,
            unit: 'F'
          };
        var jsonResponse = JSON.stringify(responseObject);
        res.write(jsonResponse);
      break;
    case '/light':
      res.write('{"light" :' + randomInt(1, 100) + '}');
      break;
    case '/xmlfile.xml': 
      res.write('<?xml version="1.0" encoding="UTF-8" ?><root><data>Example XML Content</data></root>');
      break;
    default:
      res.write('{"hello" : "world"}');
  }
  res.end();  //#D
}).listen(port);
console.log('Server listening on http://localhost:' + port);