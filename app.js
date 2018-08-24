
var restify = require('restify');
var builder = require('botbuilder');

var keys = require('./keys.js'); //Remove it, used only to import appId and appPassword

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: keys.appId, //Replace with App Id from your Microsoft bot
    appPassword: keys.appPassword //Replace with App Password from your Microsoft bot
});

const translate = require('google-translate-api');


// Bot Storage: Here we register the state storage for your bot. 
// Default store: volatile in-memory store - Only for prototyping!
// We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
// For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
var inMemoryStorage = new builder.MemoryBotStorage();

// Listen for messages from users 
server.post('/api/messages', connector.listen());
	
//session.send("Welcome to Langur translation bot. I will help you translate your messages from one language to another. Simply select your languages and write me.");


// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
	
    // session.send("You said b: %s", session.message.text);
	
	translate(session.message.text, {from: session.userData.sourceLang, to: session.userData.targetLang}).then(res => {
    // console.log(res.text);
    // console.log(res.from.language.iso);
	
	session.send(res.text);
	
	
}).catch(err => {
    console.error(err);
});
	
	
}).set('storage', inMemoryStorage); // Register in memory storage;

bot.on('conversationUpdate', (message) => {
    if (message.membersAdded) {
        const hello = new builder.Message()
            .address(message.address)
            .text("Welcome to Langur translation bot. I will help you translate your messages from one language to another. Simply select your languages and write me.");
        bot.send(hello);
    }
});

// Add first run dialog
bot.dialog('firstRun', [
    function (session) {
        // Update versio number and start Prompts
        // - The version number needs to be updated first to prevent re-triggering 
        //   the dialog. 
        session.userData.version = 1.0; 
        session.send("Hello, Welcome to Langur. Please choose your language. :)");
		
		session.beginDialog('langMenu'); 
    }
]).triggerAction({
    onFindAction: function (context, callback) {
        // Trigger dialog if the users version field is less than 1.0
        // - When triggered we return a score of 1.1 to ensure the dialog is always triggered.
        var ver = context.userData.version || 0;
        var score = ver < 1.0 ? 1.1: 0.0;
        callback(null, score);
    },
    onInterrupted: function (session, dialogId, dialogArgs, next) {
        // Prevent dialog from being interrupted.
        session.send("Sorry... We need some information from you first.");
    }
});

// Add help dialog
bot.dialog('help', function (session) {
    session.endDialog("Please enter 'language' to set the language again. Please enter 'info' to see which language is being translated. Please enter 'exit' to close the conversation. ");
}).triggerAction({ matches: /^help/i });

// Add help dialog
bot.dialog('info', function (session) {
    session.endDialog("Hi, I am Langur, I can help you translate languages. You are translating " + languageHuman(session.userData.sourceLang)  + " to " + languageHuman(session.userData.targetLang) + ". If you want to talk with my creator, please send an email to: arshadmehmood@facebook.com. Thank you.");
}).triggerAction({ matches: /^info/i });

// Add help dialog
bot.dialog('language', function (session) {
	session.beginDialog('langMenu'); 
}).triggerAction({ matches: /^language/i });

// Add root menu dialog
bot.dialog('langMenu', [
    function (session) {
        builder.Prompts.choice(session, "Choose your Source Language:", 'English|German|Turkish');
    },
    function (session, results) {
		var sourceLang = "en";
        switch (results.response.index) {
            case 0:
                sourceLang = "en";
                break;
            case 1:
                sourceLang = "de";
                break;
            case 2:
                sourceLang = "tr";
                break;
            default:
                session.endDialog();
                break;
        }
		session.userData.sourceLang = sourceLang; 
		session.save();
		
		// session.send("Your source language is set to %s", session.userData.sourceLang);
		builder.Prompts.choice(session, "Now choose your Target Language:", 'English|German|Turkish');
		
    },
	// function (session, results) {
        // builder.Prompts.choice(session, "Now choose your Target Language:", 'English|German|Turkish');
    // },
    function (session, results) {
		var targetLang = "en";
        switch (results.response.index) {
            case 0:
                targetLang = "en";
                break;
            case 1:
                targetLang = "de";
                break;
            case 2:
                targetLang = "tr";
                break;
            default:
                session.endDialog();
                break;
        }
		session.userData.targetLang = targetLang; 
		session.save();
		// session.send("Your target language is set to %s", session.userData.targetLang);
		session.endDialog("Now type anything and I will translate it for you. Type help if you need any help.");
		
    }
]);

function languageHuman(shortlang) { 
	var lang = "English";
	switch (shortlang) {
		  case 'de':
			lang = "German";
			break;
		  case 'tr':
			lang = "Turkish";
			break;
		  case 'en':
			lang = "English";
			break;
		  default:
			lang = "English";
			break;
	}
   return lang; 
} 

// Add help dialog
bot.dialog('exit', function (session) {
	session.endConversation('Thank you for using Langur, See you later.'); 
}).triggerAction({ matches: /^exit/i });

// Add a global endConversation() action that is bound to the 'Goodbye' intent
bot.endConversationAction('goodbyeAction', "Thank you for using Langur, See you later.", { matches: 'Goodbye' });