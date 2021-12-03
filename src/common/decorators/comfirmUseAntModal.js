import { ConfirmationUse } from '@ziroom/cherry2-decorator';
import { Modal } from 'ant-design-vue';

export default ConfirmationUse(Modal.confirm, {
  content: '确认要执行该操作吗？',
  cancelText: '算了',
  onOk: (r) => {
    // r 函数内置被装饰的原函数，执行 r 同时将执行原函数和其上下文
    // 第三个参数传入的 'onOk' 告诉 ConfirmationUse 要处理的组件属性，
    // 然后 ConfirmationUse 将在该属性（通常是对话框类型组件提供的回调）传入 r 函数
    r();
  }
}, 'onOk');
