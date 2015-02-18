module.exports = function (grunt) {
  var DEST = 'dist/scripts/';
  var APP_NAME = 'app.js';
  var LIBS_NAME = 'libs.js';
  var DATA_NAME = 'data.js';

  var banner = "/*!\n" +
    " * <%= pkg.title %>. \n" +
    " * Version: <%= pkg.version %>\n" +
    " *\n" + " * <%= pkg.homepage %>\n" +
    " *\n" +
    " * Author <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
    " * Released under the <%= _.pluck(pkg.licenses, 'type').join(', ') %> license.\n" +
    " */\n\n";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      install: {
        options: {
          targetDir: 'src/scripts/libs',
          cleanBowerDir: true
        }
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {src: ['src/index.html'], dest: 'dist/index.html'},
          {src: ['src/css/app.css'], dest: 'dist/css/app.css'},
          {src: ['src/scripts/libs/jquery-mobile/jquery.mobile-1.4.5.css'], dest: 'dist/css/jquery.mobile-1.4.5.css'},
          {src: ['src/scripts/libs/photoswipe/photoswipe.css'], dest: 'dist/css/photoswipe.css'},
          {src: ['src/scripts/libs/photoswipe/icons.png'], dest: 'dist/css/icons.png'},
          {src: ['src/scripts/libs/photoswipe/icons@2x.png'], dest: 'dist/css/icons@2x.png'},
          {src: ['src/images/sample.jpg'], dest: 'dist/images/sample.jpg'},
          {src: ['src/appcache.html'], dest: 'dist/appcache.html'},
          {src: ['src/appcache.mf'], dest: 'dist/appcache.mf'}
        ]
      },
      libs: {
        files: [
          {src: ['src/scripts/libs/jquery/jquery.js'], dest: 'dist/scripts/lib/jquery.js'},
          {src: ['src/scripts/libs/jquery-mobile/jquery.mobile-1.4.5.js'], dest: 'dist/scripts/lib/jquery.mobile-1.4.5.js'},
          {src: ['src/scripts/libs/IndexedDBShim/IndexedDBShim.js'], dest: 'dist/scripts/lib/IndexedDBShim.js'},
          {src: ['src/scripts/libs/latlon/vector3d.js'], dest: 'dist/scripts/lib/vector3d.js'},
          {src: ['src/scripts/libs/latlon/geo.js'], dest: 'dist/scripts/lib/geo.js'},
          {src: ['src/scripts/libs/latlon/latlon-ellipsoid.js'], dest: 'dist/scripts/lib/latlon-ellipsoid.js'},
          {src: ['src/scripts/libs/latlon/osgridref.js'], dest: 'dist/scripts/lib/osgridref.js'},
          {src: ['src/scripts/libs/photoswipe/lib/klass.min.js'], dest: 'dist/scripts/lib/klass.min.js'},
          {src: ['src/scripts/libs/photoswipe/code.photoswipe.jquery-3.0.5.min.js'], dest: 'dist/scripts/lib/code.photoswipe.jquery-3.0.5.min.js'},
          {src: ['src/scripts/libs/fastclick/fastclick.js'], dest: 'dist/scripts/lib/fastclick.js'},
          {src: ['src/scripts/libs/morel/morel.js'], dest: 'dist/scripts/lib/morel.js'},
          {src: ['src/scripts/libs/lodash/lodash.js'], dest: 'dist/scripts/lib/lodash.js'},
          {src: ['src/scripts/libs/backbone/backbone.js'], dest: 'dist/scripts/lib/backbone.js'},
          {src: ['src/scripts/libs/backbone.localstorage/backbone.localStorage.js'], dest: 'dist/scripts/lib/backbone.localStorage.js'}
        ]
      }
    },
    jst: {
      compile: {
        options: {
          namespace: 'app.templates',
         // prettify: true,
          templateSettings: {
            interpolate : /\{\{(.+?)\}\}/g
          },
          processName: function(filepath) {
            return filepath.split('/')[2].split('.')[0];
          }
        },
        files: {
          "dist/scripts/templates.js": ["src/templates/*.tpl"]
        }
      }
    },
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: '\n\n'
      },
      app: {
        options: {
          banner: banner
        },
        // the files to concatenate
        src: [
          'src/scripts/conf.js',
          'src/scripts/views/*.js',
          'src/scripts/models/*.js',
          'src/scripts/routers/*.js',
          'src/scripts/helpers.js',
          'src/scripts/app.js'
        ],
        // the location of the resulting JS file
        dest: DEST + APP_NAME
      },
      data: {
        // the files to concatenate
        src: [
          'src/data/*.js'
        ],
        // the location of the resulting JS file
        dest: DEST + DATA_NAME
      }
    },
    replace: {
      main: {
        src: [DEST + APP_NAME],
        overwrite: true, // overwrite matched source files
        replacements: [{
          from: /(app\.CONF.VERSION =) \'0\';/g, // string replacement
          to: '$1 \'<%= pkg.version %>\';'
        },
          {
            from: /(app\.CONF\.NAME =) \'app\';/g,  // string replacement
            to: '$1 \'<%= pkg.name %>\';'
          }
        ]
      },
      libs: {
        src: [DEST + LIBS_NAME],
        overwrite: true, // Fix klass.js no ';' problem
        replacements: [{
          from: '\/\/ PhotoSwipe',
          to: ';\/\/ photoswipe'
        }
        ]
      }
    },
    uglify: {
      dist: {
        options: {
          // the banner is inserted at the top of the output
          banner: banner
        },
        files: {
          'dist/scripts/app.min.js': ['<%= concat.app.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jst');

  // the default task can be run just by typing "grunt" on the command line
  grunt.registerTask('init', ['bower']);
  grunt.registerTask('build', ['copy', 'jst', 'concat', 'replace']);
  grunt.registerTask('default', ['init', 'build', 'uglify']);
};
