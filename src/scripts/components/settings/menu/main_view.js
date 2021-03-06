/** ****************************************************************************
 * Setting Menu main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import Device from '../../../helpers/device';
import JST from '../../../JST';

export default Marionette.ItemView.extend({
  tagName: 'ul',
  className: 'table-view',
  template: JST['settings/menu/main'],

  events: {
    'toggle #use-gridref-btn': 'useGridRef',
    'click #use-gridref-btn': 'useGridRef',
    'toggle #use-gridmap-btn': 'onSettingToggled',
    'click #use-gridmap-btn': 'onSettingToggled',
    'toggle #use-autosync-btn': 'onSettingToggled',
    'click #use-autosync-btn': 'onSettingToggled',

    'click #logout-button': 'logout',
  },

  triggers: {
    'click #delete-all-btn': 'records:delete:all',
    'click #submit-all-btn': 'records:submit:all',
    'click #app-reset-btn': 'app:reset',
  },

  modelEvents: {
    change: 'render',
  },

  logout() {
    this.trigger('user:logout');
  },

  useGridRef(e) {
    this.onSettingToggled(e);

    // toggle the child options
    const appModel = this.options.appModel;
    const useGridRef = appModel.get('useGridRef');
    const $element = $('#use-gridmap-btn-parent');
    $element.toggleClass('disabled', !useGridRef);
  },

  onSettingToggled(e) {
    const setting = $(e.currentTarget).data('setting');
    let active = $(e.currentTarget).hasClass('active');

    if (e.type !== 'toggle' && !Device.isMobile()) {
      // Device.isMobile() android generates both swipe and click

      active = !active; // invert because it takes time to get the class
      $(e.currentTarget).toggleClass('active', active);
    }

    this.trigger('setting:toggled', setting, active);
  },

  serializeData() {
    const appModel = this.options.appModel;
    const userModel = this.model;
    return {
      useGridRef: appModel.get('useGridRef'),
      useGridMap: appModel.get('useGridMap'),
      autosync: appModel.get('autosync'),
      surname: userModel.get('surname'),
      name: userModel.get('name'),
    };
  },
});
