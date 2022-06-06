//dependances
const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, 
	max: 300, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const authRoute = require('./routes/auth')
const articlesRoute = require('./routes/articles')
const usersRoutes = require('./routes/users')

app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(express.json());



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


app.use(limiter)
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/user', articlesRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoutes)


module.exports= app;