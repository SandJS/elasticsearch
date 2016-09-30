"use strict";

const SandGrain = require('sand-grain');
const _ = require('lodash');

class ElasticSearch extends SandGrain {

  constructor(name) {
    super(name);
    this.name = name || 'es';
    this.configName = name || 'elasticsearch';
    this.defaultConfig = require('./defaultConfig');
    this.version = require('../package').version;
  }

  createClient() {
    let config = _.cloneDeep(this.config); // see https://github.com/elastic/elasticsearch-js/issues/33

    let es = config.client || require('elasticsearch');
    delete config.client;

    return new es.Client(config);
  }

  bindToContext(ctx) {
    let self = this;
    let client = null;
    Object.defineProperty(ctx, this.name, {
      get: function() {
        if (!client) {
          client = self.createClient();
        }
        return client;
      }
    });
  }


}

module.exports = ElasticSearch;