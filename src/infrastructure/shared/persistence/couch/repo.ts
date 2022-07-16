import * as http from 'http';
import nano = require('nano');

// import nanoFactory from 'nano';
import { DatabaseConfig, GlobalConfig } from '@infrastructure/shared/config/infrastructure.config';

// const nanoFactory = require('nano');

const Repo = () => {
  const httpAgent = new http.Agent({
    keepAlive: false,
    maxSockets: 25
  });
  const url = `http://${DatabaseConfig.DB_USER}:${DatabaseConfig.DB_PASSWORD}@${
    GlobalConfig.ENVIRONMENT === 'test' ? '127.0.0.1' : DatabaseConfig.DB_HOST
  }:${DatabaseConfig.DB_PORT}`;
  // console.log(url);
  // nano.db.destroy('reservation');
  // repo.db.destroy('user')
  // repo.db.destroy('reservation')
  return nano({
    url,
    requestDefaults: {
      agent: httpAgent
    }
  });
};

export { Repo };
