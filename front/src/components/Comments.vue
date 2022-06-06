<template>

  <div class="comments" v-show="deleted == false">
    <div>
        <div class="bouclecomments">
            <p>{{commentText}}</p>
        <p>{{commentLastName}} -- {{commentFirstName}}</p>
        <i class="fas fa-trash" v-if="author == userLogged || isAdmin == 1"   v-on:click="deleteComment()" title="supprimer votre commentaire"></i>
        </div>
        

    </div>
  </div>

</template>

<script>
import axios from 'axios'
export default {
    name: 'Comments',
    props: ['id', 'commentText', 'commentFirstName', 'commentLastName', 'author', 'userLogged', 'isAdmin'],
    data: function(){
        return{
            commentsArray: [],
            deleted: false,
            
        }

    },
    methods:{ 
        deleteComment: function(){
            axios
            .delete(`https://backend.thiery-samuel.com/api/user/${this.userLogged}/article/comment/${this.id}`, {
            headers: {
            Authorization: 'Bearer '+ localStorage.getItem('token')
            }
            })
            .then(this.deleted = true)
        },
    }
}
</script>

<style>
.bouclecomments{
    border-bottom: solid 2px black;
    padding: 10px 20px;
}
.comments{
    padding: 10px;
    z-index: 5;
    margin: 10px;
    background-color: white;
    pointer-events: auto;
    border-radius: 5px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    
}
#comments{
    width: 90%;
    margin: 20px;
}
#comments .fa-window-close{
    margin-left: 2%;
    z-index: 15;
    pointer-events: auto;
}
#comments .fa-window-close:hover{
    transform: scale(1.15);
}
</style>