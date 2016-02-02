'use strict';

var BaseTypes = require('../../data-types')
  , util = require('util')
  , _ = require('lodash');

BaseTypes.ABSTRACT.prototype.dialectTypes = 'http://docs.oracle.com/cd/B28359_01/server.111/b28318/datatype.htm';

var warn = BaseTypes.ABSTRACT.warn.bind(undefined, 'http://docs.oracle.com/cd/B28359_01/server.111/b28318/datatype.htm');

var UUID = function() {
  if (!(this instanceof UUID)) return new UUID();
  BaseTypes.UUID.apply(this, arguments);
};
util.inherits(UUID, BaseTypes.UUID);

UUID.prototype.toSql = function() {
  return 'CHAR(36)';
};

BaseTypes.ENUM.prototype.toSql = function() {
  return 'VARCHAR2(255)';
};

var INTEGER = function() {
  if (!(this instanceof INTEGER)) return new INTEGER();
  BaseTypes.INTEGER.apply(this, arguments);
};
util.inherits(INTEGER, BaseTypes.INTEGER);

INTEGER.prototype.toSql = function() {
  if (this._length) {
    return 'NUMBER(' + this._length + ',0)';
  } else {
    return 'NUMBER(12,0)';
  }
};

var STRING = function() {
  if (!(this instanceof STRING)) return new STRING();
  BaseTypes.STRING.apply(this, arguments);
};
util.inherits(STRING, BaseTypes.STRING);

STRING.prototype.toSql = function() {
  if (this._binary) {
    return 'VARCHAR2(' + this._length + ' BYTE)';
  } else {
    return 'NVARCHAR2(' + this._length + ')';
  }
};

BaseTypes.TEXT.prototype.toSql = function() {
  // TEXT is deprecated in mssql and it would normally be saved as a non-unicode string.
  // Using unicode is just future proof
  if (this._length) {
    if (this._length.toLowerCase() === 'tiny') { // tiny = 2^8
      warn('Oracle does not support TEXT with the `length` = `tiny` option. `NVARCHAR2(256)` will be used instead.');
      //this.warn('Oracle does not support TEXT with the `length` = `tiny` option. `NVARCHAR2(256)` will be used instead.');
      return 'NVARCHAR2(256)';
    }
    warn('Oracle does not support TEXT with the `length` option. `CLOB` will be used instead.');
    //this.warn('Oracle does not support TEXT with the `length` option. `CLOB` will be used instead.');
  }
  return 'CLOB';
};

var CHAR = function() {
  if (!(this instanceof CHAR)) return new CHAR();
  BaseTypes.CHAR.apply(this, arguments);
};
util.inherits(CHAR, BaseTypes.CHAR);

CHAR.prototype.toSql = function() {
  if (this._binary) {
    return 'CHAR(' + this._length + ' BYTE)';
  } else {
    return BaseTypes.CHAR.prototype.toSql.call(this);
  }
};

var BOOLEAN = function() {
  if (!(this instanceof BOOLEAN)) return new BOOLEAN();
  BaseTypes.BOOLEAN.apply(this, arguments);
};
util.inherits(BOOLEAN, BaseTypes.BOOLEAN);

BOOLEAN.prototype.toSql = function() {
  return 'CHAR';
};

var NOW = function() {
  if (!(this instanceof NOW)) return new NOW();
  BaseTypes.NOW.apply(this, arguments);
};
util.inherits(NOW, BaseTypes.NOW);

NOW.prototype.toSql = function() {
  return 'CURRENT_TIMESTAMP';
};

var DATE = function() {
  if (!(this instanceof DATE)) return new DATE();
  BaseTypes.DATE.apply(this, arguments);
};
util.inherits(DATE, BaseTypes.DATE);

DATE.prototype.toSql = function() {
  return 'TIMESTAMP WITH LOCAL TIME ZONE';
};

var BIGINT = function() {
  if (!(this instanceof BIGINT)) return new BIGINT();
  BaseTypes.BIGINT.apply(this, arguments);
};
util.inherits(BIGINT, BaseTypes.BIGINT);

BIGINT.prototype.toSql = function() {
  return 'NUMBER(19)';
};

module.exports = {
  DATE: DATE,
  BIGINT: BIGINT,
  UUID: UUID,
  CHAR: CHAR,
  BOOLEAN: BOOLEAN,
  INTEGER: INTEGER,
  STRING: STRING,
  NOW: NOW,
};

_.forIn(module.exports, function (DataType, key) {
  if (!DataType.key) DataType.key = key;
  if (!DataType.extend) {
    DataType.extend = function(oldType) {
      return new DataType(oldType.options);
    };
  }
});
