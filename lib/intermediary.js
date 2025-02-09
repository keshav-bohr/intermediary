"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var convertArgType = require('../utils/convertArgType');

var logger = require('../utils/logger'); // region TYPEDEFS

/**
 * A middleware function.
 * @typedef Middleware
 * @type {function}
 * @param {object} Context The context passed by the involve function
 * @returns {MiddlewareController}
 */

/**
 * An Afterware function.
 * @typedef Afterware
 * @type {function}
 * @param {object} Context The context passed by the involve function
 * @returns {AfterwareController}
 */

/**
  * Middleware Controller
  * This holds the acutal body of the middleware function.
  * This function must return the next function's result.
  * It can be obtained by returning the arguments this controller got, in an array.
  * @typedef MiddlewareController
  * @type {function}
  * @param {...args}
  * @return next function's result.
  */

/**
  * Afterware Controller
  * This holds the acutal body of the middleware function.
  * This function must return the next function's result.
  * It can be obtained by returning the arguments this controller got, in an array.
  * @typedef AfterwareController
  * @type {function}
  * @param result the return value of the target function
  * @param {...args} finalTargetArgs The args with which the target function was invoked causing it to give the above result.
  * @return next function's result.
  */

/**
 * This callback is the hold the middleware controller logic.
 * This function must return the next function's result invoked with the arguments it got.
 * @type {callback}
 * @typedef CreateMiddlewareCallback
 * @param context The context passed by the involve function. Same as the one the middleware function gets.
 * @param {...args} arg The args which were passed to this middleware.
 */

/**
* This callback is the hold the afterware controller logic.
* This function must return the next function's result invoked with the arguments it got.
* @type {callback}
* @typedef CreateAfterwareCallback
* @param context The context passed by the involve function. Same as the one the afterware function gets.
* @param {...args} arg The args which were passed to this afterware.
*/

/**
 * @class Intermediary
 * Intermediary class holds the all the middleware and afterware
 * related to a particular stack of hooks.
 */
// endregion


var Intermediary =
/*#__PURE__*/
function () {
  /**
   * Instantiates a new intermediary with the provided middleware and afterware
   * @param {Middleware[]} middleware 
   * @param {Afterware[]} afterware 
   * @constructor
   */
  function Intermediary(middleware, afterware) {
    _classCallCheck(this, Intermediary);

    this.middleware = middleware;
    this.afterware = afterware;
  }
  /**
   * Static function which takes a list of intermediaries and 
   * returns a function which when called executes intermediaries in a sequential manner.
   * @param {Intermediary[]} intermediaries 
   * @param {function} target
   * @param context Optional object which is passed around middleware and afterware
   * during their execution.
   * @param {Object} providedConfig 
   * @static
   * @returns {function} InvolvedFunction Async function which can be invoked to execute all the intermediaries passed
   * along with the target function.
   */


  _createClass(Intermediary, [{
    key: "involve",

    /**
     * Attaches the intermediary's middleware and afterware stack to the 
     * target function and returns and involved function.
     * @param {*} target 
     * @param context Optional object which is passed around middleware and afterware
     * during their execution. 
     * @returns {function} Involved function 
     */
    value: function involve(target) {
      var _this = this;

      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var providedConfig = arguments.length > 2 ? arguments[2] : undefined;
      var defaultConfig = {
        throwOnTarget: true,
        throwOnAfterware: true,
        throwOnMiddleware: true
      };

      var config = _objectSpread({}, defaultConfig, providedConfig);

      return (
        /*#__PURE__*/
        _asyncToGenerator(function* () {
          for (var _len = arguments.length, targetArgs = new Array(_len), _key = 0; _key < _len; _key++) {
            targetArgs[_key] = arguments[_key];
          }

          var updatedArg = [].concat(targetArgs);
          var previousArg = [].concat(targetArgs);
          var result = '';
          var previousResult = '';

          if (_this.middleware) {
            var middleware = _toConsumableArray(_this.middleware);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = middleware[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var currentMiddleware = _step.value;

                try {
                  updatedArg = yield currentMiddleware(context).apply(void 0, _toConsumableArray(updatedArg));
                  updatedArg = !!updatedArg ? convertArgType(updatedArg) : previousArg;
                  previousArg = updatedArg;
                } catch (error) {
                  logger(error);

                  if (config.throwOnMiddleware) {
                    return;
                  }
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          }

          try {
            result = yield target.apply(void 0, _toConsumableArray(updatedArg));
          } catch (error) {
            logger(error);

            if (config.throwOnTarget) {
              return;
            }
          }

          if (_this.afterware) {
            var afterware = _toConsumableArray(_this.afterware);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = afterware[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var currentAfterware = _step2.value;

                try {
                  result = !!result ? result : previousResult;
                  previousResult = result;
                  var currentResult = yield currentAfterware(context).apply(void 0, [result].concat(_toConsumableArray(updatedArg)));
                  result = !!currentResult && !!currentResult.result ? currentResult.result : previousResult;
                  updatedArg = !!currentResult && !!currentResult.args ? convertArgType(currentResult.args) : previousArg;
                  previousArg = updatedArg;
                } catch (error) {
                  logger(error);

                  if (config.throwOnAfterware) {
                    return;
                  }
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          }

          return result;
        })
      );
    }
  }], [{
    key: "series",
    value: function series(intermediaries, target, context, providedConfig) {
      /**
       * Each intermediary can have stacks of multiple middleware and afterware.
       * This function sequentially executes middleware stacks of the intermediaries and then 
       * executes the target function and then executes the afterware stacks of the intermediaries.
       */
      return (
        /*#__PURE__*/
        _asyncToGenerator(function* () {
          var afterwareStacks = [];
          var middlewareStacks = [];
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = intermediaries[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var intermediary = _step3.value;

              if (!(intermediary instanceof Intermediary)) {
                throw new Error('intermediaries should be instances of Intermediary');
              }

              if (intermediary.middleware) {
                middlewareStacks.push.apply(middlewareStacks, _toConsumableArray(intermediary.middleware));
              }

              if (intermediary.afterware) {
                afterwareStacks = [].concat(_toConsumableArray(intermediary.afterware), _toConsumableArray(afterwareStacks));
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          ;
          var newIntermediary = new Intermediary(middlewareStacks, afterwareStacks);
          var next = newIntermediary.involve(target, context, providedConfig);
          return yield next.apply(void 0, arguments);
        })
      );
    }
    /**
     * Create a middleware out of the provided function.
     * @param  {CreateMiddlewareCallback} fn 
     * @static
     * @returns {Middleware} middleware
     */

  }, {
    key: "createMiddleware",
    value: function createMiddleware(fn) {
      return function (ctx) {
        return function () {
          for (var _len2 = arguments.length, targetArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            targetArgs[_key2] = arguments[_key2];
          }

          return fn.apply(void 0, [ctx].concat(targetArgs));
        };
      };
    }
    /**
     * Creates a afterware out of the provided function.
     * @param {CreateAfterwareCallback} fn 
     * @static
     * @returns {Afterware} afterware
     */

  }, {
    key: "createAfterware",
    value: function createAfterware(fn) {
      return function (ctx) {
        return function (result) {
          for (var _len3 = arguments.length, targetArgs = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            targetArgs[_key3 - 1] = arguments[_key3];
          }

          return fn.apply(void 0, [ctx, result].concat(targetArgs));
        };
      };
    }
  }]);

  return Intermediary;
}();

module.exports = Intermediary;
Intermediary.default = Intermediary;