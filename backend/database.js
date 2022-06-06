const mysql =require('mysql');
require('dotenv').config()

//base de données mysql
const bdd = mysql.createConnection({
  host: 'localhost',
  user: process.env.DATABASE_USER,
  password: process.env.SECRET_PASSWORD_MYSQL,
  database: process.env.DATABASE_NAME
});

bdd.connect(err => {
  if(err){
      throw err
  }
  console.log('connecté à la bdd mysql')
})

module.exports = bdd;