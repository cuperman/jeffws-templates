'use strict';

const S3_BUCKET = 'AWS::S3::Bucket';

module.exports = function(properties = {}) {
  const versioning = properties.versioning ? 'Enabled' : 'Suspended';

  return {
    Type: S3_BUCKET,
    Properties: {
      VersioningConfiguration: {
        Status: versioning
      }
    }
  };
};
