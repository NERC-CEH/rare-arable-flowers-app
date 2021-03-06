/** ****************************************************************************
 * Record Edit main view.
 *****************************************************************************/
import Marionette from 'marionette';
import Morel from 'morel';
import JST from '../../../JST';
import DateHelp from '../../../helpers/date';
import StringHelp from '../../../helpers/string';

export default Marionette.ItemView.extend({
  template: JST['records/edit/record'],

  initialize() {
    const recordModel = this.model.get('recordModel');
    this.listenTo(recordModel, 'request sync error geolocation', this.render);
  },

  serializeData() {
    const recordModel = this.model.get('recordModel');
    const occ = recordModel.occurrences.at(0);
    const specie = occ.get('taxon');

    // taxon
    const locationPrint = recordModel.printLocation();
    const location = recordModel.get('location') || {};

    const number = occ.get('number') && StringHelp.limit(occ.get('number'));

    return {
      id: recordModel.id || recordModel.cid,
      common_name: specie.common_name,
      common_name_significant: specie.common_name_significant,
      isLocating: recordModel.isGPSRunning(),
      isSynchronising: recordModel.getSyncStatus() === Morel.SYNCHRONISING,
      location: locationPrint,
      location_name: location.name,
      date: DateHelp.print(recordModel.get('date')),
      number,
      number_width: occ.get('number_width'),
      number_length: occ.get('number_length'),
      stage: occ.get('stage') && StringHelp.limit(occ.get('stage')),
      habitat: occ.get('habitat') && StringHelp.limit(occ.get('habitat')),
      comment: occ.get('comment') && StringHelp.limit(occ.get('comment')),
    };
  },
});
