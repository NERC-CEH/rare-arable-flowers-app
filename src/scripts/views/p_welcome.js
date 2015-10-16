/******************************************************************************
 * Welcome page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'touchswipe',
    'conf'
], function (DefaultPage, TouchSwipe) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'welcome',

        template: app.templates.p_welcome,

        events: {
            'click #exit-button': 'exit'
        },

        initialize: function () {
            _log('views.WelcomePage: initialize', log.DEBUG);

            this.render();

            this.$swapsContainer = this.$el.find('#swaps-container');

            /**
             * iOS viewport toolbar problem fix:
             * http://nicolas-hoizey.com/2015/02/viewport-height-is-taller-than-the-visible-part-of-the-document-in-some-mobile-browsers.html
             */
            var diff = this.$swapsContainer.height() - window.innerHeight;
            if (app.browser.isIOS() && diff > 10){
                this.$swapsContainer.css('margin-top', -diff);
            }

            this.$progressCircles = this.$el.find('.progress .circle');

           this.startSwipe();
        },

        render: function () {
            _log('views.WelcomePage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));
            return this;
        },

        startSwipe: function () {
            var that = this,
                WIDTH = $(document).width(),
                currentImg = 0,
                maxImages = 3,
                speed = 500,
                imgs = null,

                swipeOptions = {
                    triggerOnTouchEnd: true,
                    swipeStatus: swipeStatus,
                    allowPageScroll: "vertical",
                    threshold: 75
                };

            $(function () {
                imgs = that.$el.find("#swaps");
                imgs.swipe(swipeOptions);
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
                that.updateCircleProgress(currentImg);
            }

            function nextImage() {
                currentImg = Math.min(currentImg + 1, maxImages - 1);
                scrollImages(WIDTH * currentImg, speed);
                that.updateCircleProgress(currentImg);
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
        },

        updateCircleProgress: function(number) {
            this.$progressCircles.each(function () {
                if ($(this).data('id') !== number) {
                    $(this).removeClass('circle-full');
                } else {
                    $(this).addClass('circle-full');
                }
            })
        },

        exit: function () {
            var trips = app.models.user.get('trips');
            trips || (trips = []);
            trips.push('welcome');
            app.models.user.set('trips', trips);
            app.models.user.save();

            Backbone.history.navigate('main', {trigger: true});
        }
    });

    return Page;
});
