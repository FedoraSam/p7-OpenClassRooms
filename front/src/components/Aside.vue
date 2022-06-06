<template>
  <aside class="maincontainer--aside help--aside" >     
      <i class="fas fa-plus"  v-on:click="hideAside()" title="écrire un nouvel article"></i>
    </aside>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Aside',
    props: ['userLogged'],
    emits: ['redactComment'],
    data: function(){
      return{
      }
    },  
    
    methods: {
      hideAside: function(){
            this.$router.push({name: 'Redaction', params: {userId: this.userLogged}})
      },
    }
}
</script>

<style>

.fa-plus{
    margin: 30px;
    font-size: 2em;
    position: fixed;
    top: -23px;
    right: 50px;
    z-index: 10;
}
.fa-plus:hover{
    transform: scale(1.1);
    color: rgb(219, 122, 122);
    cursor: pointer;
}
ul{
    list-style: none;
    padding: 0;
}
li{
    display: block;
    margin: 5px 0;
}
li:hover{
    background-color: rgb(176, 176, 176);
    transform: scale(1.2);
    cursor: pointer;
}


</style>