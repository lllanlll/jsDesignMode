/**
 * 
 * 单例模式: 一个类只有一个实例
 * 标准单例
 * 惰性单例
 */
const standardSingle = function() {
    const SingleTon = function(name) {
        this.name = name;
    }
    
    SingleTon.prototype.getName = function() {
        console.log(this.name);
    }
    
    SingleTon.getInstance = (function() {
        let instance = null;
        return function(name) {
            if (!this.instance) {
                this.instance = new SingleTon(name);
            }
            return instance;
        }
    })()
    
    const a = SingleTon.getInstance('seven1');
    
    const b = SingleTon.getInstance('seven2');
    
    console.log(a === b);
}
standardSingle();

/**
 * 
 * 代理实现单例模式
 * 创建节点
 */
const proxySingle = function() {
    const CreateDiv = function(html) {
        this.html = html;
        this.init();
    };
    
    CreateDiv.prototype.init = function() {
        console.log(this.html);
        // let div = document.createElement('div');
        // div.innerHTML = this.html;
        // document.body.appendChild(div);
    };
    
    // 引入代理类
    
    const ProxySingleTonCreateDiv = (function() {
        let instance;
        return function(html) {
            if(!instance) {
                instance = new CreateDiv(html);
            }
            return instance;
        }
    })();
    
    const a = new ProxySingleTonCreateDiv('seven1');
    
    const b = new ProxySingleTonCreateDiv('seven2');
    
    console.log(a === b);

}

proxySingle();