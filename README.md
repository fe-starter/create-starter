# create-starter

[![Build Status][travis-img]][travis-url]
[![Coverage Status][codecov-img]][codecov-url]
[![NPM Downloads][downloads-img]][downloads-url]
[![NPM Version][version-img]][version-url]
[![License][license-img]][license-url]
[![Dependency Status][dependency-img]][dependency-url]
[![devDependency Status][devdependency-img]][devdependency-url]
[![Code Style][style-img]][style-url]

> Awesome starter.

## Installation

Use npx:

```shell
$ npx create-starter init [options]
```

Globally install:

```shell
$ npm install create-starter -g
# or yarn
$ yarn global add create-starter
```

## Usage

```shell
$ npx create-starter init

   ┌───────────────────────────────────────────┐
   │                                           │
   │   Welcome use starter to init your app.   │
   │                                           │
   └───────────────────────────────────────────┘

√ Please pick the App type · Vue 3
√ Please pick one app · vite-tailwind-starter        
? Fill out the fields in package.json » 100% completed
 {
   "name": "my-demo",
   "description": "demo",
   "version": "1.0.1",
   "homepage": "https://github.com/wiolem/my-demo",   
   "author": "wiolem (https://github.com/wiolem)",    
   "repository": "https://github.com/wiolem/my-demo", 
   "license": "MIT"
 }
 Clone processing .. \

   ┌───────────────────────────┐
   │                           │
   │   Starter init success!   │
   │                           │
   └───────────────────────────┘

 cd ./my-demo
 npm install

```

## Todos

- [ ] Support templates cache & update
- [ ] Support analysis package.json & replace

## Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## License

[MIT](LICENSE) &copy; [LEE](https://wiolem.github.com)



[travis-img]: https://img.shields.io/travis/wiolem/create-starter
[travis-url]: https://travis-ci.org/wiolem/create-starter
[codecov-img]: https://img.shields.io/codecov/c/github/wiolem/create-starter
[codecov-url]: https://codecov.io/gh/wiolem/create-starter
[downloads-img]: https://img.shields.io/npm/dm/create-starter
[downloads-url]: https://npmjs.org/package/create-starter
[version-img]: https://img.shields.io/npm/v/create-starter
[version-url]: https://npmjs.org/package/create-starter
[license-img]: https://img.shields.io/github/license/wiolem/create-starter
[license-url]: https://github.com/wiolem/create-starter/blob/master/LICENSE
[dependency-img]: https://img.shields.io/david/wiolem/create-starter
[dependency-url]: https://david-dm.org/wiolem/create-starter
[devdependency-img]: https://img.shields.io/david/dev/wiolem/create-starter
[devdependency-url]: https://david-dm.org/wiolem/create-starter?type=dev
[style-img]: https://img.shields.io/badge/code_style-standard-brightgreen
[style-url]: https://standardjs.com
