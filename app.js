const express = require('express');
const userRouter = require('./routes/user.js');
const taxRouter = require('./routes/tax.js');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/tax', taxRouter);
app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
})

module.exports = app;
