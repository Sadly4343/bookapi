const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser')




const app = express();

app.use(bodyParser.json())
const port = process.env.port || 3000;


app.use('/', require('./routes'));

app.use(bodyParser.json());



mongodb.intDb((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, () => { console.log(`Running on port ${port}`) });
    }
})