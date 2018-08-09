HTMLDivElement.prototype.createTurnPage = createTurnPage;

// imgSrcArray: 图片资源（路径）数组
function createTurnPage(imgSrcArray) {
    // 属性
    this.width = this.offsetWidth;
    this.height = this.offsetHeight;
    this.srcArray = imgSrcArray;
    this.sliderPage = null;
    this.leftBtn = null;
    this.rightBtn = null;
    this.sliderIndex = null;
    this.oSpanArray = null;
    this.num = imgSrcArray.length - 1;
    this.moveWidth = this.width;
    this.timer = null;
    this.lock = true;
    this.index = 0;

    // 事件
    this.init = init;
    this.bindEvent = bindEvent;
    this.autoMove = autoMove;
    this.changeIndex = changeIndex;
    // 初始化
    this.init();
    this.bindEvent();
}

function init() {
    // sliderPage
    // 结构
    var oUl = document.createElement('ul');
    var str = '';
    for(var i = 0; i < this.num + 1; i ++) {
        str += '<li><img /></li>';
    }
    oUl.innerHTML = str;
    // 外层容器必要样式重新设置
    this.style.overflow = 'hidden';
    this.style.position = 'relative';
    // 样式
    var ulStyle = 'position:absolute; left:0; top:0; width:' + this.width * (this.num + 1) + 'px; height:' + this.height + 'px;',
    liStyle = 'width:' + this.width + 'px; height:' + this.height + 'px; float:left;',
    imgStyle = 'width:100%; height:100%;';
    var lisArray = oUl.children;

    oUl.style = ulStyle;
    for(var i = 0; i < this.num + 1; i ++) {
        lisArray[i].style = liStyle;
        lisArray[i].firstElementChild.style = imgStyle;
        lisArray[i].firstElementChild.src = this.srcArray[i];
    }

    // btn
        // 结构
    var leftBtn = document.createElement('div'),
        rightBtn = document.createElement('div');

        // 样式
    var btnStyle = 'position:absolute; top:50%; margin-top:-25px;width: 40px; height: 50px; \
                    font-size:20px; color:#fff;text-align:center; line-height:50px; \
                    background:#000;opacity: 0.2; cursor: pointer;';

    leftBtn.style = 'left: 15px;' + btnStyle;
    rightBtn.style = 'right: 15px;' + btnStyle;
    leftBtn.innerHTML = '&lt;';
    rightBtn.innerHTML = '&gt;';

    // sliderIndex
        // 结构
    var sliderIndex = document.createElement('div');
    str = '';
    for(var i = 0; i < this.num; i++) {
        str += '<span></span>';
    }    
    sliderIndex.innerHTML = str;
    var oSpanArray = sliderIndex.children;

        // 样式
    var sliderIndexStyle = 'position:absolute;bottom:15px;width:100%;text-align:center;',
        oSpanArrayStyle = 'display:inline-block;width:10px;height:10px;margin-right:14px;border-radius:50%;background:#ccc;cursor:pointer;';
    sliderIndex.style = sliderIndexStyle;
    for(var i = 0; i < this.num; i ++) {
        oSpanArray[i].style = oSpanArrayStyle;
    }
    
    //绑定this属性
    this.sliderPage = oUl;
    this.leftBtn = leftBtn;
    this.rightBtn = rightBtn;
    this.sliderIndex = sliderIndex;
    this.oSpanArray = oSpanArray;
    //加入页面
    this.appendChild(this.sliderPage);
    this.appendChild(this.leftBtn);
    this.appendChild(this.rightBtn);
    this.appendChild(this.sliderIndex);

    this.oSpanArray[0].style.background = '#f40';
    var _this = this;
    this.timer = setTimeout(autoMove.bind(_this), 3500);
}

// direction 
// 默认轮播方向/点击right按钮: 'left->right'/undefined
// 点击left按钮: 'right->left'
function autoMove(direction) {
    clearTimeout(this.timer);
    var oWrapper = this;

    if(oWrapper.lock) {
        oWrapper.lock = false;
        if(!direction || direction == 'left->right'){
            oWrapper.index ++;
            if(oWrapper.index == oWrapper.num) {
                oWrapper.index = 0;
            }
            oWrapper.changeIndex(oWrapper.index);
            startMove(oWrapper.sliderPage, {left: oWrapper.sliderPage.offsetLeft - this.moveWidth}, function() {
                if(oWrapper.sliderPage.offsetLeft == - oWrapper.num * oWrapper.moveWidth) {
                    oWrapper.sliderPage.style.left = '0px';
                }
                oWrapper.lock = true;
                oWrapper.timer = setTimeout(autoMove.bind(oWrapper), 3500);
                // oWrapper.timer = setTimeout(oWrapper.autoMove, 3500);
            })
        }else if(direction == 'right->left') {
            if(oWrapper.sliderPage.offsetLeft == 0) {
                oWrapper.sliderPage.style.left = - oWrapper.num * oWrapper.moveWidth + 'px';
                oWrapper.index = oWrapper.num;
            }
            oWrapper.index --;
            oWrapper.changeIndex(oWrapper.index);
            startMove(oWrapper.sliderPage, {left: oWrapper.sliderPage.offsetLeft + oWrapper.moveWidth}, function() {
                oWrapper.lock = true;
                oWrapper.timer = setTimeout(autoMove.bind(oWrapper), 3500);
                // oWrapper.timer = setTimeout(oWrapper.autoMove, 3500);
            });
        }
    }
}

function bindEvent() {
    var oWrapper = this;
    oWrapper.onmouseenter = function() {
        oWrapper.leftBtn.style.opacity = 0.7;
        oWrapper.rightBtn.style.opacity = 0.7;
    }
    oWrapper.onmouseleave = function() {
        oWrapper.leftBtn.style.opacity = 0.2;
        oWrapper.rightBtn.style.opacity = 0.2;
    }
    oWrapper.leftBtn.onclick = (function () {
        oWrapper.autoMove('right->left');
    });
    oWrapper.rightBtn.onclick = (function () {
        oWrapper.autoMove('left->right');
    });
    for(var i = 0; i < oWrapper.num; i++) {
        (function(myIndex){
            oWrapper.oSpanArray[myIndex].onclick = function() {
                oWrapper.lock = false;
                clearTimeout(oWrapper.timer);
                oWrapper.index = myIndex;
                // changeIndex.call(this, this.index);
                oWrapper.changeIndex(oWrapper.index);
                startMove(oWrapper.sliderPage, {left: -oWrapper.moveWidth * oWrapper.index}, function() {
                    oWrapper.lock = true;
                    oWrapper.timer = setTimeout(autoMove.bind(oWrapper), 3500);
                })
            };
        })(i)
    }
}

function changeIndex(_index) {
    var oWrapper = this;
    for(var i = 0; i < oWrapper.num; i++) {
        oWrapper.oSpanArray[i].style.background = '#ccc';
    }
    oWrapper.oSpanArray[_index].style.background = '#f40';
}

//////////////功能函数/////////////
function getStyle(obj, attr, fake) {
    var fake = fake || null;
    if(obj.currentStyle) {
        return obj.currentStyle[attr];
    }else {
        return window.getComputedStyle(obj, fake)[attr];
    }
}

function startMove(obj, targetObj, callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        var iStop = true;
        for(var attr in targetObj) {
            var iCur;
            if(attr == 'opacity') {
                iCur = parseFloat(getStyle(obj, 'opacity')) * 100;
            }else {
                iCur = parseInt(getStyle(obj, attr));
            }
            iSpeed = (targetObj[attr] - iCur) / 7;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if(attr == 'opacity') {
                obj.style.opacity = (iCur + iSpeed) / 100;
            }else {
                obj.style[attr] = iCur + iSpeed + 'px';
            }
            if(iCur != targetObj[attr]) {
                iStop = false;
            }
        }
        if(iStop) {
            clearInterval(obj.timer);
            typeof(callback) == 'function' ? callback() : '';
        }
    }, 30);
}