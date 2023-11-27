var http = require("http");
var port = 8687;

const axios = require('axios');

const url = 'http://devices.webofthings.io/pi/sensors/temperature/';

let temperature 


async function getTemperature() {
    try {
      const response = await axios.get(url);

      if (response.status >= 200 && response.status < 300) {
  
        temperature = response.data.value;
    
      } else {
        console.error('Erro ao obter a temperatura. Código de resposta:', response.status);
      }
    } catch (error) {
      console.error('Erro ao realizar a solicitação:', error.message);
    }
  }

getTemperature()

http.createServer(function(req,res){
  console.log('New incoming client request for ' + req.url);

  if (req.url.endsWith('.xml')){
    var ContentType = 'application/xml';
  } else {
    ContentType = 'application/json';
  }


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
    case '/temperatureFxml': 
      res.write('<?xml version="1.0" encoding="UTF-8" ?><root><data>'+ (temperature*1.8 + 32) + '</data></root>');
      break;
    case '/temperatureCxml': 
      res.write('<?xml version="1.0" encoding="UTF-8" ?><root><data>'+ (temperature) + '</data></root>');
      break;
    default:
      res.write('{"hello" : "world"}');
  }
  res.end();  //#D
}).listen(port);
console.log('Server listening on http://localhost:' + port);