var ConfigModel = function (json) {
    this.config = {},

    this.constructor = function(json) {
        this.config = JSON.parse(json);
    };

    this.constructor(json);
}

module.exports = ConfigModel;
