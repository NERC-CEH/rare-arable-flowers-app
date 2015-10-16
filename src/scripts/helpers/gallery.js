/******************************************************************************
 * Gallery.
 *****************************************************************************/
define(['photoswipe'], function (PhotoSwipe) {
    "use strict";

    /**
     * Initializes the species gallery.
     */
    var Gallery =  function (species) {
        var images = [],
            img = {},
            gallery = species.get('gallery'),
            gallery_authors = species.get('gallery_authors'),
            profile_pic_author = species.get('profile_pic_author');

        //build image array
        img = image(species.get('profile_pic'), profile_pic_author);
        images.push(img);
        if (gallery){
            img = image(gallery, gallery_authors);
            images.push(img);
        }

        function image (url, author) {
            return {
                url: url,
                caption: 'Ⓒ ' + author
            };
        }

        return PhotoSwipe.attach(images,
            {
                jQueryMobile: true,
                preventSlideshow: true,
                allowUserZoom: true,
                loop: true,
                captionAndToolbarAutoHideDelay: 0,
                enableMouseWheel: true,
                enableKeyboard: true,

                preventHide: false,
                getImageSource: function(obj){
                    return obj.url;
                },
                getImageCaption: function(obj){
                    return obj.caption;
                }
            }
        );
    };

    return Gallery;
});


