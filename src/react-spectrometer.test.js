import test from 'ava';

import {_parseQueryString} from './react-spectrometer';

test('_parseQueryString > /posts', t => {
  const {pathname, query} = _parseQueryString('/posts');

  t.is(pathname, '/posts');
  t.deepEqual(query, {});
});

test('_parseQueryString > /posts/comments', t => {
  const {pathname, query} = _parseQueryString('/posts/comments');

  t.is(pathname, '/posts/comments');
  t.deepEqual(query, {});
});

test('_parseQueryString > /posts?foo=bar', t => {
  const {pathname, query} = _parseQueryString('/posts?foo=bar');

  t.is(pathname, '/posts');
  t.deepEqual(query, {foo: 'bar'});
});

test('_parseQueryString > /posts?foo=1', t => {
  const {pathname, query} = _parseQueryString('/posts?foo=1');

  t.is(pathname, '/posts');
  t.deepEqual(query, {foo: '1'});
});

test('_parseQueryString > /posts/comments?foo=1', t => {
  const {pathname, query} = _parseQueryString('/posts/comments?foo=1');

  t.is(pathname, '/posts/comments');
  t.deepEqual(query, {foo: '1'});
});

test('_parseQueryString > /posts/comments?foo=1#bar=1', t => {
  const {pathname, query} = _parseQueryString('/posts/comments?foo=1#bar=1');

  t.is(pathname, '/posts/comments');
  t.deepEqual(query, {foo: '1'});
});

test('_parseQueryString > /posts/comments#bar=1', t => {
  const {pathname, query} = _parseQueryString('/posts/comments#bar=1');

  t.is(pathname, '/posts/comments');
  t.deepEqual(query, {});
});
