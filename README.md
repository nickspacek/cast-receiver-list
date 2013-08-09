cast-receiver-list
==================

jQuery plugin to display and select Google Cast receivers

Usage
-----

Currently, the easiest way to use this plugin is to have a container div like so:

    <div id="#container" />

And call the plugin on it:

    $('#container').receiverList({
      api: castApiInstance,
		appId: castAppId
	 });
