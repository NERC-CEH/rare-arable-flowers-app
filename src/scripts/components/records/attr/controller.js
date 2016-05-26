/** ****************************************************************************
 * Record Attribute controller.
 *****************************************************************************/
import Backbone from 'backbone';
import Morel from 'morel';
import DateHelp from '../../../helpers/date';
import Log from '../../../helpers/log';
import App from '../../../app';
import appModel from '../../common/models/app_model';
import recordManager from '../../common/record_manager';
import MainView from './main_view';
import HeaderView from '../../common/views/header_view';
import LockView from '../../common/views/attr_lock_view';

const API = {
  show(recordID, attr) {
    Log('Records:Attr:Controller: showing');
    recordManager.get(recordID, (err, recordModel) => {
      if (err) {
        Log(err, 'e');
      }

      // Not found
      if (!recordModel) {
        Log('No record model found.', 'e');
        App.trigger('404:show', { replace: true });
        return;
      }

      // can't edit a saved one - to be removed when record update
      // is possible on the server
      if (recordModel.getSyncStatus() === Morel.SYNCED) {
        App.trigger('records:show', recordID, { replace: true });
        return;
      }

      // MAIN
      const mainView = new MainView({
        attr,
        model: recordModel,
      });
      App.regions.main.show(mainView);

      // HEADER
      const lockView = new LockView({
        model: new Backbone.Model({ appModel, recordModel }),
        attr,
        onLockClick: API.onLockClick,
      });

      const headerView = new HeaderView({
        onExit() {
          API.onExit(mainView, recordModel, attr);
        },
        rightPanel: lockView,
        model: new Backbone.Model({ title: attr }),
      });

      App.regions.header.show(headerView);

      // if exit on selection click
      mainView.on('save', () => {
        API.onExit(mainView, recordModel, attr);
      });

      // FOOTER
      App.regions.footer.hide().empty();
    });
  },

  onLockClick(options) {
    Log('Records:Attr:Controller: lock clicked');
    const attr = options.view.options.attr;
    // invert the lock of the attribute
    // real value will be put on exit
    if (attr === 'number') {
      if (appModel.getAttrLock(attr)) {
        appModel.setAttrLock(attr, !appModel.getAttrLock(attr));
      } else {
        appModel.setAttrLock('number-ranges',
          !appModel.getAttrLock('number-ranges'));
      }
    } else {
      appModel.setAttrLock(attr, !appModel.getAttrLock(attr));
    }
  },

  onExit(mainView, recordModel, attr) {
    Log('Records:Attr:Controller: exiting');
    const values = mainView.getValues();
    API.save(attr, values, recordModel);
  },

  /**
   * Update record with new values
   * @param values
   * @param recordModel
   */
  save(attr, values, recordModel) {
    let currentVal;
    let newVal;
    const occ = recordModel.occurrences.at(0);

    switch (attr) {
      case 'date':
        currentVal = recordModel.get('date');

        // validate before setting up
        if (values.date !== 'Invalid Date') {
          newVal = values.date;
          recordModel.set('date', newVal);
        }
        break;
      case 'number':
        currentVal = occ.get('number');

        // todo: validate before setting up
        if (values.number) {
          // specific number
          newVal = values.number;
          occ.set('number', newVal);
          occ.unset('number-ranges');
        } else {
          // number ranges
          attr = 'number-ranges';
          // don't save default values
          newVal = values['number-ranges'] === 'default' ?
            null : values['number-ranges'];
          occ.set('number-ranges', newVal);
          occ.unset('number');
        }
        break;
      case 'stage':
        currentVal = occ.get('stage');

        // todo:validate before setting up
        // don't save default values
        newVal = values.stage === 'default' ? null : values.stage;
        occ.set('stage', newVal);
        break;
      case 'comment':
        currentVal = occ.get('comment');

        // todo:validate before setting up
        newVal = values.comment;
        occ.set('comment', newVal);
        break;
      default:
    }

    // save it
    recordModel.save(null, {
      success: () => {
        // update locked value if attr is locked
        API.updateLock(attr, newVal, currentVal);

        window.history.back();
      },
      error: (err) => {
        Log(err, 'e');
        App.regions.dialog.error('Problem saving the sample.');
      },
    });
  },

  updateLock(attr, newVal, currentVal) {
    let lockedValue = appModel.getAttrLock(attr);

    switch (attr) {
      case 'date':
        if (lockedValue && DateHelp.print(newVal) === DateHelp.print(new Date())) {
          appModel.setAttrLock(attr, null);
        }
        break;
      case 'number-ranges':
        if (!lockedValue) {
          lockedValue = appModel.getAttrLock('number');
        }
      case 'number':
        if (!lockedValue) {
          lockedValue = appModel.getAttrLock('number-ranges');
        }

        if (!lockedValue) return; // nothing was locked

        if (attr === 'number-ranges') {
          appModel.setAttrLock(attr, newVal);
          appModel.setAttrLock('number', null);
        } else {
          appModel.setAttrLock(attr, newVal);
          appModel.setAttrLock('number-ranges', null);
        }
        break;
      default:
        if (lockedValue && (lockedValue === true || lockedValue === currentVal)) {
          appModel.setAttrLock(attr, newVal);
        }
    }
  },
};

export { API as default };
