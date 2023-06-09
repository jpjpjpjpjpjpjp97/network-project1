const express = require('express');
const ActiveDirectory = require('activedirectory');
const bodyParser = require('body-parser');
const secrets = JSON.stringify(require('./secrets.json'));
const secrets_json = JSON.parse(secrets);

const config = {
  url: secrets_json.ldap_domain, // URL For AD Server
  baseDN: secrets_json.ldap_dn, // Base domain name For AD Server
  username: secrets_json.ldap_username,
  password: secrets_json.ldap_password
};

const ad = new ActiveDirectory(config);
const app = express();
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
    ad.authenticate(username, password, (err, auth) => {
        if (err) {
          console.log('Authentication failed:', err);
          res.status(500).send('Authentication failed');
        } else {
          if (auth) {
            console.log('Authentication successful');
            res.send('Authentication successful');
          } else {
            console.log('Authentication failed');
            res.status(401).send('Authentication failed');
          }
        }
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
