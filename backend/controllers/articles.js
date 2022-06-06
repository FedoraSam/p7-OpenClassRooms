const bdd = require("../database");
const { param } = require("../routes/articles");
const fs = require('fs')

/**
 * Pagination à implémenter
 */
exports.getAllArticles = (req, res) => {
    let offset = req.query.page * req.query.limit
    let sql = "SELECT articles.article, articles.id, articles.title, articles.url, articles.author, articles.post_date, users.first_name, users.last_name FROM `articles` JOIN `users` ON `articles`.`author`= `users`.`user_id` ORDER BY articles.id DESC LIMIT " + offset + ", " + req.query.limit + " ";
    let query = bdd.query(sql, (err, results)=>{
        if(err){
            console.log('err')
            res.status(400).json({message: "Oups, les articles ne sont pas disponibles pour l'instant, ils seront de retour trés vite"})
        }else{
            res.status(200).json(results)
        }
    })
}

exports.getArticleById = (req, res)=> {
    let sql = "SELECT articles.article, articles.id, articles.title, articles.url, articles.author, articles.post_date, users.first_name, users.last_name FROM `articles` JOIN `users` ON `articles`.`author`= `users`.`user_id` WHERE articles.id = ? ";
    let query = bdd.query(sql, [req.params.articleId], (err, results) =>{
        if(err){
            res.status(400).json({message: "impossible de récupérer l article demandé"})
        }else{
            res.status(200).json(results)
        }
    })
}

exports.getArticlesByKeywords = (req, res) => {
    let sql = "SELECT articles.article, articles.id, articles.title, articles.url, articles.author, articles.post_date, users.first_name, users.last_name FROM `articles` JOIN `users` ON `articles`.`author`= `users`.`user_id` WHERE `users`.`last_name` LIKE '%" + req.params.keyword + "%' OR `users`.`first_name` LIKE '%" + req.params.keyword + "%' OR `articles`.`title` LIKE '%" + req.params.keyword + "%' OR `articles`.`article` LIKE '%" + req.params.keyword + "%'"
    let query = bdd.query(sql, (err, results)=>{
        if(err){
            res.status(400).json({message :'navré nous n avons rien trouvé'})
        }if(results.length == 0){        
            res.status(400).json({message: 'Nous n avons rien trouvé'})
           }else{
            res.status(200).json(results)
           }
    })
}


exports.addArticle = (req, res) => {
    if(req.body.text.match(/^([a-zzáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-ZÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s[!?;'.,()"+-]+)$/) && req.body.title.match(/^([a-zzáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-ZÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s[!?;'.,()"+-]+)$/)){
        let sql = "INSERT INTO `articles` ( `title`, `article`, `author`, `url`, `post_date` ) VALUES (?, ?, ?, ?, NOW() )"
        let query = bdd.query(sql,[req.body.title, req.body.text, req.body.author, `${req.protocol}://${req.get('host')}/images/${req.file.filename}`], (err, result)=>{
            if(err){
                res.status(400).json({message: 'navré votre requête n a pas put aboutir'||err})
            }else{
                res.status(201).json({message: 'votre article est publié'})
            }
        })   
    }else{
        res.status(400).json({message:"requête non autorisée"})
    } 
}

exports.deleteArticle = (req, res) => {
    let sql = 'SELECT articles.author FROM articles WHERE articles.id = ?'
    let query = bdd.query(sql, [req.params.articleId], (err, results)=>{
        if(results[0].author == req.params.userId ){
            let sql = 'SELECT url FROM articles WHERE id = ?'
            let query = bdd.query(sql, [req.params.articleId], (err, result)=>{
                if(err){
                    res.status(400).json({message: "Oups petite erreur essayez plus tard"})
                }else{
                    let fileName = result[0].url.split(/images/)[1]
                    fs.unlink(`images/${fileName}`, () =>{
                        let sql = "DELETE FROM `articles` WHERE `id` = ?"
                        let query = bdd.query(sql,[req.params.articleId], (err, result)=>{
                            if(err){
                            res.status(400).json({message: "Oups nous n avons pas pu effacer l article"})
                            }else{
                            res.status(200).json({message: "article effacé par son auteur"})
                            }
                        })
                    })        
                }               
            }) 
        }else{
            let sql = "SELECT admin FROM users WHERE users.user_id = ? "
            let query = bdd.query(sql, req.params.userId, (err, results)=>{
                if(results[0].admin == 1){
                    let sql = 'SELECT url FROM articles WHERE id = ?'
                    let query = bdd.query(sql, [req.params.articleId], (err, result)=>{
                        if(err){
                            res.status(400).json({message: "oups, essayez plus tard"})
                        }else{
                            let fileName = result[0].url.split(/images/)[1]
                            fs.unlink(`images/${fileName}`, () =>{
                                let sql = "DELETE FROM `articles` WHERE `id` = ?"
                                let query = bdd.query(sql,[req.params.articleId], (err, result)=>{
                                    if(err){
                                    res.status(400).json({message: "Désolé veuillez réessayer à un autre moment"})
                                    }else{
                                    res.status(200).json({message: "article effacé par l administrateur"})
                                    }
                                })
                            })        
                        }               
                    }) 
                }
            }) 
        }        
    })
}

exports.getLikesByArticlesId = (req, res) => {
    let sql = 'SELECT likes.likes, likes.article FROM `likes` WHERE `article` = ? AND `user` = ? '
    bdd.query(sql, [req.params.articleId, req.params.userId], (err, results)=>{
        if(err){
            res.status(400).json({err})
        }else{
            if(results.length<1){
                res.status(200).json([{likes: 0}])
            }else{
                res.status(200).json(results)  
            }             
        }
    })
}

exports.getTotalLikesByArticleId = (req, res) =>{
    let sql = "SELECT SUM(likes) AS total_likes FROM likes WHERE article = ? "
    bdd.query(sql, req.params.articleId, (err, results)=>{
        if(err){
            res.status(400).json({message: "oups, nous n arrivons pas à récupérer le total des likes de cet article"})
        }else{
            res.status(200).json(results)
        }
    })
}

exports.likeArticle = (req, res) => {
    let sql = 'SELECT * FROM `likes` WHERE  `user` = ? AND `article` = ?'
    bdd.query(sql, [ req.body.userId, req.body.article], (err, results) =>{
        if(results.length<1){
            let sql = 'INSERT INTO `likes` (`user`, `article`, `likes`) VALUES (?, ?, ?);'
            bdd.query(sql, [req.body.userId, req.body.article, req.body.like], (err, result)=>{
                if(err){
                    res.status(400).json({message: 'navré like impossible'})
                }else{
                    res.status(200).json({message: 'like enregistré'})
                }
            })
        }else{
            let id = results[0].id
            let sql = 'UPDATE `likes` SET `likes` = ? WHERE `id` = ? '
            bdd.query(sql, [req.body.like, id], (err, results)=>{
                if(err){
                    res.status(400).json({message: "impossible de liker ou disliker"})
                }else{
                    res.status(200).json({message: 'like ou dislike enregistré'})
                }
            })
        }  
    })
}

exports.getTopLikesArticles = (req, res) => {
    let sql = 'SELECT articles.article, articles.title, articles.id, articles.author, articles.url, SUM(likes.likes) AS total_likes FROM articles JOIN likes ON articles.id = likes.article GROUP by articles.id ORDER BY SUM(likes.likes) DESC LIMIT 6'
    bdd.query(sql, (err, results)=>{
        if(err){
            res.status(400).json({message: 'navré les top articles sont indisponibles pour linstant'})
        }else{
            res.status(200).json(results)
        }
    })
}