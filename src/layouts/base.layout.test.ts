import { describe, expect, it } from 'vitest';
import layoutSource from './base.layout.vue?raw';

const iPlanTooltip = 'i方案是一套面向本地实体商家、内容运营人员和营销服务团队的智能内容工作平台。平台围绕行业、平台、品类、风格和使用场景，提供文案生成、文案诊断、客户跟单话术、文生图、视频包制作和精品模板等能力，帮助用户从内容构思、表单草稿、生成优化到后续复用形成完整工作链路。';
const imageCompressionTooltip = '图片修改压缩是一款浏览器端在线图片处理工具，支持压缩、调整尺寸和格式转换，图片尽量在本地处理，适合日常上传、分享和网页优化。';
const idPhotoTooltip = '证件照工作室是一款浏览器端证件照制作工具，支持本地智能抠图、背景换色、常用证件尺寸和 300DPI 多图拼版，照片无需上传到业务服务器。';
const watermarkTooltip = '证件水印工具支持为身份证、营业执照和合同截图添加用途水印，图片仅在浏览器本地处理。';
const clipboardTooltip = '临时剪贴板支持客户端加密、自动过期、读取次数限制和阅后即焚，适合跨设备传递临时文本。';

describe('company navigation tooltips', () => {
  it.each([
    ['i方案', iPlanTooltip, 1],
    ['图片压缩', imageCompressionTooltip, 2],
    ['证件照', idPhotoTooltip, 2],
    ['证件水印', watermarkTooltip, 2],
    ['临时剪贴板', clipboardTooltip, 2],
  ])('provides the %s description for desktop and mobile entries', (_name, tooltip, expectedCount) => {
    expect(layoutSource.split(tooltip).length - 1).toBe(expectedCount);
  });

  it('attributes the i方案 ecosystem navigation and the tool site correctly', () => {
    expect(layoutSource).toContain('href="https://www.i41.cn?utm_source=tools&amp;utm_medium=tool_referral&amp;utm_campaign=ifangan&amp;utm_content=ecosystem_nav"');
    expect(layoutSource).toContain('i41 免费实用工具');
    expect(layoutSource).not.toMatch(/i方案(?:永久免费|免费)|免费(?:的)?i方案/);
  });
});
