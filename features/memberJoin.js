require('dotenv').config();

const { App } = require('@slack/bolt');

async function welcomeNewMember() {
    // listen for new members joining the channel
    app.action('announce-your-presence', async ({ payload, context }) => {
        console.log(
            `📣 Samwise Smallburrow is announcing the presence of ${payload.user.name}.`
        )

        // Send the initial response
        const response = await context.respond({
            text: `Samwise Smallburrow announces <@${payload.user.id}>'s presence.`,
            response_type: 'in_channel',
            delete_original: true,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `Well now! Look at you, wanderin' in from the road, all covered in dust and weary like you’ve been through half of the Shire and back! You must be in need of a sit down, and a bit of refreshment, I reckon. Let me take your pack—aye, it looks heavy enough to pull a troll off balance! Name’s Samwise Smallburrow, at your service. Us hobbits don't stand on ceremony too much, but we do know how to make a guest feel right at home. You've found the right spot, friend!`,
                    },
                },
            ],
        })
        
        // Send subsequent messages as thread replies
        const thread_ts = await app.client.conversations
            .history({
                channel: process.env.CHANNEL,
                limit: 1,
            })
            .then((res) => res.messages?.[0].ts)

        await sleep(Math.random() * 1000)

        await app.client.chat.postMessage({
            channel: process.env.CHANNEL,
            text: `\n\n_Come on inside, now. There’s a fire going and <@${process.env.CREATOR}>'s got the kettle on. You’ll like him, I think—<@${process.env.CREATOR}> is the finest host you'll find this side of the Brandywine. He’s a bit shy at first, but once you’ve got a pint in hand, and a tale to tell, you’ll see he’s all heart. He’s been expectin’ you too, said he had a feelin’ a traveler might drop by. He’s one of those hobbits, you know, with a knack for knowin’ things before they happen, in his own quiet way.`,
            thread_ts,
        })

        await sleep(Math.random() * 2000)

        await app.client.chat.postMessage({
            channel: process.env.CHANNEL,
            text: `\n\n_Ah, there’s <@${process.env.CREATOR}> now! Look, he’s already set out some of his famous mushroom stew—best I’ve ever had, and that’s sayin’ something! "Go on, fill your belly," he’d say, "there’s no point in leavin’ a meal half-finished when it’s made with care." That’s what he always tells me, at least, and he’s right, too. Not to mention, there’s fresh bread cooling on the windowsill. You won’t leave hungry, I can promise you that. We hobbits may be small, but we’ve got big appetites, and we always make sure our guests do too!`,
            thread_ts,
        })

        await sleep(Math.random() * 2500)

        await app.client.chat.postMessage({
            channel: process.env.CHANNEL,
            text: `\n\n_Now, rest yourself by the fire. There’ll be plenty of time to talk about your travels, and if you’ve got any stories to share, we’ll be more than eager to hear 'em. "A tale is a gift from one heart to another," my old Gaffer used to say. And I reckon, in these parts, we’ve got no shortage of open ears and warm hearths. So, welcome, friend! Stay as long as you like, because there’s no place for weariness when you’re among hobbits!`,
            thread_ts,
        })
    })
}
const newMemberJoin = async () => {
    // listen for new members joining the channel
    app.event('member_joined_channel', async ({ payload }) => {
        if (payload.channel === process.env.CHANNEL) {
            console.log(`🎩 Ushering ${payload.user} into the channel.`)
            await welcomeNewMember(app, payload.user)
        }
    })

    app.command('/samwise-smallburrow-trigger', async ({ payload }) => {
        console.log(
            `🎩 Ushering ${payload.user_id} into the channel via command.`
        )
        await welcomeNewMember(app, payload.user_id)
    })
}

/* export default newMemberJoin */
export { newMemberJoin }