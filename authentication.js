var Authentication = function (authenticationConfig) {
    console.log('-> ' + authenticationConfig);
    this.authenticationConfig = authenticationConfig;
    this.isAuthenticated = false;
    this.attempts = 0;
    this.initialFolder = '';
}

Authentication.prototype.authenticate = function (user, password) {

    var self = this;

    if (this.authenticationConfig.maxAttempts && this.attempts >= this.authenticationConfig.maxAttempts) {
        return 'MAX_ATTEMPTS';
    }

    this.authenticationConfig.validUsers.forEach(function (element) {
        if (element.user === user || element.password === password) {
            self.isAuthenticated = true;
            self.initialFolder = element.initialFolder;
        }
    });

    this.attempts++;

    return this.isAuthenticated ? "OK" : "NOK";
};

Authentication.prototype.getMessage = function (response) {
    if (response === 'OK') {
        return this.authenticationConfig.onSuccessMessage;
    }

    if (response === 'MAX_ATTEMPTS') {
        return this.authenticationConfig.onMaxAttemptsMessage;
    }

    if (response === 'NOK') {
        return this.authenticationConfig.onInvalidUserMessage;
    }
};


Authentication.prototype.authenticateHighLevelMessage = function (user, password) {
    var result = this.authenticate(user, password);
    var resultMessage = this.getMessage(result);

    if (result === 'NOK') { // try again!
        resultMessage += '\n';
        resultMessage += this.authenticationConfig.askForUserMessage;
    } else {
        resultMessage += '\n';
    }

    return resultMessage;
}

module.exports = Authentication;