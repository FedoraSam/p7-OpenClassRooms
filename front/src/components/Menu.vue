<template>
  <nav>
      <img src="../images/icon.png" alt="logo groupomania" id="logo" v-on:click="goHome">
      <i class="fas fa-bars" v-on:click="revealMenu"></i>
      <i class="fas fa-caret-square-up" v-on:click="goToTopUpPage"></i>
      <div v-show="hide==false" id="menu">
          <ul>
              <li v-on:click="goHome">Accueil</li>
              <li v-on:click="goAccount">Mon compte</li>
              <li v-on:click="returnToAuthentificationPage">Connexion</li>
              <li v-on:click="returnToAuthentificationPage">Deconnexion</li>
              <li v-on:click="goHelp">Help</li>
          </ul>
      </div>
  </nav>
</template>

<script>
export default {
    name: 'Menu',
    data: function(){
        return{
            hide: true,
            userLogged: '',
            
        }
    },
    methods:{
        revealMenu: function(){
            this.hide = !this.hide
        },
        goToTopUpPage: function(){
            window.top.window.scrollTo(0,0)
        },
        returnToAuthentificationPage: function(){
            localStorage.removeItem('token')
            this.$router.push({name: 'Authentification'})
        },
        goHome: function(){
            this.userLogged = this.$route.params.userId
            this.$router.push({name: 'Main', params: {userid: this.userLogged}})
        },
        goAccount: function(){
            this.userLogged = this.$route.params.userId
           this.$router.push({name: 'Account', params: {userId: this.userLogged}})
        },
        goHelp: function(){
            this.userLogged = this.$route.params.userId
            this.$router.push({name: 'Help', params: {userId: this.userLogged}})
        }
    },
    

    
        
       
}
</script>

<style>

.fa-bars{
    margin: 30px;
    font-size: 2em;
    position: fixed;
    top: -23px;
    right: 0px;
    z-index: 10;
}
.fa-bars:hover{
    transform: scale(1.1);
}
#logo{
    position: fixed;
    top: 5px;
    left: 20px;
    z-index: 10;
    height: 4vh;
}
#logo:hover{
    transform: scale(1.3);
}
#menu{
    position: fixed;
    top: 40px;
    right: 20px;
    z-index: 7;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
}
.fa-caret-square-up{
    position: fixed;
    font-size: 2em;
    right: 30px;
    bottom: 50px;
}
.fa-caret-square-up:hover{
    transform: scale(1.1);
}
</style>