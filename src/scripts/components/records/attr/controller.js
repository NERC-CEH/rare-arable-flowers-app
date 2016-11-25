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

const API = {
  show(recordID, attr, newRecord) {
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
      const headerView = new HeaderView({
        onExit() {
          API.onExit(mainView, recordModel, attr);
        },
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
        if (values.date && values.date.toString() !== 'Invalid Date') {
          newVal = values.date;
          recordModel.set('date', newVal);
        }
        break;
      case 'number':
        currentVal = occ.get('number');

        // todo: validate before setting up
        newVal = values.number === 'default' ? null : values.number;
        let newWidthVal = values.number_width <= 0 ? null : values.number_width;
        let newLengthVal = values.number_length <= 0 ? null : values.number_length;

        // XOR
        if (newWidthVal ? !newLengthVal : newLengthVal) {
          if (newWidthVal) {
            newLengthVal = 1;
          } else {
            newWidthVal = 1;
          }
        }

        occ.set('number', newVal);
        occ.set('number_width', newWidthVal);
        occ.set('number_length', newLengthVal);
        break;
      case 'stage':
        currentVal = occ.get('stage');

        // todo:validate before setting up
        // don't save default values
        newVal = values.stage === 'default' ? null : values.stage;
        occ.set('stage', newVal);
        break;
      case 'habitat':
        currentVal = occ.get('habitat');

        // todo:validate before setting up
        // don't save default values
        newVal = values.habitat === 'default' ? null : values.habitat;
        occ.set('habitat', newVal);
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
        window.history.back();
      },
      error: (err) => {
        Log(err, 'e');
        App.regions.dialog.error(err);
      },
    });
  },
};

export { API as default };
