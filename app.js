require('dotenv').config();

const { App, contextBuiltinKeys } = require('@slack/bolt');

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

console.log(
    '\n\n----------------------------------\n'
)
const sendMessageMessage = {
    "type": "modal",
    "title": {
        "type": "plain_text",
        "text": "My App",
        "emoji": true
    },
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
    "blocks": [
        {
            "type": "section",
            "text": {
                "type": "plain_text",
                "text": ":wave: Greetings guest!\nI hear that you want me to deliver a message for you!",
                "emoji": true
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Whom would you like to send it to?"
            },
            "accessory": {
                "type": "users_select",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Select a user",
                    "emoji": true
                },
                "action_id": "users_select-action"
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
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": " "
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": " "
            },
            "accessory": {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Send message",
                    "emoji": true
                },
                "value": "submit_message_form",
                "action_id": "submit-message-action"
            }
        }
    ]
}
function registerModalSubmissionHandler() {
    this.app.view(
        sendMessageMessage,
        /* async ({ ack, body, view, client, respond }) => {

            if (
                view['state']['values'][DATE_PICKER_BLOCK][
                ACTION_DATE_PICKER_SELECTION
                ]['selected_date'] != null
            ) {
                await ack({
                    response_action: 'clear',
                });
                const value =
                    view['state']['values'][DATE_PICKER_BLOCK][
                    ACTION_DATE_PICKER_SELECTION
                    ]['selected_date'];
                const metadata = JSON.parse(body.view.private_metadata);
                client.chat.postMessage({
                    channel: metadata.channelId,
                    text: `:date:  <@${body.user.id}> updated the close date to ${value}`,
                    thread_ts: metadata.message_ts,
                });
            }
            else {
                let errors = {}
                errors[DATE_PICKER_BLOCK] = "something wrong!"
                await ack({
                    response_action: 'errors',
                    errors
                });
            }
        }, */
    );
}
app.command("/wl", async ({ ack, body, client, command }) => {
    
    /* await client.chat.postMessage({
        channel: command.channel_id,
		blocks: sendMessageMessage.blocks,
		text: sendMessageMessage.text,
    })
    console.log(`Command Run`);

    const thread_ts = await app.client.conversations
            .history({
                channel: command.channel,
                limit: 1,
            })
            .then((res) => res.messages?.[0].ts)
    app.action('submit-message-action', async ({ ack, body, client, action }) => {

        await ack()
        await client.chat.delete({
            channel: action.channel_id,
            ts: thread_ts,
        })
    
    }) */
    registerModalSubmissionHandler
});
/* app.view("modal_view_callback_id", async ({ ack, body, view }) => {
    await ack();
    const inputValue = view.state.values.input_block.input_action.value;
    // Do something with the input value
}); */

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

(async () => {
    console.log('⚡️ Bolt app is starting up!');
  // Start your app
    await app.start();

    console.log('⚡️ Bolt app is running!');
})();

const newMemberJoin = async () => {
    // listen for new members joining the channel
    app.event('member_joined_channel', async ({ payload, message, say, channel, event }) => {
        console.log(`🎩 Ushering ${payload.user} into ${event.channel}.`)
        
        console.log(
            `📣 Samwise Smallburrow is announcing the presence of ${payload.user} into ${event.channel}.`
        )
        // Send initial messages
        await app.client.chat.postMessage({
            text: `Greetings traveler! You must be <@${payload.user}>!`,
            channel: event.channel,
        })
        // Send subsequent messages as thread replies
        const thread_ts = await app.client.conversations
            .history({
                channel: event.channel,
                limit: 1,
            })
            .then((res) => res.messages?.[0].ts)

        await sleep(Math.random() * 4000),

        await app.client.chat.postMessage({
            text: `\n\n Well now! Look at you, wanderin' in from the road, all covered in dust and weary like you’ve been through half of the Shire and back! You must be in need of a sit down, and a bit of refreshment, I reckon. Let me take your pack—aye, it looks heavy enough to pull a troll off balance! Name’s Samwise Smallburrow, at your service. Us hobbits don't stand on ceremony too much, but we do know how to make a guest feel right at home. You've found the right spot, friend!`,
            channel: event.channel,
            thread_ts,
        }),
        
        await sleep(Math.random() * 5000),

        await app.client.chat.postMessage({
            text: `\n\n Come on inside, now. There’s a fire going and <@${process.env.CREATOR}>'s got the kettle on. You’ll like him, I think—<@${process.env.CREATOR}> is the finest host you'll find this side of the Brandywine. He’s a bit shy at first, but once you’ve got a pint in hand, and a tale to tell, you’ll see he’s all heart. He’s been expectin’ you too, said he had a feelin’ a traveler might drop by. He’s one of those hobbits, you know, with a knack for knowin’ things before they happen, in his own quiet way.`,
            channel: event.channel,
            thread_ts,
        }),
            
    
        await sleep(Math.random() * 5000),
    
        await app.client.chat.postMessage({
            text: `\n\n Ah, there’s <@${process.env.CREATOR}> now! Look, he’s already set out some of his famous mushroom stew—best I’ve ever had, and that’s sayin’ something! "Go on, fill your belly," he’d say, "there’s no point in leavin’ a meal half-finished when it’s made with care." That’s what he always tells me, at least, and he’s right, too. Not to mention, there’s fresh bread cooling on the windowsill. You won’t leave hungry, I can promise you that. We hobbits may be small, but we’ve got big appetites, and we always make sure our guests do too!`,
            channel: event.channel,
            thread_ts,
        }),
    
        await sleep(Math.random() * 5000)
    
        await app.client.chat.postMessage({
            text: `\n\n Now, rest yourself by the fire. There’ll be plenty of time to talk about your travels, and if you’ve got any stories to share, we’ll be more than eager to hear 'em. "A tale is a gift from one heart to another," my old Gaffer used to say. And I reckon, in these parts, we’ve got no shortage of open ears and warm hearths. So, welcome, friend! Stay as long as you like, because there’s no place for weariness when you’re among hobbits!`,
            channel: event.channel,
            thread_ts,
        })
    })
}
const appMention = async () => {
    // listen for new members joining the channel
    app.event('app_mention', async ({ message, say }) => {
        console.log(`${message.user} mentioned Samwise Smallburrow`)
        await say({ text:`<@${message.user}> if you want some help try asking my creator <@${process.env.CREATOR}>`, thread_ts: message.thread_ts || message.ts })
    })
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