# Langur - Language translation chat bot
Langur is a translation chat bot made with [Microsoft Bot Framework](https://dev.botframework.com/) with [Node.js](http://nodejs.org) and a free [Google translate Api](https://github.com/matheuss/google-translate-api). You can read more about it on my [blog](https://arshadmehmood.com/development/langur-language-translation-bot/).

<a href="https://imgur.com/0tg1mAh"><img  style="float: right;" src="https://i.imgur.com/0tg1mAht.png" title="source: imgur.com" /></a> 


### Demo:

Fb Messenger
<a href='https://www.messenger.com/t/2053091328235574'><img src='https://facebook.botframework.com/Content/MessageUs.png'></a>

kik
<a href='https://bots.kik.com/#/langurtranslator'>langurtranslator</a>

Facebook page: 
<a href="https://fb.me/LangurTranslator">fb.me/LangurTranslator</a>

### How it works:
In the beginning, the bot asks you for your source and target language and then it translates whatever you type into it. 



### To run:

> Install dependencies:
```js
npm install
```

> Insert your `appId` and `appPassword`
After installing the dependcies, [create a bot](https://dev.botframework.com/bots/new) on the Microsoft Bot framework. Get the `appId` and the `appPassword`. Replace these values here:

```js

var keys = require('./keys.js'); //Remove it, used only to import appId and appPassword

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: keys.appId, //Replace with App Id from your Microsoft bot
    appPassword: keys.appPassword //Replace with App Password from your Microsoft bot
});

```
Or create a file named: `keys.js` and export these values. 

> Run the app
```js
node app.js
```

![Imgur](https://i.imgur.com/d7MXzlT.png)

> Install Microsoft Bot Emulator 

Download and Install [Microsoft Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases) to run on localhost.

Enter your appId and appPassword and click connect, 

![Imgur](https://i.imgur.com/bTS1Rri.png)



Afterwards, you can interact with the bot like so:

![Imgur](https://i.imgur.com/eF4HWwn.png)



### License

Langur - Language translation chat bot is released under [GNU General Public License v3.0](License.md). Please refer to the LICENSE file for detailed information. 

Copyright: [Arshad Mehmood](https://arshadmehmood.com/)