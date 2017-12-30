'use strict';

const { upperFirst, camelCase, lowerCase, upperCase, snakeCase, join, words, capitalize } = require('lodash');
const packageJson = require('../package.json');

function pluralize(string) {
  return string + 's';
}

// application-specific

exports.codeBucketName = function() {
  return 'CodeBucket';
};

exports.codeZipFilename = function() {
  const packageName = packageJson.name;
  return `${packageName}.zip`;
};

// resource-specific

exports.tableName = function(resource) {
  const resourceName = upperFirst(camelCase(resource));
  return `${resourceName}Table`;
};

exports.tableEnvVarName = function(resource) {
  const resourceName = upperCase(snakeCase(resource));
  return `${resourceName}_TABLE`;
};

exports.functionName = function(resource, handler) {
  const resourceName = upperFirst(camelCase(resource));
  const handlerName = upperFirst(camelCase(handler));
  return `${resourceName}${handlerName}Function`;
};

exports.functionRoleName = function(resource, handler) {
  const resourceName = upperFirst(camelCase(resource));
  const handlerName = upperFirst(camelCase(handler));
  return `${resourceName}${handlerName}FunctionRole`;
};

exports.functionHandlerName = function(resource, handler) {
  const resourceName = lowerCase(snakeCase(resource));
  const handlerName = camelCase(handler);
  return `${resourceName}_handler.${handlerName}`;
};

exports.apiName = function(resource) {
  const resourceName = upperFirst(camelCase(resource));
  return `${resourceName}Api`;
};

exports.apiHumanReadableName = function(resource) {
  return capitalize(join(words([packageJson.name, resource, 'API']), ' '));
};

exports.apiResourceName = function(resource, type) {
  const resourceName = upperFirst(camelCase(resource));
  const typeName = upperFirst(camelCase(type));
  return `${resourceName}Api${typeName}Resource`;
};

exports.apiMethodName = function(resource, type, method) {
  const resourceName = upperFirst(camelCase(resource));
  const typeName = upperFirst(camelCase(type));
  const methodName = upperFirst(camelCase(method));
  return `${resourceName}Api${typeName}Method${methodName}`;
};

exports.apiPathPart = function(resource, type) {
  if (type === 'member') {
    return `{${lowerCase(camelCase(resource))}Id}`;
  } else {
    return pluralize(lowerCase(snakeCase(resource)));
  }
};

exports.apiPermissionName = function(resource, type, method, handler) {
  const resourceName = upperFirst(camelCase(resource));
  const typeName = upperFirst(camelCase(type));
  const methodName = upperFirst(camelCase(method));
  const handlerName = upperFirst(camelCase(handler));
  return `${resourceName}Api${typeName}Permission${methodName}Invokes${handlerName}`;
};

exports.apiDeploymentName = function(resource, stage) {
  const resourceName = upperFirst(camelCase(resource));
  const stageName = upperFirst(camelCase(stage));
  return `${resourceName}ApiDeployment${stageName}`;
};

