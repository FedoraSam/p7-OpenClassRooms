<template>
    <div id="maincontainer--article">
        <div class="articles">
            <Comment v-show="visible == true" :articleId="articleId" :userLogged="userLogged"  @close-comment="refreshComments" />
            <i class="fas fa-caret-square-left" v-on:click="returnToMainPage"></i><span>Retour à la page principale</span>
            <p class="articles--author">Publié par {{authorLastName}} {{authorFirstName}} il y a {{postDate}}</p>
            <h2>{{title}}</h2>
            <div class="articles--body">
                <img v-bind:src="url"  class="articles--body__image">
                <p>{{text}}</p>
            </div>       
            <div class="articles--icons">        
                <i class="far fa-edit" v-on:click="showComment()" title="poster un commentaire"> <span class="icons-text"> Commenter</span></i>
                <i class="far fa-comment-alt" v-if="comments.length>0" title="voir les commentaires"> {{comments.length}} <span class="icons-text">Commentaires</span></i>
                <i class="far fa-heart" v-on:click="likeArticle(true)" title="j'aime" v-show="like == 0"><span class="icons-text"> J'aime</span></i>
                <i class="fas fa-heart liked" v-show="like == 1" v-on:click="likeArticle(false)"><span class="icons-text"> J'aime</span></i>
                <i class="far fa-trash-alt" v-show="userLogged == authorId || isAdmin == 1"  v-on:click="deleteArticle()" title="supprimer l'article"><span class="icons-text">Supprimer</span></i>
            </div>
        </div>     
        <Comments v-for="comment in comments" :isAdmin="isAdmin"  :key="comment.id" :userLogged="userLogged" :id="comment.id" :author="comment.comment_author" :commentLastName="comment.last_name" :commentFirstName="comment.first_name" :commentText="comment.comment_text"/>
    </div>

</template>

<script>
import axios from 'axios';
import Comment from './Comment.vue';
import Comments from './Comments.vue';


export default {
    name: 'Article',
    components: {Comments, Comment},
    data: function(){
        return{
            articleId: '',
            visible: false,
            comments: [],
            deleted: false,
            like: '',
            userLogged: '',
            authorId: '',
            title: '',
            text: '',
            url: '',
            postDate: '',
            isAdmin: '',
            authorFirstName: '',
            authorLastName: '',
            now: ''
        }
    },
    mounted(){
        window.top.window.scrollTo(0,0)
        this.articleId = this.$route.params.articleId
        this.userLogged = this.$route.params.userId
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
        .then(res =>{
            this.like = res.data[0].likes
        })  
        
        axios
        .get(`https://backend.thiery-samuel.com/api/user/${this.userLogged}/article/${this.articleId}`, {
            headers: {
            Authorization: 'Bearer '+ localStorage.getItem('token')
            }
        })
        .then(res => {
            this.title = res.data[0].title
            this.text = res.data[0].article
            this.url = res.data[0].url
            this.authorId = res.data[0].author
            this.authorFirstName = res.data[0].first_name
            this.authorLastName = res.data[0].last_name
            let postDate = new Date(res.data[0].post_date)
            this.now = new Date()
            let since = this.now.getTime() - postDate.getTime()
            if(since/1000/60 < 60){
                this.postDate = `moins d'une heure`
            }else if(since/1000/60/60 > 1 && since/1000/60/60 < 24){
                this.postDate = `${Math.round(since/1000/60/60)} heures` 
            }else if(since/1000/60/60/24 >1 && since/1000/60/60/24 <30 ){
                this.postDate = `${Math.round(since/1000/60/60/24)} jours`
            }else if(since/1000/60/60/24/30 > 1 && since/1000/60/60/24/30 < 12){
                this.postDate = `${Math.round(since/1000/60/60/24/30)} mois`
            } else {
                this.postDate = `${Math.round(since/1000/60/60/24/30/12)} ans`
            }
        })

        axios
        .get(`https://backend.thiery-samuel.com/api/users/${this.userLogged}`, {
          headers: {
            Authorization: 'Bearer '+ localStorage.getItem('token')
          }
        })
        .then(res => {
          this.isAdmin = res.data[0].admin})
          
        
        

    },

    methods: {
        showComment: function(){
            this.visible = !this.visible;
            },  
        deleteArticle: function(){   
            axios
            .delete(`https://localhost:4000/api/user/${this.userLogged}/article/${this.articleId}`, {
            headers: {
            Authorization: 'Bearer '+ localStorage.getItem('token')
                }
            }) 
            .then(this.deleted = true)
        },
        likeArticle: function(choice){
                axios
                .post(`https://localhost:4000/api/user/${this.userLogged}/article/${this.articleId}/like`, {like: choice, article: this.articleId, userId: this.userLogged}  , 
                {
                headers: {
                Authorization: 'Bearer '+ localStorage.getItem('token')
                    }
                }) 
                .then(this.like = choice )
        }, 
        returnToMainPage: function(){
            this.$router.push({name: 'Main', params: {userid: this.userLogged}})
        },
        refreshComments: function(){
            axios
            .get(`https://localhost:4000/api/user/${this.userLogged}/article/${this.articleId}/comments`, {
                headers: {
                Authorization: 'Bearer '+ localStorage.getItem('token')
                }
            })
            .then(res => this.comments = res.data)
            .then(this.visible = false)
        },  
              
    },  

}
</script>

<style scoped>
#maincontainer--article{
    margin: 8vh 5vw;
}
.fa-caret-square-left{
    margin-bottom: 40px;
    margin-right: 5px;
    font-size: 1.1em;
}
.fa-caret-square-left:hover{
    transform: scale(1.1);
    cursor: pointer;
}


</style>