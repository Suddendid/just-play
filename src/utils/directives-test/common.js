import {arr} from './config'

function checkArray(key) {
    let index = arr.indexOf(key)
    if (index > -1) {
        return true // 有权限
    } else {
        return false // 无权限
    }
}

/*
* 根据config中配置的参数，自定义指令，如果配置中没有传入的key，则不显示dom
* */
export const permission = {
    inserted: function (el, binding) {
        let permission = binding.value // 获取到 v-permission的值
        if (permission) {
            let hasPermission = checkArray(permission)
            if (!hasPermission) {
                // 没有权限 移除Dom元素
                el.parentNode && el.parentNode.removeChild(el)
            }
        }
    }
}


/*
* 水印
* */
function addWaterMarker(str, parentNode, font, textColor) {
    // 水印文字，父元素，字体，文字颜色
    var can = document.createElement('canvas')
    parentNode.appendChild(can)
    can.width = 200
    can.height = 150
    can.style.display = 'none'
    var cans = can.getContext('2d')
    cans.rotate((-20 * Math.PI) / 180)
    cans.font = font || '16px Microsoft JhengHei'
    cans.fillStyle = textColor || 'rgba(180, 180, 180, 0.3)'
    cans.textAlign = 'left'
    cans.textBaseline = 'Middle'
    cans.fillText(str, can.width / 10, can.height / 2)
    parentNode.style.backgroundImage = 'url(' + can.toDataURL('image/png') + ')'
}

export const waterMarker = {
    bind: function (el, binding) {
        addWaterMarker(binding.value.text, el, binding.value.font, binding.value.textColor)
    },
}


export const draggable = {
    inserted: function (el) {
        el.style.cursor = 'move'
        el.onmousedown = function (e) {
            let disx = e.pageX - el.offsetLeft
            let disy = e.pageY - el.offsetTop
            document.onmousemove = function (e) {
                let x = e.pageX - disx
                let y = e.pageY - disy
                let maxX = document.body.clientWidth - parseInt(window.getComputedStyle(el).width)
                let maxY = document.body.clientHeight - parseInt(window.getComputedStyle(el).height)
                if (x < 0) {
                    x = 0
                } else if (x > maxX) {
                    x = maxX
                }

                if (y < 0) {
                    y = 0
                } else if (y > maxY) {
                    y = maxY
                }

                el.style.left = x + 'px'
                el.style.top = y + 'px'
            }
            document.onmouseup = function () {
                document.onmousemove = document.onmouseup = null
            }
        }
    },
}
