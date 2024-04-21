// Worker 线程
self.onmessage = function (e) {
  var n = e.data;
  if (n <= 1) {
    self.postMessage(n);
    return;
  }
  // 递归计算斐波那契数
  var fib = function (x) {
    if (x <= 1) return x;
    return fib(x - 1) + fib(x - 2);
  };

  // 计算并发送结果
  self.postMessage(fib(n));
};

// 这个 Worker 脚本应该保存在一个名为 fibonacciWorker.js 的文件中