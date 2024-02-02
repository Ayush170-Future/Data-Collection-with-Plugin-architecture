const fs = require("fs");
const path = require("path");
const logger = require('./logger/index.js');

class Plugins {
  constructor(app) {
    this.app = app;
    this.plugins = {};
  }

  async loadFromConfig(configPath = './plugins.json') {
    try {
      const pluginsConfig = JSON.parse(fs.readFileSync(configPath)).plugins;

      for (let plugin in pluginsConfig) {
        if (pluginsConfig[plugin].enabled) {
          await this.load(plugin, pluginsConfig[plugin].path);
        }
      }
    } catch (error) {
      logger.error(`Failed to load plugins from config: ${error}`);
    }
  }

  async load(plugin, pluginPath) {
    try {
      logger.info(`Loading plugin: ${plugin}`);
      const module = require(path.resolve(pluginPath));
      this.plugins[plugin] = module;
      await this.plugins[plugin].load(this.app);
      logger.info(`Loaded plugin: ${plugin}`);
    } catch (error) {
      logger.error(`Failed to load '${plugin}': ${error}`);
      this.app.stop();
    }
  }
}

module.exports = Plugins;
