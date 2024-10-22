require('dotenv').config();

const { App, contextBuiltinKeys } = require('@slack/bolt');
import * as newMemberJoin from "./features/memberJoin"
import * as appMention from "./features/appMention"

console.log(
    '----------------------------------\nSamwise Smallburrow Server\n----------------------------------\n'
)
console.log('🏗️  Starting Samwise Smallburrow...')
console.log('📦 Loading Slack App...')
console.log('🔑 Loading environment variables...')

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
    port: process.env.PORT || 3000
});

(async () => {
    console.log('⚡️ Bolt app is starting up!');
  // Start your app
    await app.start();

    console.log('⚡️ Bolt app is running!');
})();

console.log(
    '\n\n----------------------------------\n'
)
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const commands = async () => {
    app.command("/wl", async ({
        command,
        ack
    }) => {
        console.log(command)
        await ack()
    
        channel_id = command.channel_id
        user_id = command.user_id
        const sendMessageMessage = {
            "text": "Hi!",
            "blocks": [
                {
                    "type": "modal",
                    "submit": {
                        "type": "plain_text",
                        "text": "Submit",
                        "emoji": true
                    },
                    "close": {
                        "type": "plain_text",
                        "text": "Cancel",
                        "emoji": true
                    },
                    "title": {
                        "type": "plain_text",
                        "text": "Samwise Message Service",
                        "emoji": true
                    },
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "plain_text",
                                "text": `:wave: Greetings <@${user_id}>!\nI hear that you want me to deliver a message for you!`,
                                "emoji": true
                            }
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "input",
                            "label": {
                                "type": "plain_text",
                                "text": "Whom would you like to send it to?",
                                "emoji": true
                            },
                            "element": {
                                "type": "plain_text_input",
                                "multiline": false
                            }
                        },
                        {
                            "type": "input",
                            "label": {
                                "type": "plain_text",
                                "text": "What is your message?",
                                "emoji": true
                            },
                            "element": {
                                "type": "plain_text_input",
                                "multiline": true
                            }
                        }
                    ]
                }
            ]
        }
        
    
        await app.client.chat.postEphemeral({
            token: process.env.SLACK_BOT_TOKEN,
            channel: channel_id,
            user: user_id,
            text: "hi! why did you run a command?"
        });
        return sendMessageMessage;
    });
}

const hello = async () => {
    // Listens to incoming messages that contain "hello"
    app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
        console.log(`👏 ${message.user} said hi`)
        await say({text:`Hey there <@${message.user}>! Thanks for saying hi!`,thread_ts: message.thread_ts || message.ts});
    });
}
hello()
newMemberJoin()
appMention()
commands()