# fs-safe-copy

[![Build Status](https://travis-ci.org/xeitodevs/fs-safe-copy.svg?branch=master)](https://travis-ci.org/xeitodevs/fs-safe-copy)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![codecov](https://codecov.io/gh/xeitodevs/fs-safe-copy/branch/master/graph/badge.svg)](https://codecov.io/gh/xeitodevs/fs-safe-copy)


A library for copy files with a promise based interface and operation
checks utilities.

### Features

* Streams based programming
* Promise based interface
* Copy single files
* Copy directories with files within (only one level of depth)
* Safe copy function, to verify the copied file when operation finishes

### Installation

You can download this package with the blazing fast NPM
```bash
npm i fs-safe-copy
```

### Usage
```javascript
const { copy, safeCopy } = require('fs-safe-copy')

// Only copy one file

try {
    await copy('/origin/file.txt', '/destination/file.txt')
} catch (e){
    // do something. see lib/errors.
}

// Copy entire dir, with depth level 1. (subdirs will be ignored)
await copy('/origin', '/destination')

// Copy one unique file and do the checksum after operation.
try {
    await safeCopy('/origin/file.txt', '/destination/file.txt', 'sha1')
} catch (e) {
     // do something. see lib/errors
}
// Note the third argument above example, you can set the hash algorithm
// to do the checksum of the file after is copied. Defaults to md5.
```
### Authors

* **Eloy** - [@eloylp](https://github.com/eloylp)
* **Andrea** - [@zucchinidev](https://github.com/zucchinidev)
See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.
