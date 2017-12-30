const path = require('path');
const fs = require('fs');
const { isArray, isString, mergeWith, map, union } = require('lodash');

const TEMPLATE_JSON = 'template.json';
const UTF8 = 'utf8';

function isArrayOfStrings(obj) {
  return isArray(obj) && !map(obj, item => isString(item)).includes(false);
}

function combineArraysOfStrings(objValue, srcValue) {
  if (isArrayOfStrings(objValue)) {
    return union(objValue, srcValue);
  }
}

exports.mergeTemplate = function(templateUpdates) {
  const cwd = process.cwd();
  const templateFilename = path.resolve(cwd, TEMPLATE_JSON);

  return new Promise((resolve, reject) => {
    fs.readFile(templateFilename, UTF8, (err, data) => {
      const oldTemplate = err ? {} : JSON.parse(data);
      const newTemplate = mergeWith({}, oldTemplate, templateUpdates, combineArraysOfStrings);
      const newTemplateJson = JSON.stringify(newTemplate, null, 2);

      fs.writeFile(templateFilename, newTemplateJson, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};
