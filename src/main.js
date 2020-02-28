const Google2Swagger = require('./index');
const axios = require('axios');
const yaml = require('js-yaml');

function convertGoogleDiscoveryToSwagger(response) {
  const swagger2Json = Google2Swagger.convert(response.data);
  
  const swagger2Yaml = yaml.safeDump(yaml.safeLoad(JSON.stringify(swagger2Json, null, 2)), {
    lineWidth: -1 // don't generate line folds
  });

  console.log(swagger2Yaml);
};

function getApiDiscovery(serviceUrl, version) {
  if (version > 5){
    throw "can't find api discovery for version 1-5.";
  }

  const discoveryUrl = `https://${serviceUrl}/$discovery/rest?version=v${version}`;

  axios.get(discoveryUrl)
  .then(convertGoogleDiscoveryToSwagger)
  .catch(function (error) {
    getApiDiscovery(serviceUrl, version + 1);
  });
}

const apiUrl = process.argv[2];

getApiDiscovery(apiUrl, 1);