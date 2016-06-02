/** ****************************************************************************
 * Home main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import JST from '../../../JST';
import TouchSwipe from 'touchswipe/js/jquery.touchSwipe.min';
import Gallery from '../../common/gallery';
import Device from '../../../helpers/device';

export default Marionette.ItemView.extend({
  template: JST['species/account/main'],

  events: {
    'click #species-map': 'toggleMap',
    'click #species-map-button': 'toggleMap',
    'click #gallery-button': 'photoView',
    'click .images img': 'photoView',
    'click #record-btn': 'record',
  },

  onShow() {
    // photos
    this.startSwipe();

    //add Map
    var $mapsHolder = $('#maps-holder');
    $mapsHolder.empty();

    $.get("images/country_coastline.svg", function(data) {
      $mapsHolder.append(new XMLSerializer().serializeToString(data.documentElement));
    });
    $.get(this.model.attributes.map, function(data) {
      $mapsHolder.append(new XMLSerializer().serializeToString(data.documentElement));
    });
  },

  startSwipe() {
    var that = this,
        WIDTH = $('#species_gallery').width(),
        currentImg = 0,
        maxImages = this.model.get('illustration') ? 2 : 1,
        speed = 500,
        imgs = null,

        swipeOptions = {
          triggerOnTouchEnd: false,
          swipeStatus: swipeStatus,
          allowPageScroll: "vertical",
          threshold: 75
        };

    var $img = $('#species_gallery .images .img');
    $img.attr('style','width:' + WIDTH);

    var $progressCircles = this.$el.find('.gallery .progress div');

    $(function () {
      imgs = $('#species_gallery .images');
      imgs.width(maxImages * WIDTH);
      imgs.swipe(swipeOptions);

      /**
       * Tap handler for touchswipe does not work on Desktop computers -
       * it is always fired even if we are swiping.
       * Therfore, we disable gallery launch for non touch devices.
       */
      if (Device.isMobile()) {
        imgs.find('img').on('tap', function (e) {
          var id = $(this).data('id');
          that.showGallery(id);
        });
      }
    });


    /**
     * Catch each phase of the swipe.
     * move : we drag the div
     * cancel : we animate back to where we were
     * end : we animate to the next image
     */
    function swipeStatus(event, phase, direction, distance) {
      //If we are moving before swipe, and we are going L or R in X mode, or U or D in Y mode then drag.
      if (phase == "move" && (direction == "left" || direction == "right")) {
        var duration = 0;

        if (direction == "left") {
          scrollImages((WIDTH * currentImg) + distance, duration);
        } else if (direction == "right") {
          scrollImages((WIDTH * currentImg) - distance, duration);
        }

      } else if (phase == "cancel") {
        scrollImages(WIDTH * currentImg, speed);
      } else if (phase == "end") {
        if (direction == "right") {
          previousImage();
        } else if (direction == "left") {
          nextImage();
        }
      }
    }

    function previousImage() {
      currentImg = Math.max(currentImg - 1, 0);
      scrollImages(WIDTH * currentImg, speed);
      updateCircleProgress(currentImg);
    }

    function nextImage() {
      currentImg = Math.min(currentImg + 1, maxImages - 1);
      scrollImages(WIDTH * currentImg, speed);
      updateCircleProgress(currentImg);
    }

    /**
     * Manually update the position of the imgs on drag
     */
    function scrollImages(distance, duration) {
      imgs.css("transition-duration", (duration / 1000).toFixed(1) + "s");

      //inverse the number we set in the css
      var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
      imgs.css("transform", "translate(" + value + "px,0)");
    }

    var updateCircleProgress = function(number) {
      $progressCircles.each(function () {
        if ($(this).data('id') !== number) {
          $(this).removeClass('circle-full');
        } else {
          $(this).addClass('circle-full');
        }
      })
    }
  },

  record() {
    this.trigger('record');
  },

  /**
   * Shows/hides the distribution map.
   */
  toggleMap() {
    this.$el.find('#species-map').toggle('slow');
  },

  /**
   * Launches the species gallery viewing.
   */
  photoView(view, e) {
    const items = [];
    const options = {};

    items.push({
      src: this.model.get('profile_pic'),
      w: 800,
      h: 800,
    });

    if (this.model.get('illustration')) {
      items.push({
        src: this.model.get('illustration'),
        w: 800,
        h: 800,
      });
    }

// Initializes and opens PhotoSwipe
    var gallery = new Gallery(items, options);
    gallery.init();
  },

});
