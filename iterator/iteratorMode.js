/**
 * 
 * 迭代器模式
 * 分为
 * 内部迭代: 迭代器内部定义规则外部只需要一次调用即可 (简单 但不方便修改)
 * 
 * 外部迭代: 显式地请求迭代下一个元素 (更复杂 但更灵活)
 * 
 */

// 实现一个内部迭代器（each）
const innerIterator = function() {

    const each = function(arr, callback) {
        for(let i = 0, l = arr.length; i < l; i++) callback.call(arr[i], i, arr[i]);
    }
    
    each([1, 2, 3], function(i, n) {
        console.log(i, n);
    })

}


// 外部迭代器 实现数组是否相等
const outerIterator = function() {

    const Iterator = function(obj) {
        let cur = 0;

        const next = function() {
            cur++;
        }

        const isDone = function() {
            return cur > obj.length;
        }

        const getCurItem = function() {
            return obj[cur];
        }

        const getLen = function() {
            return obj.length;
        }

        return {
            next,
            isDone,
            getCurItem,
            getLen
        }
    }

    const compare = function(iterator1, iterator2) {

        if(iterator1.getLen() !== iterator2.getLen()) throw new Error('not equal!');
        while(!iterator1.isDone() && !iterator2.isDone()) {
            if(iterator1.getCurItem() !== iterator2.getCurItem()) {
                throw new Error('not equal!');
            }
            iterator1.next();
            iterator2.next();
        }
        console.log('equal');

    }

    const iterator1 = Iterator([1, 2]);
    const iterator2 = Iterator([1]);

    compare(iterator1, iterator2);
}

outerIterator();
