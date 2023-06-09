const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routes/contacts/contacts');
const usersRouter = require('./routes/users/users');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res
      .status(400)
      .json({ status: 'error', code: 400, message: err.message });
  }
  res.status(500).json({ status: 'fail', code: 500, message: err.message });
});

module.exports = app;
