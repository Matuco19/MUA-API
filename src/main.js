const express = require('express');
const fs = require('fs');
const path = require('path');
const package = require('../package.json')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const routesDir = path.join(__dirname, 'routes');

const loadRoutes = (dir, prefix = '') => {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            loadRoutes(filePath, path.join(prefix, file));
        } else if (file.endsWith('.js')) {
            const router = require(filePath);
            const routeName = path.basename(file, '.js');
            if (routeName === 'index') {
                const routePath = `/api`;
                console.log(`Loading route: ${routePath}`);
                app.use(routePath, router);
            } else {
                if (prefix) {
                const routePath = `/api/${prefix}/${routeName}`;
                console.log(`Loading route: ${routePath}`);
                app.use(routePath, router);
                } else {
                const routePath = `/api/${routeName}`;
                console.log(`Loading route: ${routePath}`);
                app.use(routePath, router);
                }
            }
        }
    });
};

loadRoutes(routesDir);

app.listen(PORT, () => {
    console.log(`\nMUA API - Matuco19 Utility API - v${package.version}`)
    console.log(`Server is running on http://localhost:${PORT}`);
});