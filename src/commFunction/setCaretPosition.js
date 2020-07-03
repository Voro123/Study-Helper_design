// 设置鼠标光标位置
function setCaretPosition (textDom, pos) {
  if (textDom.setSelectionRange) {
    // IE Support
    textDom.focus()
    textDom.setSelectionRange(pos, pos)
  } else if (textDom.createTextRange) {
    // Firefox support
    var range = textDom.createTextRange()
    range.collapse(true)
    range.moveEnd('character', pos)
    range.moveStart('character', pos)
    range.select()
  }
}
export default setCaretPosition
