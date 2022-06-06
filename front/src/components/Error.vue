<template>
  <div>
      <h2>Oups...Veuillez réessayer ultérieurement</h2>
      <p v-on:click="goHome">Retourner sur la page accueil</p>

  </div>
</template>

<script>
export default {
    name: 'Error',
    data: function(){
        return{
            userLogged: ''
        }
    },
    mounted(){
        this.userLogged =  this.$route.params.userId
    },
    methods:{
        goHome: function(){
            this.$router.push({name: 'Main', params: {userid: this.userLogged}})
        }
    }
        
}
</script>

<style scoped>
h2{
    margin-top: 40vh;
    text-align: center;
}
p{
    text-align: center;
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}
</style>