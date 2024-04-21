// 创建一个新的 Web Worker
// var worker = new Worker('sumWorker.js');

// // Web Worker 完成任务后发送消息
// worker.onmessage = function (e) {
//   console.log('The sum is', e.data);
// };

// // 将大数据数组发送给 Web Worker
// worker.postMessage(bigDataArray);

// 主线程
var worker = new Worker('fibonacciWorker.js');

worker.onmessage = function (e) {
  console.log(`斐波那契数列第 ${n} 项是: ${e.data}`);
};

// 假设我们要计算斐波那契数列的第 40 项
var n = 40;
worker.postMessage(n);