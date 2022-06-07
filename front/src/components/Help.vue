<template>
<div>
    <Aside :userLogged="userLogged" />
    <div class="help-article" v-show="helpArticle == true">
        <i class="far fa-arrow-alt-circle-up"></i>
        <span>Cliquez ici</span>
    </div>
    <div class="help-account" v-show="helpAccount == true">
        <i class="far fa-arrow-alt-circle-up"></i>
        <p>Cliquez ici</p>
    </div>
    <div id="help-menu">
        <ul>
            <li v-on:click="helpRedactArticleStep1" v-show="helpArticle == false">Poster un article</li>
            <img src="../images/help-article.png" alt="comment rédiger son article" v-show="helpArticle == true">
            <p v-show="helpArticle == true">Vous ne pourrez publier votre article que quand le titre et le texte sont présent ainsi qu'une image sélectionnée</p>
            <li v-on:click="helpModifyAccount" v-show="helpArticle == false">Modifier son compte</li>
        </ul>
       
    </div>
    
</div>

</template>

<script>
import Menu from './Menu.vue'
import Aside from './Aside.vue'
export default {
    name: 'Help',
    components: {Menu, Aside},
    data: function(){
        return{
            userLogged: '',
            helpAccount: false,
            helpArticle: false,
            helpArticleNextSTep: false,
            
        }
    },
    mounted(){
        this.userLogged = this.$route.params.userId
    },
    methods: {
        helpRedactArticleStep1: function(){
            this.helpArticle = !this.helpArticle
        },
        helpModifyAccount: function(){
            this.helpAccount = !this.helpAccount
        },
        
    } 



}
</script>

<style scoped>
.help--aside{
    margin-top: 100px;
}
#help-menu{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.fa-arrow-alt-circle-up{
    font-size: 3em;
}
.help-article{
    position: absolute;
    right: 55px;
    top: 60px;
    text-align: center;
    color: rgb(137, 228, 0);
    display: flex;
    flex-direction: column;
    align-items: center;
}
.help-account{
    position: absolute;
    right: 5px;
    top: 60px;
    text-align: center;
    color: rgb(137, 228, 0);
}
.fa-arrow-alt-circle-left{
    font-size: 3em;
}
.help-Article-title{
    position: absolute;
    right: 200px;
    top: 30px;
    text-align: center;
    color: rgb(137, 228, 0);
    display: flex;
    
    align-items: center;
}
.help-Article-text{
    position: absolute;
    right: 190px;
    top: 120px;
    text-align: center;
    color: rgb(137, 228, 0);
    display: flex;
    
    align-items: center;
}
.help-Article-file{
    position: absolute;
    right: 180px;
    top: 250px;
    text-align: center;
    color: rgb(137, 228, 0);
    display: flex;
    
    align-items: center;
}
.help-Article-close{
    position: absolute;
    right: 40px;
    top: -30px;
    text-align: center;
    color: rgb(228, 0, 0);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 80px;
}
.help-Article-close .number{
    color: white;
    background-color: rgb(228, 0, 0);
}
</style>