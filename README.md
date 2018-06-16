OWLbot
=======

OWLbot is a bot for reporting scores and schedules from the Overwatch League API.  It is written using Node.js and Discordie but mainly I just used BroBot as a template.

### Features
* Sends a notification message when the next OWL match is scheduled to start

### Commands
* `schedule`: displays the next 3 matches on the schedule
* `schedule <tz>`: displays the next 3 matches on the schedule in timezone `tz`
* `schedule <team>`: displays `team`'s next 3 matches
* `results`: displays the latest 3 matches and their scores
* `results <tz>`: displays the latest 3 matches and their scores in timezone `tz`
* `results <team>`: displays `team`'s latest 3 matches and their scores
* `standings <stage>`: displays the current OWL standings, or optionally, the standings from one specific stage
