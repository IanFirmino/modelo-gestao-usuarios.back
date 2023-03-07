const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authToken = req.headers['authorization'];
    if(authToken){

        var bearer = authToken.split(' ');
        var token = bearer[1];

        try{
            var decoded = jwt.verify(token, 'secret');
        }catch(err){
            res.status(403);
            res.send('Acesso negado. ' + err);
            return;
        }

        console.log(decoded);
        if(decoded.role == 1){
            next();
        }else{
            res.status(403);
            res.send('Acesso negado. Você não é um Admin!');
        }
        
        return;
    }

    res.status(403);
    res.send('Acesso negado')

}