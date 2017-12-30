const API_GATEWAY_DEPLOYMENT = 'AWS::ApiGateway::Deployment';

module.exports = function(properties = {}) {
  return {
    Type: API_GATEWAY_DEPLOYMENT,
    Properties: {
    }
  }
};
