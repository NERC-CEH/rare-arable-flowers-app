/******************************************************************************
 * Species list sorts.
 *****************************************************************************/
/**
 * A collection of sorting options used to manage lists.
 * id - sort type identifier
 * label - label to represent the filter in the UI
 */
const sorts = {
  taxonomic(a, b) {
    if (a.attributes.general || b.attributes.general){
      return a.attributes.general ? 1 : -1;
    }
    a = parseInt(a.attributes.id);
    b = parseInt(b.attributes.id);
    if (a === b) {
      return 0;
    }
    return a > b ? 1 : -1;
  },
  common(a, b) {
    if (a.attributes.general || b.attributes.general){
      return a.attributes.general ? 1 : -1;
    }
    a = a.attributes.common_name.toLowerCase();
    b = b.attributes.common_name.toLowerCase();

    if (a === b) {
      return 0;
    }
    return a > b ? 1 : -1;
  },
  'common-reverse'(a, b) {
    if (a.attributes.general || b.attributes.general){
      return a.attributes.general ? 1 : -1;
    }
    a = a.attributes.common_name.toLowerCase();
    b = b.attributes.common_name.toLowerCase();

    if (a === b) {
      return 0;
    }
    return a < b ? 1 : -1;
  },
  scientific(a, b) {
    if (a.attributes.general || b.attributes.general){
      return a.attributes.general ? 1 : -1;
    }
    a = a.attributes.taxon.toLowerCase();
    b = b.attributes.taxon.toLowerCase();

    if (a === b) {
      return 0;
    }
    return a > b ? 1 : -1;
  },
  'scientific-reverse'(a, b) {
    if (a.attributes.general || b.attributes.general){
      return a.attributes.general ? 1 : -1;
    }
    a = a.attributes.taxon.toLowerCase();
    b = b.attributes.taxon.toLowerCase();

    if (a === b) {
      return 0;
    }
    return a < b ? 1 : -1;
  },
};

export default sorts;

