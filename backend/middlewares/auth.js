const jwt = require('jsonwebtoken');
let bdd = require('../database');
require('dotenv').config()

module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
        const userId = decodedToken.userId;
        
        let sql = "SELECT admin FROM users WHERE uesr_id = ?"
        bdd.query(sql,req.params.userId, (response)=>{
            if(req.params.userId == userId || response.admin == 1 ){
                next()
            }else{
                res.status(400).json({message: "vous n êtes pas authentifié"})
            }

        })
        
    }
    catch (error){
        res.status(401).json({message: error | 'requête non authentifiée'})
    }
}