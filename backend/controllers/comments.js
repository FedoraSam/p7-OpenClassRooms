const bdd = require("../database");

exports.getCommentById = (req, res) => {
    let sql = "SELECT users.first_name, users.last_name, comments.comment_text, comments.id, comments.comment_author FROM users JOIN comments ON users.user_id = comments.comment_author WHERE comments.commented_article=? ";
    let query = bdd.query(sql,[req.params.articleId], (err, results)=>{
        if(err){
            res.status(400).json({message: "navré nous n avons pas trouvé les articles que vous souhaitez"})
        }else{
            res.status(200).json(results)
        }
    })
}

exports.addNewComment = (req, res)=> {
    let sql = "INSERT INTO `comments` (`comment_author`, `comment_text`, `commented_article`) VALUES (? , ? , ? )"
    let query = bdd.query(sql, [req.body.writterOfComment, req.body.comment, req.params.articleId], (err, results)=>{
        if(err){
            res.status(400).json({message: "navré, nous n avons pas pu poster votre commentaire"})
        }else{
            res.status(200).json({message: "commentaire posté"})
        }
    })   
}

exports.deleteComment = (req, res) =>{
    let sql = "SELECT admin FROM users WHERE users.user_id = ? "
    let query = bdd.query(sql, req.params.userId, (err, results)=>{
        if( results[0].admin == 1){
            let sql = "DELETE FROM `comments` WHERE `id` = ?"
            let query = bdd.query(sql,[req.params.commentId], (err, result)=>{
                if(err){
                    res.status(400).json({message: "navré nous n avons pas pu effacer le commentaire"})
                }else{
                    res.status(200).json({message: "commentaire effacé par l administrateur"})
                }
            })
        }else{
            let sql = "SELECT comments.comment_author, users.user_id FROM comments JOIN users ON comments.comment_author = users.user_id WHERE comments.id = ? "
            let query = bdd.query(sql,[req.params.commentId], (err, result)=>{
                if(err){
                    res.status(400).json({message: "navré nous n avons pas pu effacer le commentaire"})
                }else if(results[0].comment_author == results[0].user_id){
                    res.status(200).json({message: "commentaire effacé par son rédacteur"})
                }else{
                    res.status(400).json({message: "vous n êtes pas authentifié"})
                }
            })

        }
    })
}    
