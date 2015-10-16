/******************************************************************************
 * List view of the species used in Record Multi List view.
 *****************************************************************************/
define([
    'backbone',
    'models/species_list_sorts',
    'models/species_list_filters',
    'templates'
], function (Backbone, sorts, filters) {
    'use strict';

    var View = Backbone.View.extend({
        tagName: 'ul',

        attributes: {
            'data-role': 'listview',
            'class': 'listview-full'
        },

        /**
         * Initializes the species list view.
         */
        initialize: function () {
            _log('views.RecordMultiList: initialize', log.DEBUG);

            this.listenTo(this.collection, 'change', this.update);
            this.listenTo(app.models.user, 'change:filtersMulti',  this.update);
            this.listenTo(app.models.user, 'change:sortMulti',  this.update);
        },

        /**
         * Renders the species list.
         * @returns {SpeciesListView}
         */
        render: function (callback) {
            _log('views.RecordMultiList: render ', log.DEBUG);

            var that = this;
            this.prepareList(function (list){
                var container = document.createDocumentFragment(); //optimising the performance

                _.each(list, function (specie) {
                    var listSpeciesView = new RecordMultiListItemView({model: specie});

                    container.appendChild(listSpeciesView.render().el);
                });

                that.$el.html(container); //appends to DOM only once

                //attach listeners
                that.$el.find('.record-multi-list-item-img').on('click', function (e) {
                    //stop propagation of jqm link
                    e.stopPropagation();
                    e.preventDefault();

                    Backbone.history.navigate('species/' + $(this).data('id'), {trigger: true});
                });

                that.$el.find('.record-multi-list-item').on('click', function (e) {
                    //stop propagation of jqm link
                    e.stopPropagation();
                    e.preventDefault();

                    var speciesID = $(this).data('id'),
                        specie = app.collections.species.find({id: speciesID});

                    var occurrence = new morel.Occurrence({
                            attributes: {
                                'taxon': speciesID,
                                'adult': 'Present'
                            }
                        });

                    app.models.sampleMulti.occurrences.add(occurrence);
                    Backbone.history.history.back();
                });


                if (callback){
                    callback(that.$el);
                }
            });

            return this;
        },

        update: function () {
            _log('views.RecordMultiList: updating', log.DEBUG);

            this.render(function($el){
                $el.listview().listview('refresh');
            });
        },

        /**
         * Prepares the species list - filters, sorts.
         */
        prepareList: function (callback) {
            var filtersToApply = _.cloneDeep(app.models.user.get('filtersMulti'));
            var sort = app.models.user.get('sortMulti');
            var list = this.collection.models.slice(); //shallow copy of array
            this.prepareListCore(list, sort, filtersToApply, callback);
        },

        /**
         * Prepares the species list. Core functionality.
         *
         * @param list
         * @param sort
         * @param filters
         */
        prepareListCore: function (list, sort, filtersToApply, callback) {
            var that = this;
            //filter list
            var filterGroups = Object.keys(filtersToApply);
            if (filterGroups.length > 0) {
                var filterGroupID = filterGroups[0];
                var filterGroup = filtersToApply[filterGroupID];
                if (filterGroup.length > 0) {
                    var onFilterGroupSuccess = function (species) {
                        delete filtersToApply[filterGroup];
                        that.prepareListCore(species, sort, filtersToApply, callback);
                        return;
                    };

                    this.filterGroupCore(list, [], filterGroup, filterGroupID, onFilterGroupSuccess);
                    return;
                } else {
                    delete filtersToApply[filterGroupID];
                    that.prepareListCore(list, sort, filtersToApply, callback);
                    return;
                }
            }

            function onSortSuccess() {
                if (callback) {
                    callback(list);
                }
            }

            sorts[sort].sort(list, onSortSuccess, true);
        },

        /**
         * Iterates through the grouped filters applying them to the list.
         *
         * @param list
         * @param filteredList
         * @param filterGroup filters to apply
         * @param filterGroupID
         * @param callback
         */
        filterGroupCore: function (list, filteredList, filterGroup, filterGroupID, callback) {
            if (filterGroup.length > 0) {
                var filterID = filterGroup.pop();
                var filter = filters[filterGroupID].filters[filterID];
                var that = this;

                var onSuccess = function (filteredList) {
                    var uniqueFilteredList = _.uniq(filteredList);
                    that.filterGroupCore(list, uniqueFilteredList, filterGroup, filterGroupID, callback);
                };
                filter.run(list, filteredList, onSuccess, true);

            } else {
                callback(filteredList);
            }
        },

        /**
         * Returns the roup of the filterID.
         *
         * @param filter
         * @returns {Array}
         */
        getFilterCurrentGroup: function (filterID) {
            //iterate all filter groups
            var group = null;
            _.each(filters, function (groupFilters, groupID) {
                //and filters
                _.each(groupFilters.filters, function (_filter, _filterID) {
                    if(_filterID === filterID) {
                        group = groupID;
                    }
                });
            });

            return group;
        }
    });

    var RecordMultiListItemView = Backbone.View.extend({
        tagName: "li",

        attributes: {
            "data-corners": false,
            "data-shadow": false,
            "data-iconshadow": true,
            "data-wrapperels": "div",
            "data-icon": "arrow-r",
            "data-iconpos": "right",
            "data-theme": "c"
        },

        template: app.templates.record_multi_list_item,

        /**
         * Renders the individual list item representing the species.
         *
         * @returns {SpeciesListItemView}
         */
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });

    return View;
});
