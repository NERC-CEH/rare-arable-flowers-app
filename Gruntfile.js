module.exports = function (grunt) {
  var DEST = 'dist/scripts/';
  var APP_NAME = 'app.js';
  var LIBS_NAME = 'libs.js';

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
          {src: ['src/pages/index.html'], dest: 'dist/index.html'},
          {src: ['src/css/app.css'], dest: 'dist/css/app.css'},
          {src: ['src/scripts/libs/jquery-mobile/jquery.mobile-1.4.5.css'], dest: 'dist/css/jquery.mobile-1.4.5.css'},
          {src: ['src/scripts/libs/photoswipe/photoswipe.css'], dest: 'dist/css/photoswipe.css'},
          {src: ['src/scripts/libs/photoswipe/icons.png'], dest: 'dist/css/icons.png'},
          {src: ['src/scripts/libs/photoswipe/icons@2x.png'], dest: 'dist/css/icons@2x.png'},
          {src: ['src/data/species.json'], dest: 'dist/data/species.json'},
          {src: ['src/data/abundance.json'], dest: 'dist/data/abundance.json'},
          {src: ['src/data/flight.json'], dest: 'dist/data/flight.json'}
        ]
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
          'src/scripts/app/*.js',
          'src/conf.js',
          'src/scripts/app.js'
        ],
        // the location of the resulting JS file
        dest: DEST + APP_NAME
      },
      libs: {
        // the files to concatenate
        src: [
          'src/scripts/libs/jquery/jquery.js',
          'src/scripts/libs/jquery-mobile/jquery.mobile-1.4.5.js',
          'src/scripts/libs/IndexedDBShim/IndexedDBShim.js',
          'src/scripts/libs/latlon/vector3d.js',
          'src/scripts/libs/latlon/geo.js',
          'src/scripts/libs/latlon/latlon-ellipsoid.js',
          'src/scripts/libs/latlon/osgridref.js',
          'src/scripts/libs/handlebars/handlebars.js',
          'src/scripts/libs/photoswipe/lib/klass.min.js',
          'src/scripts/libs/photoswipe/code.photoswipe.jquery-3.0.5.min.js',
          'src/scripts/libs/morel/morel.js'
        ],
        // the location of the resulting JS file
        dest: DEST + LIBS_NAME
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

  // the default task can be run just by typing "grunt" on the command line
  grunt.registerTask('init', ['bower']);
  grunt.registerTask('build', ['copy', 'concat', 'replace', 'uglify']);
  grunt.registerTask('default', ['init', 'build']);
};
