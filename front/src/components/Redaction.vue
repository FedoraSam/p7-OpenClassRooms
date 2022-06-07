<template>
  <aside id="maincontainer--aside" >
          <nav >
              <h3>Quoi de neuf à partager ?</h3>
                <form id="postArticle" name="postArticle" method="POST" enctype="multipart/form-data">
                    <label for="title"></label>
                    <input type="text" name="title" v-model="title" id="title" maxlength="99"  placeholder="titre de votre article">
                    <p class="regex-advert" v-show="checkedTitle == false">Merci de n'utiliser que des caractères alpha-numériques ou des signes de ponctualisation.</p>
                    <label for="text"></label>
                    <textarea name="text" id="text" v-model="text" maxlength="319" cols="30" rows="10"  placeholder="que voulez-vous dire ?"></textarea>
                    <p class="regex-advert" v-show="checkedText == false">Merci de n'utiliser que des caractères alpha-numériques ou des signes de ponctualisation.</p>
                    <div class="aside--input">
                        <label for="file">Sélectionner une image (format jpg, png ou gif)</label>
                        <input type="file" name="selectFile" accept="image/png, image/jpg, image/jpeg, image/gif" id="file" @change="selectFile($event)" >
                        <button v-if="file && title && text"  id="maincontainer--aside__button"  v-on:click.prevent="publishNewArticle()">Publier</button>
                    </div>
                </form>
          </nav>
    </aside>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Redaction',
    data: function(){
      return{
        title: '',
        text: '',
        file: '',
        checkedTitle: true,
        checkedText: true,
        userLogged: ""
      }
    },  
    mounted(){ 
       this.userLogged = this.$route.params.userId
    },   
    methods: {
      selectFile(event){
        console.log("input on change")
        this.file = event.target.files[0]       
      },
      publishNewArticle: function(){
        if(!this.title.match(/^([a-zzáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-ZÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ0-9\s[!?;'._:,()"+-]+)$/)){
          this.checkedTitle =false
        }
        if(!this.text.match(/^([a-zzáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-ZÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ0-9\s[!?';._:,()"+-]+)$/)){
          this.checkedText = false
        }
        else{
          let formData = new FormData();
          formData.append('image', this.file)
          formData.append('title', this.title)
          formData.append('text', this.text)
          formData.append('author', this.userLogged)
          axios
          .post(`https://backend.thiery-samuel.com/api/user/${this.userLogged}/article`, 
            formData, 
            {headers: {
              Authorization: 'Bearer '+ localStorage.getItem('token'),
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(this.$router.push({name: 'Main', params: {userid: this.userLogged}}));
        }
      },
      
    }
}
</script>

<style>
#maincontainer--aside{
  margin: 10vh 5vw;
  text-align: center;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  margin-bottom: 20px; 
}
.aside--input{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin: 15px;
}
#title{
  width: 90%;
  margin: 15px 0;
  padding: 5px;
  border-radius: 5px;
}
#text{
  width: 90%;
  border-radius: 5px;
}
#maincontainer--aside__button{
  margin: 10px 0;
  padding: 5px 30px;
  border-radius: 5px;
  background-color: rgb(0, 136, 255);
  color: white;
  font-weight: bold;
}
</style>