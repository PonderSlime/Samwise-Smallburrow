require('dotenv').config();

const { App } = require('@slack/bolt');

const appMention = async () => {
    // listen for new members joining the channel
    app.event('app_mention', async ({ context, payload }) => {
        const command = payload.text.split(' ').slice(1).join(' ')
        console.log(`👏 ${payload.user} mentioned: ${command}`)
        
        let message = {
            message="hi",
            ephemeral=false,
            check=false,
            thread=false,
        } = {
            message: `<@${payload.user}> if you want some help try asking my creator <@${process.env.CREATOR}>`,
            ephemeral: true,
        }
        if (message.ephemeral) {
            await context.client.chat.postEphemeral({
                channel: payload.channel,
                user: payload.user,
                text: message.message,
            })
        } else {
            await context.client.chat.postMessage({
                channel: payload.channel,
                text: message.message,
            })
        }
    })
}

/* export default appMention */
export { appMention }