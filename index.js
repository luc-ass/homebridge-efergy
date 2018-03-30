var request = require("request");
var inherits = require('util').inherits;
var Service, Characteristic;
var moment = require('moment');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-efergy", "Efergy", Efergy);
  var FakeGatoHistoryService = require('fakegato-history')(homebridge);
  //Fakegato-history masquerading as Eve Energy.
  //Stores history on local filesystem of homebridge appliance
  var loggingService = new FakeGatoHistoryService("energy", this, {
    storage:'fs'
  });

  function Efergy(log, config) {
    // configuration
    this.token = config['token'];
    this.name = config['name'];
    this.offset = config['offset'] || 0;
    this.period = config['period'] || "day";

    this.log = log;

    this.kWh_url = "http://www.energyhive.com/mobile_proxy/getEnergy?token=" + this.token + "&period=" + this.period + "&offset=" + this.offset;
    this.W_url = "http://www.energyhive.com/mobile_proxy/getCurrentValuesSummary?token=" + this.token;
  }

  // Custom Characteristics and service...
  Efergy.PowerConsumption = function() {
    Characteristic.call(this, 'Watts', 'E863F10D-079E-48FF-8F27-9C2605A29F52');
    this.setProps({
      format: Characteristic.Formats.FLOAT,
      maxValue: 999999999,
      minValue: 1,
      minStep: 0.001,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };
  inherits(Efergy.PowerConsumption, Characteristic);

  Efergy.TotalConsumption = function() {
    Characteristic.call(this, 'kWh', 'E863F10C-079E-48FF-8F27-9C2605A29F52');
    this.setProps({
      format: Characteristic.Formats.FLOAT,
      maxValue: 999999999,
      minValue: 1,
      minStep: 0.001,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };
  inherits(Efergy.TotalConsumption, Characteristic);

  Efergy.PowerService = function(displayName, subtype) {
    Service.call(this, displayName, '00000001-0000-1000-8000-135D67EC4377', subtype);
    this.addCharacteristic(Efergy.PowerConsumption);
    this.addCharacteristic(Efergy.TotalConsumption);
  };
  inherits(Efergy.PowerService, Service);

  Efergy.prototype = {

    httpRequest: function(url, method, callback) {
      request({
        url: url,
        method: method
      },
      function (error, response, body) {
        callback(error, response, body)
      })
    },

    getConsumption: function(callback) {
      this.httpRequest(this.W_url, 'get', function(error, response, body) {
        if (error) {
          this.log('HTTP function failed: %s', error);
          callback(error);
        }
        else {
          // stupidly complex because of the way the
          // json is formated by the server...
          var json = JSON.parse(body);
          var obj = json[0].data[0];
          var key = Object.keys(obj)[0];
          var data = obj[key];
          this.log('Read Total Conumption:', data, 'W');
          loggingService.addEntry({
            time: moment().unix(),
            power: data
          });
          callback(null, data);
        }
      }.bind(this))
    },

    getTotalConsumption: function(callback) {
      this.httpRequest(this.kWh_url, 'get', function(error, response, body) {
        if (error) {
          this.log('HTTP function failed: %s', error);
          callback(error);
        }
        else {
          var json = JSON.parse(body);
          var kWh = parseFloat(json['sum']);
          this.log('Read Total Consumption:', kWh, 'kWh today');
          callback(null, kWh);
        }
      }.bind(this))
    },

    getServices: function() {
      var that = this;

      var informationService = new Service.AccessoryInformation();
      informationService
      .setCharacteristic(Characteristic.Name, this.name)
      .setCharacteristic(Characteristic.Manufacturer, "Efergy")
      .setCharacteristic(Characteristic.Model, "Unknown")
      .setCharacteristic(Characteristic.SerialNumber, "1234567890");

      var myPowerService = new Efergy.PowerService("Efergy");
      myPowerService
      .getCharacteristic(Efergy.PowerConsumption)
      .on('get', this.getConsumption.bind(this));
      myPowerService
      .getCharacteristic(Efergy.TotalConsumption)
      .on('get', this.getTotalConsumption.bind(this));

      return [informationService, myPowerService, loggingService];
    }
  }
}
