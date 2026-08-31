import { describe, expect, it } from 'vitest';
import layoutSource from './base.layout.vue?raw';

const iPlanTooltip = 'i方案是一套面向本地实体商家、内容运营人员和营销服务团队的智能内容工作平台。平台围绕行业、平台、品类、风格和使用场景，提供文案生成、文案诊断、客户跟单话术、文生图、视频包制作和精品模板等能力，帮助用户从内容构思、表单草稿、生成优化到后续复用形成完整工作链路。';
const imageCompressionTooltip = '图片修改压缩是一款浏览器端在线图片处理工具，支持压缩、调整尺寸和格式转换，图片尽量在本地处理，适合日常上传、分享和网页优化。';
const idPhotoTooltip = '证件照工作室是一款浏览器端证件照制作工具，支持本地智能抠图、背景换色、常用证件尺寸和 300DPI 多图拼版，照片无需上传到业务服务器。';

describe('company navigation tooltips', () => {
  it.each([
    ['i方案', iPlanTooltip, 1],
    ['图片压缩', imageCompressionTooltip, 2],
    ['证件照', idPhotoTooltip, 2],
  ])('provides the %s description for desktop and mobile entries', (_name, tooltip, expectedCount) => {
    expect(layoutSource.split(tooltip).length - 1).toBe(expectedCount);
  });
});
