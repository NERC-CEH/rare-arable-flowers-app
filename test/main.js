/**
 * App Tests. Loaded in the app by RequireJS.
 */

define(['morel'], function (morel) {
    window.app || (window.app = {});

    var db = {
        init: false,

        initialize: function () {
            if (!this.init) {
                this.recordManager = new morel.Manager(app.CONF.morel);
                this.init = true;
            }
        },

        /**
         * TESTING: storage capabilities
         *
         * @param samplesSize in Mb
         * @param samplesNumber will be Kb each
         */
        run: function (samplesSize, samplesNumber) {
            var that = this;
            samplesSize || (samplesSize = 49); //49Mb
            samplesNumber || (samplesNumber = 1000); //number of records

            //lets make it clean
            this.clear(function (err) {
                if (err) { printError(err); return;}

                //TEST: populate DB by size
                that.add(samplesSize, null, function (err, data) {
                    if (err) { printError(err); return;}

                    that.size(null, function (err, size) {
                        if (err) { printError(err); return;}

                        size = size / 1024;
                        var bias = samplesSize * 21; //happens to be like this on Chrome

                        //should be samplesNumber x1024Kb -+biasKb
                        if (size > (samplesSize * 1000 - bias) &&
                            size < (samplesSize * 1000 + bias)) {
                            console.log('Size: OK (' +
                                samplesSize + ' - ' + (size).toFixed(2) +
                                'Kb +-' + bias +')');
                        } else {
                            console.error('Size: FAILED (' +
                                samplesSize + ' - ' + (size).toFixed(2) +
                                'Kb +-' + bias +')');
                        }

                        //TEST: clean up
                        that.clear(function (err) {
                            if (err) { printError(err); return;}

                            that.size(null, function (err, size) {
                                if (err) { printError(err); return;}

                                size = size / 1024;
                                if (size < 10) {
                                    console.log('Clear: OK (' + (size).toFixed(2) + 'Kb)');
                                } else {
                                    console.error('Clear: FAILED (' + (size).toFixed(2) + 'Kb)');
                                }

                                //TEST: populate DB by number
                                that.add(null, samplesNumber, function (err, data) {
                                    if (err) { printError(err); return;}

                                    that.size(true, function (err, size) {
                                        if (err) { printError(err); return;}

                                        //should be samplesNumber x1000Kb -+biasKb
                                        if (size === samplesNumber) {
                                            console.log('Numbers: OK (' + size + ')');
                                        } else {
                                            console.error('Numbers: FAILED (' + samplesNumber + ' - ' + size + ')');
                                        }

                                        //TEST: clean up
                                        that.clear(function (err) {
                                            if (err) { printError(err); return;}

                                            that.size(null, function (err, size) {
                                                if (err) { printError(err); return;}

                                                size = size / 1024;
                                                if (size < 10) {
                                                    console.log('Clear: OK (' + (size).toFixed(2) + 'Kb)');
                                                } else {
                                                    console.error('Clear: FAILED (' + (size).toFixed(2) + 'Kb)');
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        },

        clear: function (callback) {
            this.init || this.initialize();
            this.recordManager.clear(callback);
        },

        /**
         * Add by size or number of records
         * @param size in Mb
         * @param number of records
         * @param callback
         */
        add: function (size, number, callback) {
            this.init || this.initialize();

            number || (number = size);

            var added = 0,
                sample = null,
                data = size ? this._getMegabyte() : this._getKilobyte();

            for (var i = 0; i < number; i++) {
                sample = new morel.Sample({
                    attributes: {
                        date: morel.formatDate(randomDate(new Date(2012, 0, 1), new Date())),
                        data: data
                    }
                });
                sample.occurrences.add(new morel.Occurrence({
                    attributes: {
                        taxon: 1
                    }
                }));
                this.recordManager.set(sample, function (err, data) {
                    added++;

                    if (added === number) {
                        callback(err, data);
                    }
                })
            }

            function randomDate(start, end) {
                return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            }

        },

        size: function (count, callback) {
            this.init || this.initialize();
            if (count) {
                this.recordManager.storage.getAll(function(err, data){
                    callback (err, data.length);
                });
            } else {
                this.recordManager.storage.size(function(err, size){
                    callback (err, size);
                });
            }
        },

        _getMegabyte: function () {
            var data = '';

            for (var i = 0; i < 1000; i++) {
                data += this._getKilobyte();
            }
            return data;
        },

        _getKilobyte: function () {
            var data = '';

            for (var i = 0; i < 500; i++) {
                var rand =  (Math.random() * 100).toFixed(0);
                rand = rand >= 10 ? rand : (rand + '1');
                data += rand;
            }
            return data;
        }


    };

    var err = function (err) {
            console.error('FAILED (' + err.message + ')');
    };

    app.test = {};
    app.test.db = db;
});