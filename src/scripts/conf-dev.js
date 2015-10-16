/******************************************************************************
 * Main app configuration file.
 *****************************************************************************/
define(['morel', 'helpers/log'], function () {
    app = window.app || {};

    app.VERSION = '{APP_VER}'; //replaced on build
    app.NAME = '{APP_NAME}'; //replaced on build

    app.CONF = {
        GPS_ACCURACY_LIMIT: 100,

        //app feature settings
        OFFLINE: {
            STATUS: true,
            APPCACHE_URL: "appcache.html"
        },
        GA: {
            //Google Analytics settings
            STATUS: false,
            ID: 'UA-58378803-3'
        },
        LOGIN: {
            STATUS: true,
            URL: "http://192.171.199.230/irecord7/user/mobile/register",
            TIMEOUT: 80000
        },
        REGISTER: {
            STATUS: true
        },
        STATISTICS: {
            URL: "http://www.brc.ac.uk/irecord/raf-app-summary"
        },
        LIST: {
            DEFAULT_SORT: 'taxonomic'
        },
        MAP: {
            zoom: 5,
            zoomControl: true,
            zoomControlOptions: {
                style: 2,
                position: 5
            },
            panControl: false,
            linksControl: false,
            streetViewControl: false,
            overviewMapControl: false,
            scaleControl: false,
            rotateControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: 1,
                position: 7
            },
            styles: [
                {
                    "featureType": "landscape",
                    "stylers": [
                        {"hue": "#FFA800"},
                        {"saturation": 0},
                        {"lightness": 0},
                        {"gamma": 1}
                    ]
                },
                {
                    "featureType": "road.highway",
                    "stylers": [
                        {"hue": "#53FF00"},
                        {"saturation": -73},
                        {"lightness": 40},
                        {"gamma": 1}
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "stylers": [
                        {"hue": "#FBFF00"},
                        {"saturation": 0},
                        {"lightness": 0},
                        {"gamma": 1}
                    ]
                },
                {
                    "featureType": "road.local",
                    "stylers": [
                        {"hue": "#00FFFD"},
                        {"saturation": 0},
                        {"lightness": 30},
                        {"gamma": 1}
                    ]
                },
                {
                    "featureType": "water",
                    "stylers": [
                        {"saturation": 43},
                        {"lightness": -11},
                        {"hue": "#0088ff"}
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [
                        { "visibility": "off" }
                    ]
                }
            ]
        }
    };

    //logging
    log.CONF = {
        STATE: log.DEBUG,
        GA_ERROR: true //log error using google analytics
    };

    //morel configuration
    app.CONF.morel = {
        url: 'http://192.171.199.230/irecord7/mobile/submit',
        appname: "test",
        appsecret: "mytest",
        website_id: 23,
        survey_id: 258,
        Storage: morel.DatabaseStorage
    };

    $.extend(true, morel.Sample.keys, {
        name: {
            id: 6
        },
        surname: {
            id: 7
        },
        email: {
            id: 8
        },
        location_accuracy: {
            id: 282
        },
        location_name: {
            id: 274
        },
        recorded_all: {
            id: 62
        },
        survey_area: {
            id: 323,
            values: {
                'point': 3068,
                '100m': 3069,
                '1km': 3070
            }
        },
        locationdetails: {
            id: 567,
            values: {
                "Cultivated Strip / Block": 4783,
                "Conservation headland": 4784,
                "Wild bird seed / Game cover": 4785,
                "Wildflower / Clover rich margin": 4786,
                "Grass margin / corner": 4787,
                "Crop": 4788,
                "Stubble": 4789,
                "Track / gateway": 4790,
                "Other": 4791,
                "Grassland": 4792
            }
        }
    });

    var numberRanges = {
        '1': 4774,
        '2-10': 4775,
        '11-100': 4776,
        '101-1000': 4777,
        '1000+': 4778,
        'Present': 4779 //default
    };

    $.extend(true, morel.Occurrence.keys, {
        number: {
            id: 383, values: numberRanges
        },
        stage: {
            id: 384,
            values: {
                'Vegetative': 4780,
                'Flowering': 4781,
                'In Seed': 4782
            }
        },
        taxon: {
            values: {
                1: 878679,
                2: 878680,
                3: 878681,
                4: 878682,
                5: 878683,
                6: 878684,
                7: 878685,
                8: 878686,
                9: 878687,
                10: 878688,
                11: 878689,
                12: 878690,
                13: 878691,
                14: 878692,
                15: 878693,
                16: 878694,
                17: 878695,
                18: 878696,
                19: 878697,
                20: 878698,
                21: 878699,
                22: 878700,
                23: 878701,
                24: 878702,
                25: 878703,
                26: 878704,
                27: 878705,
                28: 878706,
                29: 878707,
                30: 878708,
                31: 878709,
                32: 878710,
                33: 878711,
                34: 878712,
                35: 878713,
                36: 878714,
                37: 878715,
                38: 878716,
                39: 878717,
                40: 878718,
                41: 878719,
                42: 878720,
                43: 878721,
                44: 878722,
                45: 878723,
                46: 878724,
                47: 878725,
                48: 878726,
                49: 878727,
                50: 878728,
                51: 878729,
                52: 878731,
                53: 878730,
                54: 878732,
                55: 878733,
                56: 878734,
                57: 878735,
                58: 878736,
                59: 878737,
                60: 878738,
                61: 878739,
                62: 878740,
                63: 878741,
                64: 878742,
                65: 878743,
                66: 878744,
                67: 878745,
                68: 878746,
                69: 878747,
                70: 878748,
                71: 878749,
                72: 878750,
                73: 878751,
                74: 878752,
                75: 878753,
                76: 878754,
                77: 878755,
                78: 878756,
                79: 878758,
                80: 878757,
                81: 878759,
                82: 878760,
                83: 878761,
                84: 878762,
                85: 878763,
                86: 878764,
                87: 878765,
                88: 878767,
                89: 878766,
                90: 878768,
                91: 878769,
                92: 878770,
                93: 878771,
                94: 878772,
                95: 878773,
                96: 878774,
                97: 878775,
                98: 878776,
                99: 878777,
                100: 878778,
                101: 878779,
                102: 878780,
                103: 878781,
                104: 878782,
                105: 878783,
                106: 878784,
                107: 878785,
                108: 878786,
                109: 878787,
                110: 878788,
                111: 878789,
                112: 878790,
                113: 878791,
                114: 878792,
                115: 878793,
                116: 878794,
                117: 878795,
                118: 878796,
                119: 878797,
                120: 878798,
                121: 878799
            }
        }
    });
});