/**
 * 
 * 代理模式
 */

// 普通代理模式
// 小明通过闺蜜代理向girl送花
// 代理监听gril心情 选择送花时机增加成功率
// 使用代理是因为小明并不知道girl的心情变化
const normalProxyMode = function () {
    const Flower = function () {};

    const xiaoming = {
        sendFlower: function (target) {
            const flower = new Flower();
            target.receiveFlower(flower);
        }
    };

    const guimi = {
        transitFlower: function (flower) {
            girl.listenGoodMood(function () {
                girl.receiveFlower(flower);
            })
        }
    }

    const girl = {
        receiveFlower: function (flower) {
            console.log('receive flower' + flower);
        },
        listenGoodMood: function (fn) {
            // 假设5s后心情变好
            setTimeout(() => {
                fn();
            }, 5000);
        }
    }

    xiaoming.sendFlower(guimi);
}

// 虚拟代理实现图片预加载
const preLoadVirtualProxy = function () {

    const myImage = (function () {

        let imgNode = document.createElement('img');
        document.body.appendChild(imgNode);
        return {
            setSrc: function (src) {
                imgNode.src = src;
            }
        }

    })();

    const proxyImg = (function () {

        const img = new Image();

        // 为img的加载完成绑定回调函数
        img.onload = function () {
            myImage.setSrc(this.src);
        }
        return {
            setSrc: function (src) {
                myImage.setSrc('本地占位图');
                img.src = src;
            }
        }
    })();

    proxyImg.setSrc('要加载的图');

}

// 虚拟代理合并http请求
const proxyMergeRequest = function () {

    // 模拟文件上传
    const synchronousFile = function (id) {
        console.log('开始上传图片, id为:' + id);
    }

    // 2s内点击的checkbox被保存在cache中 2s后一并上传
    const proxySynchronousFile = (function () {

        let cache = [];
        let timer;
        return function (id) {
            cache.push(id);
            if (timer) return;
            timer = setTimeout(() => {
                synchronousFile(cache.join(','));
                clearTimeout(timer);
                timer = null;
                cache.length = 0;
            }, 2000);
        }


    })();

    // 绑定点击上传
    var checkbox = document.getElementsByTagName('input');
    for (var i = 0, c; c = checkbox[i++];) {

        c.onclick = function () {
            if (this.checked === true) {
                proxySynchronousFile(this.id);
            }
        }
    };

}

// 缓存代理
// 计算乘积, 计算加和
const cacheProxy = function () {

    // 普通计算乘积函数
    const mult = function () {

        let a = 1;
        for (let i = 0, l = arguments.length; i < l; i++) a *= arguments[i];
        return a;

    }

    // 普通计算加和函数
    const plus = function () {

        let a = 0;
        for (let i = 0, l = arguments.length; i < l; i++) a += arguments[i];
        return a;

    };

    // 代理工厂
    const createProxyFactory = function (fn) {

        const cache = {};
        return function () {

            const args = [].join.call(arguments, ',');
            if (args in cache) return cache[args];
            return cache[args] = fn.apply(this, arguments);

        }

    };

    const proxyMult = createProxyFactory(mult);
    const proxyPlus = createProxyFactory(plus);

    console.log(proxyMult(1, 2, 3, 4));
    console.log(proxyPlus(1, 2, 3, 4));

    // 未计算 直接返回值
    console.log(proxyMult(1, 2, 3, 4));
    console.log(proxyPlus(1, 2, 3, 4));

}