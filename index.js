require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const { config } = require('./config');
const passportSetup = require('./config/passport-setup');
const userRoutes = require('./routes/user.routes');
const propertyRoutes = require('./routes/properties.routes');
const amenityRoutes = require('./routes/amenity.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const ticketRoutes = require('./routes/ticket.routes');
const generalRoutes = require('./routes/general.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const chatRoutes = require('./routes/chat.routes');
const { createServer } = require('node:http');
const socket = require('./socket');

const app = express();
const server = createServer(app);

// Integrate Socket.IO
socket(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Making Public
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(
  cookieSession({
    name: 'session',
    keys: ['auth'],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//morgan logger
app.use(morgan('tiny'));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Routes
app.get('/', (req, res) => {
  // res.render('index.ejs');
  res.render('login.ejs');
});

app.use('/properties', propertyRoutes);
app.use('/amenity', amenityRoutes);
app.use(userRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/ticket', ticketRoutes);
app.use('/g', generalRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/chat', chatRoutes);

app.on('error', (err) => {
  console.log('ERROR: ', err);
  throw err;
});

server.listen(config.PORT, () => {
  console.log(`Listening on ${config.PORT}`);
});
