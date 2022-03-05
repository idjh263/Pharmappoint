const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require("express-handlebars");


const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/dbconnection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Passport
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

const helpers = require('./utils/helpers');

const hbs = exphbs.create({ helpers });


app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Express static assets
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(require('./controllers/api'));

// Sync Database
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});