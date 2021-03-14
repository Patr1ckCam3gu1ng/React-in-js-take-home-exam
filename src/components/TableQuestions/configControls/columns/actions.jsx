const actions = {
  internals: {
    calculateWidth: columns => {
      const width = 94 / columns;

      return width;
    },
    calculateColumns: columns => {
      let index = 0;

      let columnArr = [];

      while (index < columns) {
        columnArr.push(index);
        index++;
      }

      return columnArr;
    }
  }
};

module.exports = {
  actions
};
