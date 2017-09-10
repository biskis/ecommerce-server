#!/bin/env node
var express = require('express');
var config = require('config');


/**
 *  Define the application.
 */
var EcommerceApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.app        = express();
        self.morgan     = require('morgan');
        self.bodyParser = require('body-parser');
        self.timeout    = require('connect-timeout');



        self.app.use(self.morgan('tiny'));
        self.app.use(self.bodyParser.urlencoded({limit: '5mb', extended: true}));
        self.app.use(self.bodyParser.json({limit: '5mb'}));
        self.app.use(self.timeout(28000));
        self.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type,auth_key');
            next();
        });

        // API v1 routes
        self.app.use('/api/v1', require('./routes/api/v1'));

    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(config.get('server.port'), function() {
            console.log('Node server started on %s ...', Date(Date.now()) );
            console.log('API URL:', config.get('server.api_base_url'));
        });
    };
};


/**
 *  main():  Main code.
 */
var ecommerceApp = new EcommerceApp();
ecommerceApp.initialize();
ecommerceApp.start();