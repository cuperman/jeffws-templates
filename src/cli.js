const path = require('path');
const fs = require('fs');
const merge = require('lodash/merge');

const TEMPLATE_JSON = 'template.json';
const UTF8 = 'utf8';

exports.mergeTemplate = function(templateUpdates) {
  const cwd = process.cwd();
  const templateFilename = path.resolve(cwd, TEMPLATE_JSON);

  return new Promise((resolve, reject) => {
    fs.readFile(templateFilename, UTF8, (err, data) => {
      const oldTemplate = err ? {} : JSON.parse(data);
      const newTemplate = merge({}, oldTemplate, templateUpdates);
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
