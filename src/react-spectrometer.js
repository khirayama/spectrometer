import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

function queryString(href) {
  const href_ = href.split('?');
  const pathname = href_[0];
  const params = {};

  href_[1].split('&').forEach(query => {
    const query_ = query.split('=');
    params[query_[0]] = query_[1];
  });

  return {
    pathname,
    params,
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
  getChildContext() {
    return {changeLocation: this.changeLocation};
  }
  _updateHead(head) {
    if (head.title) {
      document.title = head.title;
    }
  }
  _updatePage(pathname, initialData = null) {
    const query = queryString(pathname);

    let head = this.props.router.getHead(query.pathname);
    if (typeof head === 'function') {
      head = head(initialData);
    }
    this._updateHead(head);

    if (query.pathname === location.pathname) {
      this.setState({pathname: query.pathname, initialData});
    }
  }
  _changeLocation(pathname) {
    this._updateLocation(pathname, false);
  }
  _updateLocation(pathname, isPopstate) {
    // options.async
    // options.data
    const query = queryString(pathname);
    const options = this.props.router.getOptions(query.pathname);
    let data = null;

    if (typeof history === 'object') {
      if (isPopstate) {
        history.replaceState(null, null, pathname);
      } else {
        history.pushState(null, null, pathname);
      }
    }

    if (typeof options.data === 'function') {
      data = options.data();
    } else {
      data = options.data;
    }
    data.params = query.params;

    if (options.async) {
      this.props.router.initialize(query.pathname, data).then(initialData => {
        this._updatePage(pathname, initialData);
      });
    } else {
      this.props.router.initialize(query.pathname, data);
      this._updatePage(pathname);
    }
  }
  render() {
    const pathname = this.state.pathname;
    const component = this.props.router.getComponent(pathname);
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
