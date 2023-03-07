class HomeController {

    async index(req, res){
        res.send('Estamos funcionando!')
    }

}

module.exports = new HomeController;
