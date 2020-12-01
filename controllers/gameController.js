const Game = require('../models/GameData')

class gameController {
    static async createGame(req,res,next) {
        const dataGame = await Game.findOne({name : req.body.name})
        try{
            const game = new Game({
                name : req.body.name,
                image : req.body.image
            })
            if(dataGame) next({name : 'GAME_EXIST'}) 
            else if(!req.body.name || !req.body.image) next({name : 'REQUIRED'})
            else {
                game.save()
                res.status(201).json({success : true, data : game})
            }
        }
        catch{ next({name : 'REQUIRED'})}
    }
    static async listGame(req,res,next){
        try{
            const game = await Game.find()
            res.status(200).json({success : true,data : game})
        }
        catch{ next({name : 'GAME_FAILED'})}
    }
    static async detailGame(req,res,next) {
        const {gameID} = req.params
        try {
            const game = await Game.findById(gameID)
            res.status(200).json({success : true , data : game})
        }
        catch {next ({name : 'GAME_FAILED'})}
    }
    static async updateGame(req,res,next){
        const {gameID} = req.params
        const newData = {
            name : req.body.name,
            image : req.body.image
        }
        try{
            for (let key in newData) if (!newData[key]) delete newData[key]
            const game = await Game.findByIdAndUpdate(gameID,newData, {new :true})
            res.status(200).json({success : true, data : game})
        }
        catch {next ({name : 'GAME_FAILED'})}
    }
    static async deleteGame(req,res,next) {
        const {gameID} = req.params
        try{
            const game = await Game.findByIdAndDelete(gameID)
            res.status(200).json({success : true, data : game})
        }
        catch {next ({name : 'GAME_FAILED'})}
    }
}
module.exports = gameController