import React, {Component, PropTypes} from 'react';

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
  _updateLocation(pathname, isPopstate) {
    // options.async
    // options.data
    const options = this.props.router.getOptions(pathname);
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

    if (options.async) {
      this.props.router.initialize(pathname, data).then(initialData => {
        this._updatePage(pathname, initialData);
      });
    } else {
      this.props.router.initialize(pathname, data);
      this._updatePage(pathname);
    }
  }
  render() {
    const pathname = this.state.pathname;
    const component = this.props.router.getComponent(pathname);

    if (this.props.router.getComponent(pathname)) {
      return React.createElement(component, {
        initialData: this.state.initialData,
      });
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
