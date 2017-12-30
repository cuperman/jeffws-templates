exports.preflight = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      handler: 'person#preflight'
    })
  });
};

exports.create = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      handler: 'person#create'
    })
  });
};

exports.index = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      handler: 'person#index'
    })
  });
};

exports.show = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      handler: 'person#show'
    })
  });
};

exports.update = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      handler: 'person#update'
    })
  });
};

exports.destroy = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      handler: 'person#destroy'
    })
  });
};
