//server

function doServerRequest(body, cb) {
	var constParams = {
		user_id: parseInt(runParams.viewer_id),
		auth_key: runParams.auth_key
	};

	body = $.extend(body, constParams);

	console.log(body);

	var promise = $.ajax({
		url: '/',
		type: 'POST',
		data: JSON.stringify(body),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json'
	});

	promiseCb(promise, cb);
}

//vk

const VK_API_VERSION = 5.8;

VK.init(function () {
	console.log('vk inited');
}, function () {
	console.log('vk init error');
}, VK_API_VERSION);

function doVKRequest(method, params, cb) {
	var constParams = {
		test_mode: true
	};

	params = $.extend(params, constParams);

	console.log(method, params);

	VK.api(method, params, function (data) {
		resCb(data, cb);
	});
}

function doPublicVKRequest(method, params, cb) {
	var constParams = {
		v: VK_API_VERSION
	};

	params = $.extend(params, constParams);

	console.log(method, params);

	var promise = $.ajax({
		url: 'https://api.vk.com/method/' + method,
		data: params,
		dataType: 'jsonp'
	});

	promiseCb(promise, cb);
}

//util

function resCb(data, cb) {
	console.log(data);

	if (data.error) {
		cb(data.error);
	}

	if (data.response) {
		cb(null, data.response);
	}
}

function promiseCb(promise, cb) {
	promise.done(
		function (data) {
			resCb(data, cb);
		}
	).fail(
		function (error) {
			cb(error);
		}
	);
}
