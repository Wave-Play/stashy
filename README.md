<h1 align="center">Stashy</h1>

<div align="center">

[![GitHub license](https://img.shields.io/github/license/Wave-Play/stashy?style=flat)](https://github.com/Wave-Play/stashy/blob/main/LICENSE) [![Tests](https://github.com/Wave-Play/stashy/workflows/CI/badge.svg)](https://github.com/Wave-Play/stashy/actions) ![npm](https://img.shields.io/npm/v/@waveplay/stashy) [![minizipped size](https://badgen.net/bundlephobia/minzip/@waveplay/stashy)](https://bundlephobia.com/result?p=@waveplay/stashy)

**Storage API for Node, React Native, and the browser**

Flexible storage API shared across environments. <br/>Stashy uses the best storage backend for each environment.

</div>

## Getting started

Install the package:

```bash
npm install @waveplay/stashy
```

Use functions such as `get(key)` or `set(key, value)`. These will be delegated to the correct backend based on the environment your code is running in. 

```ts
import stashy from '@waveplay/stashy'

// Get a value from storage
const displayName = stashy.getString('name')
console.log(`Your username is ${displayName}`)

// Update a value in storage
// It'll be saved and available when you come back later
stashy.set('name', 'Pkmmte Xeleon')
```

See the [sample project](https://github.com/Wave-Play/stashy/tree/master/examples/basic-example) for more usage examples.

## API reference

| Function          | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `clearAll`        | Clears all data from the backend.                        |
| `delete`          | Deletes the value for the given key.                     |
| `get`             | Gets the value for the given key.                        |
| `getAsync`        | Gets the value for the given key asynchronously.         |
| `getBoolean`      | Gets the boolean value for the given key.                |
| `getBooleanAsync` | Gets the boolean value for the given key asynchronously. |
| `getNumber`       | Gets the number value for the given key.                 |
| `getNumberAsync`  | Gets the number value for the given key asynchronously.  |
| `getString`       | Gets the string value for the given key.                 |
| `getStringAsync`  | Gets the string value for the given key asynchronously.  |
| `set`             | Sets the value for the given key.                        |

## Backends

Stashy comes with a few backends available out of the box. You can also create your own backend by implementing the `StashyBackend` interface.

```ts
import { Stashy } from '@waveplay/stashy'
import { StashyBackend } from '@waveplay/stashy/backend'

class CustomBackend implements StashyBackend {
  // ... your custom backend implementation
}

const stashy = new Stashy({
  backend: new CustomBackend()
})

// or with different backends per environment
const stashy = new Stashy({
  backend: {
    native: new MmkvBackend(),
    ssr: new CookieBackend(),
    web: new CustomBackend()
  }
})
```

#### AsyncStorage

This backend uses [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) to store data. It is the default backend for native and only works with async functions such as `getStringAsync()`.

```ts
import { AsyncStorageBackend } from '@waveplay/stashy/backend/async-storage'
```

#### Cookie

Cookie-backed storage perfect for server-side environments. It is the default backend for SSR and requires a `context` object to be passed with every function call.

```ts
import { CookieBackend } from '@waveplay/stashy/backend/cookie'
```

#### Env

Meant to use `process.env` variables. Supports dot notation for nested objects. 

```ts
import { EnvBackend } from '@waveplay/stashy/backend/env'
```

> **Note:** This will not load the `.env` file for you. Use with [dotenv](https://github.com/motdotla/dotenv) if you need to load the `.env` file. Frameworks like [Next.js](https://nextjs.org/) and [Pilot.js](https://github.com/Wave-Play/pilot/) do this automatically.

#### LocalStorage

Relies on `localStorage` to store data. It is the default backend for web.

```ts
import { LocalStorageBackend } from '@waveplay/stashy/backend/local-storage'
```

#### MMKV

Extremely fast and efficient storage for React Native, but requires that you install [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) separately. If you're using Expo, you will also need to generate a new development client build.

```ts
import { MmkvBackend } from '@waveplay/stashy/backend/mmkv'
```

## Debugging

You can pass your own logger (such as [pino](https://github.com/pinojs/pino)) to Stashy when creating a new instance and it will be used to log events. This is useful for debugging backend and environment issues. 

The `id` property is included in each log message to help you differentiate between multiple instances of Stashy.

```ts
import { Stashy } from '@waveplay/stashy'
import pino from 'pino'

const stashy = new Stashy({
  id: 'my-stash',
  logger: pino({ level: 'debug' })
})
```

## Credits

This project was originally developed for [WavePlay](https://waveplay.com).

## License

The MIT License.
