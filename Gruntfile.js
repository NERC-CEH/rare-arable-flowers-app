module.exports = function (grunt) {
  var DEST = 'dist/scripts/';
  var CONF_NAME = 'conf.js';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    bower: {
      install: {
        options: {
          targetDir: 'src/scripts/libs',
          layout: 'byComponent',
          cleanBowerDir: true
        }
      }
    },


    copy: {
      main: {
        files: [
          //HTML
          {
            src:  "src/*.html", dest: 'dist/',
            expand: true, flatten: true
          },
          {
            src: ['src/appcache.manifest'], dest: 'dist/appcache.manifest'
          },
          {
            src:  "src/*.json", dest: 'dist/',
            expand: true, flatten: true
          },
          //CSS
          {
            src:  "src/css/*", dest: 'dist/css/',
            expand: true, flatten: true
          },
          //JS
          {
            src:  "src/images/**", dest: 'dist/images/',
            expand: true, flatten: true, filter: 'isFile'
          },
          {
            src:  "src/images/ajax-loader.gif", dest: 'dist/css/images/',
            expand: true, flatten: true
          },
          {
            src: 'src/scripts/main.js',
            dest: 'dist/scripts/main.js', flatten: true
          },
          {
            src:  "src/data/*.json", dest: 'dist/scripts/',
            expand: true, flatten: true
          },
          {
            src: 'src/scripts/*.js',
            dest: 'dist/scripts/', expand: true, flatten: true, filter: 'isFile'
          },
          {
            src: 'src/scripts/helpers/*',
            dest: 'dist/scripts/helpers/',  expand: true, flatten: true
          },
          {
            src: 'src/scripts/routers/*',
            dest: 'dist/scripts/routers/',  expand: true, flatten: true
          },
          {
            src: 'src/scripts/models/*',
            dest: 'dist/scripts/models/',  expand: true, flatten: true
          },
          {
            src: 'src/scripts/views/*',
            dest: 'dist/scripts/views/',  expand: true, flatten: true
          },
          {
            src:  "src/scripts/libs/**/js/*", dest: 'dist/scripts/libs/',
            expand: true, flatten: true
          },
          {
            src:  "src/scripts/libs/**/css/*", dest: 'dist/css/',
            expand: true, flatten: true
          }
        ]
      }
    },


    jst: {
      compile: {
        options: {
          namespace: 'app.templates',
          prettify: true,
          //this does not support using %=
          //templateSettings: {
          //  interpolate : /\{\{(.+?)\}\}/g
          //},
          processName: function(filepath) {
            return filepath.split('/')[2].split('.')[0];
          }
        },
        files: {
          "dist/scripts/templates.js": ["src/templates/*.tpl"]
        }
      }
    },


    replace: {
      // Fix double define problem
      latlon: {
        src: ['src/scripts/libs/latlon/js/latlon-ellipsoidal.js'],
        overwrite: true,
        replacements: [
          {
            from: 'if (typeof module != \'undefined\' && module.exports) module.exports.Vector3d = Vector3d;',
            to: ''
          },
          {
            from: 'if (typeof define == \'function\' && define.amd) define([], function() { return Vector3d; });',
            to: ''
          }
        ]
      },
      //Fix iOS 8 readonly broken IndexedDB
      indexedDBShim: {
        src: ['src/scripts/libs/IndexedDBShim/js/IndexedDBShim.js'],
        overwrite: true,
        replacements: [
          {
            from: 'shim(\'indexedDB\', idbModules.shimIndexedDB);',
            to:  'shim(\'_indexedDB\', idbModules.shimIndexedDB);'
          },
          {
            from: 'shim(\'IDBKeyRange\', idbModules.IDBKeyRange);',
            to:  'shim(\'_IDBKeyRange\', idbModules.IDBKeyRange);'
          }
        ]
      },
      //App NAME and VERSION
      main: {
        src: [DEST + CONF_NAME],
        overwrite: true, // overwrite matched source files
        replacements: [{
          from: /(app.VERSION =).*version grunt replaced/g, // string replacement
          to: '$1 \'<%= pkg.version %>\';'
        },
          {
            from: /(app.NAME =).*name grunt replaced/g,  // string replacement
            to: '$1 \'<%= pkg.name %>\';'
          }
        ]
      }
    },


    uglify: {
      indexedDB: {
        options: {
          banner:
          '/**\n' +
          '* IndexedDBShim\n ' +
          '* https://github.com/axemclion/IndexedDBShim\n ' +
          '*/\n'
        },
        files: {
          'src/scripts/libs/IndexedDBShim/js/IndexedDBShim.min.js': ['src/scripts/libs/IndexedDBShim/js/IndexedDBShim.js']
        }
      },
      topojson: {
        options: {
          banner:
          '/**\n' +
          '* Topojson\n ' +
          '* https://github.com/mbostock/topojson\n ' +
          '*/\n'
        },
        files: {
          'src/scripts/libs/topojson/js/topojson.min.js': ['src/scripts/libs/topojson/js/topojson.js']
        }
      },
      backbone: {
        options: {
          banner:
          '//     Backbone.js 1.1.2\n' +
          '//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors\n' +
          '//     Backbone may be freely distributed under the MIT license.\n' +
          '//     For all details and documentation:\n' +
          '//     http://backbonejs.org */\n'
        },
        files: {
          'src/scripts/libs/backbone/js/backbone.min.js': ['src/scripts/libs/backbone/js/backbone.js']
        }
      },
      fastclick: {
        options: {
          banner:
          '/** \n' +
          '* @preserve FastClick: polyfill to remove click delays on browsers with touch UIs. \n' +
          '* \n' +
          '* @version 1.0.3 \n' +
          '* @codingstandard ftlabs-jsv2 \n' +
          '* @copyright The Financial Times Limited [All Rights Reserved] \n' +
          '* @license MIT License (see LICENSE.txt) \n' +
          '*/\n'
        },
        files: {
          'src/scripts/libs/fastclick/js/fastclick.min.js': ['src/scripts/libs/fastclick/js/fastclick.js']
        }
      },
      dms: {
        options: {
          banner:
            '/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */\n' +
            '/*  Geodesy representation conversion functions                       (c) Chris Veness 2002-2015  */\n' +
            '/*   - www.movable-type.co.uk/scripts/latlong.html                                   MIT Licence  */\n' +
            '/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */\n'
        },
        files: {
          'src/scripts/libs/latlon/js/dms.min.js': ['src/scripts/libs/latlon/js/dms.js']
        }
      },
      latlon_ellipsoid: {
        options: {
          banner:
            '/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */\n' +
            '/* Geodesy tools for an ellipsoidal earth model         (c) Chris Veness 2005-2015 / MIT Licence  */\n' +
            '/*                                                                                                */\n' +
            '/* Includes methods for converting lat/lon coordinates between different coordinate systems.      */\n' +
            '/*   - www.movable-type.co.uk/scripts/latlong-convert-coords.html                                 */\n' +
            '/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */\n'
        },
        files: {
          'src/scripts/libs/latlon/js/latlon-ellipsoidal.min.js': ['src/scripts/libs/latlon/js/latlon-ellipsoidal.js']
        }
      },
      osgridref: {
        options: {
          // the banner is inserted at the top of the output
          banner:
            '/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */\n' +
            '/*  Ordnance Survey Grid Reference functions            (c) Chris Veness 2005-2015 / MIT Licence  */\n' +
            '/*  Formulation implemented here due to Thomas, Redfearn, etc is as published by OS, but is       */\n' +
            '/*  inferior to Krüger as used by e.g. Karney 2011.                                               */\n' +
            '/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */\n'
        },
        files: {
          'src/scripts/libs/latlon/js/osgridref.min.js': ['src/scripts/libs/latlon/js/osgridref.js']
        }
      },
      vector3d: {
        options: {
          // the banner is inserted at the top of the output
          banner:
            '/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */\n' +
            '/*  Vector handling functions                           (c) Chris Veness 2011-2015 / MIT Licence  */\n' +
            '/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */\n'
        },
        files: {
          'src/scripts/libs/latlon/js/vector3d.min.js': ['src/scripts/libs/latlon/js/vector3d.js']
        }
      },
      requirejs: {
        options: {
          // the banner is inserted at the top of the output
          banner:
            '/** vim: et:ts=4:sw=4:sts=4\n' +
            '* @license RequireJS 2.1.16 Copyright (c) 2010-2015, The Dojo Foundation All Rights Reserved.\n' +
            '* Available via the MIT or new BSD license.\n' +
            '* see: http://github.com/jrburke/requirejs for details\n' +
            '*/\n'
        },
        files: {
          'src/scripts/libs/requirejs/js/require.min.js': ['src/scripts/libs/requirejs/js/require.js']
        }
      },
      data: {
        files: {
          'dist/scripts/data.js': ['src/data/*.js']
        }
      }
    },

    cssmin: {
      target: {
        files: [{
          src: [
            'dist/css/jquery.mobile-1.4.5.min.css',
            'dist/css/photoswipe.min.css',
            'dist/css/trip.min.css',
            'dist/css/app.css'
          ],
          dest: 'dist/css/main.min.css'
        }]
      }
    },

    requirejs: {
      compile: {
        options: {
          verbose: true,
          baseUrl: "dist/scripts/",
          mainConfigFile: 'src/scripts/main.js',
          name: "main",
          out: "dist/scripts/main-built.js",

          optimize: 'none',
          paths: {
            data: 'empty:'
          }

        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // the default task can be run just by typing "grunt" on the command line
  grunt.registerTask('init', ['bower', 'replace:indexedDBShim', 'replace:latlon', 'uglify']);
  grunt.registerTask('build', ['copy', 'cssmin', 'jst', 'replace:main', 'requirejs']);
  grunt.registerTask('default', ['init', 'build']);
};
