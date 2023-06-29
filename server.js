const express = require("express");
const bodyParser = require("body-parser");
var nodemailer = require('nodemailer');
var fs = require('fs');

const app = express();

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'acracheck123@gmail.com',
	  pass: 'nbpvvbpkdfyibqne'
	}
  });

app.use(bodyParser.json());

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.post("/report", function (req, res) {
	console.log(typeof(req.body));
	var data = req.body
	  
	fs.writeFile(data.REPORT_ID+".txt", JSON.stringify(data), function(err, result) {
		if(err) console.log('error', err);
	});

	var mailOptions = {
		from: 'acracheck123@gmail.com',
		to: 'yogeshmehare1234@gmail.com',
		subject: 'Crash Report',
		text: `"APP_VERSION_NAME":"${data.APP_VERSION_NAME}","    ANDROID_VERSION":"${data.ANDROID_VERSION}"`,
		attachments: [
			{ 
				filename: data.REPORT_ID+".txt",
				path: `${data.REPORT_ID}.txt`
			}
		]
	  };
	

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  console.log(error);
		} else {
		  console.log('Email sent: ' + info.response);
		  
		  fs.stat(`${data.REPORT_ID}.txt`, function (err, stats) {
			// console.log(stats);
		 
			if (err) {
				return console.error(err);
			}
		 
			fs.unlink(`${data.REPORT_ID}.txt`,function(err){
				 if(err) return console.log(err);
				//  console.log('file deleted successfully');
			});  
		 });
		}
	  }); 
	  res.send("done")
});

app.listen(3000, function () {
	console.log("Server started on port 3000");
});
