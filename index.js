"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = void 0;
var _react = require("react");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var EMPTY_ARRAY = [];
var identity = function identity(v) {
  return v;
};
var _assocPath = function assocPath(stateByPath, path, callbackOrValue) {
  var _stateByPath;
  var originalState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : stateByPath;
  if (!path.length) {
    return typeof callbackOrValue === 'function' ? callbackOrValue(stateByPath, originalState) : callbackOrValue;
  }
  var key = path.shift();
  (_stateByPath = stateByPath) !== null && _stateByPath !== void 0 ? _stateByPath : stateByPath = {};
  return _objectSpread(_objectSpread({}, stateByPath), {}, _defineProperty({}, key, _assocPath(stateByPath[key], path, callbackOrValue, originalState)));
};
var createStore = exports.createStore = function createStore(_ref) {
  var initialState = _ref.initialState;
  var state = initialState;
  var subscriptions = [];
  var getState = function getState() {
    return state;
  };
  var setState = function setState(newState) {
    state = newState;
    subscriptions.forEach(function (handler) {
      return handler(state);
    });
  };
  var patchState = function patchState(keyOrPath, callbackOrValue) {
    var state = getState();
    var path = Array.isArray(keyOrPath) ? keyOrPath : [keyOrPath];
    setState(_assocPath(state, path, callbackOrValue));
  };
  var subscribe = function subscribe(callback) {
    subscriptions.push(callback);
  };
  var unsubscribe = function unsubscribe(callback) {
    subscriptions = subscriptions.filter(function (currentCallback) {
      return currentCallback !== callback;
    });
  };
  var useSelector = function useSelector() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
    var deps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EMPTY_ARRAY;
    var _useState = (0, _react.useState)(function () {
        return selector(getState());
      }),
      _useState2 = _slicedToArray(_useState, 2),
      localState = _useState2[0],
      setLocalState = _useState2[1];
    (0, _react.useEffect)(function () {
      setLocalState(selector(getState()));
      var handler = function handler() {
        setLocalState(selector(getState()));
      };
      subscribe(handler);
      return function () {
        return unsubscribe(handler);
      };
    }, deps);
    return localState;
  };
  return {
    getState: getState,
    setState: setState,
    patchState: patchState,
    useSelector: useSelector
  };
};