<template>
    <div class="top-articles--list" :style="{ animationDelay:  delay + 's'}"> 
        <div v-on:click="consultArticle" class="top-articles--list__article"> 
            <span class="number">{{totalLikes}}</span>
            <img class="img-top" v-bind:src="url" v-bind:alt="title"> 
            <span class="top-title">{{title}}</span> 
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Toparticles',
    props: ['userLogged','title', 'id', 'totalLikes', 'url', 'index'],
    data: function(){
        return{
            delay: ''
        }
    },
    methods:{
    consultArticle: function(){
            this.$router.push({path: `/main/${this.userLogged}/article/${this.id}`})
        }         
    },
    mounted(){
        this.delay = this.index * 0.3
    }
}
</script>

<style>
#top-articles{
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
    border-radius: 5px;
    background-color: rgb(255, 255, 255);
    margin-bottom: 80px;
    margin-left: 30px;
    width: 28%;
    display: inline-block;
    height: 70vh;
}

#top-articles h2{
    background-color: rgb(107, 107, 107);
    color: white;
    padding: 30px 10px;
    text-align: center;
    border-radius: 5px 5px 0px 0px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
    
}
.top-articles--list{
    margin-left: 15px;
    animation: loading-top .5s backwards ease-in;
}    
.top-articles--list__article{
    display: flex;
    align-items: center;
    margin: 20px 0;
}
.top-articles--list__article:hover{
    cursor: pointer;
    transform: scale(1.05);
}
.img-top{
    width: 35px;
    min-width: 35px;
    height: 35px;
    min-height: 35px;
    border-radius: 35px;
    margin: 5px 20px;
}
.top-title{
    overflow: hidden;
    text-overflow: ellipsis;
}
.number{
    width: 35px;
    min-width: 35px;
    height: 35px;
    min-height: 35px;
    border-radius: 35px;
    border: 1px solid rgb(173, 97, 97);
    color: rgb(0, 0, 0);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

@keyframes loading-top{
  0%{
    opacity: 0;
    transform: translateX(10vw);
  }
  100%{
    opacity: 1;
    transform: translateX(0vw);
  }
}


</style>