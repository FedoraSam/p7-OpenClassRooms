const bcrypt = require('bcrypt');
var passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');
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


let bdd = require('../database');

exports.loginAuthentification = async  (req, res, next) => {
    if(schema.validate(req.body.password)){
        let cryptedEmail = await CryptoJS.HmacSHA256(req.body.email, process.env.SECRET_KEY_CRYPTO).toString()
        let sql = "SELECT * FROM users WHERE email = ?"
        let query = bdd.query(sql, cryptedEmail,  (err, results)=>{
            if(err){
                res.status(400).json({message: 'Oups, petit problème technique...'})
            }
            else if(results.length == 0){
                res.status(400).json({message: "votre adresse mail est introuvable"})
            }else{         
                bcrypt.compare(req.body.password, results[0]['password'], (err, response)=>{
                    if(response===true){
                        res.status(200).json(
                            { userId: results[0]['user_id'], 
                            token: jwt.sign({
                            userId: results[0]['user_id']},
                            process.env.JWT_TOKEN,
                            { expiresIn: '24h'}
                            )
                        })
                    }else{
                        res.status(401).json({message: 'le mot de passe est erroné'})
                    }
                })
            }    
        })        
    }else{
        res.status(400).json({message: "mot de passe invalide"})
    }
}

exports.signupAuthentification = async (req, res, next) => {
    if(req.body.firstName.match(/^([a-zzáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-ZÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s]+)$/)){
        if(req.body.lastName.match(/^([a-zzáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-ZÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s]+)$/)){
            if(req.body.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                if(schema.validate(req.body.password)){
                    let cryptedEmail = CryptoJS.HmacSHA256(req.body.email, process.env.SECRET_KEY_CRYPTO).toString()
                    const passwordHash = await bcrypt.hash(req.body.password, 10)
                    let sql = "INSERT INTO `users`(`first_name`, `last_name`, `email`, `password`) VALUES (?, ?, ?, ?)"
                    let query = bdd.query(sql,[req.body.firstName, req.body.lastName, cryptedEmail, passwordHash], (err, results)=>{
                        if(err){
                            res.status(400).json({message: 'email déjà utilisé'})
                        }else{
                            res.status(200).json({message: 'data envoyée'})
                        }  
                    })
                }else{
                    res.status(400).json({message: "le mot de passe doit contenir au moins 8 caractères une majuscule et un chiffre"})
                }
            }else{
                res.status(400).json({message: 'email non valide'})
            }
        }else{
            res.status(400).json({message: 'veuillez utiliser uniquement des caractères alphabétiques pour votre prénom'})
        }    
    }else{
        res.status(400).json({message: 'veuillez utiliser que des caractères alphabétiques pour votre nom de famille'})
    }
} 




