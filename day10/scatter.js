import word_cloud from './word_cloud.js';

export default function drawscatter(specificIndustry) {
  // 創建單選按鈕容器  
  let customDiv = d3.select(".custom-div"); // 首先選擇 .custom-div

  let bottomContainer = customDiv
    .append("div") // 在 .custom-div 元素中添加一個 div 元素
    .attr("class", "select-container");


  // 創建横軸單選按鈕容器
  let radioContainerX = bottomContainer.append("div")
    .style('position', 'relative')
    .style('top', '-20px')
    .style('left', '62vw')
    .style('z-index', '1'); // 設置較高的z-index值

  // 添加横軸標籤
  bottomContainer.append("div")
    .text("横軸")
    .style('position', 'relative')
    .style('font-size', "20px")
    .style('top', '-47px')
    .style('left', "58vw")
    .style('font-family', 'Arial') // 設置字體樣式，例如 Arial
    .style('font-weight', 'bold'); // 設置字體粗細為粗體

  // 添加縱軸標籤
  bottomContainer.append("div")
    .text("縱軸")
    .style('position', 'relative')
    .style('font-size', "20px")
    .style('top', '-47px')
    .style('left', "58vw")
    .style('font-family', 'Arial') // 設置字體樣式，例如 Arial
    .style('font-weight', 'bold'); // 設置字體粗細為粗體

  // 創建縱軸單選按鈕容器
  let radioContainerY = bottomContainer.append("div")
    .style('position', 'relative')
    .style('top', '-75px')
    .style('left', '62vw')
    .style('z-index', '1'); // 設置較高的z-index值

  // 添加單選按鈕 A，表示營收
  addRadioButton(radioContainerX, "radioa", "myRadioButtonsX", "營收");

  // 添加單選按鈕 B，表示淨利
  addRadioButton(radioContainerX, "radiob", "myRadioButtonsX", "淨利");

  // 添加單選按鈕 C，表示資本支出
  addRadioButton(radioContainerX, "radioc", "myRadioButtonsX", "資本支出");

  // 添加單選按鈕 A，表示碳排
  addRadioButton(radioContainerY, "radioA", "myRadioButtonsY", "碳排");

  // 添加單選按鈕 B，表示用電量
  addRadioButton(radioContainerY, "radioB", "myRadioButtonsY", "用電量");

  // 添加單選按鈕 C，表示用水量
  addRadioButton(radioContainerY, "radioC", "myRadioButtonsY", "用水量");

  // 添加單選按鈕 D，表示一般廢棄物
  addRadioButton(radioContainerY, "radioD", "myRadioButtonsY", "一般廢棄物");

  // 添加單選按鈕 E，表示有害廢棄物
  addRadioButton(radioContainerY, "radioE", "myRadioButtonsY", "有害廢棄物");


  function addRadioButton(container, id, name, label) {
    let radio = container.append("input")
      .attr("type", "radio")
      .attr("id", id)
      .attr("name", name) // 設置相同的 name 屬性

    container.append("label")
      .attr("for", id)
      .text(label)
      .style("margin-right", "5px"); // 設置標籤與按鈕之間的水平間距
  }

  // 設置按鈕之間的垂直間距
  radioContainerX.selectAll("input")
    .style("margin-bottom", "3px");

  radioContainerY.selectAll("input")
    .style("margin-bottom", "3px");

  // 定義解析函數，用於處理 NaN 值
  const parseNA = string => (string === 'nan' ? '0' : string);

  // 定義轉換函數，將數據中的屬性名稱和數值進行轉換和處理
  function nan(d) {
    return {
      '行業': parseNA(d['產業類別']), // 將屬性 '產業類別' 的值進行轉換
      '公司': parseNA(d['公司名稱'] + parseNA(d['股票代碼'])),
      '2020營收': parseNA(d['2020營收']),
      '2020淨利': parseNA(d['2020淨利(稅前)']),
      '2020資本支出': parseNA(d['2020資本支出']),
      '2021營收': parseNA(d['2021營收']),
      '2021淨利': parseNA(d['2021淨利(稅前)']),
      '2021資本支出': parseNA(d['2021資本支出']),
      '2020碳排': Number(parseNA(d['2020範疇一']).replace(/,/g, '')) + Number(parseNA(d['2020範疇二']).replace(/,/g, '')),
      '2020範疇三': parseNA(d['2020範疇三']).replace(/,/g, ''),
      '2021碳排': Number(parseNA(d['2021範疇一']).replace(/,/g, '')) + Number(parseNA(d['2021範疇二']).replace(/,/g, '')),
      '2021範疇三': parseNA(d['2021範疇三']).replace(/,/g, ''),
      '2020用電量': parseNA(d['2020能源使用']),
      '2021用電量': parseNA(d['2021能源使用']),
      '2020用水量': parseNA(d['2020用水量(t)']),
      '2021用水量': parseNA(d['2021用水量(t)']),
      '2020一般廢棄物': parseNA(d['2020廢棄物產生量']),
      '2021一般廢棄物': parseNA(d['2021廢棄物產生量']),
      '2020有害廢棄物': parseNA(d['2020有害廢棄物產生量']),
      '2021有害廢棄物': parseNA(d['2021有害廢棄物產生量']),
    };
  }

  // 從 CSV 文件讀取數據並進行處理
  d3.csv('./day10/example-Carbon.csv', nan).then(scatterdata => {
    // console.log('local csv', scatterdata); // 在控制台輸出從 CSV 文件讀取的數據的第一個對象
    setupscatter(scatterdata, specificIndustry); // 調用 setupstackbarmap 函數，傳入讀取的數據和特定行業参數
  });
}



function setupscatter(data, specificIndustry) {
  let xkey = '營收'; // x軸關鍵字
  let ykey = '碳排'; // y軸關鍵字
  let result = update(data, xkey, ykey);
  drawplot(result, xkey, ykey, specificIndustry);

  d3.selectAll("input[type='radio']")
    .on("change", function () {
      // 獲取關聯標籤的文本内容
      let labelText = d3.select("label[for='" + this.id + "']").text();

      // 更改横軸或縱軸的關鍵字
      if (this.name == "myRadioButtonsX") { // 横軸
        xkey = labelText;
        result = update(data, xkey, ykey);
        drawplot(result, xkey, ykey, specificIndustry);
      } else if (this.name == "myRadioButtonsY") { // 縱軸
        ykey = labelText;
        result = update(data, xkey, ykey);
        drawplot(result, xkey, ykey, specificIndustry);
      }
    });

  function update(data, xkey, ykey) {
    // 創建一個包含2020年數據的對象數组
    let res2020 = data.map(item => ({
      '公司': item['公司'], // 公司名稱
      '行業': item['行業'], // 行業
      '年分': 2020, // 年份
      'x': Number(item['2020' + xkey].replace(/,/g, '')), // x 值，將屬性值轉換為數字
      'y': Number(item['2020' + ykey]) // y 值
    }));

    // 創建一個包含2021年數據的對象數组
    let res2021 = data.map(item => ({
      '公司': item['公司'], // 公司名稱
      '行業': item['行業'], // 行業
      '年分': 2021, // 年份
      'x': Number(item['2021' + xkey].replace(/,/g, '')), // x 值，將屬性值轉換為數字
      'y': Number(item['2021' + ykey]) // y 值
    }));

    // 將2020年和2021年的數據合並為一個數组
    let result = res2020.concat(res2021);
    return result;
  }
}


function drawplot(data, xkey, ykey, specificIndustry) {
  d3.selectAll('#scatter').remove(); // 清除舊圖

  let scatterContainer = d3.select(".custom-div > div.stackbar-chart-container");
  const width = window.innerWidth * 0.39; // 設置畫布寬度為一半
  const height = window.innerWidth * 0.39; // 設置畫布高度為 600 像素
  const chart_margin = { top: 40, right: 40, bottom: 40, left: 40 }; // 設置圖表的邊距，包含上、右、下、左四個方向的邊距值
  const chart_width = width - (chart_margin.left + chart_margin.right); // 計算圖表的寬度，即畫布寬度減去左右邊距
  const chart_height = height - (chart_margin.top + chart_margin.bottom); // 計算圖表的高度，即畫布高度減去上下邊距

  const svg = scatterContainer
    .append('svg') // 創建 svg 元素
    .attr("id", "scatter") // 設置獨特的 ID
    .attr('width', width) // 設置 svg 元素的寬度
    .attr('height', height) // 設置 svg 元素的高度
    .attr('transform', `translate(${chart_margin.left},${chart_margin.top})`); // 平移SVG元素

  if (d3.min(data, d => d.x) < 0) {
    const xOffset = Math.abs(d3.min(data, d => d.x)) + 1;
    data = data.map(d => {
      if (d.y === 0) {
        return { ...d, y: 1 }; // 使用對象展開運算符 (...) 創建一個新對象，並將 x 屬性值更新為 1
      } else {
        return d; // 對於其他屬性值不為 0 的數據，保持原樣
      }
    });
    data.forEach(d => {
      d.x += xOffset; // 將負數 x 值加上偏移量
    });

    let xScale = d3.scaleLog() // 創建對數比例尺
      .base(Math.sqrt(10)) // 設置底數為 10
      .domain([d3.min(data, d => d.x), d3.max(data, d => d.x) * 1.1])
      .range([40, chart_width]);

    let yScale = d3.scaleLog() // 創建對數比例尺
      .base(Math.sqrt(10)) // 設置底數為 10
      .domain([d3.min(data, d => d.y), d3.max(data, d => d.y) * 2])
      .range([chart_height, 40]);

    svg.append("text")
      .attr("x", xScale(xOffset)) // 在圖表水平中心位置
      .attr("y", 20) // 在圖表上方偏移 20 個單位
      .text(`x 軸偏移量為+ ${Math.round(xOffset / 10000)} 萬元`)
      .attr("font-size", 12)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle");

    // 增加輔助偏移線，處理 x 負值
    svg
      .append("line")
      .attr("x1", xScale(xOffset))
      .attr("y1", yScale(d3.min(data, d => d.y)))
      .attr("x2", xScale(xOffset))
      .attr("y2", yScale(d3.max(data, d => d.y) * 2))
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("fill", "none");
  }

  data = data.map(d => {
    if (d.x === 0) {
      return { ...d, x: 1 }; // 使用對象展開運算符 (...) 創建一個新對象，並將 x 屬性值更新為 1
    } else {
      return d; // 對於其他屬性值不為 0 的數據，保持原樣
    }
  });

  data = data.map(d => {
    if (d.y === 0) {
      return { ...d, y: 1 }; // 使用對象展開運算符 (...) 創建一個新對象，並將 y 屬性值更新為 1
    } else {
      return d; // 對於其他屬性值不為 0 的數據，保持原樣
    }
  });

  let xScale = d3.scaleLog() // 創建對數比例尺
    .base(Math.sqrt(10)) // 設置底數為 10
    .domain([d3.min(data, d => d.x), d3.max(data, d => d.x) * 1.1])
    .range([40, chart_width]);

  let yScale = d3.scaleLog() // 創建對數比例尺
    .base(Math.sqrt(10)) // 設置底數為 10
    .domain([d3.min(data, d => d.y), d3.max(data, d => d.y) * 2])
    .range([chart_height, 40]);

  // 增加圖例標示年份和顏色的變化
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${chart_width - 20}, ${chart_height - 30})`); // 設置圖例位置

  // 添加年份圖例
  legend.append("text")
    .attr("x", 20)
    .attr("y", -20)
    .text("年份")
    .attr("font-size", 12)
    .attr("fill", "black")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle");

  // 添加年份和顏色示意圖
  const legendItems = legend.selectAll(".legend-item")
    .data([2020, 2021])
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`); // 設置每個圖例项的位置

  // 添加年份示意圖
  legendItems.append("text")
    .attr("x", 20)
    .attr("y", 0)
    .text(d => d)
    .attr("font-size", 12)
    .attr("fill", "black")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle");

  // 添加顏色示意圖
  legendItems.append("rect")
    .attr("x", 60)
    .attr("y", -6)
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", d => {
      if (d === 2020) {
        return "#00BFFF"; // 如果年份為 2020，設置為 steelblue 顏色
      } else if (d === 2021) {
        return "#00FF00"; // 如果年份為 2021，設置為 green 顏色
      } else {
        return "red"; // 其他情况，設置為 red 顏色
      }
    });

  svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => xScale(d.x)) // 設置圓心的 x 坐標為根據 x 值的比例尺計算得到的值
    .attr("cy", d => yScale(d.y)) // 設置圓心的 y 坐標為根據 y 值的比例尺計算得到的值
    .attr("r", d => {
      if (d.行業 === specificIndustry) {
        return 12; // 如果數據所屬行業與指定行業相同，設置半徑為 15
      } else {
        return 10; // 如果數據所屬行業與指定行業不同，設置半徑為 10
      }
    })
    .attr("stroke", d => {
      if (d.年分 === 2020) {
        return "#00BFFF"; // 如果年份為 2020，設置邊框顏色為 steelblue
      } else if (d.年分 === 2021) {
        return "#00FF00"; // 如果年份為 2021，設置邊框顏色為 green
      } else {
        return "red"; // 其他情况，設置邊框顏色為 red
      }
    })
    .attr("stroke-width", 2) // 設置邊框寬度為 2
    .attr("fill", d => {
      if (d.行業 === specificIndustry) {
        if (d.年分 === 2020) {
          return "#00BFFF"; // 如果數據所屬行業與指定行業相同且年份為 2020，設置填充顏色為 steelblue
        } else if (d.年分 === 2021) {
          return "#00FF00"; // 如果數據所屬行業與指定行業相同且年份為 2021，設置填充顏色為 green
        } else {
          return "red"; // 其他情况，設置填充顏色為 red
        }
      } else {
        return "white"; // 數據所屬行業與指定行業不同，設置填充顏色為白色
      }
    })
    .on("mouseover", (event, d) => {
      d3.select(event.currentTarget)
        .attr("r", d => {
          if (d.行業 === specificIndustry) {
            return 15; // 如果數據所屬行業與指定行業相同，設置半徑為 20
          } else {
            return 12; // 如果數據所屬行業與指定行業不同，設置半徑為 12
          }
        });

      // 顯示文字方框
      svg.append("text")
        .attr("id", "mouse-text") // 設置獨特的 ID
        .attr("x", xScale(d.x) + 10) // 在圓點右側偏移 10 個單位處顯示文字方框
        .attr("y", yScale(d.y))
        .text(() => {
          if (d.y === 1) {
            return `${d.公司}\t${xkey + ': ' + d.x}\t 無資料`; // 如果 y 值為 1，顯示公司名稱、xkey 和 "無資料"
          } else {
            return `${d.公司}\t${xkey + ': ' + d.x}\t ${ykey + ': ' + d.y}`; // 否则，顯示公司名稱、xkey 和 ykey 的數值
          }
        })
        .attr("font-size", 12)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("pointer-events", "none"); // 避免文字方框檔住鼠標事件
    })
    .on("mouseout", (event) => {
      d3.select(event.currentTarget)
        .attr("r", d => {
          if (d.行業 === specificIndustry) {
            return 12; // 如果數據所屬行業與指定行業相同，恢復半徑為 15
          } else {
            return 10; // 如果數據所屬行業與指定行業不同，恢復半徑為 10
          }
        });

      // 移除文字方框
      d3.select("#mouse-text").remove();
    })
    .on("dblclick", (event, d) => {
      const xPos = event.pageX + 10; // 獲取滑鼠位置的 x 坐標並加上 10 的偏移量
      const yPos = event.pageY + 10; // 獲取滑鼠位置的 y 坐標並加上 10 的偏移量
      word_cloud(xPos, yPos, d.公司) //觸發文字雲

    });




  // 添加 x 軸
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${chart_height})`) // 將 x 軸放置在圖表底部
    .call(d3.axisBottom(xScale).ticks(10, ".2s")); // 使用比例尺繪制 x 軸刻度

  // 添加 y 軸
  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${chart_margin.left}, 0)`) // 將 y 軸放置在圖表左側
    .call(d3.axisLeft(yScale).ticks(10, ".2s")); // 使用比例尺繪制 y 軸刻度

  // 添加 x 軸網格線
  svg.append("g")
    .selectAll("line")
    .data(xScale.ticks())
    .join("line")
    .attr("x1", d => xScale(d))
    .attr("y1", chart_margin.top)
    .attr("x2", d => xScale(d))
    .attr("y2", chart_height)
    .attr("stroke", "lightgray")
    .attr("stroke-width", 0.5)
    .attr("stroke-dasharray", "3 3");

  // 添加 y 軸網格線
  svg.append("g")
    .selectAll("line")
    .data(yScale.ticks())
    .join("line")
    .attr("x1", chart_margin.left)
    .attr("y1", d => yScale(d))
    .attr("x2", chart_width)
    .attr("y2", d => yScale(d))
    .attr("stroke", "lightgray")
    .attr("stroke-width", 0.5)
    .attr("stroke-dasharray", "3 3");

  // 添加 X 軸標題
  svg.append("text")
    .attr("x", chart_width + chart_margin.right / 2 + 10) // x 坐標為圖表寬度的一半，使標題居中
    .attr("y", chart_height) // y 坐標為圖表高度，使標題位於圖表底部
    .text(xkey)
    .attr("fill", "black") // 文字顏色為黑色
    .attr("text-anchor", "middle") // 文字水平對齊方式為居中對齊
    .attr("dominant-baseline", "hanging") // 文字垂直對齊方式為懸掛對齊
    .style("font-size", "16px"); // 文字字體大小為 16px

  // 添加 Y 軸標題
  svg.append("text")
    .attr("x", chart_margin.left) // x 坐標為圖表左邊距，使標題位於圖表左側
    .attr("y", chart_margin.top / 2) // y 坐標為圖表上邊距的一半，使標題居中
    .text(ykey)
    .attr("fill", "black") // 文字顏色為黑色
    .attr("text-anchor", "middle") // 文字水平對齊方式為居中對齊
    .attr("dominant-baseline", "hanging") // 文字垂直對齊方式為懸掛對齊
    .style("font-size", "16px"); // 文字字體大小為 16px

  svg.append("line")
    .attr("x1", xScale(d3.min(data, d => d.x))) // 設置起始點的 x 坐標為數據中 x 的最小值经过 x 比例尺轉換得到的值
    .attr("y1", yScale(d3.min(data, d => d.y))) // 設置起始點的 y 坐標為數據中 y 的最小值经过 y 比例尺轉換得到的值
    .attr("x2", xScale(d3.max(data, d => d.x))) // 設置終點的 x 坐標為數據中 x 的最大值经过 x 比例尺轉換得到的值
    .attr("y2", yScale(d3.max(data, d => d.y))) // 設置終點的 y 坐標為數據中 y 的最大值经过 y 比例尺轉換得到的值
    .attr("stroke", "red") // 設置線的顏色為红色
    .attr("stroke-width", 1.5) // 設置線的寬度為 1.5
    .attr("fill", "none"); // 設置線的填充顏色為无（不填充）

  svg.append("text")
    .attr("x", chart_width / 2 + chart_margin.left) // x 坐標為圖表寬度的一半，使標題居中
    .attr("y", chart_margin.top / 2) // y 坐標為圖表高度，使標題位於圖表底部
    .text("雙擊圓點可見詳細資料")
    // .text("雙擊圓點可見詳細資料\n實心點為右直線圖中，該種企業分類資料")
    .attr("fill", "brown") // 文字顏色為黑色
    .attr("text-anchor", "middle") // 文字水平對齊方式為居中對齊
    .attr("dominant-baseline", "hanging") // 文字垂直對齊方式為懸掛對齊
    .style("font-size", "20px"); // 文字字體大小為 16px

  // 在右下角添加文字
  svg.append("text")
    .attr("x", chart_width - 10) // x 坐標為圖表寬度減去一定的偏移量，使文字靠近右邊界
    .attr("y", chart_height - 10) // y 坐標為圖表高度減去一定的偏移量，使文字靠近底部
    .text("ESG")
    .attr("fill", "green") // 文字顏色為綠色
    .attr("text-anchor", "end") // 文字水平對齊方式為右對齊
    .attr("dominant-baseline", "baseline") // 文字垂直對齊方式為基線對齊
    .style("font-size", "24px"); // 文字字體大小為 24px
}