export default function word_cloud(xPos,yPos,company){
    function nan(d) {
      return {
        '文字': (d['文字']), // 将属性 '產業類別' 的值进行转换
        '重要度':Number((d['重要度']))
      }
    }
    
    d3.csv("example-tcfd.csv",nan).then(words=>{
      // console.log(words)
      drawcloud(xPos,yPos,words)
    })
}

function drawcloud(xPos,yPos,words){
  console.log(words)
  // 指定新視窗的尺寸和位置
  const windowWidth = 1080;
  const windowHeight = 1080;
  const windowLeft = window.screenX + xPos;
  const windowTop = window.screenY + yPos;
  // 在指定尺寸和位置創建新視窗
  const newWindow = window.open("", "_blank", `width=${windowWidth}, height=${windowHeight}, left=${windowLeft}, top=${windowTop}`);
  
  const chart_margin = { top: 40, right: 40, bottom: 40, left: 40 }; // 设置图表的边距，包含上、右、下、左四个方向的边距值
  const chart_width = windowWidth - (chart_margin.left + chart_margin.right); // 计算图表的宽度，即画布宽度减去左右边距
  const chart_height = windowHeight - (chart_margin.top + chart_margin.bottom); // 计算图表的高度，即画布高度减去上下边距
  
  // 在新視窗的 head 元素中引入外部 CSS 檔案
  const link = newWindow.document.createElement("link");
  link.rel = "stylesheet";
  link.href = "http://127.0.0.1:5500/style.css"; // 請替換為你的本地 CSS 檔案的路徑
  newWindow.document.head.appendChild(link);
  // 在新視窗內創建一個 <div> 元素，並設置其寬度和高度
  const container = d3.select(newWindow.document.body)
  .append("div")
  .attr("id", "cloudcontainer")
  .style("width", chart_width + "px")
  .style("height", chart_height + "px");

// 在 <div> 元素中創建一個 SVG 元素
  const svg = container.append("svg")
    .attr("width", chart_width)
    .attr("height", chart_height)
    .style("background-image", "url(http://127.0.0.1:5500/cloud.png)")
    .style("background-size", "800px 800px")
    .style("background-repeat","no-repeat")
    .style("background-position", "60% 60%");

  // 風險插圖
svg.append("image")
.attr("href", "http://127.0.0.1:5500/risk.jpg")
.attr("width", 50)
.attr("height", 50)
.attr("x", 480)
.attr("y", 300);

// 目標插圖
svg.append("image")
.attr("href", "http://127.0.0.1:5500/target.jpg")
.attr("width",50)
.attr("height", 50)
.attr("x", 380)
.attr("y", 360);

// 策略插圖
svg.append("image")
.attr("href", "http://127.0.0.1:5500/strategy.jpg")
.attr("width",50)
.attr("height", 50)
.attr("x", 505)
.attr("y", 415);

    
// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here
var layout = d3.layout.cloud()
  .size([chart_width/2, chart_height/2])
  .words(words.map(function(d) { return {text: d.文字, size:d.重要度*2+14}; }))
  .padding(1)        //space between words
  .rotate(0)
  .fontSize(function(d) { return d.size; })      // font size of words
  .on("end", draw);
layout.start();

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
function draw(words) {
  svg.append("g")
    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style("font-size", function(d) { return d.size; })
    .style("fill", "#00A86B")
    .attr("text-anchor", "middle")
    .style("font-family", "Impact")
    .attr("transform", function(d) {
    console.log(d.x)
    return "translate(" + [d.x+450, d.y-80] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
  
  svg.append("g")
    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style("font-size", function(d) { return d.size; })
    .style("fill", "#9966CB")
    .attr("text-anchor", "middle")
    .style("font-family", "Impact")
    .attr("transform", function(d) {
    console.log(d.x)
    return "translate(" + [d.x+450, d.y+chart_height/3] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
  
  svg.append("g")
    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style("font-size", function(d) { return d.size; })
    .style("fill", "#F9A602")
    .attr("text-anchor", "middle")
    .style("font-family", "Impact")
    .attr("transform", function(d) {
    console.log(d.x)
    return "translate(" + [d.x-75, d.y+150] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
  }
}