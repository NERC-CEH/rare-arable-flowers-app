/** ****************************************************************************
 * Species list filters.
 *****************************************************************************/
import appModel from '../../common/models/app_model';

/**
 * A collection of filters used to manage lists.
 * id - filter identifier
 * group - some filters override/work-together. eg. colours, suborder
 * label - label to represent the filter in the UI
 */
const filters = {
  favouritesGroup: {
    favourite(list, filteredList) {
      const favourites = appModel.get('favouriteSpecies');
      for (let i = 0; i < favourites.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (list[j].id === favourites[i]) {
            filteredList.push(list[j]);
          }
        }
      }
    },
  },
  typeGroup: {
    grass(list, filteredList) {
      for (let j = 0; j < list.length; j++) {
        if (list[j].type === 'G' || list[j].general) {
          filteredList.push(list[j]);
        }
      }
    },
    flower(list, filteredList) {
      for (let j = 0; j < list.length; j++) {
        if (list[j].type === 'F' || list[j].general) {
          filteredList.push(list[j]);
        }
      }
    },
  },
  colourGroup: {
    yellow(list, filteredList) {
      for (let j = 0; j < list.length; j++) {
        if (list[j].color.indexOf('y') >= 0) {
          filteredList.push(list[j]);
        }
      }
    },
    purple(list, filteredList) {
      for (let j = 0; j < list.length; j++) {
        if (list[j].color.indexOf('pu') >= 0) {
          filteredList.push(list[j]);
        }
      }
    },
    white(list, filteredList) {
      for (let j = 0; j < list.length; j++) {
        if (list[j].color.indexOf('w') >= 0) {
          filteredList.push(list[j]);
        }
      }
    },
    green(list, filteredList) {
      for (let j = 0; j < list.length; j++) {
        if (list[j].color.indexOf('gf') >= 0) {
          filteredList.push(list[j]);
        }
      }
    },
    blue(list, filteredList) {
      for (let j = 0; j < list.length; j++) {
        if (list[j].color.indexOf('b') >= 0) {
          filteredList.push(list[j]);
        }
      }
    },
    orange(list, filteredList) {
      for (let j = 0; j < list.length; j++) {
        if (list[j].color.indexOf('o') >= 0) {
          filteredList.push(list[j]);
        }
      }
    },
    red(list, filteredList) {
      for (let j = 0; j < list.length; j++) {
        if (list[j].color.indexOf('r') >= 0) {
          filteredList.push(list[j]);
        }
      }
    },
    pink(list, filteredList) {
      for (let j = 0; j < list.length; j++) {
        if (list[j].color.indexOf('p') >= 0) {
          filteredList.push(list[j]);
        }
      }
    },
  },
};

export default filters;
