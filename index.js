const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = require('./routes/router');
const port = 8686;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/", router);

app.listen(port, () => {
    console.log('Servidor rodando! na porta ' + port)
});

 