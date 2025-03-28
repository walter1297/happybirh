const canvas = document.getElementById("cakeCanvas");
const ctx = canvas.getContext("2d");

// 加载蛋糕图片
const img = new Image();
img.src = "img/out.png"; // 确保路径正确

// 粒子数组
let particles = [];

// 卡片对应的描述文字
const cardDescriptions = [
    "王王觉得你像小狗，很聪明听话！",
    "王王觉得你像树林，因为树林里有很多枯萎的草木，但也有明媚的花",
    "王王觉得你像喇叭花，白天跟人类在一起就会打开",
    "王王觉得你像仔仔熊，很可靠！因为你总是喜欢帮忙",
    "王王觉得你像春天！因为喜欢讨好人类",
    "王王认为你喜欢配音！",
    "王王觉得你像方便面！任何时间都能给人类补充能量",
    "王王觉得你像粉色！时髦又聪明",
    "王王认为你像酷儿！因为我喜欢喝这个"
];

img.onload = function() {
    console.log("图片加载成功");

    // 获取图片的原始尺寸
    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;

    // 计算宽高比
    const aspectRatio = originalWidth / originalHeight;

    // 设置新的宽度为 200px，计算新的高度
    const newWidth = 200;
    const newHeight = newWidth / aspectRatio;

    // 设置 canvas 尺寸
    canvas.width = newWidth;
    canvas.height = newHeight;

    // 绘制图片，保持比例
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
};

// 粒子类
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 5 + 2;
        this.life = 1;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.02;
        this.size *= 0.98;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 显示“生日快乐”文字
function showBirthdayMessage() {
    ctx.font = "bold 24px 'MyPixelFont', sans-serif";
    ctx.fillStyle = "#ff4d4d";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const text = "生日快乐";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

// 动画粒子
function animateParticles() {
    // 清除画布并重新绘制蛋糕图片（不含火焰）
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 更新和绘制粒子
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.draw();
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }

    // 如果还有粒子，继续动画
    if (particles.length > 0) {
        requestAnimationFrame(animateParticles);
    } else {
        showBirthdayMessage();
        enableSecondClick();
    }
}

// 第一次点击：吹蜡烛
function handleFirstClick() {
    const dialogBox = document.getElementById("dialogBox");
    const dialogText = document.getElementById("dialogText");
    dialogBox.style.animation = "none";
    dialogBox.offsetHeight; // 触发重绘
    dialogBox.style.animation = "slideIn 0.5s forwards";
    dialogText.textContent = "这是属于你的烟花，生日快乐";

    // 禁用第一次点击
    dialogBox.removeEventListener("click", handleFirstClick);

    // 获取像素数据
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imgData.data;

    // 火焰的两种颜色（RGB）
    const flame1R = 243; // #f3ed86
    const flame1G = 237;
    const flame1B = 134;

    const flame2R = 243; // #f3d886
    const flame2G = 216;
    const flame2B = 134;

    const tolerance = 20; // 颜色误差范围

    // 遍历上部20%的像素（火焰区域）
    const flameAreaHeight = Math.floor(canvas.height * 0.2);
    for (let y = 0; y < flameAreaHeight; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            let r = pixels[i];     // 红色通道
            let g = pixels[i + 1]; // 绿色通道
            let b = pixels[i + 2]; // 蓝色通道

            // 检查像素颜色是否接近任一火焰颜色
            const matchesFlame1 =
                Math.abs(r - flame1R) <= tolerance &&
                Math.abs(g - flame1G) <= tolerance &&
                Math.abs(b - flame1B) <= tolerance;

            const matchesFlame2 =
                Math.abs(r - flame2R) <= tolerance &&
                Math.abs(g - flame2G) <= tolerance &&
                Math.abs(b - flame2B) <= tolerance;

            if (matchesFlame1 || matchesFlame2) {
                // 将火焰像素设为透明
                pixels[i + 3] = 0;

                // 创建粒子（使用火焰颜色）
                const color = matchesFlame1 ? "#f3ed86" : "#f3d886";
                particles.push(new Particle(x, y, color));
            }
        }
    }

    // 更新画布（移除火焰）
    ctx.putImageData(imgData, 0, 0);

    // 保存移除火焰后的图片状态
    img.src = canvas.toDataURL();

    // 开始粒子动画
    animateParticles();
}
// 第二次点击：显示九宫格
function enableSecondClick() {
    const dialogBox = document.getElementById("dialogBox");
    const dialogText = document.getElementById("dialogText");

    dialogBox.style.cursor = "pointer";
    dialogBox.style.pointerEvents = "auto";

    dialogBox.addEventListener("click", function handleSecondClick() {
        dialogBox.style.animation = "none";
        dialogBox.offsetHeight;
        dialogBox.style.animation = "slideIn 0.5s forwards";
        dialogText.textContent = "好奇王王对你的九宫格印象吗？点击它就能看到";

        const cakeCanvas = document.getElementById("cakeCanvas");
        cakeCanvas.style.display = "none";

        const cardGrid = document.getElementById("cardGrid");
        cardGrid.style.display = "grid";

        dialogBox.removeEventListener("click", handleSecondClick);
        dialogBox.style.cursor = "default";
        dialogBox.style.pointerEvents = "none";

        const cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            card.addEventListener("click", function() {
                card.classList.add("flipped");

                const cardBack = card.querySelector(".card-back");
                const backgroundImage = cardBack.style.backgroundImage;
                const imageUrl = backgroundImage.slice(5, -2);

                const existingImage = document.querySelector(".card-image");
                if (existingImage) {
                    existingImage.remove();
                }

                const newImage = document.createElement("img");
                newImage.src = imageUrl;
                newImage.className = "card-image";

                const birthContainer = document.querySelector(".birth");
                birthContainer.insertBefore(newImage, cardGrid);

                const index = parseInt(card.getAttribute("data-index"));
                dialogBox.style.animation = "none";
                dialogBox.offsetHeight;
                dialogBox.style.animation = "slideIn 0.5s forwards";
                dialogText.textContent = cardDescriptions[index];
            });
        });
    });
}

// 绑定第一次点击事件
document.getElementById("dialogBox").addEventListener("click", handleFirstClick);