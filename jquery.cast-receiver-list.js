(function ($) {

var UI = function(element) {
	this.element = element;
	this.receivers = {};
}

UI.prototype.init = function() {
	var elements = [];
	elements.push(this.createEmptyMessage());
	elements.push(this.createReceiverList());
	this.element.append(elements);
};

UI.prototype.createEmptyMessage = function() {
	this.emptyMessage = $('<p class="crl-empty" />')
		.text('No receivers found. Would you like to ')
		.hide();

	this.refreshButton = $('<button class="crl-refresh btn btn-xs">Refresh</button>')
		.appendTo(this.emptyMessage);
	
	return this.emptyMessage;
};

UI.prototype.createReceiverList = function() {
	var self = this;
	this.receiverList = $('<ol class="crl-receiver-list" />').on('click', 'li', function (e) {
	 	e.preventDefault();

		var receiverId = $(this).closest('li').attr('data-id');
		var receiver = self.receivers[receiverId];
		self.element.trigger('receiverClick', [ receiver ]);
	});

	return this.receiverList;
};

UI.prototype.update = function(receivers) {
	var self = this;

	if (receivers.length == 0 && receivers.children().length == 0) {
		this.receiverList.hide();
		this.emptyMessage.show();
		return;
	}
	
	this.receiverList.append(receivers
		.filter(function (item) { return self.receivers[item.id] !== 'undefined' })
		.map(function (item) {
	 		var listItem = $('<li class="crl-receiver" />')
				.attr('data-id', item.id);

			var element = $('<div />').appendTo(listItem);
			$('<span class="crl-receiver-name" />').text(item.name).appendTo(element);

			var info = $('<div class="crl-receiver-info" />').appendTo(listItem);
			$('<span class="crl-receiver-info-id" />').text(item.id).appendTo(info);
			$('<span class="crl-receiver-info-ip" />').text(item.ipAddress).appendTo(info);
			$('<span class="crl-receiver-info-projected" />').text(item.isTabProjected).appendTo(info);

			return listItem;
		}));

	receivers.forEach(function (receiver) {
		self.receivers[receiver.id] = receiver;
	});
};

$.fn.receiverList = function (options) {
	var storeId = 'instance-' + new Date().getTime();

	this
		.each(function () {
			var $this = $(this);
			var ui = new UI($this);
			ui.init();
			$this.data('receiverList', ui);
		})
		.bind('receiverClick', options.click);

	var opts = $.extend({}, $.fn.receiverList.defaults, options);
	if (typeof opts.api !== 'undefined') {
		if (typeof opts.appId === 'undefined') {
			throw 'When providing a reference to the Cast API you must also provide the appId';
		}
		registerListener(this, opts.api, opts.appId);
	}
	
	return this;
};


$.fn.receiverList.defaults = {
	
};

$.fn.receiverList.receiverStore = {};

function registerListener(elements, api, appId) {
	api.addReceiverListener(appId, function (receivers) {
		elements.each(function () {
			$(this).data('receiverList').update(receivers);
		});
	});
}

})(jQuery);

