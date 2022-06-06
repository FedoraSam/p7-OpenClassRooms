let bdd = require('../database');
const bcrypt = require('bcrypt');
var passwordValidator = require('password-validator');
const CryptoJS = require('crypto-js');


require('dotenv').config()

var schema = new passwordValidator();
schema
.is().min(8)                                    
.is().max(100)                                  
.has().uppercase()                              
.has().lowercase()                              
.has().digits(1)                               
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']); 


exports.getUser = (req, res) => {
    let sql = "SELECT users.first_name, users.last_name, users.user_id, users.admin FROM users WHERE user_id = ?"
    let query = bdd.query(sql,[req.params.userId],(err, results)=>{
        if (err){
            res.status(401).json({message: 'vous n avez pas encore de compte'})
        }else{
            res.status(200).json(results)
        }
    })    
}

// crypto sur email
exports.modifyUser = async (req, res) => {
    let email = await CryptoJS.HmacSHA256(req.body.newEmail, process.env.SECRET_KEY_CRYPTO)
    let sql = "UPDATE users SET last_name = ? , first_name = ? , email = '" + email + "' WHERE user_id = ? "
    let query = bdd.query(sql, [req.body.newLastName, req.body.newFirstName, req.params.userId], (err, results)=> {
        if(err){
            console.log(err)
            res.status(400).json({message: 'impossible de mettre à jour votre profil'})
        }else{
            res.status(200).json({message: 'profil modifié avec succès'})
        }
    })
    
}
exports.modifyPassword = (req, res) => {
    let sql = "SELECT * FROM users WHERE user_id = ?"
    let query = bdd.query(sql, req.params.userId,  (err, results) => {
        if(err)throw err
        bcrypt.compare(req.body.oldPassword, results[0]['password'], async (err, response)=>{
            if(response){
                if(schema.validate(req.body.newPassword)){
                    const passwordHash = await bcrypt.hash(req.body.newPassword, 10)
                    let sql = "UPDATE `users` SET `password` = ? WHERE `user_id`= ? "
                    console.log(passwordHash)
                    bdd.query(sql, [passwordHash, req.params.userId], (err, results)=>{
                        if(err){
                            res.status(400).json({message: "impossible de changer le mot de passe pour l instant"})
                        }else{
                            res.status(200).json({message: "mot de passe changé avec succès"})
                        }
                    })
                }else{
                    res.status(400).json({message: "le nouveau mot de passe doit avoir 8 caractères minimum une majuscule et au moins un chiffre"})
                }
            }else{
                res.status(400).json({message: "mot de passe erroné"})
            }    
        })    
    })
}


exports.deleteUser = (req, res) => {
    let sql = "SELECT * FROM users WHERE user_id = ?"
    let query = bdd.query(sql, req.params.userId,  (err, results) => {
        if(err)throw err
        bcrypt.compare(req.body.password, results[0]['password'], (err, response)=>{
            if(response){
                console.log("delete opérationnel")
                let sql ="DELETE FROM `users` WHERE `user_id` = ? "
                let query = bdd.query(sql, req.params.userId, (err, result) =>{
                    res.status(200).json({message: 'profil supprimé'})
                })               
            }else{
                res.status(401).json({message: 'le mot de passe est erroné'})
            }
        })
    })
}