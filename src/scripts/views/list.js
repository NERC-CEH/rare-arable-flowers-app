/******************************************************************************
 * Species list view used in ListPage view.
 *****************************************************************************/
define([
    'backbone',
    'models/species_list_sorts',
    'models/species_list_filters',
    'helpers/gallery',
    'templates'
], function (Backbone, sorts, filters, Gallery) {
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
        initialize: function (options) {
            _log('views.SpeciesList: initialize', log.DEBUG);
            this.onRender = options.onRender;

            this.listenTo(this.collection, 'change', this.update);
            this.listenTo(app.models.user, 'change:filters',  this.update);
            this.listenTo(app.models.user, 'change:sort',  this.update);
        },

        /**
         * Renders the species list.
         * @returns {SpeciesListView}
         */
        render: function (callback) {
            _log('views.SpeciesList: render', log.DEBUG);

            var that = this;
            this.prepareList(function (list){
                var container = document.createDocumentFragment(); //optimising the performance

                _.each(list, function (specie) {
                    var listSpeciesView = new SpeciesListItemView({model: specie});
                    container.appendChild(listSpeciesView.render().el);
                });

                that.$el.html(container); //appends to DOM only once

                if (callback){
                    callback(that.$el);
                }
            });

            return this;
        },

        update: function () {
            _log('list: updating', log.DEBUG);
            var that = this;

            this.render(function($el){
                $el.listview('refresh');
                that.onRender($el);
            });
        },

        /**
         * Prepares the species list - filters, sorts.
         */
        prepareList: function (callback) {
            var filtersToApply = _.cloneDeep(app.models.user.get('filters'));
            var sort = app.models.user.get('sort');
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
            //todo: might need to move UI functionality to higher grounds
            $.mobile.loading("show");

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
                //todo: might need to move UI functionality to higher grounds
                $.mobile.loading("hide");
                if (callback) {
                    callback(list);
                }
            }

            sorts[sort].sort(list, onSortSuccess);
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
                filter.run(list, filteredList, onSuccess);

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

    var SpeciesListItemView = Backbone.View.extend({
        tagName: "li",

        template: app.templates.list_item,

        events: {
            'click img': 'showGallery'
        },

        /**
         * Renders the individual list item representing the species.
         *
         * @returns {SpeciesListItemView}
         */
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },

        showGallery: function (e) {
            (new Gallery(this.model)).show(0);
            e.preventDefault();
        }
    });

    return View;
});
