<h1 align="center">Stashy</h1>

<div align="center">

[![GitHub license](https://img.shields.io/github/license/Wave-Play/stashy?style=flat)](https://github.com/Wave-Play/stashy/blob/main/LICENSE) [![Tests](https://github.com/Wave-Play/stashy/workflows/CI/badge.svg)](https://github.com/Wave-Play/stashy/actions) ![npm](https://img.shields.io/npm/v/@waveplay/stashy) [![minizipped size](https://badgen.net/bundlephobia/minzip/@waveplay/stashy)](https://bundlephobia.com/result?p=@waveplay/stashy)

**Flexible storage for Node, React Native, and the browser**

</div>

## Install

Using NPM

```bash
npm install @waveplay/stashy
```

Using Yarn

```bash
yarn add @waveplay/stashy
```

## Basic usage

```ts
import stashy from '@waveplay/stashy';

// Get a value from storage
const displayName = stashy.getString('name');
console.log(`Your username is ${displayName}`);

// Update a value in storage
stashy.set('name', 'Pkmmte Xeleon');
```

## Credits

This project was originally developed for [WavePlay](https://waveplay.com).

## License

The MIT License.
