// 遊戲狀態：'MENU' (初始介面)、'HOME' (首頁)、'UNIT1' (第一單元)、'UNIT2' (第二單元)、'QUIZ' (總測驗) 或 'CO2' (碳排放小遊戲)
let gameState = 'MENU';

// 下拉選單顯示狀態
let showCarDropdown = false;
let showCourseDropdown = false;

// 第一單元彈窗狀態
let showModal = false;
let modalText = "";
let sdgButtons = []; // 儲存按鈕座標資訊

// 第二單元吉祥物清單
let mascots = [];

// 碳排放小遊戲變數
let cows = [];
let isAlert = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 初始化第二單元吉祥物
  mascots = [
    new Mascot("水資源", width * 0.25, height * 0.5, "water"),
    new Mascot("碳排放", width * 0.5, height * 0.5, "cloud"),
    new Mascot("責任消費", width * 0.75, height * 0.5, "box")
  ];
}

function draw() {
  background(208, 217, 220); // #D0D9DC

  if (gameState === 'MENU') {
    drawMainMenu();
  } else if (gameState === 'HOME') {
    drawHomePage();
  } else if (gameState === 'UNIT1') {
    drawUnit1Page();
  } else if (gameState === 'UNIT2') {
    drawUnit2Page();
  } else if (gameState === 'QUIZ') {
    drawQuizPage();
  } else if (gameState === 'CO2') {
    drawCO2Page();
  }
}

function drawMainMenu() {
  let scaleFactor = min(width / 800, height / 600);
  push();
  translate(width / 2, height / 2);
  scale(scaleFactor);
  translate(-400, -300); // 將座標系移回 800x600 邏輯區域的中心

  fill(255, 255, 255, 150);
  stroke(80);
  strokeWeight(3);
  rect(50, 50, 700, 500, 30);

  drawMacButtons(75, 75);

  fill(60);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(48);
  text("環繞世界", 400, 110);

  // 4. 左側星球（地球）
  drawEarth(220, 300);

  // 5. 右側星球（土星）
  drawSaturn(580, 350);

  // 6. 右上方精靈
  drawSprite(650, 180);

  // 7. 中央下方按鈕：「進入遊戲」
  drawStartButton(400, 480);
  pop();
}

function drawHomePage() {
  // 1. 導覽列 (Navbar)
  fill(255);
  noStroke();
  rect(0, 0, width, 60);
  stroke(220);
  line(0, 60, width, 60);

  // 2. Logo (左側)
  fill(60, 100, 180);
  noStroke();
  rect(20, 10, 100, 40, 5);
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("LOGO", 70, 30);

  // 3. 導覽按鈕 (右側)
  let navItems = ["課程單元", "總測驗", "個人成績", "環保車專區"];
  let startX = width - 450;
  textAlign(LEFT, CENTER);
  textSize(16);

  // 檢查滑鼠是否在選單出現後的矩形範圍內 (導覽列高 60 + 選單高約 110)
  let overCourseMenu = (mouseX > width - 450 && mouseX < width - 310 && mouseY >= 0 && mouseY < 170);
  let overCarMenu = (mouseX > width - 150 && mouseX < width - 30 && mouseY >= 0 && mouseY < 165);

  showCourseDropdown = overCourseMenu;
  showCarDropdown = overCarMenu;

  for (let i = 0; i < navItems.length; i++) {
    let itemX = startX + i * 100;
    let itemY = 30;

    // 偵測滑鼠是否懸停在導覽列文字按鈕上
    let overNavText = (mouseX > itemX && mouseX < itemX + 80 && mouseY > 0 && mouseY < 60);

    if (overNavText || (navItems[i] === "課程單元" && overCourseMenu) || (navItems[i] === "環保車專區" && overCarMenu)) {
      fill(100, 150, 255);
      if (navItems[i] === "課程單元") showCourseDropdown = true; 
      if (navItems[i] === "環保車專區") showCarDropdown = true;
    } else {
      fill(60);
    }
    text(navItems[i], itemX, itemY);
  }

  // 4. 下拉選單邏輯
  if (showCourseDropdown) {
    drawCourseDropdown(width - 450, 60);
  }
  if (showCarDropdown) {
    drawCarDropdown(width - 150, 60);
  }

  // 5. 主畫面內容排版
  // 計算影片寬度與居中位置
  let vWidth = width * 0.6; // 影片寬度佔螢幕 60%
  let vHeight = vWidth * 0.56; // 16:9 比例
  let vX = (width - vWidth) / 2; // 居中 X 座標
  let vY = 160; // 影片的 Y 座標

  // 第一單元標題 (原本標題被取代或不見了，這裡補回)
  fill(60);
  textAlign(CENTER, TOP);
  textSize(32);
  text("第一單元：平台簡介與導覽", width / 2, 100);

  // 居中的影片佔位框
  fill(240);
  stroke(200);
  rect(vX, vY, vWidth, vHeight, 10);
  fill(150);
  noStroke();
  textAlign(CENTER, CENTER);
  text("初始介紹影片播放器", width / 2, vY + vHeight / 2);

  // 平台簡介清單 (移至影片下方)
  let listY = vY + vHeight + 30;
  textAlign(LEFT, TOP);
  textSize(18);
  let listItems = ["✓ 豐富的互動課程內容", "✓ 即時測驗與成效追蹤", "✓ 專屬環保車學習專區"];
  for (let i = 0; i < listItems.length; i++) {
    fill(80);
    text(listItems[i], vX, listY + i * 35);
  }
}

// --- 碳排放小遊戲頁面 (CO2 Scene) ---
function drawCO2Page() {
  // 1. 柔和的綠色草地背景
  background(200, 240, 200);

  // 2. 繪製所有牛隻
  for (let cow of cows) {
    if (!isAlert) cow.move(); // 警報響起後牛隻停止走動
    cow.display();
  }

  // 3. 頂部計數器與提示
  fill(60);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(24);
  text("目前牛隻數量: " + cows.length, 20, 80);
  textSize(16);
  text("提示: 點擊草地來生成牛隻，觀察環境變化", 20, 115);

  // 4. 警報觸發邏輯
  if (isAlert) {
    // 紅色警報閃爍效果 (利用 sin(frameCount) 讓透明度動態變化)
    let alertAlpha = map(sin(frameCount * 0.2), -1, 1, 50, 200);
    fill(255, 0, 0, alertAlpha);
    rect(0, 0, width, height);

    // 彈出警報視窗
    drawAlertModal();
  }

  // 5. 返回按鈕 (左上角)
  fill(60, 100, 180);
  rect(20, 20, 50, 50, 5);
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("返回", 45, 45);
}

// 警報對話框
function drawAlertModal() {
  push();
  let mW = 550;
  let mH = 320;
  translate(width / 2, height / 2);
  
  fill(255);
  stroke(200, 0, 0);
  strokeWeight(5);
  rectMode(CENTER);
  rect(0, 0, mW, mH, 20);

  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  
  textSize(32);
  text("🚨 ⚠️ 逼逼逼！環境警報！", 0, -80);
  
  textSize(20);
  let warningText = "草地上太多牛隻了！\n畜牧業排放的大量甲烷，\n已導致全球碳排放量急遽上升，\n環境正在超載！";
  text(warningText, 0, 5);

  fill(100);
  textSize(16);
  text("(點擊畫面任何地方即可重置遊戲)", 0, 110);
  pop();
}

// 乳牛類別 (Cow Class)
class Cow {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1.5, 1.5); // 隨機隨機漂移速度
    this.vy = random(-1.5, 1.5);
    this.size = random(0.6, 1.3); // 隨機大小
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    // 碰到畫布邊界反彈
    if (this.x < 50 || this.x > width - 50) this.vx *= -1;
    if (this.y < 150 || this.y > height - 50) this.vy *= -1;
  }

  display() {
    push();
    translate(this.x, this.y);
    scale(this.size);
    noStroke();
    // 四條腿
    fill(255);
    rect(-18, 10, 6, 20); rect(-8, 12, 6, 20);
    rect(8, 12, 6, 20); rect(18, 10, 6, 20);
    // 身體
    ellipse(0, 0, 65, 45);
    // 黑斑點 (手繪感拼湊)
    fill(40);
    ellipse(-12, -8, 18, 12); ellipse(15, 12, 20, 15); ellipse(5, -15, 12, 10);
    // 頭部與嘴
    fill(255); ellipse(38, -18, 32, 32);
    fill(255, 182, 193); ellipse(45, -15, 22, 16); // 粉紅色牛嘴
    // 眼睛
    fill(0); ellipse(32, -22, 4, 4); ellipse(44, -22, 4, 4);
    pop();
  }
}

function drawUnit1Page() {
  background(208, 217, 220); // #D0D9DC

  // --- 1. Logo 區域 (左上角) ---
  fill(60, 100, 180);
  noStroke();
  rect(20, 20, 50, 50, 5); // 50x50 正方形
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("回首頁", 45, 45);

  // --- 2. 影片佔位框 (中央上方) ---
  let vWidth = width * 0.7;
  let vHeight = vWidth * 0.56;
  let vX = (width - vWidth) / 2;
  let vY = 80;

  fill(255);
  stroke(150);
  strokeWeight(2);
  rect(vX, vY, vWidth, vHeight, 10);
  
  fill(60);
  noStroke();
  textSize(24);
  text("第一單元影片內容", width / 2, vY + vHeight / 2);

  // --- 3. SDGs 按鈕群 (水平並排) ---
  let sdgNames = ['SDGs 6', 'SDGs 7', 'SDGs 4', 'SDGs 12'];
  let btnSize = 80;
  let btnSpacing = 20;
  let totalWidth = (btnSize * 4) + (btnSpacing * 3);
  let startX = (width - totalWidth) / 2;
  let btnY = vY + vHeight + 50;

  sdgButtons = []; // 每次重繪時更新按鈕範圍資訊

  for (let i = 0; i < sdgNames.length; i++) {
    let x = startX + i * (btnSize + btnSpacing);
    
    // 儲存按鈕範圍供滑鼠偵測使用
    sdgButtons.push({ x: x, y: btnY, size: btnSize, name: sdgNames[i] });

    // 繪製按鈕
    fill(255);
    stroke(60, 100, 180);
    rect(x, btnY, btnSize, btnSize, 10);
    
    fill(60, 100, 180);
    noStroke();
    textSize(14);
    text(sdgNames[i], x + btnSize / 2, btnY + btnSize / 2);
  }

  // --- 4. 彈出對話框 (Modal) ---
  if (showModal) {
    drawSDGModal();
  }
}

function drawSDGModal() {
  // 半透明黑色遮罩
  fill(0, 150);
  noStroke();
  rect(0, 0, width, height);

  // 白色對話框主體
  let mWidth = 400;
  let mHeight = 250;
  let mx = (width - mWidth) / 2;
  let my = (height - mHeight) / 2;

  fill(255);
  stroke(0);
  strokeWeight(1);
  rect(mx, my, mWidth, mHeight, 15);

  // 內容文字
  fill(60);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  text(modalText, width / 2, my + mHeight / 2);

  // 右上角 'X' 關閉按鈕
  fill(200, 50, 50);
  textSize(24);
  text("X", mx + mWidth - 25, my + 25);
  
  // 小提示
  textSize(12);
  text("(點擊 X 關閉視窗)", width / 2, my + mHeight - 30);
}

function drawCourseDropdown(x, y) {
  push();
  fill(255);
  stroke(220);
  rect(x, y, 140, 110, 0, 0, 5, 5);
  
  let subItems = ["第一單元", "第二單元", "第三單元"];
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  for (let i = 0; i < subItems.length; i++) {
    let subY = y + 15 + i * 30;
    // 偵測子項目懸停
    if (mouseX > x && mouseX < x + 140 && mouseY > subY && mouseY < subY + 25) {
      fill(100, 150, 255);
    } else {
      fill(80);
    }
    text("• " + subItems[i], x + 15, subY);
  }
  pop();
}

function drawUnit2Page() {
  background(208, 217, 220); // #D0D9DC

  // --- 1. Logo 區域 (左上角) ---
  fill(60, 100, 180);
  noStroke();
  rect(20, 20, 50, 50, 5);
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("回首頁", 45, 45);

  // --- 2. 標題 ---
  fill(60);
  textSize(32);
  text("第二單元：永續吉祥物互動", width / 2, 80);

  // --- 3. 吉祥物互動偵測 ---
  let hoveredMascot = null;
  for (let m of mascots) {
    if (m.checkHover(mouseX, mouseY)) {
      hoveredMascot = m;
      break;
    }
  }

  // 繪製所有吉祥物
  for (let m of mascots) {
    let isAnyHovered = (hoveredMascot !== null);
    let isThisHovered = (m === hoveredMascot);
    m.display(isAnyHovered, isThisHovered);
  }
}

// 吉祥物類別
class Mascot {
  constructor(name, x, y, type) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.type = type;
    this.radius = 60;
  }

  display(isAnyHovered, isThisHovered) {
    push();
    translate(this.x, this.y);

    // 1. 互動特效：Spotlight 與發光線
    if (isThisHovered) {
      // 頭頂 Spotlight 效果
      noStroke();
      fill(255, 255, 0, 50);
      triangle(0, -this.radius, -100, -height, 100, -height);

      // 手繪感光芒線
      stroke(255, 200, 0);
      strokeWeight(3);
      for (let i = 0; i < 8; i++) {
        let angle = TWO_PI / 8 * i;
        line(cos(angle) * 70, sin(angle) * 70, cos(angle) * 100, sin(angle) * 100);
      }
    }

    // 2. 角色形狀與顏色偵測
    noStroke();
    if (isAnyHovered && !isThisHovered) {
      fill(180); // 灰化非選擇角色
    } else {
      // 設定角色原色
      if (this.type === "water") fill(100, 200, 255);
      else if (this.type === "cloud") fill(255);
      else if (this.type === "box") fill(255, 180, 100);
    }

    // 繪製對應形狀
    if (this.type === "water") {
      beginShape();
      vertex(0, -60);
      bezierVertex(40, -20, 40, 40, 0, 60);
      bezierVertex(-40, 40, -40, -20, 0, -60);
      endShape(CLOSE);
    } else if (this.type === "cloud") {
      ellipse(0, 0, 100, 60);
      ellipse(-30, 20, 60, 50);
      ellipse(30, 20, 60, 50);
    } else if (this.type === "box") {
      rectMode(CENTER);
      rect(0, 0, 90, 90, 15);
    }

    // 3. 標註中文名稱
    fill(isAnyHovered && !isThisHovered ? 120 : 60);
    textSize(20);
    textAlign(CENTER);
    text(this.name, 0, 100);
    pop();
  }

  checkHover(mx, my) {
    return dist(mx, my, this.x, this.y) < this.radius + 20;
  }
}

function drawQuizPage() {
  background(208, 217, 220); // #D0D9DC

  // --- 1. Logo 區域 (回首頁) ---
  fill(60, 100, 180);
  noStroke();
  rect(20, 20, 50, 50, 5);
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("回首頁", 45, 45);

  // --- 2. 標題 ---
  fill(60);
  textSize(32);
  text("總測驗：掃描 QR Code 開始", width / 2, 100);

  // --- 3. QR Code 繪製 ---
  let qrSize = 250;
  let qx = (width - qrSize) / 2;
  let qy = (height - qrSize) / 2;

  // QR Code 外框
  fill(255);
  stroke(60);
  strokeWeight(2);
  rect(qx - 20, qy - 20, qrSize + 40, qrSize + 40, 10);

  // 模擬 QR Code 圖案 (這部分可以換成實際圖片，現在用圖形代表)
  fill(40);
  noStroke();
  rect(qx, qy, qrSize, qrSize);
  // 四角定位標誌
  fill(255);
  rect(qx + 10, qy + 10, 60, 60);
  rect(qx + qrSize - 70, qy + 10, 60, 60);
  rect(qx + 10, qy + qrSize - 70, 60, 60);

  // 提示文字
  fill(80);
  textSize(18);
  textAlign(CENTER);
  text("點擊 QR Code 進入外部測驗連結", width / 2, qy + qrSize + 60);
}

function drawCarDropdown(x, y) {
  push();
  fill(255);
  stroke(220);
  rect(x, y, 120, 105, 0, 0, 5, 5);
  
  let subItems = ["簡介", "影片", "預約"];
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  for (let i = 0; i < subItems.length; i++) {
    let subY = y + 15 + i * 30;
    if (mouseX > x && mouseX < x + 120 && mouseY > subY && mouseY < subY + 25) {
      fill(100, 150, 255);
    } else {
      fill(80);
    }
    text("▶ " + subItems[i], x + 15, subY);
  }
  pop();
}

function mousePressed() {
  if (gameState === 'MENU') {
    // 根據 drawMainMenu 的縮放比例計算按鈕點擊範圍
    let scaleFactor = min(width / 800, height / 600);
    let btnX = width / 2;
    let btnY = height / 2 + (180 * scaleFactor); // 480 在 800x600 中的 Y 偏移
    let btnW = 200 * scaleFactor;
    let btnH = 60 * scaleFactor;

    if (mouseX > btnX - btnW / 2 && mouseX < btnX + btnW / 2 &&
        mouseY > btnY - btnH / 2 && mouseY < btnY + btnH / 2) {
      gameState = 'HOME';
    }
  } else if (gameState === 'HOME') {
    // 偵測 Logo 點擊 (重設頁面回選單)
    if (mouseX > 20 && mouseX < 120 && mouseY > 10 && mouseY < 50) {
      gameState = 'MENU';
    }

    // 偵測「總測驗」按鈕點擊 (startX 為 width - 450, 總測驗是 index 1)
    let quizBtnX = width - 350;
    if (mouseX > quizBtnX && mouseX < quizBtnX + 80 && mouseY > 0 && mouseY < 60) {
      gameState = 'QUIZ';
    }

    // 偵測課程單元下拉選單點擊
    if (showCourseDropdown) {
      let x = width - 450;
      for (let i = 0; i < 3; i++) {
        let subY = 60 + 15 + i * 30;
        if (mouseX > x && mouseX < x + 140 && mouseY > subY && mouseY < subY + 25) {
          if (i === 0) { // 如果點擊第一單元
            gameState = 'UNIT1';
          }
          if (i === 1) { // 如果點擊第二單元
            gameState = 'UNIT2';
          }
        }
      }
    }

    // 偵測環保車專區點擊 (依此類推)
    if (showCarDropdown) {
      // 可在此加入點擊「簡介、影片、預約」的邏輯
    }
  } else if (gameState === 'UNIT1') {
    // 如果彈窗開啟，優先偵測 X 按鈕
    if (showModal) {
      let mWidth = 400;
      let mHeight = 250;
      let mx = (width - mWidth) / 2;
      let my = (height - mHeight) / 2;
      
      // 偵測右上角 X 區域
      if (mouseX > mx + mWidth - 50 && mouseX < mx + mWidth && mouseY > my && mouseY < my + 50) {
        showModal = false;
      }
      return; // 彈窗開啟時不偵測後方按鈕
    }

    // 偵測回首頁 Logo
    if (mouseX > 20 && mouseX < 70 && mouseY > 20 && mouseY < 70) {
      gameState = 'HOME';
    }

    // 偵測 SDGs 按鈕點擊
    for (let btn of sdgButtons) {
      if (mouseX > btn.x && mouseX < btn.x + btn.size && 
          mouseY > btn.y && mouseY < btn.y + btn.size) {
        showModal = true;
        modalText = "您點擊了 " + btn.name + "\n這是該指標的詳細介紹內容。";
      }
    }
  } else if (gameState === 'UNIT2') {
    // 偵測回首頁 Logo
    if (mouseX > 20 && mouseX < 70 && mouseY > 20 && mouseY < 70) {
      gameState = 'HOME';
    }

    // 修正：將吉祥物點擊偵測移至 UNIT2 區塊
    for (let m of mascots) {
      if (m.checkHover(mouseX, mouseY)) {
        if (m.name === "碳排放") {
          gameState = 'CO2';
          resetCO2Game();
        }
      }
    }
  } else if (gameState === 'QUIZ') {
    // 偵測回首頁 Logo
    if (mouseX > 20 && mouseX < 70 && mouseY > 20 && mouseY < 70) {
      gameState = 'HOME';
    }

    // 偵測 QR Code 點擊連結
    let qrSize = 250;
    let qx = (width - qrSize) / 2;
    let qy = (height - qrSize) / 2;
    if (mouseX > qx && mouseX < qx + qrSize && mouseY > qy && mouseY < qy + qrSize) {
      window.open("https://forms.gle/your-google-form-url", "_blank"); // 替換為你的連結
    }
  }
  else if (gameState === 'CO2') {
    // 返回按鈕偵測
    if (mouseX > 20 && mouseX < 70 && mouseY > 20 && mouseY < 70) {
      gameState = 'HOME';
      return;
    }

    if (isAlert) {
      // 警報響起後點擊重置回 1 隻牛
      resetCO2Game();
    } else {
      // 動態生成新牛隻
      cows.push(new Cow(mouseX, mouseY));
      // 檢查是否達到 15 隻門檻
      if (cows.length >= 15) {
        isAlert = true;
      }
    }
  }
}

function windowResized() {
  // 當瀏覽器視窗大小改變時，重新調整畫布尺寸
  resizeCanvas(windowWidth, windowHeight);
}

function drawMacButtons(x, y) {
  push();
  strokeWeight(1.5);
  fill(255, 95, 87); ellipse(x, y, 15, 15);     // 紅
  fill(255, 189, 46); ellipse(x + 25, y, 15, 15); // 黃
  fill(39, 201, 63); ellipse(x + 50, y, 15, 15);  // 綠
  pop();
}

function drawEarth(x, y) {
  push();
  stroke(60); strokeWeight(3); fill(144, 238, 144);
  ellipse(x, y, 160, 160);
  fill(60); noStroke(); textAlign(CENTER, CENTER); textSize(60);
  text("地", x, y);
  // 旋轉箭頭
  stroke(80); noFill(); strokeWeight(2);
  line(x - 110, y, x - 110, y - 40); line(x - 110, y - 40, x - 120, y - 30); line(x - 110, y - 40, x - 100, y - 30);
  line(x + 110, y, x + 110, y + 40); line(x + 110, y + 40, x + 100, y + 30); line(x + 110, y + 40, x + 120, y + 30);
  pop();
}

// 重置小遊戲狀態
function resetCO2Game() {
  cows = [];
  cows.push(new Cow(width / 2, height / 2));
  isAlert = false;
}

function drawSaturn(x, y) {
  push();
  stroke(40); strokeWeight(3); noFill();
  ellipse(x, y, 220, 60); // 行星環
  fill(255, 200, 120); ellipse(x, y, 120, 120); // 星球主體
  pop();
}

function drawSprite(x, y) {
  push();
  stroke(255, 255, 255, 150);
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  line(x, y, 580, 350); // 連向土星
  drawingContext.setLineDash([]);
  noStroke();
  fill(144, 238, 144); ellipse(x - 15, y - 5, 20, 40); ellipse(x + 15, y - 5, 20, 40); // 翅膀
  fill(255, 230, 200); ellipse(x, y, 25, 25); // 身體
  fill(60); ellipse(x - 5, y - 2, 3, 3); ellipse(x + 5, y - 2, 3, 3); // 眼睛
  pop();
}

function drawStartButton(x, y) {
  push();
  noStroke();
  for(let i = 10; i > 0; i--) { // 發光效果
    fill(255, 255, 255, 20 - i);
    rect(x - 100 - i, y - 30 - i, 200 + i*2, 60 + i*2, 20);
  }
  stroke(200); strokeWeight(2); fill(255);
  rect(x - 100, y - 30, 200, 60, 15);
  noStroke(); fill(80); textAlign(CENTER, CENTER); textSize(28);
  text("進入遊戲", x, y);
  pop();
}
