<template>
  <transition name="comment">
    <div class="articles--commentaires "  >
        <i class="fas fa-window-close" @click="$emit('closeComment')" title="Fermer la fenêtre"></i>
        <textarea class="maincontainer--article__comments" placeholder="votre commentaire"  v-model="commentToPost"></textarea> 
        <p class="regex-advert" v-show="checkedcomment == false">Merci de ne pas utiliser de caractères spéciaux, utiliser uniquement des chiffres lettre ainsi que les signes de ponctuation</p>
        <button v-if="commentToPost" class="maincontainer--article__button" v-on:click.prevent="postComment()" >Valider</button>
    </div>
  </transition>  
</template>

<script>
import axios from 'axios';

export default {
    name: 'Comment',
    emits: ['closeComment', 'refreshComments'],
    props: [ 'userLogged', 'articleId'],
    data: function(){
      return{
        commentToPost:'',
        comments: [],
        checkedcomment: true
      }
    },
    methods:{ 
        postComment: function(){
          if(!this.commentToPost.match(/^([a-zzáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-ZÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s[!?;.,'-_:()"+-]+)$/)){
          this.checkedcomment = false
          }else{
            axios
            .post(`https://backend.thiery-samuel.com/api/user/${this.userLogged}/article/${this.articleId}/comment`,{
              writterOfComment: this.userLogged,
              comment: this.commentToPost,
              articleId: this.articleId
            }, {
              headers: {
                Authorization: 'Bearer '+ localStorage.getItem('token')
                        }
                })
            .then(this.$emit('refreshComments'))    
            .then(this.$emit('closeComment'))          
            }
        }  
    },    
}
</script>

<style>
.articles--commentaire{
  border-bottom: solid 1px black;
  margin: 10px 0;
  color: rgb(48, 43, 43);
}
.maincontainer--article__comments{
  width: 90%;
  height: 55%;
  margin: 30px 30px;
}
.articles--commentaires{
  background-color: rgb(255, 255, 255);
  width: 100%;
  height: 100%;
  background-color: rgba(131, 131, 131, 0.512);
  z-index: 1;
  position: absolute;
  top: 0;
}
.fa-window-close{
  color: red;
  font-size: 1.5em;
  position: absolute;
  top: -20px;
}
.fa-window-close:hover{
  transform: scale(1.3);
  cursor: pointer;
}
.maincontainer--article__button{
  margin: 5px 30px;
  background-color: rgb(34, 143, 252);
  color: white;
  font-size: 1.2em;
  padding: 5px 20px;
}
.comment-enter-from{
  opacity: 0;
  transform: translateY(-10vw);
}  
.comment-leave-to{
  opacity: 0;
  transform: translateY(10vw);
}
.comment-enter-active,
.comment-leave-active{
  transition: all 0.5s ease-out;
  
}
</style>