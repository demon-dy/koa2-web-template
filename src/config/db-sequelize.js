const Sequelize = require('sequelize');
import config from './db-config';

export const dbSequelize = new Sequelize(config.database, config.user, config.password, {
	host: config.host,
	dialect: config.dialect,
	pool: {
		max: config.max,
		min: 0,
		idle: config.idle
	}
});