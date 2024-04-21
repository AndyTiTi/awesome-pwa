// 接收主线程发送的消息和数据
self.onmessage = function (e) {
  var大数据数组 = e.data;
  var sum = 0;

  // 进行计算密集型任务
  for (var i = 0; i < 大数据数组.length; i++) {
    sum += 大数据数组[i];
  }

  // 将结果发送回主线程
  self.postMessage(sum);
};