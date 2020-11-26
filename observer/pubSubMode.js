/**
 * 
 * 发布订阅模式（观察者模式）
 * 
 */

// 常规实现步骤:
// 1.指定发布者
// 2.给发布者添加一个缓存列表用于存放回调函数来通知订阅者
// 3.发布时遍历列表触发里面的回调函数

// 售楼处模拟
// 添加key为订阅者推送需要的消息 而不是全部推送
const salesHouseObserver = function () {

	const salesOffice = {};

	salesOffice.clientList = {};

	salesOffice.listen = function (key, fn) {
		if (!this.clientList[key]) this.clientList[key] = [];
		this.clientList[key].push(fn);
	}

	salesOffice.trigger = function () {

		// 获取消息类型
		const key = [].shift.call(arguments);

		// 获取该类型的回调
		const fns = this.clientList[key];

		// 若无订阅
		if (!fns || fns.length === 0) return false;

		for (let i = 0, fn; fn = fns[i++];) {
			fn.apply(this, arguments); // arguments 是发布消息时带上的参数
		}
	}

	salesOffice.listen('squareMeter88', function (price) { // 小明订阅 88 平方米房子的消息
		console.log('价格= ' + price); // 输出： 2000000 
	});
	salesOffice.listen('squareMeter110', function (price) { // 小红订阅 110 平方米房子的消息
		console.log('价格= ' + price); // 输出： 3000000 
	});

	salesOffice.trigger('squareMeter88', 2000000); // 发布88平的
	salesOffice.trigger('squareMeter110', 3000000); // 发布110平的

}

// 提取发布订阅核心
const Events = {
	clientList: [],
	listen: function (key, fn) {

		if (!this.clientList[key]) this.clientList[key] = [];

		this.clientList[key].push(fn);

	},
	trigger: function () {

		const key = [].shift.call(arguments);
		const fns = this.clientList[key];

		if (!fns || fns.length === 0) return false;

		for (let i = 0, fn; fn = fns[i++];) {
			fn.apply(this, arguments); // arguments 是 trigger 时带上的参数
		}

	},
	// fn为要取消的特定的回调函数名
	remove: function (key, fn) {

		// 获取此key的所有回调
		const fns = this.clientList[key];

		// 若此key无订阅的fn 返回false
		if (!fns || fns.length === 0) return false;

		// 若不传fn 则取消所有回调
		if (!fn) {
			fns && (fns.length = 0);
		} else {

			// 反向遍历方便splice
			for (let i = fns.length - 1; i > 0; i++) {
				if (fns[i] === fn) fns.splice(i, 1);
			}

		}

	}

};

// 定义安装函数 为其他对象添加发布订阅
const installEvent = function (obj) {
	for (let i in Events) obj[i] = Events[i];
}

// 为售楼处添加
const salesDynamicPubSub = function () {
	const salesDyn = {};
	installEvent(salesDyn);

	salesDyn.listen('squareMeter88', function (price) { // 小明订阅 88 平方米房子的消息
		console.log('价格= ' + price); // 输出： 2000000 
	});
	salesDyn.listen('squareMeter110', function (price) { // 小红订阅 110 平方米房子的消息
		console.log('价格= ' + price); // 输出： 3000000 
	});

	salesDyn.remove('squareMeter88');

	salesDyn.trigger('squareMeter88', 2000000); // 发布88平的
	salesDyn.trigger('squareMeter110', 3000000); // 发布110平的
}

// 网站登陆案例
// 当登陆完成时发布登陆成功消息 触发订阅回调
const loginPubSub = function () {

	// 为login安装发布订阅
	const login = {};
	installEvent(login);

	// 登陆模块
	$.ajax('http:// xxx.com?login', function (data) {

		// 发布登录成功的消息
		login.trigger('loginSucc', data);
	});

	// 各其他依赖登陆成功与否的模块
	const header = (function () { // header 模块
		login.listen('loginSucc', function (data) {
			header.setAvatar(data.avatar);
		});
		return {
			setAvatar: function (data) {
				console.log('设置 header 模块的头像');
			}
		}
	})();
	const nav = (function () { // nav 模块
		login.listen('loginSucc', function (data) {
			nav.setAvatar(data.avatar);
		});
		return {
			setAvatar: function (avatar) {
				console.log('设置 nav 模块的头像');
			}
		}
	})();

	// 若新增一个模块 不需要改动登陆模块即可
	const address = (function () { // nav 模块
		login.listen('loginSucc', function (obj) {
			address.refresh(obj);
		});
		return {
			refresh: function (avatar) {
				console.log('刷新收货地址列表');
			}
		}
	})();
}

// 全局发布订阅对象
const globalEvent = (function () {

	const clientList = {};
	const listen = function (key, fn) {

		if (!clientList[key]) clientList[key] = [];

		clientList[key].push(fn);

	};
	const trigger = function () {

		const key = [].shift.call(arguments);
		const fns = clientList[key];

		if (!fns || fns.length === 0) return false;

		for (let i = 0, fn; fn = fns[i++];) {
			fn.apply(this, arguments); // arguments 是 trigger 时带上的参数
		}

	};
	// fn为要取消的特定的回调函数名
	const remove = function (key, fn) {

		// 获取此key的所有回调
		const fns = clientList[key];

		// 若此key无订阅的fn 返回false
		if (!fns || fns.length === 0) return false;

		// 若不传fn 则取消所有回调
		if (!fn) {
			fns && (fns.length = 0);
		} else {

			// 反向遍历方便splice
			for (let i = fns.length - 1; i > 0; i++) {
				if (fns[i] === fn) fns.splice(i, 1);
			}

		}

	}

	return {
		listen,
		trigger,
		remove
	}
})();

// 和售楼处对象解藕
globalEvent.listen('squareMeter88', function (price) { // 小红订阅消息
	console.log('价格= ' + price); // 输出：'价格=2000000' 
});
globalEvent.trigger('squareMeter88', 2000000); // 售楼处发布消息

// 终极版发布订阅
// 可先发布后订阅
// 可创建命名空间防止冲突
const finalEvent = (function () {
	var global = this,
		Event,
		_default = 'default';
	Event = function () {
		var _listen,
			_trigger,
			_remove,
			_slice = Array.prototype.slice,
			_shift = Array.prototype.shift,
			_unshift = Array.prototype.unshift,
			namespaceCache = {},
			_create,
			find,
			each = function (ary, fn) {
				var ret;
				for (var i = 0, l = ary.length; i < l; i++) {
					var n = ary[i];
					ret = fn.call(n, i, n);
				}
				return ret;
			};
		_listen = function (key, fn, cache) {
			if (!cache[key]) {
				cache[key] = [];
			}
			cache[key].push(fn);
		};
		_remove = function (key, cache, fn) {
			if (cache[key]) {
				if (fn) {
					for (var i = cache[key].length; i >= 0; i--) {
						if (cache[key][i] === fn) {
							cache[key].splice(i, 1);
						}
					}
				} else {
					cache[key] = [];
				}
			}
		};
		_trigger = function () {
			var cache = _shift.call(arguments),
				key = _shift.call(arguments),
				args = arguments,
				_self = this,
				ret,
				stack = cache[key];
			if (!stack || !stack.length) {
				return;
			}
			return each(stack, function () {
				return this.apply(_self, args);
			});
		};
		_create = function (namespace) {
			var namespace = namespace || _default;
			var cache = {},
				offlineStack = [], // 离线事件
				ret = {
					listen: function (key, fn, last) {
						_listen(key, fn, cache);
						if (offlineStack === null) {
							return;
						}
						if (last === 'last') {
							offlineStack.length && offlineStack.pop()();
						} else {
							each(offlineStack, function () {
								this();
							});
						}
						offlineStack = null;
					},
					one: function (key, fn, last) {
						_remove(key, cache);
						this.listen(key, fn, last);
					},
					remove: function (key, fn) {
						_remove(key, cache, fn);
					},
					trigger: function () {
						var fn,
							args,
							_self = this;
						_unshift.call(arguments, cache);
						args = arguments;
						fn = function () {
							return _trigger.apply(_self, args);
						};
						if (offlineStack) {
							return offlineStack.push(fn);
						}
						return fn();
					}
				};
			return namespace ?
				(namespaceCache[namespace] ? namespaceCache[namespace] :
					namespaceCache[namespace] = ret) :
				ret;
		};
		return {
			create: _create,
			one: function (key, fn, last) {
				var event = this.create();
				event.one(key, fn, last);
			},
			remove: function (key, fn) {
				var event = this.create();
				event.remove(key, fn);
			},
			listen: function (key, fn, last) {
				var event = this.create();
				event.listen(key, fn, last);
			},
			trigger: function () {
				var event = this.create();
				event.trigger.apply(this, arguments);
			}
		};
	}();
	return Event;
})()

// 先发布后订阅
finalEvent.trigger('squareMeter88', 2000000); // 售楼处发布消息

finalEvent.listen('squareMeter88', function (price) { // 小红订阅消息
	console.log('价格= ' + price); // 输出：'价格=2000000' 
});

// 命名空间
finalEvent.create('namespace1').listen('click', function (a) {
	console.log(a); // 输出：1 
});
finalEvent.create('namespace1').trigger('click', 1);
finalEvent.create('namespace2').listen('click', function (a) {
	console.log(a); // 输出：2 
});
finalEvent.create('namespace2').trigger('click', 2);