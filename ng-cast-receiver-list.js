angular.module('crl', [])
	.controller('crl.ReceiverCtrl', [ '$scope', 'crl.receiverService', function(scope, receiverService) {
		scope.receivers = receiverService.receivers;
		scope.selectReceiver = function (id) {
			receiverService.activateReceiver(id);
			receiver.active = true;
		};
	}])
	// Used as a central location for the receivers in the list
	.factory('crl.receiverService', [ '$rootScope', 'crl.castApi', 'CAST_APP_ID', function (rootScope, castApi, appId) {
		var service = {
			existingReceiverIds: {},
			receivers: [],
			activateReceiver: function (id) {
				var receiver = this.receivers.filter(function (r) { return r.id == id; })[0];
				if (!receiver) {
					console.debug('activateReceiver could not find receiver with ID=' + id);
					return;
				}
				receiver.active = true;
			}
		};
		castApi.request().then(function (api) {
			api.addReceiverListener(appId, function (receivers) {
				rootScope.$apply(function () {
					receivers.forEach(function (receiver) {
						if (!service.existingReceiverIds[receiver.id]) {
							service.receivers.push(receiver);
							service.existingReceiverIds[receiver.id] = true;
						}
					});
				});
			});
		});
		return service;
	}])
	// Used to create an instance of the Cast API
	.factory('crl.castApi', [ '$window', '$q', '$rootScope', function (window, q, rootScope) {
		var deferred = q.defer();
		if (typeof cast !== 'undefined' && cast.isAvailable) {
			resolve(deferred);
		} else {
			window.addEventListener('message', function(event) {
				if (event.source == window && event.data && event.data.source === 'CastApi' && event.data.event === 'Hello') {
					resolve(deferred);
				}
			});
		}
		return { request: function () { return deferred.promise; } };

		function resolve(deferred) {
			rootScope.$apply(function () {
				deferred.resolve(new cast.Api());
			});
		}
	}])
	// Used for drawing an "avatar" for the receivers in the list
	.directive('identicon', function () {
		return {
			restrict: 'EA',
			link: function (scope, element, attr) {
				var size = attr.width && attr.height ? Math.max(attr.width, attr.height) : 40;
				var ctx = element[0].getContext('2d');
				attr.$observe('hash', function (value) {
					draw(ctx, value, { rotate: true, size: size });
				});
			}
		};

		function draw(ctx, hash, settings) {
			// Adapted from: http://francisshanahan.com/identicon5/test.html, unsure of license
			var z=function(a,b){if(b.length>=2){a.beginPath();a.moveTo(b[0],b[1]);for(var i=2;i<b.length;i++){a.lineTo(b[i],b[i+1]);i++}a.fill()}};var A=function(a,b){switch(a){case 0:a=[0.5,1,1,0,1,1];break;case 1:a=[0.5,0,1,0,0.5,1,0,1];break;case 2:a=[0.5,0,1,0,1,1,0.5,1,1,0.5];break;case 3:a=[0,0.5,0.5,0,1,0.5,0.5,1,0.5,0.5];break;case 4:a=[0,0.5,1,0,1,1,0,1,1,0.5];break;case 5:a=[1,0,1,1,0.5,1,1,0.5,0.5,0.5];break;case 6:a=[0,0,1,0,1,0.5,0,0,0.5,1,0,1];break;case 7:a=[0,0,0.5,0,1,0.5,0.5,1,0,1,0.5,0.5];break;case 8:a=[0.5,0,0.5,0.5,1,0.5,1,1,0.5,1,0.5,0.5,0,0.5];break;case 9:a=[0,0,1,0,0.5,0.5,1,0.5,0.5,1,0.5,0.5,0,1];break;case 10:a=[0,0.5,0.5,1,1,0.5,0.5,0,1,0,1,1,0,1];break;case 11:a=[0.5,0,1,0,1,1,0.5,1,1,0.75,0.5,0.5,1,0.25];break;case 12:a=[0,0.5,0.5,0,0.5,0.5,1,0,1,0.5,0.5,1,0.5,0.5,0,1];break;case 13:a=[0,0,1,0,1,1,0,1,1,0.5,0.5,0.25,0.5,0.75,0,0.5,0.5,0.25];break;case 14:a=[0,0.5,0.5,0.5,0.5,0,1,0,0.5,0.5,1,0.5,0.5,1,0.5,0.5,0,1];break;default:a=[0,0,1,0,0.5,0.5,0.5,0,0,0.5,1,0.5,0.5,1,0.5,0.5,0,1];break}for(var i=0;i<a.length;i++){a[i]=a[i]*b}return a};var B=function(a,b){var c;var d=b/5;var e=d/2;var j=0;var k=0;a.strokeRect(0,0,d,d);for(var i=0;i<15;i++){c=A(i,d);a.save();a.translate(e+(j*d),e+(k*d));for(var p=0;p<c.length;p++){c[p]-=e}z(a,c);a.strokeRect(-e,-e,d,d);a.restore();if(j>=4){j=0;k++}else{j++}}};var C=function(a,b,x,y,c,d,e){var f=e/2;a.save();a.translate(x,y);a.rotate(d*Math.PI/180);a.save();a.translate(f,f);var g=[];for(var p=0;p<b.length;p++){g[p]=b[p]-f}a.rotate(c);z(a,g);a.restore();a.restore()};var D=function(a,b){switch(a){case 0:a=[];break;case 1:a=[0,0,1,0,1,1,0,1];break;case 2:a=[0.5,0,1,0.5,0.5,1,0,0.5];break;case 3:a=[0,0,1,0,1,1,0,1,0,0.5,0.5,1,1,0.5,0.5,0,0,0.5];break;case 4:a=[0.25,0,0.75,0,0.5,0.5,1,0.25,1,0.75,0.5,0.5,0.75,1,0.25,1,0.5,0.5,0,0.75,0,0.25,0.5,0.5];break;case 5:a=[0,0,0.5,0.25,1,0,0.75,0.5,1,1,0.5,0.75,0,1,0.25,0.5];break;case 6:a=[0.33,0.33,0.67,0.33,0.67,0.67,0.33,0.67];break;case 7:a=[0,0,0.33,0,0.33,0.33,0.66,0.33,0.67,0,1,0,1,0.33,0.67,0.33,0.67,0.67,1,0.67,1,1,0.67,1,0.67,0.67,0.33,0.67,0.33,1,0,1,0,0.67,0.33,0.67,0.33,0.33,0,0.33];break;default:a=[0,0,1,0,0.5,0.5,0.5,0,0,0.5,1,0.5,0.5,1,0.5,0.5,0,1];break}for(var i=0;i<a.length;i++){a[i]=a[i]*b}return a};var E=function(a,b,c,d){var e=parseInt(b.substr(0,1),16);var f=parseInt(b.substr(1,1),16);var g=parseInt(b.substr(2,1),16)&7;var h=Math.PI/2;var i=h*(parseInt(b.substr(3,1),16)&3);var j=h*(parseInt(b.substr(4,1),16)&3);var k=parseInt(b.substr(5,1),16)%2;var l=parseInt(b.substr(6,2),16);var m=parseInt(b.substr(8,2),16);var n=parseInt(b.substr(10,2),16);var o=parseInt(b.substr(12,2),16);var p=parseInt(b.substr(14,2),16);var q=parseInt(b.substr(16,2),16);var r=c/3;var s=c;var t=A(e,r);a.fillStyle="rgb("+l+","+m+","+n+")";if(d===false){i=0}C(a,t,0,0,i,0,r);C(a,t,s,0,i,90,r);C(a,t,s,s,i,180,r);C(a,t,0,s,i,270,r);if(d===false){j=0}var u=A(f,r);a.fillStyle="rgb("+o+","+p+","+q+")";C(a,u,0,r,j,0,r);C(a,u,2*r,0,j,90,r);C(a,u,3*r,2*r,j,180,r);C(a,u,r,3*r,j,270,r);var v=D(g,r);if(k>0&&(Math.abs(l-o)>127||Math.abs(m-p)>127||Math.abs(n-q)>127)){a.fillStyle="rgb("+o+","+p+","+q+")"}else{a.fillStyle="rgb("+l+","+m+","+n+")"}C(a,v,r,r,0,0,r)};
		E(ctx,hash,settings.size,settings.rotate);
		}
	})
	// Utility, used for hashing the receiver ID for use with the identicon
	.filter('md5', function () {
		// Adapted from: https://github.com/blueimp/JavaScript-MD5, under the MIT license: http://opensource.org/licenses/MIT
		var md5 = function(){"use strict";function t(n,t){var r=(65535&n)+(65535&t),e=(n>>16)+(t>>16)+(r>>16);return e<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,u,o,c,f){return t(r(t(t(e,n),t(o,f)),c),u)}function u(n,t,r,u,o,c,f){return e(t&r|~t&u,n,t,o,c,f)}function o(n,t,r,u,o,c,f){return e(t&u|r&~u,n,t,o,c,f)}function c(n,t,r,u,o,c,f){return e(t^r^u,n,t,o,c,f)}function f(n,t,r,u,o,c,f){return e(r^(t|~u),n,t,o,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[(r+64>>>9<<4)+14]=r;var e,i,a,h,d,g=1732584193,l=-271733879,v=-1732584194,C=271733878;for(e=0;e<n.length;e+=16)i=g,a=l,h=v,d=C,g=u(g,l,v,C,n[e],7,-680876936),C=u(C,g,l,v,n[e+1],12,-389564586),v=u(v,C,g,l,n[e+2],17,606105819),l=u(l,v,C,g,n[e+3],22,-1044525330),g=u(g,l,v,C,n[e+4],7,-176418897),C=u(C,g,l,v,n[e+5],12,1200080426),v=u(v,C,g,l,n[e+6],17,-1473231341),l=u(l,v,C,g,n[e+7],22,-45705983),g=u(g,l,v,C,n[e+8],7,1770035416),C=u(C,g,l,v,n[e+9],12,-1958414417),v=u(v,C,g,l,n[e+10],17,-42063),l=u(l,v,C,g,n[e+11],22,-1990404162),g=u(g,l,v,C,n[e+12],7,1804603682),C=u(C,g,l,v,n[e+13],12,-40341101),v=u(v,C,g,l,n[e+14],17,-1502002290),l=u(l,v,C,g,n[e+15],22,1236535329),g=o(g,l,v,C,n[e+1],5,-165796510),C=o(C,g,l,v,n[e+6],9,-1069501632),v=o(v,C,g,l,n[e+11],14,643717713),l=o(l,v,C,g,n[e],20,-373897302),g=o(g,l,v,C,n[e+5],5,-701558691),C=o(C,g,l,v,n[e+10],9,38016083),v=o(v,C,g,l,n[e+15],14,-660478335),l=o(l,v,C,g,n[e+4],20,-405537848),g=o(g,l,v,C,n[e+9],5,568446438),C=o(C,g,l,v,n[e+14],9,-1019803690),v=o(v,C,g,l,n[e+3],14,-187363961),l=o(l,v,C,g,n[e+8],20,1163531501),g=o(g,l,v,C,n[e+13],5,-1444681467),C=o(C,g,l,v,n[e+2],9,-51403784),v=o(v,C,g,l,n[e+7],14,1735328473),l=o(l,v,C,g,n[e+12],20,-1926607734),g=c(g,l,v,C,n[e+5],4,-378558),C=c(C,g,l,v,n[e+8],11,-2022574463),v=c(v,C,g,l,n[e+11],16,1839030562),l=c(l,v,C,g,n[e+14],23,-35309556),g=c(g,l,v,C,n[e+1],4,-1530992060),C=c(C,g,l,v,n[e+4],11,1272893353),v=c(v,C,g,l,n[e+7],16,-155497632),l=c(l,v,C,g,n[e+10],23,-1094730640),g=c(g,l,v,C,n[e+13],4,681279174),C=c(C,g,l,v,n[e],11,-358537222),v=c(v,C,g,l,n[e+3],16,-722521979),l=c(l,v,C,g,n[e+6],23,76029189),g=c(g,l,v,C,n[e+9],4,-640364487),C=c(C,g,l,v,n[e+12],11,-421815835),v=c(v,C,g,l,n[e+15],16,530742520),l=c(l,v,C,g,n[e+2],23,-995338651),g=f(g,l,v,C,n[e],6,-198630844),C=f(C,g,l,v,n[e+7],10,1126891415),v=f(v,C,g,l,n[e+14],15,-1416354905),l=f(l,v,C,g,n[e+5],21,-57434055),g=f(g,l,v,C,n[e+12],6,1700485571),C=f(C,g,l,v,n[e+3],10,-1894986606),v=f(v,C,g,l,n[e+10],15,-1051523),l=f(l,v,C,g,n[e+1],21,-2054922799),g=f(g,l,v,C,n[e+8],6,1873313359),C=f(C,g,l,v,n[e+15],10,-30611744),v=f(v,C,g,l,n[e+6],15,-1560198380),l=f(l,v,C,g,n[e+13],21,1309151649),g=f(g,l,v,C,n[e+4],6,-145523070),C=f(C,g,l,v,n[e+11],10,-1120210379),v=f(v,C,g,l,n[e+2],15,718787259),l=f(l,v,C,g,n[e+9],21,-343485551),g=t(g,i),l=t(l,a),v=t(v,h),C=t(C,d);return[g,l,v,C]}function a(n){var t,r="";for(t=0;t<32*n.length;t+=8)r+=String.fromCharCode(255&n[t>>5]>>>t%32);return r}function h(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;for(t=0;t<8*n.length;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function d(n){return a(i(h(n),8*n.length))}function g(n,t){var r,e,u=h(n),o=[],c=[];for(o[15]=c[15]=void 0,u.length>16&&(u=i(u,8*n.length)),r=0;16>r;r+=1)o[r]=909522486^u[r],c[r]=1549556828^u[r];return e=i(o.concat(h(t)),512+8*t.length),a(i(c.concat(e),640))}function l(n){var t,r,e="0123456789abcdef",u="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),u+=e.charAt(15&t>>>4)+e.charAt(15&t);return u}function v(n){return unescape(encodeURIComponent(n))}function C(n){return d(v(n))}function m(n){return l(C(n))}function s(n,t){return g(v(n),v(t))}function A(n,t){return l(s(n,t))}function p(n,t,r){return t?r?s(t,n):A(t,n):r?C(n):m(n)}return p}();
				
		return function (input) {
			return md5(input);
		};
	});
