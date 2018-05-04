const enviroments = {};

enviroments.staging = {
  'httpPort': 3005,
  'httpsPort': 3006,
  'envName': 'staging'

};

enviroments.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production'
};

const currentEnviroment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

const exportEnviroment = typeof(enviroments[currentEnviroment]) === 'object' ? enviroments[currentEnviroment] : enviroments.staging;

module.exports = exportEnviroment;