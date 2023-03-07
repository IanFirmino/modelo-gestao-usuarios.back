const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = require('./routes/router');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/", router);

app.listen(8080, () => {
    console.log('Servidor rodando!')
});

 