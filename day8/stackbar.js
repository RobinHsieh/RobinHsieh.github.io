import homepage from './main.js';  

export default function barpage(specificIndustry) {
  // 创建底部容器
  var bottomContainer = d3.select("body")
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
  var selectElement = bottomContainer.append("select") // 在底部容器中添加一个选择元素
    .attr("id", "dropdown"); // 设置选择元素的 id 属性为 "dropdown"

  const dropdownData = [
    { options: '2020' },
    { options: '2021' }
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
    .style('left', "50px"); // 设置 option 元素的左边定位样式为 50px

  // 创建堆叠条形图容器
  var barChartContainer = d3.select("body")
    .append("div") // 在 body 元素中添加一个 div 元素
    .attr("class", "stackbar-chart-container"); // 添加类名为 "stackbar-chart-container"

  // 定义解析 'NA' 字符串的函数，将其转换为 undefined
  const parseNA = string => (string === 'NA' ? undefined : string);

  // 定义数据处理函数，将 'NA' 替换为 undefined
  function nan(d) {
    return {
      '行業': parseNA(d['Type']), // 將屬性 category 的值進行 parseNA 轉換
      '公司': parseNA(d['Name']), 
      '2020營收': parseNA(d['2020_revenue']), 
      '2020淨利': parseNA(d['2020_net_income']), 
      '2020資本支出': parseNA(d['2020_Capital Expenditure']), 
      '2021營收': parseNA(d['2021_revenue']), 
      '2021淨利': parseNA(d['2021_net_income']), 
      '2021資本支出': parseNA(d['2021_Capital Expenditure']), 
    };
  }

  // 使用 d3.csv() 方法从 'example.csv' 读取数据，并在读取完成后执行指定的回调函数
  d3.csv('example.csv', nan).then(bardata => {
    //console.log('local csv', bardata); // 在控制台輸出從 CSV 檔案讀取的資料的第一個物件
    setupstackbarmap(bardata, specificIndustry); // 调用 setupstackbarmap 函数，传入读取的数据和特定行业参数
  });
};




function setupstackbarmap(data, specificIndustry) {
  let res = data; // 保存原始数据

  // 预设数据
  let result2020 = update(res, 2020, specificIndustry); // 更新数据
  let result2021 = update(res, 2021, specificIndustry); // 更新数据
  let result = result2020.concat(result2021)

  // 生成标题文字
  let title = 'computer and peripheral equipment' + " 基本資料(萬)";

  // 绘制初始图表
  draw_stackbar(result, title);

  // 点击事件的回调函数
  function click() {
    let year = this.value; // 获取下拉菜单中被选中的值
    let title = specificIndustry + " 基本資料(萬)"; // 生成标题文字
    let result2020 = update(res, 2020, specificIndustry); // 更新数据
    let result2021 = update(res, 2021, specificIndustry); // 更新数据
    let result = result2020.concat(result2021)
    //console.log(result)
    draw_stackbar(result, title); // 绘制图表
  }

  // 更新数据的函数
  function update(data, year, specificIndustry) {
    let result = data.filter(item => item['行業'] === specificIndustry) // 根据特定行业参数筛选数据
      .map(item => ({
        //'行業': item['行業'],
        '公司': item['公司'],
        '年分': year,
        '營收': Math.round(Math.abs(Number(item[year + '營收'].replace(/,/g, ''))) / 10000), // 将特定属性值进行数值处理
        '淨利': Math.round(Math.abs(Number(item[year + '淨利'].replace(/,/g, ''))) / 10000),
        '資本支出': Math.round(Math.abs(Number(item[year + '資本支出'].replace(/,/g, ''))) / 10000)
      }));

    return result;
  }

  // 监听下拉菜单的变化事件
  d3.select('#dropdown').on('change', click);
}

function draw_stackbar(res, title) {
  d3.selectAll('.stackbar-chart-container svg').remove(); // 清除旧图

  const width = 1440; // 设置画布宽度为 1000 像素
  const height = 900; // 设置画布高度为 600 像素
  const chart_margin = { top: 80, right: 80, bottom: 80, left: 80 }; // 设置图表的边距，包含上、右、下、左四个方向的边距值
  const chart_width = width - (chart_margin.left + chart_margin.right); // 计算图表的宽度，即画布宽度减去左右边距
  const chart_height = height - (chart_margin.top + chart_margin.bottom); // 计算图表的高度，即画布高度减去上下边距

  const svg = d3.selectAll('.stackbar-chart-container')
    .append('svg') // 创建 svg 元素
    .attr('width', chart_width) // 设置 svg 元素的宽度
    .attr('height', chart_width) // 设置 svg 元素的高度
    .append('g') // 在 svg 元素中创建一个 g 元素，用于放置图表元素
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr('transform', `translate(${chart_margin.left},${chart_margin.top})`);
  const stack = d3.stack()
    .keys(["營收", "淨利", "資本支出"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  const series = stack(res); // 使用堆叠函数生成堆叠数据

  // X 轴比例尺
  const xScale = d3.scaleBand()
    .domain(res.map(d => d.公司)) // 设置 X 轴的刻度范围为公司名称
    .range([0, chart_width - 80]) // 设置 X 轴的位置范围
    .padding(0.2); // 设置 X 轴的间隔比例

  const xSubgroup = d3.scaleBand()
    .domain(res.map(d => d.年分))
    .range([0, xScale .bandwidth()])
    .padding([0.1])


  // Y 轴比例尺
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => +d[1]))]) // 设置 Y 轴的刻度范围，从0到数据中最大值
    .range([chart_height, 0]); // 设置 Y 轴的位置范围

  // 颜色比例尺
  const colorScale = d3.scaleOrdinal()
    .domain(["營收", "淨利", "資本支出"]) // 设置颜色比例尺的域为營收、淨利和資本支出
    .range(["#FFC107", "#FF5722", "#3F51B5"]); // 设置颜色比例尺的输出范围，对应每个数据类别的颜色

  // 创建堆叠条形图
  const canvas = svg.selectAll("g")
  .data(series) // 绑定堆叠数据
  .join("g") // 创建 g 元素用于放置每组堆叠条形图
  .attr("fill", d => colorScale(d.key)); // 设置堆叠条形图的填充颜色

  canvas.selectAll("rect")
  .data(d => d) // 绑定每组数据
  .join("rect") // 创建矩形元素用于绘制每个堆叠条形图
  .attr("x", d => xScale(d.data.公司)+xSubgroup(d.data.年分)) // 设置矩形的 x 坐标，对应公司名称
  .attr("y", yScale(0)) // 设置初始的 y 坐标为底部
  .attr("height", 0) // 设置初始高度为0
  .attr("width", xSubgroup.bandwidth()) // 设置矩形的宽度，根据比例尺的间隔比例计算得出
  .transition() // 添加过渡效果
  .duration(1000) // 过渡的持续时间
  .delay((d, i) => i * 100) // 每个矩形的延迟时间，实现逐个绘制的效果
  .attr("y", d => yScale(d[1])) // 设置矩形的目标 y 坐标，对应堆叠的顶部
  .attr("height", d => yScale(d[0]) - yScale(d[1])); // 设置矩形的目标高度，根据堆叠的高度差计算得出

  canvas.selectAll("text")
  .data(d => d.filter(item => item[0] === 0)) // 绑定满足条件的数据
  .join("text") // 创建文本元素
  .text(d => {
    console.log(d); // 在控制台输出 d 的内容
    return d.data.年分; // 设置文本内容
  })
  .attr('x', d => xScale(d.data.公司) + xSubgroup(d.data.年分) + xSubgroup.bandwidth() / 2) // 设置文本的 x 坐标在矩形的中间位置
  .attr('y', d => yScale(d[0]) + 10) // 设置文本的 y 坐标在矩形顶部上方一定距离处
  .attr('text-anchor', 'middle') // 设置文本的水平对齐方式为居中对齐
  .attr('dominant-baseline', 'baseline') // 设置文本的垂直对齐方式为基线对齐
  .style('font-size', '12px') // 设置文本的字体大小
  .style('fill', 'black'); // 设置文本的颜色为黑色

  
  const header = svg.append('g').attr('class', 'bar-header')
    .attr('transform', `translate(${+chart_margin.right / 2},${-chart_margin.top / 2})`).append('text');
  header.append('tspan').text(title).style('font-size', '2em'); // 添加图表标题

  const xAxis = d3.axisBottom(xScale) // 创建 X 轴刻度生成器
    .tickSizeInner(-chart_height) // 设置内部刻度线的长度
    .tickSizeOuter(0) // 设置外部刻度线的长度
    .tickSize(0); // 设置刻度线的长度为0，即不显示刻度线

  const xAxisDraw = svg.append('g')
    .attr('transform', `translate(0, ${chart_height+10})`) // 将 X 轴向下平移至图表底部
    .attr('class', 'xaxis')
    .style('font-size', 16)
    .call(xAxis) // 绘制 X 轴
    .select('.domain') // 选择轴线元素
    .style('display', 'none'); // 设置轴线的显示属性为 none


  const yAxis = d3.axisLeft(yScale) // 创建 Y 轴刻度生成器
    .ticks(10)
    .tickSizeInner(-chart_width); // 设置内部刻度线的长度

  const yAxisDraw = svg.append('g')
    .attr('class', 'yaxis')
    .style('font-size', 12)
    .call(yAxis); // 绘制 Y 轴

  // 创建图例
  const legendWidth = 100; // 图例的宽度
  const legendHeight = 20; // 图例的高度

  const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${chart_width - legendWidth * 2}, ${-chart_margin.top / 1.1 })`);

  // 添加图例矩形和文本
  legend.selectAll('rect')
    .data(["營收", "淨利", "資本支出"]) // 绑定图例数据
    .join('rect')
    .attr('x', 0)
    .attr('y', (d, i) => i * (legendHeight + 5)) // 设置图例矩形的 y 坐标
    .attr('width', legendHeight)
    .attr('height', legendHeight)
    .attr('alignment-baseline', 'middle')
    .attr('fill', d => colorScale(d)); // 设置图例矩形的填充颜色

  legend.selectAll('text')
    .data(["營收", "淨利", "資本支出"]) // 绑定图例数据
    .join('text')
    .attr('x', legendHeight + 5)
    .attr('y', (d, i) => i * (legendHeight + 5) + legendHeight / 2) // 设置图例文本的 y 坐标
    .text(d => d) // 设置图例文本内容
    .attr('alignment-baseline', 'middle')
    .style('font-size', '12px');
}

function back(){
  d3.selectAll("#bottom-button").remove() // 移除页面中所有 id 为 "bottom-button" 的元素
  d3.selectAll(".stackbar-chart-container").remove() // 移除页面中所有 class 为 "stackbar-chart-container" 的元素
  homepage() // 调用 homepage 函数，返回主页
}
