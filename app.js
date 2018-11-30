/* global CognitiveServices */
/* global BotChat */
/*-----------------------------------------------------------------------------
A simple Language Understanding (LUIS) bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});



  


// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
var bot = new builder.UniversalBot(connector, function (session, args) {
        session.send('That rash looks serious! I have seen your calendar, should I make an appointment for 8pm at the nearest skin clinic?');
});

bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;


// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

// Add a dialog for each intent that the LUIS app recognizes.
// See https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis 
bot.dialog('BookAppointment',
    (session) => {
        session.send('Okay, I will make a booking!');
        session.endDialog();
    }
).triggerAction({
    matches: 'BookAppointment'
})

bot.dialog('FeelingSick',
    (session) => {
        session.send('I am sorry to hear that, describe the seriousness of your problem please.');
        session.endDialog();
    }
).triggerAction({
    matches: 'FeelingSick'
})
bot.dialog('NeedConsultation',
    (session) => {
        session.send('What kind of advise do you need?');
        session.endDialog();
    }
).triggerAction({
    matches: 'NeedConsultation'
})
bot.dialog('DigestProb',
    (session) => {
        session.send('Oh, what did you have for lunch?');
        session.endDialog();
    }
).triggerAction({
    matches: 'DigestProb'
})
bot.dialog('FoodEaten',
    (session) => {
        session.send('Oh, that is the problem. Just have some antacid and water, you will be good to go!');
        session.endDialog();
    }
).triggerAction({
    matches: 'FoodEaten'
})

bot.dialog('Mild',
    (session) => {
        session.send('Please describe your issue.');
        session.endDialog();
    }
).triggerAction({
    matches: 'Mild'
})

bot.dialog('Rash',
    (session) => {
        session.send('Can I take a look?');
        session.endDialog();
    }
).triggerAction({
    matches: 'Rash'
})


bot.dialog('RashResponse',
    (session) => {
        session.send('I have made a booking with Dr. July Wong. Please reach there on time!');
        
        
        
         var msg = new builder.Message(session)
    .addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            speak: "<s>Your  meeting about \"Adaptive Card design session\"<break strength='weak'/> is starting at 12:30pm</s><s>Do you want to snooze <break strength='weak'/> or do you want to send a late notification to the attendees?</s>",
               body: [
                    {
                        "type": "TextBlock",
                        "text": "Appointment with Dr. July Wong",
                        "size": "large",
                        "weight": "bolder"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Skin Ward, Queen Mary Hospital (10)"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Today, 8:00 PM."
                    }                ]
        }
    });
session.send(msg);
        
        session.endDialog();
    }
).triggerAction({
    matches: 'RashResponse'
})

bot.dialog('Serious',
    (session) => {
        session.send('Immediately tell me how you are feeling?');
        session.endDialog();
    }
).triggerAction({
    matches: 'Serious'
})

bot.dialog('AmbCall',
    (session) => {
        session.send('You have a past record of heart problems. I am calling the ambulance! Take deep breaths meanwhile.');
        session.endDialog();
    }
).triggerAction({
    matches: 'AmbCall'
})


bot.dialog('GreetingDialog',
    (session) => {
        session.send('Hello. I am Baymax. How can I help you?');
        session.endDialog();

    }
).triggerAction({
    matches: 'Greeting'
})

bot.dialog('HelpDialog',
    (session) => {
        session.send('You reached the Help intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Help'
})

bot.dialog('CancelDialog',
    (session) => {
        session.send('You reached the Cancel intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Cancel'
})

