boxmaster
=========

Server for ARTxFM boxes.  Displays info about all the known boxes.  With
proper authentication allows LEDs to be turned on/off and boxes to be
enabled/disabled.


How To Run
----------

This is written with heroku in mind. Data is stored on a mongodb.

To run this locally, first install the heroku scripts, install mongodb
locally, and then:

```bash
  $ foreman start
```


Box Logging
-----------

The boxes connect from time to time and send in a status message. In
order for a message to be logged, the box must use an ID that is already
known to the system.  Setting up IDs in the system is a manual
affair. Using mongo shell do something like this:

```js
  db.boxen.insert( {id:"456DEF", uid:"joes cafe"} );
```

The `id` is the "secret" id that the box will use when reporting in, and
the `uid` is the ID value shown in the UI.

On the box itself, you need to add to `/etc/crontab` like so:

```bash

*/5 * * * *  root  /home/pi/box/checkin.py http://boxmaster.herokuapp.com/box/hello >/home/pi/checkin.log 2>&1

```


Database Setup
--------------
Is a bit manual at the moment.

*  Insert known box IDs as described above.
*  Make sure you have an index on the `boxen.id` field.
