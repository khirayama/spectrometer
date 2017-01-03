# <img src="logo/logo-title-dark.png" height="60"/>

Spectrometer is a simple flux router for JavaScipt apps.  
Spectrometer provide `Router`.  
And it provide `Connector` Component and `Link` Component for `React` also.

## Installation

```
npm install --save spectrometer
```

## API

This has 3 classes.  
Ref: [Documents](docs)

### Classes

- Router
- Connector
- Link

## Documentation

[Documents](docs)

## Examples

Ref: [Examples](examples)

```javascript

import {Router, Connector, Link} from 'spectrometer';

const routes = [{
  path: '/',
  component: HomePage,
  head: {title: 'Home'},
}, {
  path: '/posts',
  initialize: params => {
    return new Promise((resolve) => {
      Posts.fetch().then((posts) => {
        resolve(posts);
      });
    });
  },
  component: PostsPage,
  head: {title: 'Posts'},
  options: {
    async: true,
  }
}, {
  path: '/posts/:id',
  initialize: params => {
    return new Promise((resolve) => {
      Posts.find(params.id).then((post) => {
        resolve(post);
      });
    });
  },
  component: PostPage,
  head: post => {
    return {title: post.title};
  },
  options: {
    async: true,
  }
}];

const router = new Router(routes);

// views
ReactDOM.render(
  <Connector
    router={router}
    path={location.pathname}
    />,
  document.querySelector('.application')
);

// Component
function PostsPage(props) {
  // pass initialize result with props
  const posts = props.initialData;

  return (
    <div>
      <h1>Posts</h1>
      <Link className="link" href="/">to top</Link>
      <ul>{posts.map((post) => {
        return (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
            (wait 200ms to get post)
          </li>
        )
      })}</ul>
    </div>
  );
}
```
