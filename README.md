# Homebridge-Efergy
homebridge-plugin for Efergy Engage.

#Installation
Follow the instruction in [NPM](https://www.npmjs.com/package/homebridge) for the homebridge server installation. The plugin is not jet published through [NPM](https://www.npmjs.com/package/homebridge-denon) and should be installed "globally" by typing:

~~sudo npm install -g homebridge-denon~~
    
    sudo npm install -g https://github.com/luc-ass/homebridge-efergy/

#Configuration

config.json

Example:
    
    {
      "bridge": {
          "name": "Homebridge",
          "username": "CC:22:3D:E3:CE:51",
          "port": 51826,
          "pin": "031-45-154"
      },
      "description": "This is an example configuration file for homebridge denon plugin",
      "hint": "Always paste into jsonlint.com validation page before starting your homebridge, saves a lot of frustration",
      "accessories": [
          {
              "accessory": "Efergy",
              "name": "Efergy",
              "token": "abcdefghijklmnopqrstuvwxyz123456789",
              "offset" : "-60"
              "period": "day",
          }
      ]
    }

Offset and period are optional. They fall back to 0/day.
Offset is your GMT-Offset (for example -60 for Berlin).
Period accepts the following values: minute/hour/day/week/month/year

###todo
- load historic data into Eve.app. Requires some additional digging

