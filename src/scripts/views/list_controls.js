/******************************************************************************
 * Species list controls view used in ListPage view.
 *****************************************************************************/
define([
    'backbone',
    'models/species_list_sorts',
    'models/species_list_filters',
    'templates'
], function (Backbone, sorts, filters) {
    'use strict';

    var View = Backbone.View.extend({
        tagName: 'div',
        id: 'list-controls-tabs',

        template: app.templates.list_controls,
        template_sort: app.templates.list_controls_sort,
        template_filter: app.templates.list_controls_filter,

        initialize: function (options) {
            options || (options = {});
            this.multi = options.multi;
            this.filtersKey = options.filtersKey || 'filters';
            this.sortKey = options.sortKey || 'sort';
            this.render();
        },

        render: function () {
            this.$el.html(this.template());

            this.renderListSortControls();
            this.renderListFilterControls();
            this.setListControlsListeners();

            this.$listCounter = this.$el.find('#list-controls-counter');
        },

        attributes: function () {
            return {
                "data-role": 'tabs'
            };
        },

        /**
         * Updates the filtered species list counter.
         */
        updateCounter: function ($list) {
            var filtered = $list.children().length,
                total = app.data.species.length;

            this.$listCounter.html(filtered === total ? '' : filtered + '/' + total);
        },

        /**
         * Renders and appends the list sort controls.
         */
        renderListSortControls: function () {
            var keys = Object.keys(sorts);
            for (var i = 0, length = keys.length; i < length; i++) {
                var sort = app.models.user.get(this.sortKey);

                if (keys[i] === sort) {
                    sorts[keys[i]].checked = "checked";
                }
                sorts[keys[i]].multi = this.multi ? "-multi" : "";
            }

            var placeholder = this.$el.find('#list-controls-sort-placeholder');

            placeholder.html(this.template_sort(sorts));
            placeholder.trigger('create');
        },

        /**
         * Renders and appends the list filter controls.
         */
        renderListFilterControls: function () {
            var currentFilters = app.models.user.get(this.filtersKey);

            _.each(filters, function (filterGroup, filterGroupID) {
                _.each(filterGroup.filters, function (filter, filterID) {
                    if (currentFilters[filterGroupID] && currentFilters[filterGroupID].indexOf(filterID) >= 0) {
                        filter.checked = "checked";
                    } else {
                        filter.checked = "";
                    }
                });
            });

            var placeholder = this.$el.find('#list-controls-filter-placeholder');

            placeholder.html(this.template_filter(filters));
            placeholder.trigger('create');
        },

        /**
         * Has to be done once on list creation.
         */
        setListControlsListeners: function () {
            var that = this;
            this.$el.find('.sort').on('change', function () {
                app.models.user.save(that.sortKey, $(this).data('id'));
            });

            this.$el.find('.filter').on('change', function (e) {
                app.models.user.toggleListFilter(this.id, $(this).data('group'), that.multi);
            });
        }
    });

    return View;
});
