// 参数由 $argument 传入，数组数据为 $items
// 例如：#name=硅谷 |&clear&flag&nm

const args = $argument || '';
const params = (() => {
  const res = {};
  const parts = args.split('&');
  parts.forEach(part => {
    const [key, val] = part.split('=');
    if (val === undefined) {
      res[key.trim()] = true; // 无值，赋true
    } else {
      res[key.trim()] = decodeURIComponent(val.trim());
    }
  });
  return res;
})();

const clear = !!params.clear;
const nm = !!params.nm;
const flagOn = !!params.flag;
const prefix = params.name || '';

const nameclear = /(套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|TEST|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|USE|USED|TOTAL|EXPIRE|EMAIL)/i;

// 国家及国旗字典
const countryMap = {
  '香港': '🇭🇰',
  '澳门': '🇲🇴',
  '台湾': '🇹🇼',
  '日本': '🇯🇵',
  '韩国': '🇰🇷',
  '新加坡': '🇸🇬',
  '美国': '🇺🇸',
  '英国': '🇬🇧',
  '法国': '🇫🇷',
  '德国': '🇩🇪',
  '澳大利亚': '🇦🇺',
  '阿联酋': '🇦🇪',
  // 可根据需要补充
};

// 支持英文简写映射到中文名
const countryAlias = {
  HK: '香港',
  MO: '澳门',
  TW: '台湾',
  JP: '日本',
  KR: '韩国',
  SG: '新加坡',
  US: '美国',
  GB: '英国',
  FR: '法国',
  DE: '德国',
  AU: '澳大利亚',
  AE: '阿联酋',
};

function getFlag(name) {
  for (const k in countryMap) {
    if (name.includes(k)) return countryMap[k];
  }
  for (const k in countryAlias) {
    if (name.includes(k)) {
      const cn = countryAlias[k];
      if (countryMap[cn]) return countryMap[cn];
    }
  }
  return '';
}

function rename(nodes) {
  if (!Array.isArray(nodes)) return nodes;
  let filtered = nodes;

  if (clear) {
    filtered = filtered.filter(i => !nameclear.test(i.name));
  }

  filtered.forEach(i => {
    let newName = i.name;

    if (prefix) {
      newName = prefix + newName;
    }

    if (flagOn) {
      const f = getFlag(i.name);
      if (f) newName = f + ' ' + newName;
    }

    i.name = newName;
  });

  if (!nm) {
    filtered = filtered.filter(i => i.name && i.name.trim() !== '');
  }

  return filtered;
}

$done({  // 这是surge/qx/clash环境通用返回方式
  // 对应你脚本实际变量名，如果是 $items 是节点数组
  // 你要替换输出节点集合名称，通常是兼容 $items
  // 很多脚本直接 return $done({items: rename($items)}) 或 $done({body: rename($items)}) 不会自动替换
  // 这里采用通用做法，用 items 输出，环境配合改
  items: rename($items)
});
