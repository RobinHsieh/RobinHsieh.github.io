import homepage from './main.js';  
import drawscatter from './scatter.js';

export default function barpage(specificIndustry) {
  // 创建底部容器
  let bottomContainer = d3.select("body")
    .append("div") // 在 body 元素中添加一个 div 元素
    .attr("class", "bottom-container"); // 添加类名为 "bottom-container"

  // 添加上一頁按鈕
  bottomContainer.append("button") // 在底部容器中添加一个按钮元素
    .attr("id", "bottom-button") // 设置按钮元素的 id 属性为 "bottom-button"
    .style("font-size", "16px") // 设置按钮元素的字体大小样式为 16px
    .style("margin-right", "10px") // 设置按钮元素的右边距样式为 10px
    .text("上一頁") // 设置按钮元素的文本内容为 "上一頁"
    .on('click', back); // 添加点击事件监听器，当按钮被点击时执行 back 函数

  // 创建下拉菜单容器
  let selectElement = bottomContainer.append("select") // 在底部容器中添加一个选择元素
    .attr("id", "dropdown"); // 设置选择元素的 id 属性为 "dropdown"

  const dropdownData = [
    { options: '營收' },
    { options: '淨利'},
    { options: '資本支出'},
    { options: '直接碳排' },
    { options: '間接碳排' },
    { options: '產業鏈碳排' },
    { options: '電力使用'},
    { options: '用水量'},
    { options: '廢棄物總量'},
    { options: '有害廢棄物'}
  ];

  // 绑定数据到下拉菜单
  selectElement.selectAll("option") // 选择下拉菜单中的所有 option 元素
    .data(dropdownData) // 绑定数据到选中的元素上
    .enter() // 进入数据绑定的处理流程
    .append("option") // 对于每个未绑定数据的元素，创建一个 option 元素
    .text(function (d) { return d.options; }) // 设置 option 元素的文本内容为数据中的选项
    .style('position', 'fixed') // 设置 option 元素的固定定位样式
    .style('font-size', "16px") // 设置 option 元素的字体大小样式为 16px
    .style('top', '50px') // 设置 option 元素的顶部定位样式为 50px
    .style('left', "50px") // 设置 option 元素的左边定位样式为 50px
    .style("margin-right", "10px") // 设置按钮元素的右边距样式为 10px


  // 创建堆叠条形图容器
  let barChartContainer = d3.select("body")
    .append("div") // 在 body 元素中添加一个 div 元素
    .attr("class", "stackbar-chart-container"); // 添加类名为 "stackbar-chart-container"

  // 定义解析 'NA' 字符串的函数，将其转换为 undefined
  const parseNA = string => (string === 'nan' ? '0' : string);

  // 定义数据处理函数，将 'NA' 替换为 undefined
  function nan(d) {
    return {
      '行業': parseNA(d['產業類別']), // 將屬性 category 的值進行 parseNA 轉換
      '公司': parseNA(d['公司名稱']+parseNA(d['股票代碼'])), 
      '2020營收': parseNA(d['2020營收']), 
      '2020淨利': parseNA(d['2020淨利(稅前)']), 
      '2020資本支出': parseNA(d['2020資本支出']), 
      '2021營收': parseNA(d['2021營收']), 
      '2021淨利': parseNA(d['2021淨利(稅前)']), 
      '2021資本支出': parseNA(d['2021資本支出']), 
      '2020範疇一':parseNA(d['2020範疇一']),
      '2020範疇二':parseNA(d['2020範疇二']),
      '2020範疇三':parseNA(d['2020範疇三']),
      '2021範疇一':parseNA(d['2021範疇一']),
      '2021範疇二':parseNA(d['2021範疇二']),
      '2021範疇三':parseNA(d['2021範疇三']),
      '2020能源使用':parseNA(d['2020能源使用']),
      '2021能源使用':parseNA(d['2021能源使用']),
      '2020用水量':parseNA(d['2020用水量(t)']),
      '2021用水量':parseNA(d['2021用水量(t)']),
      '2020廢棄物產生量':parseNA(d['2020廢棄物產生量']),
      '2021廢棄物產生量':parseNA(d['2021廢棄物產生量']),
      '2020有害廢棄物'  :parseNA(d['2020有害廢棄物產生量']),
      '2021有害廢棄物'  :parseNA(d['2021有害廢棄物產生量']),
    };
  }

  // 使用 d3.csv() 方法从 'example.csv' 读取数据，并在读取完成后执行指定的回调函数
  d3.csv('example-Carbon.csv', nan).then(bardata => {
    // console.log('local csv', bardata); // 在控制台輸出從 CSV 檔案讀取的資料的第一個物件
    setupstackbarmap(bardata, specificIndustry); // 调用 setupstackbarmap 函数，传入读取的数据和特定行业参数
    drawscatter(specificIndustry);
  });
};

function setupstackbarmap(data, specificIndustry) {
  let res = data; // 保存原始数据
  let target = "營收"
  // 预设数据
  let result2020 = update(res, 2020, specificIndustry,target); // 更新数据
  let result2021 = update(res, 2021, specificIndustry,target); // 更新数据
  let result = result2020.concat(result2021)
  // 生成标题文字
  let title = specificIndustry + " "+target;

  // 绘制初始图表
  draw_stackbar(result, title,target);

  // 点击事件的回调函数
  function click() {
    let target = this.value
    let title = specificIndustry + " "+target;; // 生成标题文字
    let result2020 = update(res, 2020, specificIndustry,target); // 更新数据
    let result2021 = update(res, 2021, specificIndustry,target); // 更新数据
    let result = result2020.concat(result2021)
    draw_stackbar(result, title,target); 
    drawscatter(specificIndustry);// 绘制图表
  }

  // 更新数据的函数
  function update(data, year, specificIndustry,target) {
    if (target == "營收"){
      let result = data.filter(item => item['行業'] === specificIndustry) // 根据特定行业参数筛选数据
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '營收': Math.round(Math.abs(Number(item[year + '營收'].replace(/,/g, ''))) / 10000), // 将特定属性值进行数值处理
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小进行降序排序
        return result;
      }
    if (target == "淨利"){
      let result = data.filter(item => item['行業'] === specificIndustry) // 根据特定行业参数筛选数据
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '淨利': Math.round(Math.abs(Number(item[year + '淨利'].replace(/,/g, ''))) / 10000),
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小进行降序排序
        return result;
      }
    if (target == "資本支出"){
      let result = data.filter(item => item['行業'] === specificIndustry) // 根据特定行业参数筛选数据
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '資本支出': Math.round(Math.abs(Number(item[year + '資本支出'].replace(/,/g, ''))) / 10000)
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小进行降序排序
        return result;
      }
    if (target == "直接碳排"){
      let result = data.filter(item => item['行業'] === specificIndustry) // 根据特定行业参数筛选数据
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '直接碳排': Math.round(Math.abs(Number(item[year + '範疇一'].replace(/,/g, ''))) ), // 将特定属性值进行数值处理
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小进行降序排序
        return result;
      }
    if (target == "間接碳排"){
      let result = data.filter(item => item['行業'] === specificIndustry) // 根据特定行业参数筛选数据
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '間接碳排': Math.round(Math.abs(Number(item[year + '範疇二'].replace(/,/g, ''))) ),
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小进行降序排序
        return result;
      }
    if (target == "產業鏈碳排"){
      let result = data.filter(item => item['行業'] === specificIndustry) // 根据特定行业参数筛选数据
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '產業鏈碳排': Math.round(Math.abs(Number(item[year + '範疇三'].replace(/,/g, ''))) )
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小进行降序排序
        return result;
      }
    if (target == "電力使用"){
      let result = data.filter(item => item['行業'] === specificIndustry) // 根据特定行业参数筛选数据
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '能源使用': Math.round(Math.abs(Number(item[year + '能源使用'].replace(/,/g, ''))) ), // 将特定属性值进行数值处理
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小进行降序排序
        return result;
      }
    if (target == "用水量"){
      let result = data.filter(item => item['行業'] === specificIndustry) // 根据特定行业参数筛选数据
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '用水量': Math.round(Math.abs(Number(item[year + '用水量'].replace(/,/g, ''))) ),
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小进行降序排序
        return result;
      }
    if (target == "廢棄物總量"){
      let result = data.filter(item => item['行業'] === specificIndustry) // 根据特定行业参数筛选数据
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '廢棄物總量': Math.round(Math.abs(Number(item[year + '廢棄物產生量'].replace(/,/g, ''))) ), // 将特定属性值进行数值处理
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小进行降序排序
        return result;
      }
    if (target == "有害廢棄物"){
      let result = data.filter(item => item['行業'] === specificIndustry) // 根据特定行业参数筛选数据
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '有害廢棄物': Math.round(Math.abs(Number(item[year + '有害廢棄物'].replace(/,/g, ''))) ),
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小进行降序排序
        return result;
      }
  }

  // 监听下拉菜单的变化事件
  d3.select('#dropdown').on('change', click);
}

function draw_stackbar(res, title,target) {
  // console.log(res)
  d3.selectAll('.stackbar-chart-container svg').remove(); // 清除旧图
  let project,color;
  if (target == '營收'){
    project = ["營收"]
    color = ["#FFC107"]
  }
  else if(target == '淨利'){
    project = ["淨利"]
    color = ["#FF5722"]
  }
  else if(target == '資本支出'){
    project = ["資本支出"]
    color = ["#3F51B5"]
  }
  else if(target == '直接碳排'){
    project = ["直接碳排"]
    color = ["#FFC107"]
  }
  else if(target == '間接碳排'){
    project = ["間接碳排"]
    color = ["#FF5722"]
  }
  else if(target == '產業鏈碳排'){
    project = ["產業鏈碳排"]
    color = ["#3F51B5"]
  }
  else if(target == '電力使用'){
    project = ["能源使用"]
    color = ["#FFC107", "#FF5722", "#3F51B5"]
  }
  else if(target == '用水量'){
    project = ["用水量"]
    color = ["#3F51B5"]
  }
  else if(target == '廢棄物總量'){
    project = ["廢棄物總量"]
    color = ["#FFC107", "#FF5722", "#3F51B5"]
  }
  else if(target == '有害廢棄物'){
    project = ["有害廢棄物"]
    color =  ["#FF5722"]
  }
  
  const width = document.body.clientWidth*0.6; // 设置画布宽度为一半
  const height = document.body.clientWidth*0.4; // 设置画布高度为 600 像素
  const chart_margin = { top: 60, right: 60, bottom: 60, left: 60 }; // 设置图表的边距，包含上、右、下、左四个方向的边距值
  const chart_width = width - (chart_margin.left + chart_margin.right); // 计算图表的宽度，即画布宽度减去左右边距
  const chart_height = height - (chart_margin.top + chart_margin.bottom); // 计算图表的高度，即画布高度减去上下边距

  const svg = d3.selectAll('.stackbar-chart-container')
    .append('svg') // 创建 svg 元素
    .attr('width', width) // 设置 svg 元素的宽度
    .attr('height', height) // 设置 svg 元素的高度
    .append('g') // 在 svg 元素中创建一个 g 元素，用于放置图表元素
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr('transform', `translate(${chart_margin.left},${chart_margin.top})`)
    .style('font-family', 'Arial') // 设置字体样式，例如 Arial;

  const stack = d3.stack()
    .keys(project)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  const series = stack(res); // 使用堆叠函数生成堆叠数据

  // X 轴比例尺
  const xScale = d3.scaleBand()
    .domain(res.map(d => d.公司)) // 设置 X 轴的刻度范围为公司名称
    .range([0, chart_width ]) // 设置 X 轴的位置范围
    .padding(0.2); // 设置 X 轴的间隔比例

  const xSubgroup = d3.scaleBand()
    .domain(res.map(d => d.年分))
    .range([0, xScale .bandwidth()])
    .padding([0.1])


  // Y 轴比例尺
  const dmax = d3.max(series, d => d3.max(d, d => +d[1]))
  const yScale = d3.scaleLog() // 创建对数比例尺
    .base(Math.sqrt(10)) // 设置底数为 10
    .domain([1, dmax]) // 设置 Y 轴的刻度范围，从0到数据中最大值
    .range([chart_height, 40]); // 设置 Y 轴的位置范围

  // 颜色比例尺
  const colorScale = d3.scaleOrdinal()
    .domain(project) // 设置颜色比例尺的域为營收、淨利和資本支出
    .range(color); // 设置颜色比例尺的输出范围，对应每个数据类别的颜色

  // 创建堆叠条形图
  const canvas = svg.selectAll("g")
  .data(series) // 绑定堆叠数据
  .join("g") // 创建 g 元素用于放置每组堆叠条形图
  .attr("fill", d => colorScale(d.key)); // 设置堆叠条形图的填充颜色

  canvas.selectAll("rect")
  .data(d => d)
  .join("rect")
  .attr("x", d => xScale(d.data.公司) + xSubgroup(d.data.年分))
  .attr("y", yScale(1))
  .attr("height", 0)
  .attr("width", xSubgroup.bandwidth())
  .on("mouseover", function(event, d) { // 滑鼠懸停事件
    canvas.append("text")
      .attr("class", "value-label")
      .attr("x", xScale(d.data.公司) + xSubgroup(d.data.年分) + xSubgroup.bandwidth() / 2)
      .attr("y", yScale(d[1] + 1.2) - 15) // 文字方塊上移15個單位
      .text(d[1] - d[0]) // 顯示矩形值
      .attr("font-size", 12)
      .attr("fill", "black")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("pointer-events", "none"); // 避免文字方塊擋住滑鼠事件
  })
  .on("mouseout", function(event, d) { // 滑鼠離開事件
    // 移除文字方塊
    canvas.select(".value-label").remove();
  })
  .transition()  //彈出動畫控制
  .duration(1000)
  .delay((d, i) => i * 100)
  .attr("y", d => yScale(d[1] + 1))
  .attr("height", d => yScale(d[0] + 1) - yScale(d[1] + 1))
  

  

  canvas.selectAll("text")
  .data(d => d.filter(item => item[0] === 0)) // 绑定满足条件的数据
  .join("text") // 创建文本元素
  .text(d => {
    // console.log(d); // 在控制台输出 d 的内容
    return d.data.年分; // 设置文本内容
  })
  .attr('x', d => xScale(d.data.公司) + xSubgroup(d.data.年分) + xSubgroup.bandwidth() / 2) // 设置文本的 x 坐标在矩形的中间位置
  .attr('y', d => yScale(d[0]+1) + 12) // 设置文本的 y 坐标在矩形顶部上方一定距离处
  .attr('text-anchor', 'middle') // 设置文本的水平对齐方式为居中对齐
  .attr('dominant-baseline', 'baseline') // 设置文本的垂直对齐方式为基线对齐
  .style('font-size', '12px') // 设置文本的字体大小
  .style('fill', 'black') // 设置文本的颜色为黑色
  .style('font-family', 'Arial') // 设置字体样式，例如 Arial
  .style('font-weight', 'normal');


  
  const header = svg.append('g').attr('class', 'bar-header')
    .attr('transform', `translate(${+chart_margin.right/2},${-chart_margin.top / 2})`).append('text');
  header.append('tspan').text(title).style('font-size', '2em'); // 添加图表标题

  const xAxis = d3.axisBottom(xScale) // 创建 X 轴刻度生成器
    .tickSizeInner(-chart_height) // 设置内部刻度线的长度
    .tickSizeOuter(0) // 设置外部刻度线的长度
    .tickSize(0); // 设置刻度线的长度为0，即不显示刻度线

  const xAxisDraw = svg.append('g')
    .attr('transform', `translate(0, ${chart_height+15})`) // 将 X 轴向下平移至图表底部
    .attr('class', 'xaxis')
    .style('font-size', 16)
    .call(xAxis) // 绘制 X 轴
    .select('.domain') // 选择轴线元素
    .style('display', 'none'); // 设置轴线的显示属性为 none
  
  const yAxis = d3.axisLeft(yScale) // 创建 Y 轴刻度生成器
    .tickSizeInner(-chart_width) // 设置内部刻度线的长度
    .ticks(10, ".2s") // 设置刻度的数量和格式，这里使用 ".2s" 格式表示使用科学计数法显示刻度值
  
  const yAxisDraw = svg.append('g')
    .attr('class', 'yaxis')
    .style('font-size', 12)
    .call(yAxis); // 绘制 Y 轴
}

function back(){
  d3.selectAll("#bottom-button").remove() // 移除页面中所有 id 为 "bottom-button" 的元素
  d3.selectAll(".stackbar-chart-container").remove() // 移除页面中所有 class 为 "stackbar-chart-container" 的元素
  d3.selectAll(".bottom-container").remove() 
  homepage() // 调用 homepage 函数，返回主页
}
