import Backbone from 'backbone';
import App from '../../../app';
import appModel from '../../common/models/app_model';
import Sample from '../../common/models/sample';
import Occurrence from '../../common/models/occurrence';
import MainView from './main_view';
import HeaderView from './header_view';
import speciesData from 'species.data';

const API = {
  show() {
    const speciesCollection = new Backbone.Collection(speciesData);

    const mainView = new MainView({
      collection: speciesCollection,
      appModel,
    });
    mainView.on('childview:record', (childView) => {
      const speciesModel = childView.model;
      API.record(speciesModel);
    });
    App.regions.main.show(mainView);


    // HEADER
    const headerView = new HeaderView();

    headerView.on('filter', (e) => {
      App.regions.dialog.show({
        title: 'Filter',
        body: `
        <ul class="table-view accordion">
          <li class="table-view-cell">
            <a class="collapsed" data-toggle="collapse" href="#Favourites" aria-controls="Favourites">
              Favourites
            </a>
            <div id="Favourites" class="collapse">
            <ul class="list">
                <li class="item item-checkbox">
                  <label class="checkbox">
                    <input type="checkbox">
                  </label>
                  Flux Capacitor
                </li>
                </ul>
            </div>
          </li>
          <li class="table-view-cell">
            <a class="collapsed" data-toggle="collapse" href="#Type" aria-controls="Type">
              Type
            </a>
            <div id="Type" class="collapse"></div>
          </li>
          <li class="table-view-cell">
            <a class="collapsed" data-toggle="collapse" href="#Colour" aria-controls="Colour">
              Colour
            </a>
            <div id="Colour" class="collapse">
               <ul class="list">
                <li class="item item-checkbox item-small">
                  <label class="checkbox">
                    <input type="checkbox">
                  </label>
                  Flux Capacitor
                </li>

                <li class="item item-checkbox item-small">
                  <label class="checkbox">
                    <input type="checkbox">
                  </label>
                  Flux Capacitor
                </li>

                <li class="item item-checkbox item-small">
                  <label class="checkbox">
                    <input type="checkbox">
                  </label>
                  Flux Capacitor
                </li>

                <li class="item item-checkbox item-small">
                  <label class="checkbox">
                    <input type="checkbox">
                  </label>
                  Flux Capacitor
                </li>

                <li class="item item-checkbox item-small">
                  <label class="checkbox">
                    <input type="checkbox">
                  </label>
                  Flux Capacitor
                </li>

                <li class="item item-checkbox item-small">
                  <label class="checkbox">
                    <input type="checkbox">
                  </label>
                  Flux Capacitor
                </li>

                <li class="item item-checkbox item-small">
                  <label class="checkbox">
                    <input type="checkbox">
                  </label>
                  Flux Capacitor
                </li>

                <li class="item item-checkbox item-small">
                <label class="checkbox">
                  <input type="checkbox">
                </label>
                Flux Capacitor
              </li>
              </ul>
            </div>
          </li>
        </ul>
        `,
      });
    });

    headerView.on('sort', (e) => {
    });

    App.regions.header.show(headerView);

    // FOOTER
    App.regions.footer.hide().empty();
  },

  // record species
  record(speciesModel) {
    // create new record
    const sample = new Sample();
    const occurrence = new Occurrence();
    occurrence.set('taxon', speciesModel.attributes);
    sample.addOccurrence(occurrence);
    sample.save().then(() => {
      sample.startGPS();
      appModel.set('draftRecordID', sample.cid);

      // navigate to record edit
      App.trigger('records:edit', sample.cid);
    });
  },
};

export { API as default };
