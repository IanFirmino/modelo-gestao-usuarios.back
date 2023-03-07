const user = require('../models/user');
const passwordToken = require('../models/passwordtoken');

class UserController{

    async login(req, res){

        const {email, password} = req.body;

        const logon = await user.login(email, password)
        if(!logon[0]){
            res.status(406)
            res.send(logon[1]);
            return;
        }

        res.status(200);
        res.send(logon[1]);
    }

    async create(req, res){
        const {name, email, password} = req.body;

        if(name == undefined || email == undefined || password == undefined){
            res.status(406);
            res.json({
                err: 'Preencha corretamente os campos!'
            });    
            return;
        }

        const mailExists = await user.findEmail(email);
        if(mailExists[1]){
            res.status(406);
            res.json({
                err: 'Email já cadastrado na base de dados!'
            });
            return;
        }

        const newUser = await user.create(name, email, password);
        if(newUser[0]){
            res.status(200);
            res.send(newUser[1]);
            return;
        }

        res.status(400);
        res.send(newUser[1]);
    }

    async findById(req, res){
        
        const {id} = req.params
        if (id == undefined){
            req.status(406);
            req.json({
                err: 'Necessário id de usuário!'
            });
            return;
        }

        const userFound = await user.findById(id); 
        if (userFound[0]){
            res.status(200);
            res.send(userFound[1]);
            return;
        }

        res.status(400);
        res.send(userFound[1]);
    }

    async findAll(req, res){

        const allUsers = await user.findAll(); 
        if (allUsers[0]){
            res.status(200);
            res.send(allUsers[1]);
            return;
        }

        res.status(400);
        res.send(allUsers[1]);
    }


    async update(req, res){

        const {id, name, email, role} = req.body;

        const updateUser = await user.update(id, name, email, role);
        if(updateUser[0]){
            res.status(200);
            res.send(updateUser[1]);
            return;
        }

        res.status(400);
        res.send(updateUser[1]);
    }

    async delete(req, res){
        const {id} = req.params;

        const userDeleted = await user.delete(id);
        if(userDeleted[0]){
            res.status(200);
            res.send(userDeleted[1]);
            return;
        }

        res.status(400);
        res.send(userDeleted[1]);

    }

    async recoverPassword(req, res){
        const {email} = req.body;

        const recover = await passwordToken.create(email);
        if(!recover[0]){
            res.status(406);
            res.send(recover[1]);
            return;
        }

        res.status(200);
        res.send(recover[1]);
    }

    async registerNewPassword(req, res){

        const {email, token, newPass} = req.body;

        const userValidateToken = await passwordToken.validateToken(email, token);
        if(!userValidateToken[0]){
            res.status(406);
            res.send(userValidateToken[1]);
            return;
        }

        const userId = userValidateToken[1][0].userid;
        const refreshPassword = await passwordToken.refreshPassword(userId, newPass, token);
        
        if(!refreshPassword[0]){
            res.status(406);
            res.send(refreshPassword[1]);
            return;
        }

        res.status(200);
        res.send(refreshPassword[1]);       
    }

}

module.exports = new UserController;