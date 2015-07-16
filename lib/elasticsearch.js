"use strict";

const SandGrain = require('sand-grain');
const elasticsearch = require('elasticsearch');
const _ = require('lodash');

class ElasticSearch extends SandGrain {

  constructor() {
    super();
    this.name = 'es';
    this.configName = 'elasticsearch';
    this.defaultConfig = require('./defaultConfig');
    this.version = require('../package').version;
  }

  createClient() {
    let config = _.cloneDeep(this.config); // see https://github.com/elastic/elasticsearch-js/issues/33
    return new elasticsearch.Client(config);
  }

  bindToContext(ctx) {
    let self = this;
    Object.defineProperty(ctx, 'es', {
      get: function() {
        if (!ctx._esClient) {
          ctx._esClient = self.createClient();
        }
        return ctx._esClient;
      }
    });
  }


}

module.exports = ElasticSearch;