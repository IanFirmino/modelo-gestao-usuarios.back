const db = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User{

    async login(email, password){

        const user = await this.findByEmail(email);
        if(!user[0]){
            return [false, user[1]];
        }

        const access = await bcrypt.compare(password, user[1][0].password)
        if(!access){
            return [false, 'Senha incorreta!'];
        }

        const token = jwt.sign({email: user[1][0].email, role: user[1][0].role}, 'secret');
        return [true, token];
    }

    async create(name, email, password){

        const cryptPassword = await bcrypt.hash(password, 10);

        try{
            await db.insert({
                name, email, password: cryptPassword, role: 0
            }).table("users");

            return [true, 'Usuário criado com sucesso!'];
        }catch(err){
            return [false, err];
        }
    }

    async findAll(){

        try{

            const users = await db.select('id', 'name', 'email', 'role').from('users');
            
            return [true, users];
        }catch(err){
            return [false, err];
        }
    }

    async findById(id){

        try{
            const user = await db.select('id', 'name', 'email', 'role').from('users').where({id: id});

            if(user.length < 1){
                return [false, 'Usuário não encontrado'];
            }

            return [true, user];
        }catch(err){
            return [false, err];
        }

    }

    async findByEmail(email){

        try{
            const user = await db.select('id', 'name', 'email', 'role', 'password').from('users').where({email: email});

            if(user.length < 1){
                return [false, 'Usuário não encontrado!'];
            }

            return [true, user];
        }catch(err){
            return [false, err];
        }

    }

    async findEmail(mail){

        try{
            const email = await db.select('email').from('users').where({email: mail});
            return [true, email.length > 0];

        }catch(err){
            return [false, err];
        }
    }

    async update(id, name, email, role){

        const userFound = await this.findById(id);
        if(!userFound[0]){
            return [false, userFound[1]];
        }

        const userUpdate = {}

        if(email && userFound.email != email){
            userUpdate.email = email;
        }
        if(name && userFound.name != name){
            userUpdate.name = name;
        }
        if(role && userFound.role != role){
            userUpdate.role = role;
        }

        try{
            await db.update(userUpdate).where({id: id}).table('users');
            
            return [true, 'Atualização realizada!'];
        }catch(err){
            return [false, err];
        }
        
    }

    async delete(id){

        const userExist = await this.findById(id);
        if(!userExist[0]){
            return [false, 'Usuário não encontrado!']
        }

        try{
            await db.delete().where({id: id}).table('users');

            return[true, 'Usuário deletado ' & id];
        }catch(err){
            return [false, err];
        }   

    }



}

module.exports = new User;
