![RAF](https://github.com/NERC-CEH/rare-arable-flowers/raw/master/src/images/app_logo_dark.png)

This is Rare Arable Flowers identification and recording mobile web application. 
HTML5 based offline mobile app linked to [iRecord](http://www.brc.ac.uk/irecord/) website.

Live: [Rare Arable Flowers](http://flowers.irecord.org.uk)
Project: [homepage](http://www.brc.ac.uk/app/flowers)

## Configuration

App configuration hosted in `scr/conf.js`.

**Note:** it should be done *before* building the code.


## Building

- Install [NodeJS](http://nodejs.org/)
- Get a copy of the code by running:

```bash
git clone git://github.com/NERC-CEH/rare-arable-flowers.git
```

- Enter the `rare-arable-flowers` directory and install the npm build dependancies:

```bash
cd rare-arable-flowers && npm install
```

- Build the library: 
`Production`

```bash
grunt
```

`Testing/development` 

```bash
grunt bower dev
```


This will create a `dist` folder with the app code and its dependencies.


## Running

[Express](http://expressjs.com/) framework is provided for a quick launch of a web server.

```bash
node app.js
```

Note: Make sure the server MIME has **application/json** 


## Bugs and feature requests

Have a bug or a feature request? search for existing and closed issues. [Please open a new issue](https://github.com/NERC-CEH/rare-arable-flowers/issues).


## Creators

**Karolis Kazlauskis**

- <https://github.com/kazlauskis>


## Copyright and license

Code and documentation copyright 2015 CEH. Code released under the [GNU GPL v3 license](LICENSE).
Media (photos, maps) all rights reserved.
