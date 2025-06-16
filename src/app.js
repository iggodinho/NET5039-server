require('dotenv').config();
const express = require('express');
const app = express();

const api_routes = require('./routes/index.routes');

app.use(express.json());

app.use('/api', api_routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
