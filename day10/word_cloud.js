export default function word_cloud(xPos,yPos,company){
  function nan(d) {
    return {
      'E達成': (d['E~達成']), // 将属性 '產業類別' 的值进行转换
      'E目標': (d['E~目標']), // 将属性 '產業類別' 的值进行转换
      '風險': (d['風險']), // 将属性 '產業類別' 的值进行转换
      '實體風險':(d['實體風險']),
      '重要度'  : Number(d['重要度']),
      'cdp'    : d['CDP'],
      'sbti'   : d['SBTi'],
      'msci'   : d['MSCI']
    }
  }
  let path = "csv/"+company.slice(-4)+".csv";
  d3.csv(path,nan).then(words=>{
    // console.log(words)
    drawcloud(xPos,yPos,words,company)
  })
}

function drawcloud(xPos,yPos,words,company){

  const cdp = words[0].cdp;
  const sbti = words[0].sbti;
  const msci = words[0].msci;
  // 指定新視窗的尺寸和位置
  const windowWidth = 1280;
  const windowHeight = 960;
  const windowLeft = window.screenX + xPos;
  const windowTop = window.screenY + yPos;
  // 在指定尺寸和位置創建新視窗
  var informationModal = new bootstrap.Modal(document.getElementById('informationModal'));
  // 觸發視窗
  informationModal.show();
    
  const chart_margin = { top: 40, right: 40, bottom: 40, left: 40 }; // 设置图表的边距，包含上、右、下、左四个方向的边距值
  const chart_width = windowWidth - (chart_margin.left + chart_margin.right); // 计算图表的宽度，即画布宽度减去左右边距
  const chart_height = windowHeight - (chart_margin.top + chart_margin.bottom); // 计算图表的高度，即画布高度减去上下边距
  
  /*
  // 在新視窗的 head 元素中引入外部 CSS 檔案
  const link = newWindow.document.createElement("link");
  link.rel = "stylesheet";
  link.href = "./stylesheets/helpers/all.css"; // 請替換為你的本地 CSS 檔案的路徑
  newWindow.document.head.appendChild(link);
  */
  // 在新視窗內創建一個 <div> 元素，並設置其寬度和高度
  const container = d3.select(document.getElementById('informationModal').querySelector('.modal-body'))
  .append("div")
  .attr("id", "cloudcontainer")
  .style("width", chart_width + "px")
  .style("height", chart_height + "px");


  // 增加標題
  let modalTitle = document.getElementById("informationModalLabel");
  modalTitle.textContent = company + " 風險、目標與成果彙整報告";  // 設置元素的內容

  // 增加副標題
  /*
  let modalSubTitle = document.getElementById("informationModalSubLabel");
  modalSubTitle.textContent = "CDP climate change grade: " + cdp + "&nbsp;&nbsp;&nbsp;SBTI target classification: " + sbti+"&nbsp;&nbsp;&nbsp;MSCI ESG rating: "+msci;  // 設置元素的內容
  */
  container.append("div")
  .attr("id", "subtitle")
  .style("text-align", "center")
  .style("font-size", "24px")
  .html("CDP climate change grade: " + cdp + "&nbsp;&nbsp;&nbsp;SBTI target classification: " + sbti+"&nbsp;&nbsp;&nbsp;MSCI ESG rating: "+msci);
  

  // 在 <div> 元素中創建一個 SVG 元素
  const svg = container.append("svg")
  .attr("width", chart_width)
  .attr("height", chart_height)
  .style("background-image", "url(https://imgur.com/HJB0fD6.png)")
  .style("background-size", "800px 800px")
  .style("background-repeat","no-repeat")
  .style("background-position", "60% 60%");

  // 在 SVG 中創建矩形元素
  const rectangle = svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", chart_width)
  .attr("height", chart_height)
  .style("fill", "none") // 這裡可以自行設置填充顏色，這裡用藍色作為範例
  .attr("stroke", "black")
  .attr("stroke-width", 8);

  // 風險插圖
svg.append("image")
.attr("href", "https://imgur.com/44DGITP.jpg")
.attr("width", 50)
.attr("height", 50)
.attr("x", 620)
.attr("y", 220);

// 目標插圖
svg.append("image")
.attr("href", "https://imgur.com/yN4Hftj.jpg")
.attr("width",50)
.attr("height", 50)
.attr("x", 500)
.attr("y", 280);

// 策略插圖
svg.append("image")
.attr("href", "https://imgur.com/jJ3c2Be.jpg")
.attr("width",50)
.attr("height", 50)
.attr("x", 630)
.attr("y", 340);

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here   
function createWordCloud(words, color, xPos, yPos,width,height) {
  let layout = d3.layout.cloud()
    .size([width, height])
    .words(words.map(function(d) { return { text: d.text, size: d.size }; }))
    .padding(5) // space between words
    .rotate(0)
    .fontSize(function(d) { return d.size; }) // font size of words
    .on("end", draw);

  layout.start();

  function draw(words) {

    // 確認文字雲位置
    // const cloudWidth = layout.size()[0];
    // const cloudHeight = layout.size()[1];

    // svg.append("rect")
    //   .attr("x", xPos - cloudWidth / 2)
    //   .attr("y", yPos - cloudHeight / 2)
    //   .attr("width", cloudWidth)
    //   .attr("height", cloudHeight)
    //   .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    //   .attr("fill", "none")
    // .attr("stroke", "black")
    // .attr("stroke-width", 1);
    svg.append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", function(d) { return d.size; })
      .style("fill", color)
      .attr("text-anchor", "middle")
      .style("font-family", "Impact")
      .attr("transform", function(d) {
        return "translate(" + [d.x + xPos, d.y + yPos] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
  }
}

// Usage example for draw1 and draw2
createWordCloud(words.map(function(d) { return { text: d.E達成, size: d.重要度+2}; }), "#00A86B",680, 410,480,250);
createWordCloud(words.map(function(d) { return { text: d.E目標, size: d.重要度+2 }; }), "#9966CB", 0, 200,480,250);
createWordCloud(words.map(function(d) { return { text: d.風險, size: d.重要度+2 }; }), "#FFA600", 680, 105,480,150);
createWordCloud(words.map(function(d) { return { text: d.實體風險, size: d.重要度+2 }; }), "red", 680, 5,480,100);

// 设置弧度路径的半径
const radius = 125;

// 设置弧度路径的坐标和大小
const arc = d3.arc()
    .innerRadius(radius)
    .outerRadius(radius);

// 数据数组，这里假设有三段弧度路径
const data = [
  { startAngle: 0 - (Math.PI / 6), endAngle: 2 * Math.PI / 3 - (Math.PI / 6) },
  { startAngle: 2 * Math.PI / 3 - (Math.PI / 6), endAngle: 4 * Math.PI / 3 - (Math.PI / 6) },
  { startAngle: 4 * Math.PI / 3 - (Math.PI / 6), endAngle: 6 * Math.PI / 3 - (Math.PI / 6) }
];

const arcs = svg.selectAll("g.arc")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", "translate(598,313)");

// 在弧度路径上添加弧
// arcs.append("path")
//     .attr("d", d => arc(d))
//     .attr("fill", "none")
//     .attr("stroke", "#333")
//     .attr("stroke-width", 2);
    
const label =['風險','成果','目標']

// 在弧度路径上添加文字
arcs.append("text")
    .attr("dy", ".35em")
    .attr("transform", function(d, i) {
        const pos = arc.centroid(d);
        // 計算弧線的中心角度
        const angle = (d.startAngle + d.endAngle) / 2;
        // 將文字向上移動一些，使其與弧線彎曲
        // const yOffset = Math.cos(angleInRadians);;
        // 將文字進行旋轉，使其與弧線一致
        return `translate(${pos[0]*1.1}, ${pos[1]*1.1}) rotate(${angle * (180 / Math.PI)})`;
    })
    .attr("text-anchor", "middle")
    .text(function(d, i) { return label[i]; }) // 使用 label 陣列來取得標籤文字
    .attr("fill", 'black')
    .style("font-size", "16px");
}

function killDetailInformation(){
  d3.selectAll('.modal-body > div').remove();
}

document.getElementById('informationModal').addEventListener('hidden.bs.modal', function (event) {
  killDetailInformation()
});
