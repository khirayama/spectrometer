import test from 'ava';

import {_parse, _tokensToRegexp, _pathToRegexp, _exec} from './router';

// _parse
test('_parse > /posts', t => {
  const tokens = _parse('/posts');

  t.is(tokens.length, 1);
  t.is(tokens[0], '/posts');
});

test('_parse > posts/:id', t => {
  const tokens = _parse('/posts/:id');

  t.is(tokens.length, 2);
  t.is(tokens[0], '/posts');
  t.is(tokens[1].name, 'id');
});

test('_parse > posts/:id/edit', t => {
  const tokens = _parse('/posts/:id/edit');

  t.is(tokens.length, 3);
  t.is(tokens[0], '/posts');
  t.is(tokens[1].name, 'id');
  t.is(tokens[2], '/edit');
});

test('_parse > posts/:id/:status', t => {
  const tokens = _parse('/posts/:id/:status');

  t.is(tokens.length, 3);
  t.is(tokens[0], '/posts');
  t.is(tokens[1].name, 'id');
  t.is(tokens[2].name, 'status');
});

// _tokensToRegexp
test('_tokensToRegexp > /posts/:id', t => {
  const tokens = _parse('/posts/:id');
  const regexp = _tokensToRegexp(tokens);

  t.is(regexp.constructor.name, 'RegExp');
});

// _pathToRegexp
test('_pathToRegexp > /posts/:id', t => {
  const result = _pathToRegexp('/posts/:id');

  t.is(result.constructor.name, 'RegExp');
  t.is(result.keys.length, 1);
  t.is(result.keys[0].name, 'id');
});
test('_pathToRegexp > /posts/:id/:status', t => {
  const result = _pathToRegexp('/posts/:id/:status');

  t.is(result.constructor.name, 'RegExp');
  t.is(result.keys.length, 2);
  t.is(result.keys[0].name, 'id');
  t.is(result.keys[1].name, 'status');
});
test('_pathToRegexp > /posts/:id/:id', t => {
  const result = _pathToRegexp('/posts/:id/:id');

  t.is(result.constructor.name, 'RegExp');
  t.is(result.keys.length, 2);
  t.is(result.keys[0].name, 'id');
  t.is(result.keys[1].name, 'id');
});

// _exec
test('_exec > /posts', t => {
  const result = _pathToRegexp('/posts');
  const matches = _exec(result, '/posts');

  t.is(Object.keys(matches.params).length, 0);
});
test('_exec > /posts/:id', t => {
  const result = _pathToRegexp('/posts/:id');
  const matches = _exec(result, '/posts/100');

  t.is(matches.params.id[0], '100');
});
test('_exec > /posts/:id/edit', t => {
  const result = _pathToRegexp('/posts/:id/edit');
  const matches = _exec(result, '/posts/100/edit');

  t.is(matches.params.id[0], '100');
});
test('_exec > /posts/:id/:status', t => {
  const result = _pathToRegexp('/posts/:id/:status');
  const matches = _exec(result, '/posts/100/001');

  t.is(matches.params.id[0], '100');
  t.is(matches.params.status[0], '001');
});
test('_exec > /posts/:id/:id', t => {
  const result = _pathToRegexp('/posts/:id/:id');
  const matches = _exec(result, '/posts/100/001');

  t.is(matches.params.id[0], '100');
  t.is(matches.params.id[1], '001');
});
test('_exec > /posts/:id/edit to /posts/:id', t => {
  const result = _pathToRegexp('/posts/:id');
  const matches = _exec(result, '/posts/100/edit');

  t.is(matches, null);
});
