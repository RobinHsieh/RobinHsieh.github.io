import barpage from './stackbar.js';  
// 定義下拉菜單的數據
export default function homepage(){
  killall()

  // 創建 controls 元素
  var controlsContainer = d3.select("body")
  .append("div")
  .attr("class", "controls");
  
  var barChartContainer = d3.select("body")
  .append("div")
  .attr("class", "tree-chart-container");

  // 創建 select 元素
  var selectElement = controlsContainer.append("select")
  .attr("id", "dropdown").style('top', '10px') // 设置 option 元素的顶部定位样式为 50px
  .style('left', "50px") // 设置 option 元素的左边定位样式为 50px
  // .style('background-color','yellowgreen')
  .style('position', 'static')
  .style('font-size',"16px");

  const dropdownData = [
    { label: '2020', options: ['營收', '淨利', '資本支出'] },
    { label: '2021', options: ['營收', '淨利', '資本支出'] }
  ];
  
  // 選擇下拉菜單的容器元素，並設置樣式
  const dropdown = d3.select('#dropdown')
   
  // 遍歷下拉菜單的數據陣列
  dropdownData.forEach(group => {
    // 創建下拉菜單的選項組元素，並設置標籤屬性為當前組的標籤
    const optgroup = dropdown.append('optgroup').attr('label', group.label)
    .style('background-color','white')
    
    // 遍歷當前組的選項陣列
    group.options.forEach(option => {
      // 在選項組元素中創建選項元素，並設置值屬性和文本內容為當前選項
      optgroup.append('option').attr('value', option).text(option)
      .style('background-color','white')

    });
  });
  
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
  // 定義解析 'NA' 字串的函數，將其轉換為 undefined
  const parseNA = string => (string === 'NA' ? undefined : string);

  // 使用 d3.csv() 方法從 'example.csv' 讀取資料，並在讀取完成後執行指定的回呼函式
  d3.csv('example.csv',nan).then(res => {
    // console.log('local csv', res); // 在控制台輸出從 CSV 檔案讀取的資料的第一個物件
    setuptreemap(res)

  // 印出轉換後的結果
});

}

function setuptreemap(data) {
  let res = data;
  let result = update(data, '2020營收'); //預設資料
  draw(result, '2020 五十大 營收(萬)') //預設繪圖
  // 點擊事件的回呼函式
  function click() {
    let selectedOptvalue = this.value; // 獲取下拉選單中被選中的值
    let selectedOptgroup = d3.select('#dropdown option:checked').node().parentNode.label; // 獲取下拉選單中被選中的群組標籤
    let category = selectedOptgroup + selectedOptvalue; // 將群組標籤和值組合成類別
    let title = selectedOptgroup + " 五十大 " + selectedOptvalue+"(萬)"; // 生成標題文字
    let result = update(res, category); // 更新資料
    draw(result, title); // 繪製圖表
  }

  // 更新資料的函式
  function update(data, keywords) {
    let result = data.map(item => ({
      '行業': item['行業'],
      '公司': item['公司'],
      'value': Math.round(Math.abs(Number(item[keywords].replace(/,/g, '')))/10000)// 將特定屬性值進行數值處理
    }));

    return result;
  }

  // 監聽下拉選單的變化事件
  d3.select('#dropdown').on('change', click);
}


//畫樹圖
function draw(res, keywords) {
  d3.selectAll('.tree-chart-container svg').remove(); // 移除所有具有 'tree-chart-container' 類別的元素中的 SVG 元素

  // 創建 tree-chart-container 元素

  const width = document.body.clientWidth*0.7; // 設定畫布的寬度為 隨body大小變化
  const height = document.body.clientWidth*0.5; // 設定畫布的高度為  隨body大小變化
  const chart_margin = { top: 80, right: 40, bottom: 80, left: 40 }; // 設定圖表的邊距，包含上、右、下、左四個方向的邊距值
  const chart_width = width - (chart_margin.left + chart_margin.right); // 計算圖表的寬度，即畫布寬度減去左右邊距
  const chart_height = height - (chart_margin.top + chart_margin.bottom); // 計算圖表的高度，即畫布高度減去上下邊距
  
  const svg = d3.selectAll('.tree-chart-container')
    .append('svg') // 創建 svg 元素
    .attr('width', width) // 設定 svg 元素的寬度
    .attr('height', height) // 設定 svg 元素的高度
    .append('g') // 在 svg 元素中創建一個 g 元素，用於放置圖表元素
    .attr("style", "max-width: 100%; height: auto;")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr('transform', `translate(${chart_margin.left},${chart_margin.top})`)
    ; // 設定 g 元素的平移位置，以適應圖表邊距
  
  let groupedData = d3.group(res, function(res) {
    return res.行業; // 根據 category 屬性將資料進行分組
  });
  const defaultDelay=1000
  const transitionDelay=d3.transition().duration(defaultDelay)
  var root = d3.hierarchy(groupedData).sum(function(d){return d.value});
// 創建層次結構的根節點，使用 d3.hierarchy() 方法將分組後的資料轉換為層次結構的節點
// 使用 sum() 方法將每個節點的值設置為其子節點值的總和
  
  var tiles = root.leaves();
// // 獲取層次結構中的葉子節點，也就是最底層的節點
  var treemap = d3.treemap()
    .size([chart_width, chart_height])
    .paddingInner(5).paddingTop(15).paddingRight(5).paddingBottom(5).paddingLeft(5).round(true);
// // 創建 treemap 函式，設定大小、內部間距和圓角等屬性

  var nodes = treemap(root
                .sum(function(d) { return d.value; })
                .sort(function(a, b) { return b.height - a.height || b.value - a.value; }))
                .descendants();
// // 使用 treemap 函式對根節點進行布局，計算每個節點的位置和大小
// // 使用 sum() 方法重新計算每個節點的值，sort() 方法對節點進行排序，以便更好地展示
  // console.log(nodes)
  const canvas = svg.selectAll('.g')
                      .data(tiles)
                      .enter()
                      .append('g')
                      .attr('transform',(d)=>
                      {
                        return 'translate('+d['x0']+','+d['y0']+')'
                      });
// // 在 SVG 中創建一個 g 元素群組，用於放置矩形區塊
// // 根據每個節點的位置和大小，將 g 元素進行平移，以適應其在 SVG 中的位置
// // 提取tiles陣列中每個元素的value值，並存儲在values陣列中
  var values = tiles.map(d => d.value);
  // console.log(tiles)
// // 使用d3.extent()方法計算values陣列中的最大值和最小值
  var extent = d3.extent(values);

// // 從extent陣列中取得最小值和最大值
  var minValue = extent[0];
  var maxValue = extent[1];
 
// // 創建一個線性比例尺，用於將value值映射到不透明度的範圍
  var opacity = d3.scaleLinear()
      .domain([minValue, maxValue]) // 指定比例尺的範圍
      .range([.5,1]); // 指定對應的不透明度範圍
  
  var lastClickTime = 0;
  var delay = 300; // 设置双击间隔时间，单位为毫秒
  
  let parentNodes = root.descendants().filter(function(d) { return d.depth === 1; });//treemap 母類別名稱
                      
  canvas.append('rect')
        .attr('class','tiles')
        .attr('fill',(d)=>{
          var cat = d.data['行業'];
          // console.log(cat)
          if (cat === '電子通路與零組件業'){
            return 'orchid';
          }
          else if(cat === '電腦及周邊設備業'){
            return 'blue';
          }
          else if(cat === '輕工業'){
            return '#FCD12A';
          }
          else if(cat === '重工業'){
            return 'red';
          }
          else if(cat === '半導體業'){
            return '#29AB87';
          }
          else if(cat === '金融保險業'){
            return '#FD6A02';
          }
          else if(cat === '服務業'){
            return '#B1560F';
          }
        })
        .attr('name',(d)=>{
          return d['公司'];
        })
        .attr('category',(d)=>{
          return d.data['行業'];
        })
        .attr('value',(d)=>{
          return d['value'];
        })
        .attr('width',(d)=>{
          return d['x1']-d['x0'];
        })
        .attr('height',(d)=>{
          return d['y1']-d['y0'];
        })
        .attr("opacity",function(d){ return opacity(d.data['value'])}) //矩形透明度
        .attr("stroke", "black")
        .attr("stroke-width", 3) //矩形邊框
        .on("mouseover", function() {
          d3.select(this)
            .transition()
            .duration(200) // 動畫持續時間
            .attr("transform", "scale(1.2)"); // 放大矩形
        })
        .on("dblclick",function(){
          let currentTime = new Date().getTime();
          if (currentTime - lastClickTime > delay) {
            killall()
            lastClickTime = currentTime;
            let specificIndustry = this.getAttribute('category') // 獲得類別參數以傳送給barpage
            barpage(specificIndustry)
          }
        })
        .on("mouseout", function() {
          // console.log(this)
          d3.select(this)
            .transition()
            .duration(200) // 動畫持續時間
            .attr("transform", "scale(1)"); // 還原矩形大小
        });
// // 在 g 元素中創建矩形元素，設定相應的屬性
// // 根據每個節點的分類，設定矩形的填充顏色
// // 將節點的名稱、分類和值等資訊作為屬性存儲在矩形元素中
// // 根據節點的位置和大小，設定矩形的寬度和高度

// 在 canvas 中添加文字元素
canvas.append('text')
  .text((d) => {
    return d.data['value'];
  })
  .attr('x', (d) => {
    return (d.x1-d.x0)/2;
  })
  .attr('y', 10)
  .style('text-anchor', 'middle') // 水平居中
  .style('dominant-baseline', 'middle') // 垂直居中;
  .style('font-size',14);

  canvas.append('text')
  .text((d) => {
    return d.data['公司'];
  })
  .attr('x', (d) => {
    return (d.x1-d.x0)/2;
  })
  .attr('y', 25)
  .style('font-size',14)
  .style('text-anchor', 'middle') // 水平居中
  .style('dominant-baseline', 'middle'); // 垂直居中;
// 篩選出深度為 1 的節點作為圖例的數據

// 在 svg 中添加圖例群組元素
const legend = svg.append('g')
  .attr('class', 'legend');

// 選擇所有具有 .text 類別的元素，並根據 parentNodes 的數據進行綁定
const legendItems = legend.selectAll('.text')
  .data(parentNodes)
  .enter()
  .append("text")
  .attr("x", function(d) { return (d.x0 + d.x1) / 2; }) // 設定 x 坐標為節點的 x0 和 x1 的平均值
  .attr("y", function(d) { return (d.y0 + 5); }) // 設定 y 坐標為節點的 y0 往下偏移 5 單位
  .text(function(d) { return d.data['0']; }) // 使用節點數據中的 '0' 屬性作為圖例文字
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle') // 設定文字水平對齊方式為中間
  .attr('dominant-baseline', 'middle') // 設定文字垂直對齊方式為中間
  .attr('fill', (d) => {
    var cat = d.data['0'];
    // 根據不同的類別設定不同的填充顏色
    if (cat === '電子通路與零組件業'){
      return 'orchid';
    }
    else if(cat === '電腦及周邊設備業'){
      return 'blue';
    }
    else if(cat === '輕工業'){
      return '#FCD12A';
    }
    else if(cat === '重工業'){
      return 'red';
    }
    else if(cat === '半導體業'){
      return '#29AB87';
    }
    else if(cat === '金融保險業'){
      return '#FD6A02';
    }
    else if(cat === '服務業'){
      return '#B1560F';
    }
  });

// 在 svg 中添加標題文字
svg.append('text')
  .attr('class', 'chart-title')
  .attr('x', chart_width / 2) // 設定 x 坐標為圖表寬度的一半，使文字水平居中
  .attr('y', 0) // 設定 y 坐標為 0，將文字置於圖表頂部
  .attr('text-anchor', 'middle') // 設定文字水平對齊方式為中間
  .attr('font-size', '30px')
  .text(keywords); // 使用傳入的 keywords 參數作為標題文字
}

//////移除所有元素
function killall(){
  d3.selectAll('.tree-chart-container').remove(); // 移除所有具有 'tree-chart-container' 類別的元素中的 SVG 元素
  d3.selectAll('#dropdown').remove();//移除下拉式選單
}

homepage()///呼叫此頁面
