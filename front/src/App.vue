<template>
        
            <router-view v-slot="{Component}" >
                    <transition name="fade" mode="out-in">
                        <component :is="Component"/>
                    </transition>
  
                    
            </router-view>
        
</template>

<script>


export default {

  name: 'app',  

  
}
</script>

<style >
body{
  background-color: rgb(233, 233, 233);
}
header{
  background-color: rgb(255, 255, 255);
  margin: 0;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 8;
}

.fade-enter-from{
  opacity: 0;
  transform: translateX(-10vw);
}  
.fade-leave-to{
  opacity: 0;
  transform: translateX(10vw);
}
.fade-enter-active,
.fade-leave-active{
  transform-origin: 50% top;
  transition: all 0.5s ease-out;
  
}

</style>