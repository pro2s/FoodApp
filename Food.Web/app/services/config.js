(function() {
    'use strict';
    
    angular
        .module('app')
        .service('Config', Config);
    
    function Config() {
    var _environments = {
    	local: {
    		host: '',
    		config: {
    		    api: 'http://publicfoodapi.azurewebsites.net/',
    		}
    	},
    	dev: {
    		host: 'localhost:52124',
    		config: {
    		    api: 'http://localhost:53058/',
    		}
    	},
    	test: {
    		host: 'pro2s.github.io',
    		config: {
    		    api: 'http://publicfoodapi.azurewebsites.net/',
    		}
    	},
        prod: {
    		host: 'production.com',
    		config: {
    			api: 'http://production.com/',
    		}
    	}
    },
    _environment;

    return {
    	getEnvironment: function(){
    		var host = window.location.host;

    		if(_environment){
    			return _environment;
    		}

    		for(var environment in _environments){
    			if(typeof _environments[environment].host && _environments[environment].host == host){
    				_environment = environment;
    				return _environment;
    			}
    		}

    		return null;
    	},
    	get: function(property){
    		return _environments[this.getEnvironment()].config[property];
    	},
        set: function(property, value){
    		_environments[this.getEnvironment()].config[property] = value;
    	}
    }

    };

})(); 

