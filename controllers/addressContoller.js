const Adress = require('../models/AdressData')

class addressController {

    static async createAdress(req, res, next) {
        const {district, city, province, country, phone, zip } = req.body
        try {
            const addressData = await Adress.findOne({ user: req.userID })
            if (addressData) {
                const newAdress = { district, city, province, country, phone, zip}
        for(let key in newAdress) if(!newAdress[key]) delete newAdress[key]
        const addressData = await Adress.findOneAndUpdate({user : req.userID},newAdress,{new : true})
        res.status(200).json({result : true, data : addressData})
            }
            else {
                const address = await new Adress({
                    user: req.userID,
                     district, city, province, country, phone,zip
                })
                address.save()
                res.status(200).json({ success: true, data: address })
            }
        }
        catch (e) { next({name :'USER_NOT_FOUND' }) }
    }
    static async getAdress(req,res,next){
        try{
            const addressData = await Adress.findOne({user : req.userID})
            .populate('user')
            res.status(200).json({success : true, data : addressData})
        }
        catch(e){next({name :'USER_NOT_FOUND' })}
    }
    static async updateAdress(req,res,next){
      const { district, city, province, country, phone, zip} = req.body
      try{
        const newAdress = { district, city, province, country, phone, zip}
        for(let key in newAdress) if(!newAdress[key]) delete newAdress[key]
        const addressData = await Adress.findOneAndUpdate({user : req.userID},newAdress,{new : true})
        res.status(200).json({result : true, data : addressData})
      }
        catch (e){next({name :'USER_NOT_FOUND' })}
    }
    static async deleteAddress(req,res,next){
        if(await Adress.findOneAndDelete({user : req.userID})){
        res.status(200).json({result : true, message : 'Delete Success'})
        }
        else {next({name :'USER_NOT_FOUND' })}
    }

}

module.exports = addressController