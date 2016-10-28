var express = require('express'),
    bodyParser = require('body-parser'),
    webhook = require('./modules/webhook'),
    fs = require("fs"),
    app = express();

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());

app.get('/webhook', webhook.handleGet);
app.post('/webhook', webhook.handlePost);

app.post('/attach', function (req, res) {

	console.log("attach file");

	var filename = "image.png";

    var base64data = "";

    /*new Buffer(filename).toString('base64');*/

    fs.readFile(filename, 'base64' , function (err, data) {
        if (err) throw err;
        base64data = data.toString()
    });

    var root = "https://jsxin-dev-ed.my.salesforce.com/";
    var url = root+"services/data/v37.0/sobjects/Attachment";

    var data = {
      "Name" : filename,
      "Body": base64data,
      "parentId": "001900000096By5" 
    };

    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', 'Bearer ' + salesforce.org.oauth.access_token);
    xhttp.send(data);

    /*
                req.setEndpoint(url);
                req.setMethod("POST");
                req.setHeader('Content-Type', 'application/json');
                req.setHeader('Authorization', 'Bearer ' + salesforce.org.oauth.access_token);
                var data = {
                  "Name" : filename,
                  "Body": base64data,
                  "parentId": payload[1] 
                }
                req.setbody(data);
                */


  	res.send('POST request to the homepage');
});


app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});