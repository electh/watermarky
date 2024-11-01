import { useMemo, useState } from 'react';
import { IconUpload, IconDownload, IconLeft, IconRight } from '@arco-design/web-react/icon';
import {
  Form,
  Input,
  Radio,
  Button,
  InputNumber,
  Watermark,
  Slider,
  ColorPicker,
  Space,
  Upload,
  Message
} from '@arco-design/web-react';
import html2canvas from 'html2canvas';

const defaultValue = {
  content: 'Arco Design',
  gapsX: 100,
  gapsY: 100,
  offsetX: undefined,
  offsetY: undefined,
  fontSize: 16,
  fontWeight: 'normal',
  fontFamily: 'sans-serif',
  color: 'rgba(0,0,0,0.12)',
  rotate: 30,
  zIndex: 1,
};

const App = () => {
  const [form] = Form.useForm();
  const [config, setConfig] = useState(defaultValue);
  const [imageUrl, setImageUrl] = useState('');
  const [showPanel, setShowPanel] = useState(true);

  const wmProps = useMemo(() => {
    const {
      content,
      gapsX,
      gapsY,
      offsetX,
      offsetY,
      rotate,
      fontSize,
      fontWeight,
      fontFamily,
      color,
      zIndex
    } = config;
    return {
      content,
      rotate,
      gap: [gapsX, gapsY],
      offset: [offsetX, offsetY],
      fontStyle: {
        color,
        fontSize: fontSize + 'px',
        fontFamily,
        fontWeight,
      },
      zIndex
    };
  }, [config]);

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleDownload = async () => {
    try {
      const element = document.getElementById('watermark-container');
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 4,
        logging: false,
        backgroundColor: null,
        imageRendering: 'high-quality',
        width: element.scrollWidth,
        height: element.scrollHeight
      });
      
      const link = document.createElement('a');
      link.download = 'watermarked-image.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      Message.success('下载成功');
    } catch (error) {
      console.error(error);
      Message.error('下载失败');
    }
  };

  return (
    <div style={{
      flexWrap: 'nowrap',
      height: '100vh',  // 占满整个视口高度
      overflow: 'hidden' // 防止整体出现滚动条
    }}>
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        {/* 固定在顶部的上传按钮 */}
        <Space style={{
          padding: '16px', 
          borderBottom: '1px solid var(--color-border-2)',
          display: 'flex',
          justifyContent: 'space-between'  // 靠右对齐
        }}>
          <Space>
            <Upload
              accept="image/*"
              beforeUpload={handleUpload}
              showUploadList={false}
              >
              <Button icon={<IconUpload/>}>上传图片</Button>
            </Upload>
            <Button
              type="primary"
            onClick={handleDownload}
            disabled={!imageUrl}
            icon={<IconDownload/>}
          >
              下载图片
            </Button>
          </Space>
          <Button 
            type="primary" 
            icon={showPanel ? <IconRight /> : <IconLeft />}
            onClick={() => setShowPanel(!showPanel)}
          >
            控件
          </Button>
        </Space>

        {/* 可滚动的图片预览区域 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          background: 'rgb(var(--gray-8))',
          padding: '24px',  // 添加内边距
          display: 'flex',  // 使用flex布局
          justifyContent: 'center'  // 水平居中
        }}>
          <div id="watermark-container" style={{
            display: 'inline-block',  // 根据内容自适应宽度
            minWidth: 'min-content'   // 确保容器不会小于内容
          }}>
            <Watermark {...wmProps}>
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  style={{ 
                    display: 'block',
                    width: 'auto',
                    height: 'auto',
                    maxWidth: 'none'  // 移除最大宽度限制
                  }} 
                 alt={"upload-image"}/>
              )}
            </Watermark>
          </div>
        </div>
      </div>

      {/* 右侧控制面板 */}
      <div style={{ position: 'fixed', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1000 }}>
        
        
          <Form 
            form={form} 
            layout='vertical' 
            style={{ 
              padding: '16px',
              borderRadius: '12px',
              boxShadow: 'var(--shadow)',
              width: '264px', 
              flexShrink: 0,
              backgroundColor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s ease',
              transform: `translateX(${showPanel ? 0 : 'calc(100% + 24px)'})`,
            }} 
            onValuesChange={() => {
              setConfig(form.getFieldsValue())
            }}
          >
            <Form.Item label='内容' field='content' initialValue={defaultValue.content}>
              <Input />
            </Form.Item>
            <Form.Item label='字重' field='fontWeight' initialValue={defaultValue.fontWeight}>
              <Radio.Group options={['lighter', 'normal', 'bold']} />
            </Form.Item>
            <Form.Item label='字族' field='fontFamily' initialValue={defaultValue.fontFamily}>
              <Radio.Group options={['sans-serif', 'serif']} />
            </Form.Item>
            <Form.Item label='颜色' field='color' initialValue={defaultValue.color}>
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label='字体大小' field='fontSize' initialValue={defaultValue.fontSize}>
              <Slider min={12} max={100}/>
            </Form.Item>
            <Form.Item label='旋转角度' field='rotate' initialValue={defaultValue.rotate}>
              <Slider min={-180} max={180}/>
            </Form.Item>
            <Form.Item label='间距' >
              <Space>
                <Form.Item noStyle field='gapsX' initialValue={defaultValue.gapsX}>
                  <InputNumber  placeholder='水平间距'/>
                </Form.Item>
                <Form.Item noStyle field='gapsY' initialValue={defaultValue.gapsY}>
                  <InputNumber  placeholder='竖直间距'/>
                </Form.Item>
              </Space>
            </Form.Item>
          </Form>
      </div>
    </div>
  );
};

export default App;

