const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const axios = require('axios');
const apicache = require('apicache');
const { myStatus, retrieveTags } = require('./controller/controller')
const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
const PORT = process.env.PORT || 3000;

// Step 4 Bonus
const cache = apicache.middleware;
app.use(express.static(path.join(__dirname, '../client/public')));


app.get('/api/ping', cache('60 minutes'), myStatus)  // Here cache is used for avoiding api calls again and again

// Step 2
app.get('/api/posts/:tags/:sortBy?/:direction?', cache('60 minutes'), retrieveTags);


app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});