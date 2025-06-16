const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const PATH_ROUTER = __dirname;

fs.readdirSync(PATH_ROUTER).forEach((file) => {
  if (file === 'index.routes.js' || !file.endsWith('.routes.js')) return;

  const routeName = file.split('.')[0];
  const routeModule = require(path.join(PATH_ROUTER, file));

  router.use(`/${routeName}`, routeModule);
  console.log(`Loaded route: /${routeName}`);
});

module.exports = router;
