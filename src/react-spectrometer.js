import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export function _parseQueryString(hrefString) {
  const hrefAndHashArray = hrefString.split('#');
  const hrefArray = hrefAndHashArray[0].split('?');
  const pathname = hrefArray[0];
  const query = {};

  const queriesString = hrefArray[1] || null;

  if (queriesString !== null) {
    queriesString.split('&').forEach(queryString => {
      const queryArray = queryString.split('=');
      query[queryArray[0]] = queryArray[1];
    });
  }

  return {
    pathname,
    query,
  };
}

export class Connector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pathname: props.path,
      initialData: null,
    };

    this.changeLocation = this._changeLocation.bind(this);
  }
  componentDidMount() {
    if (this.props.firstRendering !== false) {
      const pathname = location.pathname;
      this._updateLocation(pathname, true);
    }

    window.addEventListener('popstate', () => {
      const pathname = location.pathname;
      this._updateLocation(pathname, true);
    });
  }
  componentWillUpdate() {
    this.prevPathname = this.state.pathname;
  }
  getChildContext() {
    return {changeLocation: this.changeLocation};
  }
  _updateHead(head) {
    if (head.title) {
      document.title = head.title;
    }
  }
  _updatePage(href, initialData = null) {
    const {pathname, query} = _parseQueryString(href);

    let head = this.props.router.getHead(pathname);
    if (typeof head === 'function') {
      head = head(initialData);
    }
    this._updateHead(head);

    if (pathname === location.pathname) {
      this.setState({pathname, initialData});
    }
  }
  _changeLocation(pathname) {
    this._updateLocation(pathname, false);
  }
  _updateLocation(href, isPopstate) {
    // options.async
    // options.data
    const {pathname, query} = _parseQueryString(href);
    const options = this.props.router.getOptions(pathname);
    let data = null;

    if (typeof history === 'object') {
      if (isPopstate) {
        history.replaceState(null, null, href);
      } else {
        history.pushState(null, null, href);
      }
    }

    if (typeof options.data === 'function') {
      data = options.data();
    } else {
      data = options.data;
    }
    data.query = query;

    if (options.async) {
      this.props.router.initialize(pathname, data).then(initialData => {
        this._updatePage(href, initialData);
      });
    } else {
      this.props.router.initialize(pathname, data);
      this._updatePage(href);
    }
  }
  render() {
    const pathname = this.state.pathname;
    const component = this.props.router.getComponent(pathname);
    const classNames = [
      this.props.router.getClassName(pathname),
      this.props.router.getClassName(this.prevPathname || ''),
    ];
    const props = Object.assign({}, this.props, {
      key: (new Date()).getTime(),
      changeLocation: this.changeLocation,
      initialData: this.state.initialData,
    });

    delete props.transitionName;
    delete props.transitionAppear;
    delete props.transitionAppearTimeout;
    delete props.transitionEnterTimeout;
    delete props.transitionLeaveTimeout;
    delete props.transitionLeaveTimeout;
    delete props.path;
    delete props.router;

    if (this.props.router.getComponent(pathname)) {
      return React.createElement(ReactCSSTransitionGroup, {
        transitionName: this.props.transitionName || '',
        transitionAppear: this.props.transitionAppear || false,
        transitionAppearTimeout: this.props.transitionAppearTimeout || 0,
        transitionEnterTimeout: this.props.transitionEnterTimeout || 0,
        transitionLeaveTimeout: this.props.transitionLeaveTimeout || 0,
        className: classNames.join(' '),
      }, React.createElement(component, props));
    }
    return null;
  }
}

Connector.childContextTypes = {
  changeLocation: PropTypes.func,
};

Connector.propTypes = {
  router: PropTypes.shape({
    initialize: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
    getHead: PropTypes.func.isRequired,
    getOptions: PropTypes.func.isRequired,
  }),
  path: PropTypes.string.isRequired,
};

export class Link extends Component {
  constructor() {
    super();

    this.handleClick = this._handleClick.bind(this);
  }
  _handleClick(event) {
    event.preventDefault();

    const pathname = this.props.href;

    this.context.changeLocation(pathname);
  }
  render() {
    return <a {...this.props} onClick={this.handleClick}>{this.props.children}</a>;
  }
}

Link.contextTypes = {
  changeLocation: PropTypes.func,
};

Link.propTypes = {
  href: PropTypes.string.isRequired,
};
