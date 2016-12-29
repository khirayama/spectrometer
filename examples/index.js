import {Router, Connector} from '../lib';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

const Posts = {
  data: [{
    id: 0,
    title: 'Sample post 0',
    body: 'Sample post 0 body',
  }, {
    id: 1,
    title: 'Sample post 1',
    body: 'Sample post 1 body',
  }, {
    id: 2,
    title: 'Sample post 2',
    body: 'Sample post 2 body',
  }],
  fetch: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Posts.data);
      }, 300);
    });
  },
  find: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        for (let index = 0; index < Posts.data.length; index++) {
          const post = Posts.data[index];
          if (String(post.id) === String(id)) {
            resolve(post);
          }
        }
        resolve(null);
      }, 200);
    });
  }
};

function HomePage(props) {
  return (
    <div>
      <h1>Home</h1>
      <div onClick={() => props.changeLocation('/posts')}>to posts (wait 300ms to get posts)</div>
    </div>
  );
}

function PostsPage(props) {
  const posts = props.initialData;
  return (
    <div>
      <h1>Posts</h1>
      <div onClick={() => props.changeLocation('/')}>to top</div>
      <ul>{posts.map((post) => {
        return <li key={post.id} onClick={() => props.changeLocation(`/posts/${post.id}`)}>{post.title} (wait 200ms to get post)</li>
      })}</ul>
    </div>
  );
}

function PostPage(props) {
  const post = props.initialData;
  return (
    <div>
      <div onClick={() => props.changeLocation('/')}>to top</div>
      <div onClick={() => props.changeLocation('/posts')}>to posts</div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}

const routes = [{
  path: '/',
  component: HomePage,
  head: {title: 'Home'},
}, {
  path: '/posts',
  initialize: () => {
    return new Promise((resolve, {message}) => {
      Posts.fetch().then((posts) => {
        console.log(message);
        resolve(posts);
      });
    });
  },
  component: PostsPage,
  head: {title: 'Posts'},
  options: {
    async: true,
    data: () => {
      return {
        message: 'Completed posts initialize!'
      };
    }
  }
}, {
  path: '/posts/:id',
  initialize: (params, {message}) => {
    return new Promise((resolve) => {
      Posts.find(params.id).then((post) => {
        console.log(message);
        resolve(post);
      });
    });
  },
  component: PostPage,
  head: (post) => {
    return {title: post.title};
  },
  options: {
    async: true,
    data: {
      message: 'Completed initialize!'
    }
  }
}];

window.addEventListener('DOMContentLoaded', () => {
  const router = new Router(routes);

  ReactDOM.render(
    <Connector
      router={router}
      path={location.pathname}
      firstRendering={false}
      />,
    document.querySelector('.application')
  );
});
