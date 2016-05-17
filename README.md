# Homebridge-Efergy
homebridge-plugin for [EnergyHive](https://www.energyhive.com/) / [Efergy Engage](https://engage.efergy.com/).

#Installation
Follow the instruction in [NPM](https://www.npmjs.com/package/homebridge) for the homebridge server installation. The plugin is not jet published through [NPM](https://www.npmjs.com/package/homebridge-efergy) and should be installed "globally" by typing:

    sudo npm install -g homebridge-efergy

#Configuration

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

# To Do
- remove the name "Power Functions" from source code to keep frontend clean?
- load historic data into Eve.app. Requires some additional digging: [Historic data 1](https://github.com/KhaosT/HAP-NodeJS/issues/140) [Historic data 2](https://gist.github.com/0ff/668f4b7753c80ad7b60b) [Eve Serv/Char](https://gist.github.com/gomfunkel/b1a046d729757120907c)
- add battery status for "Meter-Box-Device"

