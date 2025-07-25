/**
 * 更新日期：2024-04-05 15:30:15
 * 用法：Sub-Store 脚本操作添加
 * rename.js 以下是此脚本支持的参数，必须以 # 为开头多个参数使用"&"连接，参考上述地址为例使用参数。 禁用缓存url#noCache
 *
 *** 主要参数
 * [in=] 自动判断机场节点名类型 优先级 zh(中文) -> flag(国旗) -> quan(英文全称) -> en(英文简写)
 * 如果不准的情况, 可以加参数指定:
 *
 * [nm]    保留没有匹配到的节点
 * [in=zh] 或in=cn识别中文
 * [in=en] 或in=us 识别英文缩写
 * [in=flag] 或in=gq 识别国旗 如果加参数 in=flag 则识别国旗 脚本操作前面不要添加国旗操作 否则移除国旗后面脚本识别不到
 * [in=quan] 识别英文全称

 *
 * [out=]   输出节点名可选参数: (cn或zh ，us或en ，gq或flag ，quan) 对应：(中文，英文缩写 ，国旗 ，英文全称) 默认中文 例如 [out=en] 或 out=us 输出英文缩写
 *** 分隔符参数
 *
 * [fgf=]   节点名前缀或国旗分隔符，默认为空格；
 * [sn=]    设置国家与序号之间的分隔符，默认为空格；
 * 序号参数
 * [one]    清理只有一个节点的地区的01
 * [flag]   给节点前面加国旗
 *
 *** 前缀参数
 * [name=]  节点添加机场名称前缀；
 * [nf]     把 name= 的前缀值放在最前面
 *** 保留参数
 * [blkey=iplc+gpt+NF+IPLC] 用+号添加多个关键词 保留节点名的自定义字段 需要区分大小写!
 * 如果需要修改 保留的关键词 替换成别的 可以用 > 分割 例如 [#blkey=GPT>新名字+其他关键词] 这将把【GPT】替换成【新名字】
 * 例如      https://raw.githubusercontent.com/Keywos/rule/main/rename.js#flag&blkey=GPT>新名字+NF
 * [blgd]   保留: 家宽 IPLC ˣ² 等
 * [bl]     正则匹配保留 [0.1x, x0.2, 6x ,3倍]等标识
 * [nx]     保留1倍率与不显示倍率的
 * [blnx]   只保留高倍率
 * [clear]  清理乱名
 * [blpx]   如果用了上面的bl参数,对保留标识后的名称分组排序,如果没用上面的bl参数单独使用blpx则不起任何作用
 * [blockquic] blockquic=on 阻止; blockquic=off 不阻止
 */

const inArg = $arguments || {};

const clear = inArg.clear === true || inArg.clear === 'true';
const nm = inArg.nm === true || inArg.nm === 'true';
const addFlag = inArg.flag === true || inArg.flag === 'true';
const prefixName = inArg.name ? decodeURI(inArg.name) : '';
const FGF = ' ';

const nameclear = /(套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|TEST|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|USE|USED|TOTAL|EXPIRE|EMAIL)/i;

// 国家与国旗对应（简化版，按需要扩展）
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
  // ...根据需要补充
};

// 兼容英文简写（简写到国家中文名）
const countryAlias = {
  'HK': '香港',
  'MO': '澳门',
  'TW': '台湾',
  'JP': '日本',
  'KR': '韩国',
  'SG': '新加坡',
  'US': '美国',
  'GB': '英国',
  'FR': '法国',
  'DE': '德国',
  'AU': '澳大利亚',
  'AE': '阿联酋',
  // ...根据需要补充
};

function getFlagByName(name) {
  for (const key in countryMap) {
    if (name.includes(key)) return countryMap[key];
  }
  // 尝试英文简写匹配
  for (const key in countryAlias) {
    if (name.includes(key)) {
      const cn = countryAlias[key];
      return countryMap[cn] || '';
    }
  }
  return '';
}

function operator(proxies) {
  if (!Array.isArray(proxies)) return proxies;

  // 先过滤无用节点
  if (clear) {
    proxies = proxies.filter(item => !nameclear.test(item.name));
  }

  // 加前缀，增添国旗
  proxies.forEach(item => {
    let newName = item.name;

    if (prefixName) {
      newName = prefixName + newName;
    }

    // 添加国旗
    if (addFlag) {
      const flag = getFlagByName(item.name);
      if (flag) {
        newName = flag + ' ' + newName;
      } // else不处理，不强制添加国旗
    }

    item.name = newName;
  });

  // nm为true时保留所有节点，不做其他过滤，false则过滤掉没名称或可能空名节点
  if (!nm) {
    proxies = proxies.filter(item => item.name && item.name.trim() !== '');
  }

  return proxies;
}

// 执行
operator($items);
