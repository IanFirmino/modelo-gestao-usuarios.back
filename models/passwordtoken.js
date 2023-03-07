const db = require('../database/connection');
const user = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class PasswordToken{

    async create(email){

        const userToken = await user.findByEmail(email)
        if(!userToken[0]){
            return [false, 'Email de usuário não encontrado']
        }

        try{
            const userId = userToken[1][0].id; 
            
            await db.insert({
                userid: userId,
                token: uuidv4(),
                used: 0,
                email: email
            }).table('recuperarsenha');

            return [true, 'Token registrado para o usuário!'];
        }catch(err){
            return [false, err];
        }

    }

    async validateToken(email, token){

        try{
            const userRecovery = await db.select('userid').from('recuperarsenha').where({email, token});

            if(userRecovery.length == 0){
                return [false, 'Token invalid'];
            }

            return [true, userRecovery];
        }catch(err){
            return [false, err];
        }
    }

    async refreshPassword(userid, newPass, token){

        const userFound = await user.findById(userid);
        if(!userFound[0]){
            return [false, userFound[1]];
        }

        const criptNewPass = await bcrypt.hash(newPass, 10);

        try{

            await db.update({password: criptNewPass}).where({id: userid}).table('users');
            await db.update({used: 1}).where({token: token}).table('recuperarsenha');
            return [true, 'Senha alterada'];

        }catch(err){
            return [false, err];
        }
        
    }

}

module.exports = new PasswordToken();