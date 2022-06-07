<template>
    <div v-bind:data-id="userId" id="main">
      <div v-show="loading == false">
        <h1 v-show="modale == false" >Bonjour {{userName}}, quoi de neuf aujourd'hui ?</h1>
        <p class="admin-mode" v-if="isAdmin == 1">MODE ADMINISTRATEUR </p>
        <form action="" id="search-form">
          <div id="search-area">
            <input type="text" id="search-input" placeholder="rechercher" v-model="keyword"> 
            <i class="fas fa-search" v-on:click.prevent="getArticlesByKeyword" v-show="searchMode == false"></i>
            <i class="fas fa-times" v-show="searchMode == true" v-on:click="shutSearch" ></i>
            <p class="regex-advert" v-show="searchMode == true">{{searchError}}</p>
          </div>
        </form>
        <section id="maincontainer" >
            <div id="maincontainer--articles">
                <Aside :userLogged="userId"/>  
                <transition-group name="articles">  
                  <Articles v-show="commentsHidden == true && searchMode == false" :admin="isAdmin"  v-for="article in articles" :key="article.id" :url="article.url" :articleId="article.id" :authorId="article.author" :postDate="article.post_date"  :userLogged="userId" :title="article.title" :text="article.article" :authorFirstName="article.first_name" :authorLastName="article.last_name"/>
                  <Articles v-show="commentsHidden == true && searchMode == true" :admin="isAdmin"  v-for="article in articlesSearched" :key="article.id" :url="article.url" :articleId="article.id" :authorId="article.author" :postDate="article.post_date"  :userLogged="userId" :title="article.title" :text="article.article" :authorFirstName="article.first_name" :authorLastName="article.last_name"/>    
                </transition-group>
                <div class="articles-loader" v-show="allArticlesLoaded == false">
                    <span class="pagination" v-show="loadingArticles == false" v-on:click="loadNextArticles">Articles suivants</span>
                    <div v-show="loadingArticles == true">
                        <div class="loading-spinner-small1"></div>
                        <div class="loading-spinner-small2"></div>
                        <div class="loading-spinner-small3"></div>
                    </div>
                </div>
                
            </div>
            <div id="top-articles" v-show="commentsHidden == true && searchMode == false">
                <h2 >Top likes articles  <i class="fas fa-chart-line"></i></h2>
                <Toparticles  :userLogged="userId" v-for="(article, index) in topArticles" :index="index" :key="article.id" :title="article.title" :id="article.id" :totalLikes="article.total_likes" :url="article.url" /> 
            </div>
        </section>
        </div>
        <div class="loading-spinner" v-show="loading == true">
            <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    </div>  
  
</template>

<script>
import axios from 'axios';
import Aside from './Aside.vue';
import Articles from './Articles.vue';
import Toparticles from './Toparticles.vue';

export default {
    name: 'Main',
    props: ['userid'],
    components: {Aside, Articles, Toparticles},
    data: function(){
      return{
        userName: '',
        userId: '',
        commentsHidden: true,
        modale: false,
        searchMode: false,
        searchError: "",
        articles: [],
        loadedArticles: [],
        loadingArticles: false,
        allArticlesLoaded: false,
        comments: [],
        articlesSearched: [],
        visible: true,
        serverResponse: '',
        topArticles: [],
        keyword: '',
        loading: true,
        isAdmin: '',
        limit: 5,
        page: 1
      }
    },
    methods: {
      shutComments(){
        this.modale = false
        this.commentsHidden = true
      },
      shutSearch(){
        this.searchMode = !this.searchMode
        this.keyword = ''
      },
      getArticlesByKeyword(){
        if(this.keyword.match(/^([a-zzáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-ZÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ0-9\s[!?;'.,()"+-]+)$/)){
          axios
          .get(`https://backend.thiery-samuel.com/api/user/${this.userId}/articles/search/${this.keyword}`, {
            headers: {
              Authorization: 'Bearer '+ localStorage.getItem('token')
                      }
          })
          .then(res => {this.articlesSearched = res.data
                        this.searchMode = true
                        this.searchError = ''
          })
          .catch(error => {
            this.articlesSearched = []
            this.keyword = ''
            this.searchMode = true
            this.searchError = error.response.data.message})
        }else{
          this.searchMode = true
          this.searchError = "vos mots clés comportent des cractères interdits"
        }
      },
       async loadNextArticles(){
         this.loadingArticles = true
        await axios
        .get(`https://backend.thiery-samuel.com/api/user/${this.userId}/articles?page=${this.page}&limit=${this.limit}`, {
          headers: {
            Authorization: 'Bearer '+ localStorage.getItem('token')
          }
        })
        .then((res) => { this.loadedArticles = res.data})
        .then(()=>{
          this.page++
          this.loadingArticles = false
          for(let i=0; i<this.loadedArticles.length; i++){
            this.articles.push(this.loadedArticles[i])
            if(this.loadedArticles.length < this.limit){
              this.allArticlesLoaded = true
            }
          }
          
        })
      },      
    },
    
     async mounted(){ 
       
        await  axios
        .get(`https://backend.thiery-samuel.com/api/users/${this.userId}`, {
          headers: {
            Authorization: 'Bearer '+ localStorage.getItem('token')
          }
        })
        .then(res => { 
            this.isAdmin = res.data[0].admin
            this.userName = res.data[0].last_name,
            this.userId = res.data[0].user_id    
          })
        .catch((err)=>{
          console.log(err)
          this.$router.push({name: 'Main', params: {userid: this.userLogged}})
        }) 
        
      await axios
      .get(`https://backend.thiery-samuel.com/api/user/${this.userId}/articles?page=0&limit=${this.limit}`, {
        headers: {
          Authorization: 'Bearer '+ localStorage.getItem('token')
        }
      })
      .then(res => {this.articles = res.data}); 

      await axios
        .get(`https://backend.thiery-samuel.com/api/user/${this.userId}/toparticles`, {
        headers: {
          Authorization: 'Bearer '+ localStorage.getItem('token')
        }
      })
      .then(res => {
        this.topArticles = res.data})
        this.loading = false
        
    },
    beforeMount(){
      this.userId =  this.$route.params.userId
    },
    
                
}
</script>

<style >
h1{
  text-align: center;
  margin: 80px 0;
}
.admin-mode{
  background-color: rgb(0, 8, 255);
  color: white;
  text-align: center;
  font-weight: bold;
  position: fixed;
  top: 4vh;
  width: 100%;
  z-index: 10;
}
h2{
  margin: 0;
}
h3{
  margin: 0;
}
body{
    margin: 0;
    font-family: 'Open Sans', sans-serif;
    min-height: 100vh;
    box-sizing: border-box;
}
#search-form{
  display: flex;
  justify-content: center;
  margin: 30px 0;
}
#search-area{
  position: relative;
}
#search-input{
  
  border-radius: 15px;
  padding: 1vh 20vw;
  height: 20px;
}
.fa-search{
  height: 20px;
  position: absolute;
  top: 5px;
  right: 0px;
  font-size: 1.5em;
  padding: 1vh 40px;
  background-color: rgb(107, 107, 107);
  border-radius: 15px;
  color: white;
}
.fa-search:hover{
  transform: scale(1.2);
}
.fa-times{
  position: absolute;
  font-size: 1.5em;
  top: 6.4px;
  right: 1px;
  padding: 3.7px 40px;
  background-color: rgb(188, 90, 90);
  border-radius: 15px;
}
.fa-times:hover{
  transform: scale(1.2);
  color: red;
}
#maincontainer{
  display: flex;
  margin: 0 5vw;
  justify-content: center;
}
#maincontainer--articles{
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
  margin-bottom: 80px;
  width: 66%;
  max-width: 768px;
  display: flex;
  flex-direction: column;
}
.articles-loader{
  margin: 20px;
  position: relative;
  display: flex;
  justify-content: center;
}
.pagination{
  margin: 20px;
}
.pagination:hover{
  cursor: pointer;
  transform: scale(1.2);
  transition: .3s;
}
@media (max-width: 455px){
  #maincontainer{
    margin: 0;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
  }
  #maincontainer--articles{
    width: 98%;
    margin-top: 20px;
  }
  #top-articles{
    width: 98%;
    margin: 0 ;
  }
  h1{
    font-size: 1.5em;
  }
  h2{
    font-size: 1.2em;
  }
  
}
@media (max-width: 650px){
  #maincontainer{
    margin: 0;
  }
}
@media (max-width: 900px) and (min-width: 456px){
  #maincontainer{
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
  }
  #maincontainer--articles{
    width: 95%;
    margin-top: 20px;
  }
  #top-articles{
    width: 95%;
    margin: 0 ;
  }
  
}

@media (max-width: 1100px) and (min-width: 901px){
  #maincontainer{
    margin: 0 1vw;
  }
  #maincontainer--articles{
    width: 64%;
    
  }
  #top-articles{
    width: 33%;
    margin-left: 10px;
  }
}
.articles-enter-from{
  opacity: 0;
  
}  
.articles-leave-to{
  opacity: 0;
  
}
.articles-enter-active{
  transition: all 0.5s ease-in;
}
.articles-leave-active{
  transition: all 0.4s ease-out;

}
.loading-spinner-small1{
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: brown;
  position: absolute;
  top: 50%;
  right: 60%;
  animation: loading 1.5s forwards  infinite;
}
.loading-spinner-small2{
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: brown;
  position: absolute;
  top: 50%;
  right: 50%;
 animation: loading 1.5s forwards infinite;
  animation-delay: .33s;
}
.loading-spinner-small3{
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: brown;
  position: absolute;
  top: 50%;
  right: 40%;
  animation: loading 1.5s forwards infinite;
  animation-delay: 0.66s;
}
@keyframes loading{
  0%{
    transform: scale(0.9);
  }
  50%{
    transform: scale(1.2);
  }
  100%{
    transform: scale(1.2);
  }
}
#main{
  position: relative;
}
.loading-spinner{
  position: absolute;
  top: 40vh;
  right: 50vw;  
}
.lds-spinner {
  color: official;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-spinner div {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 3px;
  left: 37px;
  width: 6px;
  height: 18px;
  border-radius: 20%;
  background: rgb(213, 74, 74);
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

</style>