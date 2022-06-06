<template>
    <div class="container">
        <form action="" class="connectionform">
            <input type="text" v-if="mode == 'create'" placeholder="nom" v-model="firstName">
            <input type="text" v-if="mode == 'create'" placeholder="prénom" v-model="lastName">
            <input type="email" placeholder="adresse mail" v-model="email">
            <input type="password" placeholder="mot de passe 8 caractère minimum dont au moins un majuscule et des chiffres" v-model="password"> 
            <div class="container--button">
                <button v-if="mode == 'login'" v-on:click.prevent='login()'>Connexion</button>
                <p class="regex-advert" v-show="errorLogin == true">{{errorMesssage}}</p>
                <button v-if="mode == 'create'" v-on:click.prevent='createNewAccount()'>Créer un compte</button>
            </div>    
            <p v-if="mode == 'login'">Vous n'avez pas encore de compte gratuit <span class="signup" v-on:click='switchToCreateAccount()'>Créer un compte</span></p>
            <p v-if="mode == 'create'">Vous avez déjà un compte  <span class="signup" v-on:click='switchToLogIn()'>connectez-vous</span></p>
        </form>
    </div>  
</template>

<script>
import axios from 'axios';
export default {
    name: 'authentification',
    data: function() {
        return {
            mode: 'login',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            errorLogin: false,
            errorSignup: false,
            errorMesssage: ""
        }
    },
    methods:{
        createNewAccount: function () {    
            axios
            .post('https://backend.thiery-samuel.com/api/auth/signup', {
                lastName: this.lastName,
                firstName: this.firstName,
                email: this.email,
                password: this.password
            })
            .then(response => {
                this.errorSignup = false
                this.mode = 'login'
                
            })
            .catch((error)=>{
                this.errorSignup = true
                this.errorMesssage = error.response.data.message
            })
                
        },  
        login: function(){
            axios
            .post('https://backend.thiery-samuel.com/api/auth/login', {
                email: this.email,
                password: this.password
            })
            .then((response) => {
                localStorage.setItem('token', response.data.token);
                let id = response.data.userId
                this.$router.push({path: `/main/${id}`})})
            .catch((error)=>{
                this.errorLogin = true
                this.errorMesssage = error.response.data.message
            })    
        },
        switchToCreateAccount: function () {
            this.mode = 'create';  
            this.errorMesssage = ''
            
        },
        switchToLogIn: function(){
            this.mode = 'login';
            this.errorMesssage = ''
        }
    }
}
</script>

<style>

.connectionform{
    display: flex;
    flex-direction: column;
    padding: 10% 5%;
    
}
.container{
    background-color: aliceblue;
    width: 50vw;
    border-radius: 5px;
    box-shadow: 5px 5px 15px rgb(79, 78, 78);
    position: absolute;
    top: 50%; left: 50%; /* à 50%/50% du parent référent */
    transform: translate(-50%, -50%);
    
}
@media (max-width: 720px){
    .container{
        width: 95vw;
        top: 50vh;
        left: 50%;

    }
}
input{
    margin: 5px 0px;
    border-radius: 5px;
    padding: 5px;
    background-color: white;
    border: none;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
}
.container--button{
    text-align: center;
}
button{
    border-radius: 5px;
    margin: 20px;
    padding: 5px;
    width: 50%;
    color: rgb(32, 18, 18);
    font-size: 1.4em;
    font-weight: bold;
    border: none;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
}
button:hover{
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
}
.signup{
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}
</style>