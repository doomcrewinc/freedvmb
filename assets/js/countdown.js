let countDownTimer = (function($) {
    // Private Scope
    let interval = null;
    let targetElement = undefined;
    let targetDate = undefined;
    let targetMet = '';
    let glue = ' ';
    let minute = 60;
    let hour = minute * 60;
    let day = hour * 24;
    let month = day * 30;

    // Public Scope
    return {
        /**
         * Sets options:
         *  - targetDate
         *  - targetElement
         *  - targetMet
         *  - glue
         * @param opts
         * @return this
         */
        init: function(opts) {
            if ($.isEmptyObject(opts)) {
                console.warn('Empty Init Call');
                return this;
            }
            if (opts.hasOwnProperty('targetDate')) {
                this.setTargetDate(opts.targetDate)
            }
            if (opts.hasOwnProperty('targetElement')) {
                this.setTargetElement(opts.targetElement);
            }
            if (opts.hasOwnProperty('targetMet')) {
                this.setTargetMet(opts.targetMet)
            }
            if (opts.hasOwnProperty('glue')) {
                this.setGlue(opts.glue);
            }

            return this;
        },
        start: function() {
            this.calculate();
        },
        stop: function() {
            clearInterval(this.interval);
        },
        /**
         * Sets our interval, calculates time.
         * Can override default behavior of print if delta <= 0 with a callback function;
         * @param callback
         */
        calculate: function(callback) {
            this.interval = setInterval(function(counter) {
                let date = counter.getTargetDate();
                let delta = date.getTime() - new Date().getTime();

                if (delta <= 0) {
                    if (callback && typeof callback === 'function') {
                        callback();
                    } else {
                        counter.print(0, 0, 0, 0);
                    }
                } else {
                    let minutes = counter.getMinutes(delta);
                    let seconds = counter.getSeconds(delta);
                    let hours = counter.getHours(delta);
                    let days = counter.getDays(delta);

                    counter.print(seconds, minutes, hours, days);
                }
            }, 1000, this);
        },
        print: function(seconds, minutes, hours, days) {
            if (this.targetElement === undefined) {
                this.error('No element designated to attach timer to.');
            }
            if (this.targetDate === undefined) {
                this.error('No date designated.');
            }

            let html = '<div>' + [
                '<div class="counter-days"> ' + days + '<sup>days</sup> </div>',
                '<div class="counter-hours"> ' + hours + '<sup>hours</sup> </div>',
                '<div class="counter-minutes"> ' + minutes + '<sup>mins</sup> </div>',
                '<div class="counter-seconds"> ' + seconds + '<sup>secs</sup> </div>'
            ].join(this.glue) + '</div>';

            this.targetElement.html(html);
        },
        error: function(message) {
            console.error(message);
        },

        // Setters
        setTargetDate: function(date) {
            if (isNaN(Date.parse(date))) {
                this.error('Could not parse date ' + date + ' to Date.');
            }

            this.targetDate = new Date(date);
        },
        setTargetElement: function(element) {
            this.targetElement = $(element);
        },
        setGlue: function(glue) {
            this.glue = glue;
        },
        setTargetMet: function(message) {
            this.targetMet = message;
        },

        // Getters
        getTargetDate: function() {
            return this.targetDate;
        },
        getTargetElement: function() {
            return this.targetElement;
        },

        // Time Related Getters
        getSeconds: function(delta) {
            return Math.floor(
                (delta % (1000 * minute)) / 1000
            );
        },
        getMinutes: function(delta) {
            return Math.floor(
                (delta % (1000 * hour) / (1000 * minute))
            );
        },
        getHours: function(delta) {
            return Math.floor(
                (delta % (1000 * day) / (1000 * hour))
            );
        },
        getDays: function(delta) {
            return Math.floor(delta / (1000 * day));
        }
    }
})(jQuery);