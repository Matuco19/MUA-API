const express = require('express');
const fs = require('fs');
const path = require('path');
const package = require('../package.json')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const routesDir = path.join(__dirname, 'routes');

fs.readdirSync(routesDir).forEach(file => {
    if (file.endsWith('.js')) {
        const router = require(path.join(routesDir, file));
      
        const routePath = '/api/' + path.basename(file, '.js');
        app.use(routePath, router);
    }
});

app.listen(PORT, () => {
    console.log(`MSA API - Matuco19 System API - v${package.version}`)
    console.log(`Server is running on http://localhost:${PORT}`);
});