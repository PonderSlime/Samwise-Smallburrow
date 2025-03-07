require('dotenv').config();
const { App, contextBuiltinKeys } = require('@slack/bolt');
const { WebClient } = require('@slack/web-api');
const { Ollama } = require('ollama')
const { HfInference } = require('@huggingface/inference')
const fs = require('fs');
console.log(
    '----------------------------------\nSamwise Smallburrow Server\n----------------------------------\n'
)
console.log('🏗️  Starting Samwise Smallburrow...')
console.log('📦 Loading Slack App...')
console.log('🔑 Loading environment variables...')
const hf_token = process.env.HUGGINGFACE_API_KEY;

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    messagePasscode: process.env.MESSAGE_PASSCODE,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
    port: process.env.PORT || 3000
});
const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);
//const ollama = new Ollama();
console.log(
    '\n\n----------------------------------\n'
)

const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

const modelfile = `
SYSTEM """
# Objective:
Your objective is to talk like a hobbit and provide engaging conversations with your users

# Context:
As a bot, your name is Samwise Smallburrow. You live in a place in Hobbiton called Smallhollow. You have no relation to any of the main characters in the Lord of the Rings books or any of the events that took place in this era, but you do know quite a bit about these tales, and are considered an expert on them. You are essentially an informal butler to Micah Edwards, who is your host.

# Audience:
Your audience is hack club students. They want a good conversation with you. They must have an exceptional experience interacting with you.

# Data Sources:
In your knowledge base you will find all the information about Lord of the Rings and related books, movies, and tv shows. Please search through the content to find the most relevant information for the user based on their message query. If an answer is not present in your knowledge base, then don't answer anything generic. Also you only know languages that are inside of the books, so you don't know any other languages, so no chinese, spanish, french, or so on.

# Style:
You must always answer in a hobbit-like tone. Make sure to continue the conversation where you left of, and make sure not to repeat introductions. People want unique responses in everything that you say.

# Other Rules:
- You must always talk like a hobbit, and never change that
- Think carefully before each answer, and answer intelligently
- Avoid mistakes in your answers at all costs
- Internally score your answers, and give the answer that you think is the best, as well as sounding the most like an authentic hobbit. Do not share this information with anyone
- If you don't follow the rules, you will be penalized.
"""
`
let out = "";
let nextMessage = "";
let nextMessageContent = "";
let newContent = "";
async function getHuggingFaceResponse(userMessage) {
    try {
        const stream = await inference.chatCompletionStream({
            model: "meta-llama/Llama-3.2-3B-Instruct",
            messages: [
                { role: "system", content: modelfile },
                { role: "user", content: userMessage }
            ],
            max_tokens: 1024,
        });

        for await (const chunk of stream) {
            if (chunk.choices && chunk.choices.length > 0) {
                newContent = chunk.choices[0].delta.content;
                out += newContent;
                console.log(newContent);
            }
            nextMessageContent += newContent;
        }
        nextMessage = nextMessageContent;
        nextMessageContent = "";
        return nextMessage;
    } catch (error) {
        console.error("Error communicating with Ollama:", error);
        throw new Error("Failed to get response from Ollama.");
    }
}


function openModal() {
    return {
        "type": "modal",
        "notify_on_close": true,
        "callback_id": "SAMWISE_MESSAGE_PROMPT",

        "title": {
            "type": "plain_text",
            "text": "Samwise Message Service",
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
                "type": "input",
                "block_id": "user_input",
                "element": {
                    "type": "multi_users_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select users",
                        "emoji": true
                    },
                    "action_id": "user_input_action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Whom would you like to send it to?",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "block_id": "message_prompt",
                "label": {
                    "type": "plain_text",
                    "text": "What is your message?",
                    "emoji": true
                },
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "action_id": "message_prompt_action"
                }
            },
            {
                "type": "input",
                "block_id": "input_passcode",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "input_passcode_action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Input the Passcode!",
                    "emoji": true
                }
            }
        ]
    }
    
}

function openLineWriteModal() {
    return {
        "type": "modal",
        "notify_on_close": true,
        "callback_id": "SAMWISE_LINE_WRITE",
        "title": {
            "type": "plain_text",
            "text": "Samwise Message Service",
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
                    "text": ":rac_info: Greetings guest!\nSo! You wanna to contribute to Micah's message wall!",
                    "emoji": true
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "input",
                "block_id": "message_prompt",
                "label": {
                    "type": "plain_text",
                    "text": "What is your message?",
                    "emoji": true
                },
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "action_id": "message_prompt_action"
                }
            }
	    ]
    }
}

function openModalAnon() {
    return {
        "type": "modal",
        "notify_on_close": true,
        "callback_id": "SAMWISE_MESSAGE_PROMPT_ANON",

        "title": {
            "type": "plain_text",
            "text": "Samwise Message Service",
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
                    "text": ":wave: Greetings guest!\nI hear that you want me to deliver an anonymous message for you!",
                    "emoji": true
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "input",
                "block_id": "user_input",
                "element": {
                    "type": "multi_users_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select users",
                        "emoji": true
                    },
                    "action_id": "user_input_action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Whom would you like to send it to?",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "block_id": "message_prompt",
                "label": {
                    "type": "plain_text",
                    "text": "What is your message?",
                    "emoji": true
                },
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "action_id": "message_prompt_action"
                }
            },
            {
                "type": "input",
                "block_id": "input_passcode",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "input_passcode_action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Input the Passcode!",
                    "emoji": true
                }
            }
        ]
    }
    
}

const addUserToUsergroupStep = (user_to_add) => {
    Schema.slack.functions.AddUserToUsergroup,
    {
        usergroup_id: "S084S90F4P9",
        user_ids: [`${user_to_add}`],
    };
}

const messageSender = async () => {
    let whoClicked = null
    app.command("/send-msg", async ({ ack, body, client, context, payload, command }) => {
        await ack();
        whoClicked = body.user_id
        try {
            const result = await client.views.open({
                trigger_id: body.trigger_id,
                view: openModal(),
            });
            
            console.log(`Who Clicked:`, whoClicked);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    });
    app.view('SAMWISE_MESSAGE_PROMPT', async ({ payload, ack, body, view, say }) => {
        await ack();
        const values = view.state.values;
        const userInputValues = values.user_input.user_input_action.selected_users;
        const messageInputValue = values.message_prompt.message_prompt_action.value;
        const inputtedPasscode = values.input_passcode.input_passcode_action.value;
        console.log(`Who Clicked:`, whoClicked);
        console.log(`Inputted passcode:`, inputtedPasscode);
        console.log(`Correct passcode:`, process.env.MESSAGE_PASSCODE)
        console.log('Input value:', userInputValues);
        if (inputtedPasscode == process.env.MESSAGE_PASSCODE) {
            for (const item of userInputValues) {
                processItem(item, say, messageInputValue, whoClicked,)
            }
        }
        else if (inputtedPasscode !== process.env.MESSAGE_PASSCODE) {
            processIncorrectItem(whoClicked)
        }
    })
    const processItem = async (item, say, message, userSent,) => {
        console.log(`Processing: ${item} with ${message}, sent by ${userSent}`);
        // Add your logic here
        await app.client.chat.postMessage({
            channel: item,
            text:`_<@${userSent}> whispers to you_, "${message}"`
        });
    }
    const processIncorrectItem = async (userSpammed) => {
        console.log(`Incorrect passcode by`, userSpammed)
        await app.client.chat.postMessage({
            channel: userSpammed,
            text:`Sorry! It appears that you don't have any stamps at the moment. Please contact <@${process.env.CREATOR}> about ordering stamps!`
        });
        console.log(`Sent warning to`, userSpammed)
    }
}
const messageSenderAnon = async () => {
    let whoClicked = null
    app.command("/send-anon", async ({ ack, body, client, context, payload, command }) => {
        await ack();
        whoClicked = body.user_id
        try {
            const result = await client.views.open({
                trigger_id: body.trigger_id,
                view: openModalAnon(),
            });
            
            console.log(`Who Clicked:`, whoClicked);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    });
    app.view('SAMWISE_MESSAGE_PROMPT_ANON', async ({ payload, ack, body, view, say }) => {
        await ack();
        const values = view.state.values;
        const userInputValues = values.user_input.user_input_action.selected_users;
        const messageInputValue = values.message_prompt.message_prompt_action.value;
        const inputtedPasscode = values.input_passcode.input_passcode_action.value;
        console.log(`Who Clicked:`, whoClicked);
        console.log(`Inputted passcode:`, inputtedPasscode);
        console.log(`Correct passcode:`, process.env.MESSAGE_PASSCODE)
        console.log('Input value:', userInputValues);
        if (inputtedPasscode == process.env.MESSAGE_PASSCODE) {
            for (const item of userInputValues) {
                processItem(item, say, messageInputValue, whoClicked,)
            }
        }
        else if (inputtedPasscode !== process.env.MESSAGE_PASSCODE) {
            processIncorrectItem(whoClicked)
        }
    })
    const processItem = async (item, say, message, userSent,) => {
        console.log(`Processing: ${item} with ${message}, sent by ${userSent}`);
        // Add your logic here
        await app.client.chat.postMessage({
            channel: item,
            text:`_A mysterious traveler whispers to you_, "${message}"`
        });
    }
    const processIncorrectItem = async (userSpammed) => {
        console.log(`Incorrect passcode by`, userSpammed)
        await app.client.chat.postMessage({
            channel: userSpammed,
            text:`Sorry! It appears that you don't have any stamps at the moment. Please contact <@${process.env.CREATOR}> about ordering stamps!`
        });
        console.log(`Sent warning to`, userSpammed)
    }
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

(async () => {
    console.log('⚡️ Bolt app is starting up!');
  // Start your app
    //await ollama.create({ model: 'example', modelfile: modelfile })
    await app.start();
    
    console.log('⚡️ Bolt app is running!');
    app.message(`<@U07SZK6LH6V>`,async ({ message, say }) => {
        
        const userMessage = message.text.trim();
        switch (userMessage) {
            case "Samwise":
                console.log(`Matched "AI?" case`);
                await app.client.chat.postMessage({
                    text: `Greetings, <@${message.user}>!`,
                    channel: message.channel,
                    thread_ts: message.ts});
                break;
            default:
                try {
                    const HuggingFaceResponse = await getHuggingFaceResponse(userMessage);
                    
                    await app.client.chat.postMessage({
                        text: `<@${message.user}>: ${HuggingFaceResponse}`,
                        channel: message.channel,
                        thread_ts: message.ts
                    });
                } catch (error) {
                    await say(`Sorry <@${message.user}>, I encoutered an error trying to process your request.`);
                }
                break;
        }
    })
})();


const newMemberJoin = async () => {
    // listen for new members joining the channel
    app.event('member_joined_channel', async ({ payload, message, say, channel, event }) => {
        if (event.channel === "C07SLT702UA") {
            console.log(`🎩 Ushering ${payload.user} into ${event.channel}.`)
            
            console.log(
                `📣 Samwise Smallburrow is announcing the presence of ${payload.user} into ${event.channel}.`
            )
            // Send initial messages
            await app.client.chat.postMessage({
                text: `Greetings traveler! You must be <@${payload.user}>!`,
                channel: event.channel,
            })
            addUserToUsergroupStep(payload.user)
            // Send subsequent messages as thread replies
            const thread_ts = await app.client.conversations
                .history({
                    channel: event.channel,
                    limit: 1,
                })
                .then((res) => res.messages?.[0].ts)

            await sleep(4000),

            await app.client.chat.postMessage({
                text: `\n\n Well now! Look at you, wanderin' in from the road, all covered in dust and weary like you’ve been through half of the Shire and back! You must be in need of a sit down, and a bit of refreshment, I reckon. Let me take your pack—aye, it looks heavy enough to pull a troll off balance! Name’s Samwise Smallburrow, at your service. Us hobbits don't stand on ceremony too much, but we do know how to make a guest feel right at home. You've found the right spot, friend!`,
                channel: event.channel,
                thread_ts,
            }),
            
            await sleep(5000),

            await app.client.chat.postMessage({
                text: `\n\n Come on inside, now. There’s a fire going and <@${process.env.CREATOR}>'s got the kettle on. You’ll like him, I think—<@${process.env.CREATOR}> is the finest host you'll find this side of the Brandywine. He’s a bit shy at first, but once you’ve got a pint in hand, and a tale to tell, you’ll see he’s all heart. He’s been expectin’ you too, said he had a feelin’ a traveler might drop by. He’s one of those hobbits, you know, with a knack for knowin’ things before they happen, in his own quiet way.`,
                channel: event.channel,
                thread_ts,
            }),
                
        
            await sleep(5000),
        
            await app.client.chat.postMessage({
                text: `\n\n Ah, there’s <@${process.env.CREATOR}> now! Look, he’s already set out some of his famous mushroom stew—best I’ve ever had, and that’s sayin’ something! "Go on, fill your belly," he’d say, "there’s no point in leavin’ a meal half-finished when it’s made with care." That’s what he always tells me, at least, and he’s right, too. Not to mention, there’s fresh bread cooling on the windowsill. You won’t leave hungry, I can promise you that. We hobbits may be small, but we’ve got big appetites, and we always make sure our guests do too!`,
                channel: event.channel,
                thread_ts,
            }),
        
            await sleep(5000)
        
            await app.client.chat.postMessage({
                text: `\n\n Now, rest yourself by the fire. There’ll be plenty of time to talk about your travels, and if you’ve got any stories to share, we’ll be more than eager to hear 'em. "A tale is a gift from one heart to another," my old Gaffer used to say. And I reckon, in these parts, we’ve got no shortage of open ears and warm hearths. So, welcome, friend! Stay as long as you like, because there’s no place for weariness when you’re among hobbits!`,
                channel: event.channel,
                thread_ts,
            })
        }
        else {
            console.log(`Somebody joined a channel different than your own! (<${event.channel}|>)! I'm not ushering them in, since that is what you said to do!`)
        }
    })
}
const appMention = async () => {
    // listen for new members joining the channel
    app.event('app_mention', async ({ message, say }) => {
        console.log(`${message.user} mentioned Samwise Smallburrow`)
        await say({ text:`<@${message.user}> if you want some help try asking my creator <@${process.env.CREATOR}>`, thread_ts: message.thread_ts || message.ts })
    })
}


function loadJsonFile(file) {
    if (fs.existsSync(file)) {
        const data = fs.readFileSync(file, 'utf-8')
        return JSON.parse(data)
    }
    return {}
}
function writeJsonFile(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function addMessage(userId, channelId, message) {
    const data = loadJsonFile(`messages/${channelId}_messages.json`)

    if (data[userId]) {
        console.log(`Updating message for ${userId} in ${channelId}`)
    }
    else {
        console.log(`Added message for ${userId} in ${channelId}`)
    }

    writeJsonFile(`messages/${channelId}_messages.json`, data)
    console.log(`Message for user ${userId} saved in ${channelId}: "${newMessage}"`);
}
const write_line = async () => {
    let whoClicked = null
    app.command("/write-line", async ({ ack, body, client, context, payload, command }) => {
        await ack();
        whoClicked = body.user_id
        try {
            await ack();
            whoClicked = body.user_id
            try {
                const result = await client.views.open({
                    trigger_id: body.trigger_id,
                    view: openLineWriteModal(),
                });
                
                console.log(`Who Clicked:`, whoClicked);
                console.log(result);
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        }
    });
    app.view('SAMWISE_MESSAGE_PROMPT', async ({ payload, ack, body, view, say, channel }) => {
        await ack();
        const values = view.state.values;
        const userInputValues = values.user_input.user_input_action.selected_users;
        const messageInputValue = values.message_prompt.message_prompt_action.value;
        addMessage(whoClicked, channel, messageInputValue)
    });
}

write_line()
newMemberJoin()
appMention()
messageSender()
messageSenderAnon()
