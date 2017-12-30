const AWSTemplateFormatVersion = '2010-09-09';

module.exports = (Resources = {}, Outputs = {}, Description) => {
  if (Description) {
    return {
      AWSTemplateFormatVersion,
      Description,
      Outputs,
      Resources
    };
  }

  return {
    AWSTemplateFormatVersion,
    Outputs,
    Resources
  };
};
