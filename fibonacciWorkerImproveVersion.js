// Worker 线程
self.onmessage = function (e) {
  var n = e.data;
  var a = 0, b = 1, sum = 0;

  // 计算斐波那契数列的第 n 项
  for (var i = 2; i <= n; i++) {
    sum = a + b;
    a = b;
    b = sum;
  }

  // 由于 F(1) = 1, 需要对 n 进行特殊处理
  if (n === 1) {
    sum = 1;
  }

  // 将计算结果发送回主线程
  self.postMessage(sum);
};