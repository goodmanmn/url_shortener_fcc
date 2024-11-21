// require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let urlList = [
];
// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const regex = /((ftp|http|https):\/\/)?(www.)?(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\.[a-z]{1,3})(\/[\w#!:.?+=&%@!\-\/]*|\/)?$/;
  const { url : original_url } = req.body;

  if (!original_url) {
    console.log("bad original url")
    return res.json({error: 'invalid url'});
  };
 
  if (!regex.test(original_url)) {
    return res.json({error: 'invalid url'});
  }

  const urlExist = urlList.find(item => item.originalUrl === original_url)

  if (urlExist) {
    console.log(urlList)
    return res.json({ original_url : urlExist.originalUrl, short_url : urlExist.shortUrl});
  } else {
    urlList.push({shortUrl: urlList.length + 1, originalUrl: original_url});
    console.log(urlList)
    return res.json({ original_url : original_url, short_url: urlList.length});
  };

});

app.get('/api/shorturl/:short', (req, res) => {
  const {short: _short} = req.params;
  const urlLink = urlList.find(item => item.shortUrl == _short);
  console.log(urlLink);
  if (urlLink) {
    return res.redirect(urlLink.originalUrl);
  } else {
    return res.json({error: 'invalid url'});
  }
});
  
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
