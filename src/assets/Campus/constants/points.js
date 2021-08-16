export var Points = {
  getPointEvent: function (event = undefined) {
    /**
     * Since point events will be stored as constants and are
     * liable to be updated during the session of the app. They
     * will have to be called by a function which will get the
     * information dynamically.
     *
     * Point events will be stored in this constant with an
     * underscore in front of them. I.e., _somePoint
     *
     * @returns {points, response, criteria, name}
     */
    var returnObject = {
      points: undefined,
      response: undefined,
      criteria: undefined,
      name: undefined,
    };
    console.log('Getting', this[`_${event}`]);

    if (event === undefined || this[`_${event}`] === undefined)
      return returnObject;
    else return {...returnObject, ...this[`_${event}`]};
  },
  setPointEvent: function ({name, points, key, criteria}) {
    /**
     * Call this function to store the point event as per the format.
     * The function will store the point event with an underscore
     * in front to distinguish it from any pre-declared variables
     * */
    this[`_${key}`] = {name, points, key, criteria};
  },
};
