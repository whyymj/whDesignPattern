/**
 * 模仿Java方法热加载；
 *  例子：
 *  var obj = new reloadFun()
 *  obj.addFun('name', function (fir, sec) {
 *  console.log(fir + '>' + sec)
 *  }).addFun('name', function (name) {
 *  console.log('>>' + name);
 *  })
 *  obj.runFun('name')('w', 'h', 'hehe');
 */
export function reloadFun() {
  this.cacheForArgLen = {};
  this.cacheForArgType = {};
  this.addFun = function (name, fun) {
    if (typeof this.cacheForArgLen[name] == 'object') {
      if (Array.isArray(this.cacheForArgLen[name]['' + fun.length])) {
        this.cacheForArgLen[name]['' + fun.length].push(fun);
      } else {
        this.cacheForArgLen[name]['' + fun.length] = [fun];
      }
    } else {
      this.cacheForArgLen[name] = {};
      this.cacheForArgLen[name]['' + fun.length] = [fun];
    }
    return this;
  };
  this.runFun = function (name) {
    var arr = this.cacheForArgLen[name];
    var paralen;
    if (typeof arr == 'object') {
      return function () {
        var thatArg = arguments;
        paralen = arguments.length;
        if (Array.isArray(arr['' + paralen]) && arr['' + paralen].length > 0) {
          var len = arr['' + paralen].length;
          for (var i = 0; i < len; i++) {
            arr['' + paralen][i].apply(this, arguments)
          }
        } else {
          for (var key in arr) {
            arr[key].map(function (item) {
              if (typeof item == 'function') {
                item.apply(this, thatArg);
              }
            })
          }
        }
      }
    }
    return function () {};
  }
}
