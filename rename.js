// 修改节点名称的脚本
function operator(proxies) {
  // 从脚本参数中获取要添加的机场名称
  const airportName = $arguments.name || '';
  
  // 遍历所有代理节点
  proxies.forEach(proxy => {
    // 如果提供了机场名称，则在节点名称前添加
    if (airportName) {
      proxy.name = `${airportName} ${proxy.name}`;
    }
  });
  
  return proxies;
}
