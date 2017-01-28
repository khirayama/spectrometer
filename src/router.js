const PATH_REGEXP = new RegExp([
  '(\\\\.)',
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))',
].join('|'), 'g');

export function _parse(str) {
  const tokens = [];
  let index = 0;
  let path = '';
  let res;

  /*eslint-disable */
  while ((res = PATH_REGEXP.exec(str)) !== null) {
    let offset = res.index;

    path += str.slice(index, offset);
    index = offset + res[0].length;

    // if not exist path or empty string
    if (path) {
      tokens.push(path);
    }
    path = '';

    const token = {
      name: res[3],
      pattern: '[^/]+?',
    };
    tokens.push(token);
  }
  /*eslint-enable */

  if (index < str.length) {
    path += str.substr(index);
  }
  if (path) {
    tokens.push(path);
  }

  return tokens;
}

export function _tokensToRegexp(tokens) {
  let route = '';
  const lastToken = tokens[tokens.length - 1];
  const endsWithSlash = (typeof lastToken === 'string' && /\/$/.test(lastToken));

  tokens.forEach(token => {
    if (typeof token === 'string') {
      route += token;
    } else {
      let capture = token.pattern;

      capture = '/(' + capture + ')';
      route += capture;
    }
  });
  route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
  route += '$';

  return new RegExp('^' + route, 'i');
}

export function _pathToRegexp(path) {
  const tokens = _parse(path);
  const regexp = _tokensToRegexp(tokens);

  regexp.keys = [];
  tokens.forEach(token => {
    if (typeof token !== 'string') {
      regexp.keys.push(token);
    }
  });

  return regexp;
}

export function _getParams(keys, matches) {
  const params = {};

  if (matches) {
    keys.forEach((key, index) => {
      if (!params[key.name]) {
        params[key.name] = [];
      }
      params[key.name].push(matches[index + 1]);
    });
  }
  return params;
}

export function _exec(regexp, path) {
  const matches = regexp.exec(path);
  const params = _getParams(regexp.keys, matches);

  if (!matches) {
    return null;
  }

  matches.params = params;
  return matches;
}

export default class Router {
  constructor(routes) {
    this._routes = routes;
  }

  _findRoute(path) {
    for (let index = 0; index < this._routes.length; index++) {
      const route = this._routes[index];
      const regexp = _pathToRegexp(route.path || '');
      const matches = _exec(regexp, path);
      if (matches) {
        return {route, matches};
      }
    }
    return null;
  }

  initialize(path, data) {
    const {route, matches} = this._findRoute(path);
    if (route.initialize && matches) {
      return route.initialize(matches.params, data);
    }
    return new Promise(resolve => resolve());
  }

  getHead(path) {
    const {route, matches} = this._findRoute(path);
    if (route.head && matches) {
      return route.head;
    }
    return null;
  }

  getComponent(path) {
    const {route, matches} = this._findRoute(path);
    if (route.component && matches) {
      return route.component;
    }
    return null;
  }

  getClassName(path) {
    const {route, matches} = this._findRoute(path);
    if (route.className && matches) {
      return route.className;
    }
    return '';
  }

  getOptions(path) {
    const {route, matches} = this._findRoute(path);
    if (route.options && matches) {
      return route.options;
    }
    return {};
  }
}
