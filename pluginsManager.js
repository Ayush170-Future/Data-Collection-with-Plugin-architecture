const fs = require("fs");
const path = require("path");

class Plugins {
  constructor(app) {
    this.app = app;
    this.plugins = {};
  }

  async loadFromConfig(configPath = './plugins.json') {
    const pluginsConfig = JSON.parse(fs.readFileSync(configPath)).plugins;
    for (let plugin in pluginsConfig) {
      if (pluginsConfig[plugin].enabled) {
        await this.load(plugin, pluginsConfig[plugin].path);
      }
    }
  }

  async load(plugin, pluginPath) {
    try {
      console.log(pluginPath)
      const module = require(path.resolve(pluginPath));
      this.plugins[plugin] = module;
      await this.plugins[plugin].load(this.app);
      console.log(`Loaded plugin: '${plugin}'`);
    } catch (e) {
      console.log(e);
      console.log(`Failed to load '${plugin}'`);
      this.app.stop();
    }
  }
}

module.exports = Plugins;