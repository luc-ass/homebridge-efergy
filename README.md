# Homebridge-Efergy
homebridge-plugin for [EnergyHive](https://www.energyhive.com/) / [Efergy Engage](https://engage.efergy.com/).

## Installation
Follow the instruction in [NPM](https://www.npmjs.com/package/homebridge) for the homebridge server installation. The plugin is published through [NPM](https://www.npmjs.com/package/homebridge-efergy):

    sudo npm install homebridge-efergy

## Configuration

Example:
    

    {
        "accessory": "Efergy",
        "name": "Efergy",
        "token": "abcdefghijklmnopqrstuvwxyz123456789",
        "offset" : "-60"
        "period": "day",
    }

- Token: can be generated if you log into your EngergyHive-/Engage-Account and navigate to Settings > App tokens
- Offset: Your GMT-Offset (for example -60 for Berlin).
- Period: Accepts the following values: minute, hour, day, week, month, year
- Offset and period are optional. They fall back to 0/day.

## To Do
- add battery status for "Meter-Box-Device"

## Change Log
### 0.1.0
 - Added fakegato-history (thank you mylesgray)
