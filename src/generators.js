'use strict';

const omit = require('lodash/omit');

const { codeBucketName, codeZipFilename, tableName, functionName,
        functionRoleName, functionHandlerName, tableEnvVarName,
        apiName, apiResourceName, apiMethodName, apiPermissionName,
        apiDeploymentName, apiHumanReadableName, apiPathPart, apiPathMatcher, apiUrlName } = require('./conventions');
const Template = require('./template');
const { Bucket } = require('./resources/s3');
const { Table, STRING } = require('./resources/dynamodb');
const { Role } = require('./resources/iam');
const { Function, Permission } = require('./resources/lambda');
const { RestApi, Resource, Method, Deployment } = require('./resources/api_gateway');

const POLICY_AMAZON_DYNAMODB_FULL_ACCESS = 'AmazonDynamoDBFullAccess';
const RUNTIME_NODEJS_6_10 = 'nodejs6.10';

exports.generateStack = function() {
  const CodeBucketName = codeBucketName();

  return Template({
    [CodeBucketName]: Bucket({
      versioning: true
    })
  }, {
    AccountId: {
      Value: {
        Ref: 'AWS::AccountId'
      }
    },
    StackId: {
      Value: {
        Ref: 'AWS::StackId'
      }
    },
    StackName: {
      Value: {
        Ref: 'AWS::StackName'
      }
    },
    Region: {
      Value: {
        Ref: 'AWS::Region'
      }
    },
    [CodeBucketName]: {
      Value: {
        Ref: CodeBucketName
      }
    }
  });
};

exports.generateCodeBucket = function() {
  const CodeBucketName = codeBucketName();

  return Template({
    [CodeBucketName]: Bucket({
      versioning: true
    })
  }, {
    [CodeBucketName]: {
      Value: {
        Ref: CodeBucketName
      }
    }
  })
};

// Generates a DynamoDB Table Definition
exports.generateTable = function(resourceString, hashKeyName, hashKeyType) {
  const TableName = tableName(resourceString);

  return Template({
    [TableName]: Table({
      hashKeyName,
      hashKeyType
    })
  }, {
    [TableName]: {
      Value: {
        Ref: TableName
      }
    }
  });
};

// Generates an IAM Role, and Lambda Function
function generateFunction(resourceString, handlerString, options = {}) {
  const CodeBucketName = codeBucketName();
  const CodeFilename = codeZipFilename();
  const FunctionRoleName = functionRoleName(resourceString, handlerString);
  const FunctionName = functionName(resourceString, handlerString);

  const policies = options.policies || [];

  const environment = options.environment || {};
  const handler = `app/handlers/${functionHandlerName(resourceString, handlerString)}`;
  const roleName = FunctionRoleName;
  const runtime = RUNTIME_NODEJS_6_10;

  return Template({
    [FunctionRoleName]: Role({
      policies
    }),

    [FunctionName]: Function({
      codeBucketName: CodeBucketName,
      codeFilename: CodeFilename,
      environment,
      handler,
      roleName,
      runtime
    })
  });
};
exports.generateFunction = generateFunction;

exports.generateDataFunction = function(resourceString, handlerString) {
  const TableEnvVarName = tableEnvVarName(resourceString);
  const TableName = tableName(resourceString);

  return generateFunction(resourceString, handlerString, {
    policies: [
      POLICY_AMAZON_DYNAMODB_FULL_ACCESS
    ],
    environment: {
      [TableEnvVarName]: {
        Ref: TableName
      }
    }
  });
};

// Generates a Rest API, Resources, Method, Lambda Permission Definitions, and Deployment Definitions
function generateApiMethod(resourceString, typeString, methodString, handlerString, stageString = 'prod') {
  const ApiName = apiName(resourceString);
  const ApiCollectionResourceName = apiResourceName(resourceString, 'collection');
  const ApiMemberResourceName = apiResourceName(resourceString, 'member');
  const ApiMethodName = apiMethodName(resourceString, methodString, typeString);
  const ApiPermissionName = apiPermissionName(resourceString, typeString, methodString, handlerString);
  const ApiDeployment = apiDeploymentName(resourceString, 'prod');
  const FunctionName = functionName(resourceString, handlerString);
  const LambdaPermissionName = apiPermissionName(resourceString, typeString, methodString, handlerString);
  const ApiUrlName = apiUrlName(resourceString, stageString);

  const resources = {
    [ApiName]: RestApi({
      name: apiHumanReadableName(resourceString)
    }),

    [ApiDeployment]: Deployment({
      restApiName: ApiName,
      stageName: stageString,
      dependencies: [
        ApiMethodName
      ]
    }),

    [ApiCollectionResourceName]: Resource({
      pathPart: apiPathPart(resourceString, 'collection'),
      restApiName: ApiName
    }),

    [ApiMemberResourceName]: Resource({
      pathPart: apiPathPart(resourceString, 'member'),
      restApiName: ApiName,
      parentName: ApiCollectionResourceName
    }),

    [ApiMethodName]: Method({
      httpMethod: methodString,
      restApiName: ApiName,
      resourceName: typeString === 'member' ? ApiMemberResourceName : ApiCollectionResourceName,
      functionName: FunctionName
    }),

    [LambdaPermissionName]: Permission({
      restApiName: ApiName,
      httpMethod: methodString,
      pathMatcher: apiPathMatcher(resourceString, typeString),
      functionName: FunctionName
    })
  };

  const outputs = {
    [ApiUrlName]: {
      Value: {
        'Fn::Sub': `https://\${${ApiName}}.execute-api.\${AWS::Region}.amazonaws.com/${stageString}`
      }
    }
  };

  if (typeString === 'member') {
    return Template(resources, outputs);
  } else {
    return Template(omit(resources, ApiMemberResourceName), outputs);
  }
}
exports.generateApiMethod = generateApiMethod;

exports.generateApiCollectionMethod = function(resourceString, methodString, handlerString) {
  return generateApiMethod(resourceString, 'collection', methodString, handlerString);
};

exports.generateApiMemberMethod = function(resourceString, methodString, handlerString) {
  return generateApiMethod(resourceString, 'member', methodString, handlerString);
};
