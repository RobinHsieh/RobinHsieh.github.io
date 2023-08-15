import homepage from './main.js';
import drawscatter from './scatter.js';

export default function barpage(specificIndustry) {
  // 創建底部容器
  let bottomContainer = d3.select(".custom-div")
    .append("div") // 在 .custom-div 類別中添加一個 div 元素
    .attr("class", "bottom-container"); // 添加類名為 "bottom-container"

  // 添加上一頁按鈕
  bottomContainer.append("button") // 在底部容器中添加一個按鈕元素
    .attr("id", "bottom-button") // 設置按鈕元素的 id 屬性為 "bottom-button"
    .style("font-size", "16px") // 設置按鈕元素的字體大小樣式為 16px
    .style("margin-right", "10px") // 設置按鈕元素的右邊距樣式為 10px
    .text("上一頁") // 設置按鈕元素的文本内容為 "上一頁"
    .on('click', back); // 添加點擊事件監聽器，當按鈕被點擊时执行 back 函數

  // 創建下拉菜單容器
  let selectElement = bottomContainer.append("select") // 在底部容器中添加一個選擇元素
    .attr("id", "dropdown"); // 設置選擇元素的 id 屬性為 "dropdown"

  const dropdownData = [
    { options: '營收' },
    { options: '淨利' },
    { options: '資本支出' },
    { options: '直接碳排' },
    { options: '間接碳排' },
    { options: '產業鏈碳排' },
    { options: '電力使用' },
    { options: '用水量' },
    { options: '廢棄物總量' },
    { options: '有害廢棄物' }
  ];

  // 綁定數據到下拉菜單
  selectElement.selectAll("option") // 選擇下拉菜單中的所有 option 元素
    .data(dropdownData) // 綁定數據到選中的元素上
    .enter() // 進入數據綁定的處理流程
    .append("option") // 對於每個未綁定數據的元素，創建一個 option 元素
    .text(function (d) { return d.options; }) // 設置 option 元素的文本内容為數據中的選项
    .style('position', 'fixed') // 設置 option 元素的固定定位樣式
    .style('font-size', "16px") // 設置 option 元素的字體大小樣式為 16px
    .style('top', '50px') // 設置 option 元素的頂部定位樣式為 50px
    .style('left', "50px") // 設置 option 元素的左邊定位樣式為 50px
    .style("margin-right", "10px") // 設置按鈕元素的右邊距樣式為 10px


  // 創建堆疊條形圖容器
  let customDiv = d3.select(".custom-div"); // 首先選擇 .custom-div

  let barChartContainer = customDiv
    .append("div") // 在 body 元素中添加一個 div 元素
    .attr("class", "stackbar-chart-container"); // 添加類名為 "stackbar-chart-container"

  // 定義解析 'NA' 字符串的函數，將其轉換為 undefined
  const parseNA = string => (string === 'nan' ? '0' : string);

  // 定義數據處理函數，將 'NA' 替換為 undefined
  function nan(d) {
    return {
      '行業': parseNA(d['產業類別']), // 將屬性 category 的值進行 parseNA 轉換
      '公司': parseNA(d['公司名稱'] + parseNA(d['股票代碼'])),
      '2020營收': parseNA(d['2020營收']),
      '2020淨利': parseNA(d['2020淨利(稅前)']),
      '2020資本支出': parseNA(d['2020資本支出']),
      '2021營收': parseNA(d['2021營收']),
      '2021淨利': parseNA(d['2021淨利(稅前)']),
      '2021資本支出': parseNA(d['2021資本支出']),
      '2020範疇一': parseNA(d['2020範疇一']),
      '2020範疇二': parseNA(d['2020範疇二']),
      '2020範疇三': parseNA(d['2020範疇三']),
      '2021範疇一': parseNA(d['2021範疇一']),
      '2021範疇二': parseNA(d['2021範疇二']),
      '2021範疇三': parseNA(d['2021範疇三']),
      '2020能源使用': parseNA(d['2020能源使用']),
      '2021能源使用': parseNA(d['2021能源使用']),
      '2020用水量': parseNA(d['2020用水量(t)']),
      '2021用水量': parseNA(d['2021用水量(t)']),
      '2020廢棄物產生量': parseNA(d['2020廢棄物產生量']),
      '2021廢棄物產生量': parseNA(d['2021廢棄物產生量']),
      '2020有害廢棄物': parseNA(d['2020有害廢棄物產生量']),
      '2021有害廢棄物': parseNA(d['2021有害廢棄物產生量']),
    };
  }

  // 使用 d3.csv() 方法從 'example.csv' 讀取數據，並在讀取完成后执行指定的回調函數
  d3.csv('./day10/example-Carbon.csv', nan).then(bardata => {
    // console.log('local csv', bardata); // 在控制台輸出從 CSV 檔案讀取的資料的第一個物件
    setupstackbarmap(bardata, specificIndustry); // 調用 setupstackbarmap 函數，傳入讀取的數據和特定行業参數
    drawscatter(specificIndustry);
  });
};

function setupstackbarmap(data, specificIndustry) {
  let res = data; // 保存原始數據
  let target = "營收"
  // 预設數據
  let result2020 = update(res, 2020, specificIndustry, target); // 更新數據
  let result2021 = update(res, 2021, specificIndustry, target); // 更新數據
  let result = result2020.concat(result2021)
  // 生成標題文字
  let title = specificIndustry + " " + target;

  // 繪制初始圖表
  draw_stackbar(result, title, target);

  // 點擊事件的回調函數
  function click() {
    let target = this.value
    let title = specificIndustry + " " + target;; // 生成標題文字
    let result2020 = update(res, 2020, specificIndustry, target); // 更新數據
    let result2021 = update(res, 2021, specificIndustry, target); // 更新數據
    let result = result2020.concat(result2021)
    draw_stackbar(result, title, target);
    drawscatter(specificIndustry);// 繪制圖表
  }

  // 更新數據的函數
  function update(data, year, specificIndustry, target) {
    if (target == "營收") {
      let result = data.filter(item => item['行業'] === specificIndustry) // 根據特定行業参數篩選數據
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '營收': Math.round(Math.abs(Number(item[year + '營收'].replace(/,/g, ''))) / 10000), // 將特定屬性值進行數值處理
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小進行降序排序
      return result;
    }
    if (target == "淨利") {
      let result = data.filter(item => item['行業'] === specificIndustry) // 根據特定行業参數篩選數據
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '淨利': Math.round(Math.abs(Number(item[year + '淨利'].replace(/,/g, ''))) / 10000),
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小進行降序排序
      return result;
    }
    if (target == "資本支出") {
      let result = data.filter(item => item['行業'] === specificIndustry) // 根據特定行業参數篩選數據
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '資本支出': Math.round(Math.abs(Number(item[year + '資本支出'].replace(/,/g, ''))) / 10000)
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小進行降序排序
      return result;
    }
    if (target == "直接碳排") {
      let result = data.filter(item => item['行業'] === specificIndustry) // 根據特定行業参數篩選數據
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '直接碳排': Math.round(Math.abs(Number(item[year + '範疇一'].replace(/,/g, '')))), // 將特定屬性值進行數值處理
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小進行降序排序
      return result;
    }
    if (target == "間接碳排") {
      let result = data.filter(item => item['行業'] === specificIndustry) // 根據特定行業参數篩選數據
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '間接碳排': Math.round(Math.abs(Number(item[year + '範疇二'].replace(/,/g, '')))),
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小進行降序排序
      return result;
    }
    if (target == "產業鏈碳排") {
      let result = data.filter(item => item['行業'] === specificIndustry) // 根據特定行業参數篩選數據
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '產業鏈碳排': Math.round(Math.abs(Number(item[year + '範疇三'].replace(/,/g, ''))))
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小進行降序排序
      return result;
    }
    if (target == "電力使用") {
      let result = data.filter(item => item['行業'] === specificIndustry) // 根據特定行業参數篩選數據
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '能源使用': Math.round(Math.abs(Number(item[year + '能源使用'].replace(/,/g, '')))), // 將特定屬性值進行數值處理
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小進行降序排序
      return result;
    }
    if (target == "用水量") {
      let result = data.filter(item => item['行業'] === specificIndustry) // 根據特定行業参數篩選數據
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '用水量': Math.round(Math.abs(Number(item[year + '用水量'].replace(/,/g, '')))),
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小進行降序排序
      return result;
    }
    if (target == "廢棄物總量") {
      let result = data.filter(item => item['行業'] === specificIndustry) // 根據特定行業参數篩選數據
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '廢棄物總量': Math.round(Math.abs(Number(item[year + '廢棄物產生量'].replace(/,/g, '')))), // 將特定屬性值進行數值處理
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小進行降序排序
      return result;
    }
    if (target == "有害廢棄物") {
      let result = data.filter(item => item['行業'] === specificIndustry) // 根據特定行業参數篩選數據
        .map(item => ({
          '公司': item['公司'],
          '年分': year,
          '有害廢棄物': Math.round(Math.abs(Number(item[year + '有害廢棄物'].replace(/,/g, '')))),
        })).sort((a, b) => b[target] - a[target]); // 按照y軸大小進行降序排序
      return result;
    }
  }

  // 監聽下拉菜單的變化事件
  d3.select('#dropdown').on('change', click);
}

function draw_stackbar(res, title, target) {
  // console.log(res)
  d3.selectAll('.stackbar-chart-container svg').remove(); // 清除舊圖
  let project, color;
  if (target == '營收') {
    project = ["營收"]
    color = ["#FFC107"]
  }
  else if (target == '淨利') {
    project = ["淨利"]
    color = ["#FF5722"]
  }
  else if (target == '資本支出') {
    project = ["資本支出"]
    color = ["#3F51B5"]
  }
  else if (target == '直接碳排') {
    project = ["直接碳排"]
    color = ["#FFC107"]
  }
  else if (target == '間接碳排') {
    project = ["間接碳排"]
    color = ["#FF5722"]
  }
  else if (target == '產業鏈碳排') {
    project = ["產業鏈碳排"]
    color = ["#3F51B5"]
  }
  else if (target == '電力使用') {
    project = ["能源使用"]
    color = ["#FFC107", "#FF5722", "#3F51B5"]
  }
  else if (target == '用水量') {
    project = ["用水量"]
    color = ["#3F51B5"]
  }
  else if (target == '廢棄物總量') {
    project = ["廢棄物總量"]
    color = ["#FFC107", "#FF5722", "#3F51B5"]
  }
  else if (target == '有害廢棄物') {
    project = ["有害廢棄物"]
    color = ["#FF5722"]
  }

  const width = window.innerWidth * 0.6; // 設置畫布寬度為一半
  const height = window.innerWidth * 0.4; // 設置畫布高度為 600 像素
  const chart_margin = { top: 60, right: 60, bottom: 60, left: 60 }; // 設置圖表的邊距，包含上、右、下、左四個方向的邊距值
  const chart_width = width - (chart_margin.left + chart_margin.right); // 計算圖表的寬度，即畫布寬度減去左右邊距
  const chart_height = height - (chart_margin.top + chart_margin.bottom); // 計算圖表的高度，即畫布高度減去上下邊距

  const svg = d3.selectAll('.stackbar-chart-container')
    .append('svg') // 創建 svg 元素
    .attr('width', width) // 設置 svg 元素的寬度
    .attr('height', height) // 設置 svg 元素的高度
    .append('g') // 在 svg 元素中創建一個 g 元素，用於放置圖表元素
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr('transform', `translate(${chart_margin.left},${chart_margin.top})`)
    .style('font-family', 'Arial') // 設置字體樣式，例如 Arial;

  const stack = d3.stack()
    .keys(project)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  const series = stack(res); // 使用堆疊函數生成堆疊數據

  // X 軸比例尺
  const xScale = d3.scaleBand()
    .domain(res.map(d => d.公司)) // 設置 X 軸的刻度範圍為公司名稱
    .range([0, chart_width]) // 設置 X 軸的位置範圍
    .padding(0.2); // 設置 X 軸的間隔比例

  const xSubgroup = d3.scaleBand()
    .domain(res.map(d => d.年分))
    .range([0, xScale.bandwidth()])
    .padding([0.1])


  // Y 軸比例尺
  const dmax = d3.max(series, d => d3.max(d, d => +d[1]))
  const yScale = d3.scaleLog() // 創建對數比例尺
    .base(Math.sqrt(10)) // 設置底數為 10
    .domain([1, dmax]) // 設置 Y 軸的刻度範圍，從0到數據中最大值
    .range([chart_height, 40]); // 設置 Y 軸的位置範圍

  // 顏色比例尺
  const colorScale = d3.scaleOrdinal()
    .domain(project) // 設置顏色比例尺的域為營收、淨利和資本支出
    .range(color); // 設置顏色比例尺的輸出範圍，對应每個數據類别的顏色

  // 創建堆疊條形圖
  const canvas = svg.selectAll("g")
    .data(series) // 綁定堆疊數據
    .join("g") // 創建 g 元素用於放置每组堆疊條形圖
    .attr("fill", d => colorScale(d.key)); // 設置堆疊條形圖的填充顏色

  canvas.selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => xScale(d.data.公司) + xSubgroup(d.data.年分))
    .attr("y", yScale(1))
    .attr("height", 0)
    .attr("width", xSubgroup.bandwidth())
    .on("mouseover", function (event, d) { // 滑鼠懸停事件
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
    .on("mouseout", function (event, d) { // 滑鼠離開事件
      // 移除文字方塊
      canvas.select(".value-label").remove();
    })
    .transition()  //彈出動畫控制
    .duration(1000)
    .delay((d, i) => i * 100)
    .attr("y", d => yScale(d[1] + 1))
    .attr("height", d => yScale(d[0] + 1) - yScale(d[1] + 1))




  canvas.selectAll("text")
    .data(d => d.filter(item => item[0] === 0)) // 綁定滿足條件的數據
    .join("text") // 創建文本元素
    .text(d => {
      // console.log(d); // 在控制台輸出 d 的内容
      return d.data.年分; // 設置文本内容
    })
    .attr('x', d => xScale(d.data.公司) + xSubgroup(d.data.年分) + xSubgroup.bandwidth() / 2) // 設置文本的 x 坐標在矩形的中間位置
    .attr('y', d => yScale(d[0] + 1) + 12) // 設置文本的 y 坐標在矩形頂部上方一定距離處
    .attr('text-anchor', 'middle') // 設置文本的水平對齊方式為居中對齊
    .attr('dominant-baseline', 'baseline') // 設置文本的垂直對齊方式為基線對齊
    .style('font-size', '12px') // 設置文本的字體大小
    .style('fill', 'black') // 設置文本的顏色為黑色
    .style('font-family', 'Arial') // 設置字體樣式，例如 Arial
    .style('font-weight', 'normal');



  const header = svg.append('g').attr('class', 'bar-header')
    .attr('transform', `translate(${+chart_margin.right / 2},${-chart_margin.top / 2})`).append('text');
  header.append('tspan').text(title).style('font-size', '2em'); // 添加圖表標題

  const xAxis = d3.axisBottom(xScale) // 創建 X 軸刻度生成器
    .tickSizeInner(-chart_height) // 設置内部刻度線的長度
    .tickSizeOuter(0) // 設置外部刻度線的長度
    .tickSize(0); // 設置刻度線的長度為0，即不顯示刻度線

  const xAxisDraw = svg.append('g')
    .attr('transform', `translate(0, ${chart_height + 15})`) // 將 X 軸向下平移至圖表底部
    .attr('class', 'xaxis')
    .style('font-size', 16)
    .call(xAxis) // 繪制 X 軸
    .select('.domain') // 選擇軸線元素
    .style('display', 'none'); // 設置軸線的顯示屬性為 none

  const yAxis = d3.axisLeft(yScale) // 創建 Y 軸刻度生成器
    .tickSizeInner(-chart_width) // 設置内部刻度線的長度
    .ticks(10, ".2s") // 設置刻度的數量和格式，这里使用 ".2s" 格式表示使用科學計數法顯示刻度值

  const yAxisDraw = svg.append('g')
    .attr('class', 'yaxis')
    .style('font-size', 12)
    .call(yAxis); // 繪制 Y 軸
}

function back() {
  d3.selectAll("#bottom-button").remove() // 移除頁面中所有 id 為 "bottom-button" 的元素
  d3.selectAll(".stackbar-chart-container").remove() // 移除頁面中所有 class 為 "stackbar-chart-container" 的元素
  d3.selectAll(".bottom-container").remove()
  d3.selectAll(".select-container").remove()
  homepage() // 調用 homepage 函數，返回主頁
}
