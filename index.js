const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Listening to ${port}`);
})