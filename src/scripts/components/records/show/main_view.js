/** ****************************************************************************
 * Record Show main view.
 *****************************************************************************/
import Marionette from 'marionette';
import Morel from 'morel';
import JST from '../../../JST';
import DateHelp from '../../../helpers/date';
import StringHelp from '../../../helpers/string';
import Gallery from '../../common/gallery';

export default Marionette.ItemView.extend({
  template: JST['records/show/main'],

  events: {
    'click img': 'photoView',
  },

  photoView(e) {
    e.preventDefault();

    const items = [];
    const recordModel = this.model.get('recordModel');
    recordModel.occurrences.at(0).images.each((image, index) => {
      items.push({
        src: image.getURL(),
        w: image.get('width') || 800,
        h: image.get('height') || 800,
      });
    });

// Initializes and opens PhotoSwipe
    var gallery = new Gallery(items);
    gallery.init();
  },

  serializeData() {
    const recordModel = this.model.get('recordModel');
    const occ = recordModel.occurrences.at(0);
    const specie = occ.get('taxon');

    // taxon
    const scientificName = specie.taxon;
    const commonName = `${specie.common_name} ${specie.common_name_significant}`;

    const syncStatus = recordModel.getSyncStatus();

    const locationPrint = recordModel.printLocation();
    const location = recordModel.get('location') || {};

    const number = occ.get('number') && StringHelp.limit(occ.get('number'));

    return {
      id: occ.cid,
      isSynchronising: syncStatus === Morel.SYNCHRONISING,
      onDatabase: syncStatus === Morel.SYNCED,
      scientificName,
      commonName,
      location: locationPrint,
      location_name: location.name,
      date: DateHelp.print(recordModel.get('date')),
      stage: occ.get('stage') && StringHelp.limit(occ.get('stage')),
      comment: occ.get('comment'),
      number,
      number_width: occ.get('number_width'),
      number_length: occ.get('number_length'),
      habitat: occ.get('habitat') && StringHelp.limit(occ.get('habitat')),
      images: occ.images,
    };
  },
});

