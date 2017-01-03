# Spectrometer

Spectrometer is a simple flux router for JavaScipt apps.  
Spectrometer provide `Router`.  
And it provide `Connector` Component and `Link` Component for `React` also.

## Table of Contents

- Spectrometer
  - class: Router
  - class: Connector
  - class: Link

## Documents

### Class: Router

#### router.initialize(path)

- `path` `<String>` The pathname

Run route's initialize.

```javascript

const router = new Router([{
  path: '/',
  initialize: () => {
    return new Promise(resolve => {
      const initialData = getInitializeData();
      resolve(initialData);
    });
  }
}]);

router.initialize('/').then(initialData => {
  console.log(initialData);
});

```

#### router.getHead(path)

- `path` `<String>` The pathname

Get route's head object.

```javascript

const router = new Router([{
  path: '/',
  head: {
    title: 'Home'
  }
}]);

router.getHead('/'); // {title: 'Home'}

```

#### router.getComponent(path)

- `path` `<String>` The pathname

Get route's component object.

```javascript

const router = new Router([{
  path: '/',
  component: HomePage
}]);

router.getComponent('/'); // HomePage

```

#### router.getOptions(path)

- `path` `<String>` The pathname

Get route's options object.

```javascript

const router = new Router([{
  path: '/',
  options: {
    data: {
      id: '123456'
    }
  },
}]);

router.getOptions('/'); // {data: {id: '123456'}}

```
