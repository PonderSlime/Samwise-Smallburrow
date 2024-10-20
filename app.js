require('dotenv').config();

const { App } = require('@slack/bolt');
/* const { features } = require('./features/index.js');
/* const { features } = require('./features/index.js') */

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

/* console.log(`⚒️  Loading ${Object.entries(features).length} features...`) */
/* for (const [feature, handler] of Object.entries(features)) {
    console.log(`📦 ${feature} loaded`)
    if (typeof handler === 'function') {
        handler(app)
    }
} */

(async () => {
    console.log('⚡️ Bolt app is starting up!');
  // Start your app
    await app.start();

    console.log('⚡️ Bolt app is running!');
})();

console.log(
    /* '🚀 Server Started in',
    Bun.nanoseconds() / 1000000,
    'milliseconds on version:',
    version + '!', */
    '\n\n----------------------------------\n'
)
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const newMemberJoin = async () => {
    // listen for new members joining the channel
    app.event('member_joined_channel', async ({ payload }) => {
        if (message.channel === process.env.CHANNEL) {
            console.log(`🎩 Ushering ${message.user} into the channel.`)
            
            console.log(
                `📣 Samwise Smallburrow is announcing the presence of ${message.user}.`/* ${payload.user.name}. */
            )
            await say(`Well now! Look at you, wanderin' in from the road, all covered in dust and weary like you’ve been through half of the Shire and back! You must be in need of a sit down, and a bit of refreshment, I reckon. Let me take your pack—aye, it looks heavy enough to pull a troll off balance! Name’s Samwise Smallburrow, at your service. Us hobbits don't stand on ceremony too much, but we do know how to make a guest feel right at home. You've found the right spot, friend!`),
        
            await sleep(Math.random() * 2000),
        
            await say(`\n\n_Come on inside, now. There’s a fire going and <@${process.env.CREATOR}>'s got the kettle on. You’ll like him, I think—<@${process.env.CREATOR}> is the finest host you'll find this side of the Brandywine. He’s a bit shy at first, but once you’ve got a pint in hand, and a tale to tell, you’ll see he’s all heart. He’s been expectin’ you too, said he had a feelin’ a traveler might drop by. He’s one of those hobbits, you know, with a knack for knowin’ things before they happen, in his own quiet way.`),
        
            await sleep(Math.random() * 4000),
        
            await say(`\n\n_Ah, there’s <@${process.env.CREATOR}> now! Look, he’s already set out some of his famous mushroom stew—best I’ve ever had, and that’s sayin’ something! "Go on, fill your belly," he’d say, "there’s no point in leavin’ a meal half-finished when it’s made with care." That’s what he always tells me, at least, and he’s right, too. Not to mention, there’s fresh bread cooling on the windowsill. You won’t leave hungry, I can promise you that. We hobbits may be small, but we’ve got big appetites, and we always make sure our guests do too!`),
        
            await sleep(Math.random() * 5000)
        
            await say(`\n\n_Now, rest yourself by the fire. There’ll be plenty of time to talk about your travels, and if you’ve got any stories to share, we’ll be more than eager to hear 'em. "A tale is a gift from one heart to another," my old Gaffer used to say. And I reckon, in these parts, we’ve got no shortage of open ears and warm hearths. So, welcome, friend! Stay as long as you like, because there’s no place for weariness when you’re among hobbits!`)
        }
    })
   /*  app.event('member_joined_channel', async ({ payload }) => {
        if (message.channel === process.env.CHANNEL) {
            console.log(`🎩 Ushering ${message.user} into the channel.`)
            await welcomeNewMember(app, message.user)
        }
    }) */

    app.command('/samwise-smallburrow-trigger', async ({ message }) => {
        console.log(
            `🎩 Ushering ${message.user_id} into the channel via command. (test)`
        )
    })
}
const appMention = async () => {
    // listen for new members joining the channel
    app.event('app_mention', async ({ message, say }) => {
        console.log(`${message.user} mentioned Samwise Smallburrow`)
        await say(`<@${message.user}> if you want some help try asking my creator <@${process.env.CREATOR}>`)
    })
}

const hello = async () => {
    // Listens to incoming messages that contain "hello"
    app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
        console.log(`👏 ${message.user} said hi`)
        await say(`Hey there <@${message.user}>!`);
    });
}
hello()
newMemberJoin()
appMention()