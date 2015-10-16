/******************************************************************************
 * Species page view.
 *****************************************************************************/
define([
    'views/_page',
    'helpers/gallery',
    'templates',
    'd3'
], function (Page, Gallery) {
    'use strict';

    var SpeciesPage = Page.extend({
        id: 'species',

        template: app.templates.p_species,

        events: {
            'click #species-profile-fav-button': 'toggleSpeciesFavourite',
            'click #species-map': 'toggleMap',
            'click #species-map-button': 'toggleMap',
            'click #gallery-button': 'showGallery'
        },

        initialize: function () {
            _log('views.SpeciesPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.SpeciesPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));
        },

        update: function (speciesID) {
            scrollTo(0, 0); //needs to go up if the profile has changed

            this.model = app.collections.species.find({id: speciesID});

            var $heading = $('#species_heading');
            $heading.text(this.model.attributes.taxon);

            //append the profile
            var $profile = this.$el.find('#species-profile-placeholder');
            var profileView = new SpeciesProfile({model: this.model});
            $profile.html(profileView.render().el);
            $profile.trigger('create');

            //turn on/off fav button
            var $favButton = $("#species-profile-fav-button");
            if (app.models.user.isFavourite(speciesID)) {
                $favButton.addClass("on");
            } else {
                $favButton.removeClass("on");
            }

            //photos
            this.gallery = null;
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

        startSwipe: function () {
            var that = this,
                WIDTH = $('#species').width(),
                currentImg = 0,
                maxImages = this.model.get('gallery') ? 2 : 1,
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
                if (app.browser.isMobile()) {
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

        appendEventListeners: function () {
            this.appendBackButtonListeners();
        },

        /**
         * Toggles the current species as favourite by saving it into the
         * storage and changing the buttons appearance.
         */
        toggleSpeciesFavourite: function (e) {
            var $favButton = $(e.target);
            $favButton.toggleClass("on");
            var speciesID = this.model.get('id');
            app.models.user.toggleFavouriteSpecies(speciesID);
        },

        /**
         * Shows/hides the distribution map.
         */
        toggleMap: function () {
            $('#species-map').toggle('slow');
        },

        /**
         * Launches the species gallery viewing.
         */
        showGallery: function (id) {
            this.gallery || this._initGallery();

            //prevents id being not number or out of range
            if (id < this.gallery.originalImages.length) {
                this.gallery.show(id);
            } else {
                this.gallery.show(0);
            }
        },

        _initGallery: function () {
            this.gallery = new Gallery(this.model);
        }
    });

    var SpeciesProfile = Backbone.View.extend({
        template: app.templates.species_profile,

        /**
         * Renders the species profile.
         *
         * @returns {SpeciesProfile}
         */
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });

    return SpeciesPage;
});

