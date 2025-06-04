const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const cors = require('cors');




const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = process.env.port || 3000;


app.use('/', require('./routes'));





mongodb.intDb((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, () => { console.log(`Running on port ${port}`) });
    }
})