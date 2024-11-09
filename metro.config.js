const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.watchFolders = [];
config.server = {
    enhanceMiddleware: (middleware) => middleware,
    maxWorkers: 2, // Puedes experimentar con 2, 4 o el valor que funcione mejor
};

module.exports = config;
