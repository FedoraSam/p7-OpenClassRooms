<template>
      <div class="articles" v-show="deleted == false" >
            <Comment v-show="visible == true"  :articleId="articleId" :userLogged="userLogged" @refreshComments="refreshComments()" @close-comment="visible = false" />  
        <div v-on:click="consultArticle" class="article--link">
            <p class="articles--author">Publié par  {{authorLastName}} {{authorFirstName}} il y a {{timeElapsed}}</p>
            <h2 >{{title}}</h2>
            <div class="articles--body">
                <img v-bind:src="url" v-bind:alt="title" class="articles--body__image">
                <p class="articles--body__text">{{text}} </p>
            </div>
        </div>  
        <div class="articles--icons">
            
            <i class="far fa-edit" v-on:click="showComment()" title="poster un commentaire"><span class="icons-text"> Commenter</span></i>
            <i class="far fa-comment-alt" v-if="comments.length>0"   @click="consultArticle" title="voir les commentaires"> {{comments.length}} <span class="icons-text">Commentaires</span></i>
            <i class="far fa-heart" v-on:click="likeArticle(true)" title="j'aime" v-show="like == 0"> {{totalLikes}} <span class="icons-text"> J'aime</span></i>
            <i class="fas fa-heart liked" v-show="like == 1" v-on:click="likeArticle(false)">{{totalLikes}} <span class="icons-text">J'aime</span></i>
            <i class="far fa-trash-alt" v-show="userLogged == authorId || admin == 1"  v-on:click="deleteArticle()" title="supprimer l'article"><span class="icons-text">Supprimer</span></i>
        </div>
      </div>
   
</template>

<script>
import axios from 'axios';
import Comment from './Comment.vue';
import Comments from './Comments.vue'
export default {
    name: 'Articles',
    components: {Comment, Comments},
    emits: ['openComments', 'modaleMode'],
    props: [ 'userLogged', 'title', 'text', 'authorFirstName', 'authorLastName', 'articleId', 'authorId', 'url', 'error', 'admin', 'postDate'],
    data: function(){
      return{
        visible: false,
        commentsVisible: false,
        comments: [],
        deleted: false,
        like: '',
        totalLikes: '',
        timeElapsed: ''
      }
    },
    methods: {
        showComment: function(){
            this.visible = true;
            },    
        deleteArticle: function(){   
            axios
                .delete(`https://backend.thiery-samuel.com/api/user/${this.userLogged}/article/${this.articleId}` ,
                    {headers: {
                        Authorization: 'Bearer '+ localStorage.getItem('token')
                            }
                    }) 
                .then(this.deleted = true)
        },
        likeArticle: function(choice){
            axios
            .post(`https://backend.thiery-samuel.com/api/user/${this.userLogged}/article/${this.articleId}/like`, 
                {like: choice, article: this.articleId, userId: this.userLogged}  , 
                {headers: {
                    Authorization: 'Bearer '+ localStorage.getItem('token')
                    }
                }) 
            .then(() => {this.like = choice})
            .then(()=>{
                axios  
                .get(`https://backend.thiery-samuel.com/api/user/${this.userLogged}/article/${this.articleId}/total-likes`, {
                    headers: {
                    Authorization: 'Bearer '+ localStorage.getItem('token')
                    }
                })
                .then(res => {this.totalLikes = res.data[0].total_likes})  
            })
        },   
        consultArticle: function(){
            this.$router.push({path: `/main/${this.userLogged}/article/${this.articleId}`})
        },
        refreshComments: function(){
            axios
            .get(`https://backend.thiery-samuel.com/api/user/${this.userLogged}/article/${this.articleId}/comments`, {
                headers: {
                Authorization: 'Bearer '+ localStorage.getItem('token')
                }
            })
            .then(res => this.comments = res.data)
        },
        
    },  
    mounted(){ 
        axios
        .get(`https://backend.thiery-samuel.com/api/user/${this.userLogged}/article/${this.articleId}/comments`, {
            headers: {
            Authorization: 'Bearer '+ localStorage.getItem('token')
            }
        })
        .then(res => this.comments = res.data)
    
        axios
        .get(`https://backend.thiery-samuel.com/api/user/${this.userLogged}/article/${this.articleId}/like`, {
                headers: {
                Authorization: 'Bearer '+ localStorage.getItem('token')
                }
            })
        .then(res => {
            this.like = res.data[0].likes
        })
        axios  
        .get(`https://backend.thiery-samuel.com/api/user/${this.userLogged}/article/${this.articleId}/total-likes`, {
                headers: {
                Authorization: 'Bearer '+ localStorage.getItem('token')
                }
            })
        .then(res => {
            this.totalLikes = res.data[0].total_likes
        })  
        .then(()=>{
            let postDate = new Date(this.postDate)
            this.now = new Date()
            let since = this.now.getTime() - postDate.getTime()
            if(since/1000/60 < 60){
                this.timeElapsed = `moins d'une heure`
            }else if(since/1000/60/60 > 1 && since/1000/60/60 < 24){
                this.timeElapsed = `${Math.round(since/1000/60/60)} heures` 
            }else if(since/1000/60/60/24 >1 && since/1000/60/60/24 <30 ){
                this.timeElapsed = `${Math.round(since/1000/60/60/24)} jours`
            }else if(since/1000/60/60/24/30 > 1 && since/1000/60/60/24/30 < 12){
                this.timeElapsed = `${Math.round(since/1000/60/60/24/30)} mois`
            } else {
                this.timeElapsed = `${Math.round(since/1000/60/60/24/30/12)} ans`
            }
        })
        

    }
}
</script>

<style>
.articles{
  border-bottom: 3px solid rgb(228, 103, 103);
  padding: 10px;
  margin: 20px;
  z-index: 5;
  position: relative;
}
.article--link:hover{
   cursor: pointer;
}
.articles--author{
    font-size: 0.8em;
    color: rgb(78, 78, 78);
}
.articles--body{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.articles--body__image{
    height: 300px;
    width: 60%;
    object-fit: cover;
    margin: 20px 0;
}
.articles--body__text{
    margin: 0 20px;
}
.articles--icons{
    display: flex;
    justify-content: space-evenly;
}
.articles--icons i{
  margin: 20px;  
}
@media (max-width: 455px){
    .icons-text{
        display: none;
    }
    .articles{
        padding: 2px;
        margin: 2px;
    }
    .articles--body{
        flex-direction: column;
    }
    .articles--body__text{
    margin: 0 5px;
}
}
@media (max-width: 768px){
    .articles--icons i{
        margin: 5px;
    }
    .articles--icons{
        margin: 20px 0;
    }
}
@media (max-width: 1100px) and (min-width: 769px){
    .articles--icons i{
        margin: 8px;
    }
}
.fa-edit{
    padding: 5px 10px;
    border-radius: 5px;
    color: rgb(7, 7, 7);
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}
.fa-edit:hover{
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    transform: scale(0.95);
    cursor: pointer;
    transition: 0.4s;
}
.fa-comment-alt{
    padding: 5px 10px;
    border-radius: 5px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    color: rgb(4, 4, 4);
}
.fa-comment-alt:hover{

  transform: scale(0.95);
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  cursor: pointer;
    transition: 0.4s;
}
.articles--icons .fa-heart{
    padding: 5px 10px;
    border-radius: 5px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    
}
.liked{
    color: rgb(238, 104, 166);
    
}
.articles--icons .fa-heart:hover{
  transform: scale(0.95);
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  cursor: pointer;
  transition: 0.4s;
}

.fa-trash-alt{
    padding: 5px 10px;
    border-radius: 5px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    color: rgb(0, 0, 0);
}
.fa-trash-alt:hover{
  color: rgb(42, 73, 33);
  transform: scale(0.95);
  cursor: pointer;
  transition: 0.4s;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}

</style>