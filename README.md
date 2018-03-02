BroBot
=======
![BroBot Logo](http://i.imgur.com/FsnNkv8m.png)

BroBot is a bot designed using the Something Awful Forums for inspiration.  It is written using Node.js and Discordie.
Now you can have the same flair as Goons from SA minus the ![:10bux:](saemotes/:10bux:.png) ![:getin:](saemotes/:getin:.gif). 

BroBot was inspired by Fatebot (https://github.com/CogDis/fatebot).

If you would like to invite this bot to your server, simply follow this link: https://discordapp.com/oauth2/authorize?client_id=193464967318601729&scope=bot&permissions=0

A special thanks to Aki/@akinokaze for coming up with the original smilie algorithm implemented in this bot.

Questions? Comments? Concerns? REQUESTS?!?! Join BroBot's server: https://discord.gg/G42rDGm

####Features
* If given the roles, BroBot will kick users that use a slur (see `BroBot.js:65` for list of slurs)
* BroBot responds to certain SA memes with "witty" responses that will hopefully kill that meme dead!
* Welcome messages to new members (contact me in the BroBot Help channel and I will add your server to the list of servers that wish to have Welcome Messages)
* A bunch of commands
* Constantly being developed and willing to take personalized requests to make BroBot work on your server
* Yells at smartasses who try to `!join-role Admin/Mod` roles

####Commands
* `!vaporwave`: links a vaporwave song from YouTube
* `!urban`: searches Urban Dictionary for a definition
* `!invite`: generates a 24-hour invite
* `!decide <option1> or <option2> or ... or <optionN>`: chooses a random option separated by 'or'
* `!8ball <question>`: responds to a question for The Almighty 8Ball
* `!snoop <sentence>`: Snoopify your sentence
* `!sass`: posts a sassy gif
* `!bird`: posts a random emote flipping you off
* `!mindblown`: posts a random mindblowing gif
* `!join-role <roleName>`: joins a given role
* `!leave-role <roleName>`: leaves a given role
* `!helpbro mod`: lists mod commands [more coming soon]
* `!saemotes`: direct messages you the list of Something Awful smilies.
* `:sa_smilie_code`: attachs that smilie on a separate message. This can be used anywhere in a message.

If an SA emote is the same as a Discord emote, add 'sa' to the beginning, i.e. :v: = :sav:

####Future Commands
* `!wowchar <name-server>`  will look up WoW characters on a given server (i.e. `!wowchar Tusen-Sargeras` will return the char info)
* `!ow battlenet` will return basic OverWatch stats (i.e. `!ow TusenTakk#11385` will return my really bad stats)
* `!strawpoll option1 | option2 | ... |optionN` will create a strawpoll and link it in the channel


####Permissions
In order to take full advantage of BroBot, he will need the following permissions:
* Manage roles
* Kick Members
* Create Instant Invite

If your server has roles in order to post in certain channels or to post at all, you will obviously want to give BroBot those roles as well to make sure that he works in all channels, and to make sure that he can give roles correctly (for instance if you have a hidden NSFW channel that requires roles to see, BroBot would need access to that channel in order for the `!join-role` command to work properly.)

If you don't want BroBot to kick people for using slurs, don't give him Kick roles!
