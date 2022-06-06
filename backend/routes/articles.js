const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const articlesControl = require('../controllers/articles');
const commentsControl = require('../controllers/comments');
const multer = require('../middlewares/multer-config');

/**
 * Route Article
 */
router.get('/:userId/articles',auth, articlesControl.getAllArticles);
router.get('/:userId/article/:articleId', auth, articlesControl.getArticleById)
router.post('/:userId/article', auth, multer, articlesControl.addArticle);
router.delete('/:userId/article/:articleId', auth, articlesControl.deleteArticle);
router.get('/:userId/articles/search/:keyword', auth, articlesControl.getArticlesByKeywords)
router.get('/:userId/toparticles', auth, articlesControl.getTopLikesArticles)

/**
 * Route Like
 */

router.post('/:userId/article/:articleId/like', auth, articlesControl.likeArticle);
router.get('/:userId/article/:articleId/like', auth, articlesControl.getLikesByArticlesId)
router.get('/:userId/article/:articleId/total-likes', auth, articlesControl.getTotalLikesByArticleId)

/**
 * Route Comments
 */

 router.get('/:userId/article/:articleId/comments', auth,  commentsControl.getCommentById)
 router.post('/:userId/article/:articleId/comment', auth, commentsControl.addNewComment)
 router.delete('/:userId/article/comment/:commentId', auth, commentsControl.deleteComment)


module.exports = router;