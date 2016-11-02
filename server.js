var express = require('express'),
    bodyParser = require('body-parser'),
    webhook = require('./modules/webhook'),
    salesforce = require('./modules/salesforce'), 
    fs = require("fs"),
    app = express();

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());

app.get('/webhook', webhook.handleGet);
app.post('/webhook', webhook.handlePost);

app.get('/:id/attach/:path', function (req, res) {

	console.log("attach file");
	
	var uploadId = req.params.id;
    var uploadPath = req.params.path;

	var filename = uploadPath.substr(uploadPath.lastIndexOf('/')+1);

	console.log(uploadId);
	console.log(uploadPath);
	console.log(filename);

    var base64data = "";

    /*new Buffer(filename).toString('base64');*/

    fs.readFile(uploadPath, 'base64' , function (err, data) {
        if (err) throw err;
        base64data = data.toString()
    });

    var root = "https://jsxin-dev-ed.my.salesforce.com/";
    var url = root+"services/data/v37.0/sobjects/Attachment";

    var data = {
      "Name" : filename,
      "Body": base64data,
      "parentId": uploadId
    };

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', 'Bearer ' + salesforce.org.oauth.access_token);
    xhttp.send(JSON.stringify(data));

    res.sendStatus(200);
});


app.get('/attachfile', function (req, res) {

    console.log("attach file");

    var filename = "image.png"

    var base64data = "";

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

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', 'Bearer ' + salesforce.org.oauth.access_token);
    xhttp.send(JSON.stringify(data));

    res.sendStatus(200);
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});