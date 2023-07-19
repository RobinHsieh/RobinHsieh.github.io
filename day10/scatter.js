import word_cloud from './word_cloud.js';

export default function drawscatter(specificIndustry) {
  // 创建单选按钮容器  
  let bottomContainer = d3.select('.bottom-container');

  // 创建横轴单选按钮容器
  let radioContainerX = bottomContainer.append("div")
    .style('position', 'fixed')
    .style('top', '2%')
    .style('left', '70%');

  // 添加横轴标签
  bottomContainer.append("div")
    .text("横轴")
    .style('position', 'fixed')
    .style('font-size', "16px")
    .style('top', '2%')
    .style('left', "68%")
    .style('font-family', 'Arial'); // 设置字体样式，例如 Arial

  // 添加单选按钮 A，表示营收
  radioContainerX.append("input")
    .attr("type", "radio")
    .attr("id", "radioa")
    .attr("name", "myRadioButtonsX") // 设置相同的 name 属性
    .attr("checked", true); // 默认选择项目

  radioContainerX.append("label")
    .attr("for", "radioa")
    .text("營收");

  // 添加单选按钮 B，表示净利
  radioContainerX.append("input")
    .attr("type", "radio")
    .attr("id", "radiob")
    .attr("name", "myRadioButtonsX"); // 设置相同的 name 属性
  radioContainerX.append("label")
    .attr("for", "radiob")
    .text("淨利");

  // 添加单选按钮 C，表示资本支出
  radioContainerX.append("input")
    .attr("type", "radio")
    .attr("id", "radioc")
    .attr("name", "myRadioButtonsX"); // 设置相同的 name 属性
  radioContainerX.append("label")
    .attr("for", "radioc")
    .text("資本支出");

  // 添加纵轴标签
  bottomContainer.append("div")
    .text("縱軸")
    .style('position', 'fixed')
    .style('font-size', "16px")
    .style('top', '5%')
    .style('left', "68%")
    .style('font-family', 'Arial'); // 设置字体样式，例如 Arial

  // 创建纵轴单选按钮容器
  let radioContainerY = bottomContainer.append("div")
    .style('position', 'fixed')
    .style('top', '5%')
    .style('left', '70%');

  // 添加单选按钮 A，表示碳排
  radioContainerY.append("input")
    .attr("type", "radio")
    .attr("id", "radioA")
    .attr("name", "myRadioButtonsY") // 设置相同的 name 属性
    .attr("checked", true); // 默认选择项目
    
  radioContainerY.append("label")
    .attr("for", "radioA")
    .text("碳排");

  // 添加单选按钮 B，表示用電量
  radioContainerY.append("input")
    .attr("type", "radio")
    .attr("id", "radioB")
    .attr("name", "myRadioButtonsY"); // 设置相同的 name 属性
  radioContainerY.append("label")
    .attr("for", "radioB")
    .text("用電量");

  // 添加单选按钮 C，表示用水量
  radioContainerY.append("input")
    .attr("type", "radio")
    .attr("id", "radioC")
    .attr("name", "myRadioButtonsY"); // 设置相同的 name 属性
  radioContainerY.append("label")
    .attr("for", "radioC")
    .text("用水量");

  // 添加单选按钮 D，表示一般廢棄物
  radioContainerY.append("input")
    .attr("type", "radio")
    .attr("id", "radioD")
    .attr("name", "myRadioButtonsY"); // 设置相同的 name 属性
  radioContainerY.append("label")
    .attr("for", "radioD")
    .text("一般廢棄物");

  // 添加单选按钮 E，表示有害廢棄物
  radioContainerY.append("input")
    .attr("type", "radio")
    .attr("id", "radioE")
    .attr("name", "myRadioButtonsY"); // 设置相同的 name 属性
  radioContainerY.append("label")
    .attr("for", "radioE")
    .text("有害廢棄物");

  // 定义解析函数，用于处理 NaN 值
  const parseNA = string => (string === 'nan' ? '0' : string);

  // 定义转换函数，将数据中的属性名称和数值进行转换和处理
  function nan(d) {
    return {
      '行業': parseNA(d['產業類別']), // 将属性 '產業類別' 的值进行转换
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
  
  // 从 CSV 文件读取数据并进行处理
  d3.csv('example-Carbon.csv', nan).then(scatterdata => {
    // console.log('local csv', scatterdata); // 在控制台输出从 CSV 文件读取的数据的第一个对象
    setupscatter(scatterdata, specificIndustry); // 调用 setupstackbarmap 函数，传入读取的数据和特定行业参数
  });
}



function setupscatter(data, specificIndustry) {  
  let xkey = '營收'; // x轴关键字
  let ykey = '碳排'; // y轴关键字
  let result = update(data, xkey, ykey);
  drawplot(result, xkey, ykey, specificIndustry);
  
  d3.selectAll("input[type='radio']")
    .on("change", function() {
      // 获取关联标签的文本内容
      let labelText = d3.select("label[for='" + this.id + "']").text();
      
      // 更改横轴或纵轴的关键字
      if (this.name == "myRadioButtonsX") { // 横轴
        xkey = labelText;
        result = update(data, xkey, ykey);
        drawplot(result, xkey, ykey, specificIndustry);
      } else if (this.name == "myRadioButtonsY") { // 纵轴
        ykey = labelText;
        result = update(data, xkey, ykey);
        drawplot(result, xkey, ykey, specificIndustry);
      }
    });

  function update(data, xkey, ykey) {
    // 创建一个包含2020年数据的对象数组
    let res2020 = data.map(item => ({
      '公司': item['公司'], // 公司名称
      '行業': item['行業'], // 行业
      '年分': 2020, // 年份
      'x': Number(item['2020' + xkey].replace(/,/g, '')), // x 值，将属性值转换为数字
      'y': Number(item['2020' + ykey]) // y 值
    }));
  
    // 创建一个包含2021年数据的对象数组
    let res2021 = data.map(item => ({
      '公司': item['公司'], // 公司名称
      '行業': item['行業'], // 行业
      '年分': 2021, // 年份
      'x': Number(item['2021' + xkey].replace(/,/g, '')), // x 值，将属性值转换为数字
      'y': Number(item['2021' + ykey]) // y 值
    }));
  
    // 将2020年和2021年的数据合并为一个数组
    let result = res2020.concat(res2021);
    return result;
  }  
}


function drawplot(data, xkey, ykey, specificIndustry) {
  d3.selectAll('#scatter').remove(); // 清除旧图
  
  let scatterContainer = d3.select("body > div.stackbar-chart-container");
  const width = document.body.clientWidth * 0.39; // 设置画布宽度为一半
  const height = document.body.clientWidth * 0.39; // 设置画布高度为 600 像素
  const chart_margin = { top: 40, right: 40, bottom: 40, left: 40 }; // 设置图表的边距，包含上、右、下、左四个方向的边距值
  const chart_width = width - (chart_margin.left + chart_margin.right); // 计算图表的宽度，即画布宽度减去左右边距
  const chart_height = height - (chart_margin.top + chart_margin.bottom); // 计算图表的高度，即画布高度减去上下边距

  const svg = scatterContainer
    .append('svg') // 创建 svg 元素
    .attr("id", "scatter") // 设置独特的 ID
    .attr('width', width) // 设置 svg 元素的宽度
    .attr('height', height) // 设置 svg 元素的高度
    .attr('transform', `translate(${chart_margin.left},${chart_margin.top})`); // 平移SVG元素

  if (d3.min(data, d => d.x) < 0) {
    const xOffset = Math.abs(d3.min(data, d => d.x)) + 1;
    data = data.map(d => {
      if (d.y === 0) {
        return { ...d, y: 1 }; // 使用对象展开运算符 (...) 创建一个新对象，并将 x 属性值更新为 1
      } else {
        return d; // 对于其他属性值不为 0 的数据，保持原样
      }
    });
    data.forEach(d => {
      d.x += xOffset; // 将负数 x 值加上偏移量
    });

    let xScale = d3.scaleLog() // 创建对数比例尺
      .base(Math.sqrt(10)) // 设置底数为 10
      .domain([d3.min(data, d => d.x), d3.max(data, d => d.x) * 1.1])
      .range([40, chart_width ]);

    let yScale = d3.scaleLog() // 创建对数比例尺
      .base(Math.sqrt(10)) // 设置底数为 10
      .domain([d3.min(data, d => d.y), d3.max(data, d => d.y) * 2])
      .range([chart_height, 40]);

    svg.append("text")
      .attr("x", xScale(xOffset)) // 在图表水平中心位置
      .attr("y", 20) // 在图表上方偏移 20 个单位
      .text(`x 轴偏移量为+ ${Math.round(xOffset / 10000)} 万元`)
      .attr("font-size", 12)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle");

    // 增加辅助偏移线，处理 x 负值
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
      return { ...d, x: 1 }; // 使用对象展开运算符 (...) 创建一个新对象，并将 x 属性值更新为 1
    } else {
      return d; // 对于其他属性值不为 0 的数据，保持原样
    }
  });

  data = data.map(d => {
    if (d.y === 0) {
      return { ...d, y: 1 }; // 使用对象展开运算符 (...) 创建一个新对象，并将 y 属性值更新为 1
    } else {
      return d; // 对于其他属性值不为 0 的数据，保持原样
    }
  });

  let xScale = d3.scaleLog() // 创建对数比例尺
    .base(Math.sqrt(10)) // 设置底数为 10
    .domain([d3.min(data, d => d.x), d3.max(data, d => d.x) * 1.1])
    .range([40, chart_width ]);

  let yScale = d3.scaleLog() // 创建对数比例尺
    .base(Math.sqrt(10)) // 设置底数为 10
    .domain([d3.min(data, d => d.y), d3.max(data, d => d.y) * 2])
    .range([chart_height, 40]);

  // 增加图例标示年份和颜色的变化
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${chart_width - 20}, ${chart_height - 30})`); // 设置图例位置

  // 添加年份图例
  legend.append("text")
    .attr("x", 20)
    .attr("y", -20)
    .text("年份")
    .attr("font-size", 12)
    .attr("fill", "black")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle");

  // 添加年份和颜色示意图
  const legendItems = legend.selectAll(".legend-item")
    .data([2020, 2021])
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`); // 设置每个图例项的位置

  // 添加年份示意图
  legendItems.append("text")
    .attr("x", 20)
    .attr("y", 0)
    .text(d => d)
    .attr("font-size", 12)
    .attr("fill", "black")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle");

  // 添加颜色示意图
  legendItems.append("rect")
    .attr("x", 60)
    .attr("y", -6)
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", d => {
      if (d === 2020) {
        return "#00BFFF"; // 如果年份为 2020，设置为 steelblue 颜色
      } else if (d === 2021) {
        return "#00FF00"; // 如果年份为 2021，设置为 green 颜色
      } else {
        return "red"; // 其他情况，设置为 red 颜色
      }
    });

    svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => xScale(d.x)) // 设置圆心的 x 坐标为根据 x 值的比例尺计算得到的值
    .attr("cy", d => yScale(d.y)) // 设置圆心的 y 坐标为根据 y 值的比例尺计算得到的值
    .attr("r", d => {
      if (d.行業 === specificIndustry) {
        return 12; // 如果数据所属行业与指定行业相同，设置半径为 15
      } else {
        return 10; // 如果数据所属行业与指定行业不同，设置半径为 10
      }
    })
    .attr("stroke", d => {
      if (d.年分 === 2020) {
        return "#00BFFF"; // 如果年份为 2020，设置边框颜色为 steelblue
      } else if (d.年分 === 2021) {
        return "#00FF00"; // 如果年份为 2021，设置边框颜色为 green
      } else {
        return "red"; // 其他情况，设置边框颜色为 red
      }
    })
    .attr("stroke-width", 2) // 设置边框宽度为 2
    .attr("fill", d => {
      if (d.行業 === specificIndustry) {
        if (d.年分 === 2020) {
          return "#00BFFF"; // 如果数据所属行业与指定行业相同且年份为 2020，设置填充颜色为 steelblue
        } else if (d.年分 === 2021) {
          return "#00FF00"; // 如果数据所属行业与指定行业相同且年份为 2021，设置填充颜色为 green
        } else {
          return "red"; // 其他情况，设置填充颜色为 red
        }
      } else {
        return "white"; // 数据所属行业与指定行业不同，设置填充颜色为白色
      }
    })
    .on("mouseover", (event, d) => {
      d3.select(event.currentTarget)
        .attr("r", d => {
          if (d.行業 === specificIndustry) {
            return 15; // 如果数据所属行业与指定行业相同，设置半径为 20
          } else {
            return 12; // 如果数据所属行业与指定行业不同，设置半径为 12
          }
        });
  
      // 显示文字方框
      svg.append("text")
        .attr("id", "mouse-text") // 设置独特的 ID
        .attr("x", xScale(d.x) + 10) // 在圆点右侧偏移 10 个单位处显示文字方框
        .attr("y", yScale(d.y))
        .text(() => {
          if (d.y === 1) {
            return `${d.公司}\t${xkey + ': ' + d.x}\t 無資料`; // 如果 y 值为 1，显示公司名称、xkey 和 "無資料"
          } else {
            return `${d.公司}\t${xkey + ': ' + d.x}\t ${ykey + ': ' + d.y}`; // 否则，显示公司名称、xkey 和 ykey 的数值
          }
        })
        .attr("font-size", 12)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("pointer-events", "none"); // 避免文字方框挡住鼠标事件
    })
    .on("mouseout", (event) => {
      d3.select(event.currentTarget)
        .attr("r", d => {
          if (d.行業 === specificIndustry) {
            return 12; // 如果数据所属行业与指定行业相同，恢复半径为 15
          } else {
            return 10; // 如果数据所属行业与指定行业不同，恢复半径为 10
          }
        });
  
      // 移除文字方框
      d3.select("#mouse-text").remove();
    })
    .on("dblclick", (event, d) => {
      const xPos = event.pageX + 10; // 獲取滑鼠位置的 x 坐標並加上 10 的偏移量
      const yPos = event.pageY + 10; // 獲取滑鼠位置的 y 坐標並加上 10 的偏移量
      word_cloud(xPos,yPos,d.公司) //觸發文字雲
      
    });
    
    
    
    
    // 添加 x 轴
    svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${chart_height})`) // 将 x 轴放置在图表底部
    .call(d3.axisBottom(xScale).ticks(10, ".2s")); // 使用比例尺绘制 x 轴刻度

    // 添加 y 轴
    svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${chart_margin.left}, 0)`) // 将 y 轴放置在图表左侧
    .call(d3.axisLeft(yScale).ticks(10, ".2s")); // 使用比例尺绘制 y 轴刻度

    // 添加 x 轴网格线
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

    // 添加 y 轴网格线
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

    // 添加 X 轴标题
    svg.append("text")
    .attr("x", chart_width + chart_margin.right / 2 + 10) // x 坐标为图表宽度的一半，使标题居中
    .attr("y", chart_height) // y 坐标为图表高度，使标题位于图表底部
    .text(xkey)
    .attr("fill", "black") // 文字颜色为黑色
    .attr("text-anchor", "middle") // 文字水平对齐方式为居中对齐
    .attr("dominant-baseline", "hanging") // 文字垂直对齐方式为悬挂对齐
    .style("font-size", "16px"); // 文字字体大小为 16px

    // 添加 Y 轴标题
    svg.append("text")
    .attr("x", chart_margin.left) // x 坐标为图表左边距，使标题位于图表左侧
    .attr("y", chart_margin.top / 2) // y 坐标为图表上边距的一半，使标题居中
    .text(ykey)
    .attr("fill", "black") // 文字颜色为黑色
    .attr("text-anchor", "middle") // 文字水平对齐方式为居中对齐
    .attr("dominant-baseline", "hanging") // 文字垂直对齐方式为悬挂对齐
    .style("font-size", "16px"); // 文字字体大小为 16px

    svg.append("line")
      .attr("x1", xScale(d3.min(data, d => d.x))) // 设置起始点的 x 坐标为数据中 x 的最小值经过 x 比例尺转换得到的值
      .attr("y1", yScale(d3.min(data, d => d.y))) // 设置起始点的 y 坐标为数据中 y 的最小值经过 y 比例尺转换得到的值
      .attr("x2", xScale(d3.max(data, d => d.x))) // 设置终点的 x 坐标为数据中 x 的最大值经过 x 比例尺转换得到的值
      .attr("y2", yScale(d3.max(data, d => d.y))) // 设置终点的 y 坐标为数据中 y 的最大值经过 y 比例尺转换得到的值
      .attr("stroke", "red") // 设置线的颜色为红色
      .attr("stroke-width", 1.5) // 设置线的宽度为 1.5
      .attr("fill", "none"); // 设置线的填充颜色为无（不填充）


    // 在右下角添加文字
    svg.append("text")
    .attr("x", chart_width - 10) // x 坐标为图表宽度减去一定的偏移量，使文字靠近右边界
    .attr("y", chart_height - 10) // y 坐标为图表高度减去一定的偏移量，使文字靠近底部
    .text("ESG")
    .attr("fill", "green") // 文字颜色为绿色
    .attr("text-anchor", "end") // 文字水平对齐方式为右对齐
    .attr("dominant-baseline", "baseline") // 文字垂直对齐方式为基线对齐
    .style("font-size", "24px"); // 文字字体大小为 24px
}