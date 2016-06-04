/******************************************************************************
 * Species list filters.
 *****************************************************************************/
define([], function () {
    /**
     * A collection of filters used to manage lists.
     * id - filter identifier
     * group - some filters override/work-together. eg. colours, suborder
     * label - label to represent the filter in the UI
     */
    var filters =  {
        favouritesGroup: {
            type: 'checkbox',
            label: 'Favourites',
            filters: {
                favourites: {
                    label: 'My favourites only',
                    run: function (list, filteredList, onSuccess) {
                        var keys = app.models.user.get('favourites');
                        for (var i = 0; i < keys.length; i++) {
                            for (var j = 0; j < list.length; j++) {
                                if (list[j].attributes.id === keys[i]) {
                                    filteredList.push(list[j]);
                                }
                            }
                        }
                        onSuccess(filteredList);
                    }
                }
            }
        },
        typeGroup: {
            type: 'checkbox',
            label: 'Type',

            filters: {
                grass: {
                    label: 'Grasses',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.type === 'G' || list[j].attributes.general) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                },
                flower: {
                    label: 'Flowers',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.type === 'F' || list[j].attributes.general) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                }
            }
        },
        colorGroup: {
            type: 'checkbox',
            label: 'Colour',

            filters: {
                yellow: {
                    label: 'Yellow',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.color.indexOf('y') >= 0) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                },
                purple: {
                    label: 'Purple',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.color.indexOf('pu') >= 0) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                },
                white: {
                    label: 'White',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.color.indexOf('w') >= 0) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                },
                green: {
                    label: 'Green',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.color.indexOf('gf') >= 0) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                },
                blue: {
                    label: 'Blue',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.color.indexOf('b') >= 0) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                },
                orange: {
                    label: 'Orange',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.color.indexOf('o') >= 0) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                },
                red: {
                    label: 'Red',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.color.indexOf('r') >= 0) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                },

                pink: {
                    label: 'Pink',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.color.indexOf('p') >= 0) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                }
            }
        }
    };

    return filters;
});
