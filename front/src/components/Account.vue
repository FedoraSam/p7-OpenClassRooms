<template>
  <div class="account">
      <form action="" class="connectionform" v-show="confirmation == false">
            <label for="first-name" v-show="changePassword == false">Nom de famille</label>
            <input type="text"  placeholder="nom" v-model="firstName" v-show="changePassword == false">
            <p v-show="checkedFirstName == false" class="regex-advert">Veuillez utiliser uniquement des caractères alphabétiques pour votre nom de famille </p>
            <label for="last-name" v-show="changePassword == false" >Prénom</label>
            <input type="text"  placeholder="prénom" v-model="lastName"  v-show="changePassword == false">
            <p v-show="checkedLastName == false" class="regex-advert">Veuillez utiliser uniquement des caractères alphabétiques pour votre prénom </p>
            <label for="email" v-show="changePassword == false">Votre email</label>
            <input type="email" placeholder="adresse mail" v-model="email" v-show="changePassword == false">
            <p class="signup" v-show="changePassword == false" v-on:click.prevent="modeChangePassword">Changer votre mot de passe</p>
            <p class="signup" v-show="changePassword == true" v-on:click.prevent="modeChangePassword">Annuler</p>
            <label v-show="changePassword == true" for="old-password">Confirmer votre ancien mot de passe </label>
            <input v-show="changePassword == true" type="password" placeholder="mot de passe" v-model="oldPassword">
            <label v-show="changePassword == true" for="new-password">Votre nouveau mot de passe</label>
            <input v-show="changePassword == true" type="password" placeholder="mot de passe" v-model="newPassword">
            <div class="container--button">
                <button v-show="changePassword == true" v-on:click.prevent="modifyPassword">Modifier</button>
                <p class="regex-advert">{{errorPassword}}</p>
                <button v-show="changePassword == false" v-on:click.prevent="modifyAccount">Modifier</button>
            </div> 
            <p class="signup" v-show="deleteAccount == false" v-on:click="deleteAccount = true">Supprimer votre compte</p> 
            <p class="signup" v-show="deleteAccount == true" v-on:click="deleteAccount = false ">Annuler</p> 
            <div class="container--button" v-show="deleteAccount == true">
                <button v-on:click.prevent="confirmation = true">Supprimer votre compte</button> 
            </div>    
        </form>
    <div class="account" v-show="confirmation == true">
        <label for="">Êtes-vous sûre de vouloir supprimer votre compte ? Tous vos articles, commentaires seront supprimés.</label>
            <form action="" class="connectionform">
                <label for="">Confirmer votre mot de passe</label>
                <input type="text" v-model="password">
                <div class="container--button">    
                    <button class="red" v-on:click.prevent="deleteUser">Confirmer la suppression de votre compte</button>
                    <button v-on:click.prevent="confirmation = false">Annuler</button>
                </div>    
            </form>    
    </div>
</div>  
</template>

<script>
import axios from 'axios'
import Menu from './Menu.vue'

export default {
    name: 'Account',
    components: {Menu},
    data: function (){
        return{
            firstName: '',
            lastName: '',
            email: '',
            oldPassword: '',
            newPassword: '',
            userLogged: '',
            changePassword: false,
            deleteAccount: false,
            confirmation: false,
            password: '',
            checkedLastName: true,
            checkedFirstName: true,
            errorPassword: ""
        }
    },
    methods: {
        modeChangePassword: function(){
            this.changePassword = !this.changePassword
            this.errorPassword = ''
        },
        deleteUser: function(){
           axios
           .delete(`https://backend.thiery-samuel.com/api/users/${this.userLogged}`, {
                headers: {
                Authorization: 'Bearer '+ localStorage.getItem('token')
                },
                data: {
                    password: this.password
                } 
            })
            .then(res => {
                localStorage.removeItem('token')
                this.$router.push({name: 'Authentification'})
                })
       },


        modifyAccount: function(){
            if(!this.lastName.match(/^([a-zzáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-ZÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s]+)$/)){
                this.checkedLastName = false
            }
            if(!this.firstName.match(/^([a-zzáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-ZÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s]+)$/)){
                console.log("regex non respectée")
                this.checkedFirstName = false
            }
            else{      
                axios
                .put(`https://backend.thiery-samuel.com/api/users/${this.userLogged}`,{
                    newFirstName: this.firstName,
                    newLastName: this.lastName,
                    newEmail: this.email,
                },  {
                    headers: {
                    Authorization: 'Bearer '+ localStorage.getItem('token')
                    }
                })
                .then(res => console.log(res))
            }    
        },


        modifyPassword: function(){
            axios
            .put(`https://backend.thiery-samuel.com/api/users/${this.userLogged}/password`,
                {
                    newPassword: this.newPassword,
                    oldPassword: this.oldPassword
                },
                {
                    headers: {
                    Authorization: 'Bearer '+ localStorage.getItem('token')
                    },
                })
            .then(res => {
                this.errorPassword = ""
            })
            .catch(err =>{
                this.errorPassword = err.response.data.message
            })
        }
    },
    mounted(){ 
      this.userLogged = this.$route.params.userId
      axios
      .get(`https://backend.thiery-samuel.com/api/users/${this.userLogged}`, {
        headers: {
          Authorization: 'Bearer '+ localStorage.getItem('token')
        }
      })
      .then(res => {
                   this.email = res.data[0].email
                   this.firstName = res.data[0].first_name
                   this.lastName = res.data[0].last_name
        })    
    }
}
</script>

<style>
.account{
    background-color: rgb(255, 255, 255);
    width: 50vw;
    border-radius: 5px;
    box-shadow: 5px 5px 15px rgb(79, 78, 78);
    margin: 10vh auto;
}
@media (max-width: 760px){
    .account{
        width: 95vw;

    }
    
}
.connectionform label{
    margin-top: 15px;
    margin-bottom: 8px;
}
.red{
    background-color: red;
    color: white;
}
.regex-advert{
    color: red;
}
</style>