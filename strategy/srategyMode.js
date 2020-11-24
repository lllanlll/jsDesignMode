/**
 * 
 * 策略模式: 定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。
 * 一个基于策略模式的程序至少由两部分组成。第一个部分是一组策略类，策略类封装了具体
 * 的算法，并负责具体的计算过程。第二个部分是环境类 Context，Context 接受客户的请求，随后
 * 把请求委托给某一个策略类。要做到这点，说明 Context 中要维持对某个策略对象的引用。
 */

// 情景: 计算年终绩效奖金 分为S A B档
// 普通形式(简单函数功能抽离)
const normalMode = function () {
    var performanceS = function (salary) {
        return salary * 4;
    };
    var performanceA = function (salary) {
        return salary * 3;
    };
    var performanceB = function (salary) {
        return salary * 2;
    };
    var calculateBonus = function (performanceLevel, salary) {
        if (performanceLevel === 'S') {
            return performanceS(salary);
        }
        if (performanceLevel === 'A') {
            return performanceA(salary);
        }
        if (performanceLevel === 'B') {
            return performanceB(salary);
        }
    };
    calculateBonus('A', 10000); // 输出：30000
}

// 传统面向对象语言的策略模式
const traditionalObject = function () {
    // 定义绩效等级类
    var performanceS = function () {};
    performanceS.prototype.calculate = function (salary) {
        return salary * 4;
    };
    var performanceA = function () {};
    performanceA.prototype.calculate = function (salary) {
        return salary * 3;
    };
    var performanceB = function () {};
    performanceB.prototype.calculate = function (salary) {
        return salary * 2;
    };

    // 定义奖金类
    var Bonus = function () {
        this.salary = null; // 原始工资
        this.strategy = null; // 绩效等级对应的策略对象
    };
    Bonus.prototype.setSalary = function (salary) {
        this.salary = salary; // 设置员工的原始工资
    };
    Bonus.prototype.setStrategy = function (strategy) {
        this.strategy = strategy; // 设置员工绩效等级对应的策略对象
    };
    Bonus.prototype.getBonus = function () { // 取得奖金数额
        return this.strategy.calculate(this.salary); // 把计算奖金的操作委托给对应的策略对象
    };

    var bonus = new Bonus();
    bonus.setSalary(10000);
    bonus.setStrategy(new performanceS()); // 设置策略对象
    bonus.getBonus();
}

// 使用js版本的策略模式: 直接将strategy定义为函数
const jsStrategyMode = function () {
    const strategies = {
        "S": function (salary) {
            return salary * 4;
        },
        "A": function (salary) {
            return salary * 3;
        },
        "B": function (salary) {
            return salary * 2;
        }
    }
    const calculateBonus = function (level, salary) {
        return strategies[level](salary);
    }
    calculateBonus('S', 20000);
}

// 表单验证的策略模式
const formCheckStrategy = function () {
    var strategies = {
        isNonEmpty: function (value, errorMsg) { // 不为空
            if (value === '') {
                return errorMsg;
            }
        },
        minLength: function (value, length, errorMsg) { // 限制最小长度
            if (value.length < length) {
                return errorMsg;
            }
        },
        isMobile: function (value, errorMsg) { // 手机号码格式
            if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
                return errorMsg;
            }
        }
    };

    var Validator = function () {
        this.cache = [];
    };
    Validator.prototype.add = function (dom, rules) {
        var self = this;
        for (var i = 0, rule; rule = rules[i++];) {
            (function (rule) {
                var strategyAry = rule.strategy.split(':');
                var errorMsg = rule.errorMsg;
                self.cache.push(function () {
                    var strategy = strategyAry.shift();
                    strategyAry.unshift(dom.value);
                    strategyAry.push(errorMsg);
                    return strategies[strategy].apply(dom, strategyAry);
                });
            })(rule)
        }
    };
    Validator.prototype.start = function () {
        for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
            var errorMsg = validatorFunc();
            if (errorMsg) {
                return errorMsg;
            }
        }
    };

    var registerForm = document.getElementById('registerForm');
    var validataFunc = function () {
        var validator = new Validator();
        validator.add(registerForm.userName, [{
            strategy: 'isNonEmpty',
            errorMsg: '用户名不能为空'
        }, {
            strategy: 'minLength:10',
            errorMsg: '用户名长度不能小于 10 位'
        }]);
        validator.add(registerForm.password, [{
            strategy: 'minLength:6',
            errorMsg: '密码长度不能小于 6 位'
        }]);
        validator.add(registerForm.phoneNumber, [{
            strategy: 'isMobile',
            errorMsg: '手机号码格式不正确'
        }]);
        var errorMsg = validator.start();
        return errorMsg;
    }
    registerForm.onsubmit = function () {
        var errorMsg = validataFunc();
        if (errorMsg) {
            alert(errorMsg);
            return false;
        }
    };
}