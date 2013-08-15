cast-receiver-list
==================

jQuery/Angular JS plugin to display and select Google Cast receivers

Requirements
------------

* jQuery
* (Optional) Bootstrap

Usage
-----

Currently, the easiest way to use this plugin is to have a container div like so:

    <div id="#container" />

And call the plugin on it:

    $('#container').receiverList({
      api: castApiInstance,
      appId: castAppId
    });

The plugin will register a Receiver Listener with the Google Cast API.

Plans
-----

* Add hooks to manually update the list, so that the plugin itself isn't registering with the Cast API
* Add tracking of current Cast sessions and ability to Start/Stop Cast sessions
