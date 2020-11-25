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
	remove: function(key, fn) {

		// 获取此key的所有回调
		const fns = this.clientList[key];

		// 若此key无订阅的fn 返回false
		if(!fns || fns.length === 0) return false;

		// 若不传fn 则取消所有回调
		if(!fn) {
			fns && (fns.length = 0);
		} else {
			for(let i = fns.length - 1; i > 0; i++) {
				if(fns[i] === fn) fns.splice(i, 1);
			}
		}

	}
	
};

// 定义安装函数 为其他对象添加发布订阅
const installEvent = function (obj) {
	for(let i in Events) obj[i] = Events[i];
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
