import { t } from '@/locales'

export const errorCodeI18n = {
  20038: t('errorCode.20038'), // 参数类型错误
  20021: t('errorCode.20021'), // 参数值不能为空
  20024: t('errorCode.20024'), // 缺少提单文件，即调用导入订单接口 carrier_link未传值
  20017: t('errorCode.20017'), // 传入的文件不是使用waybill_file来传参。大概率不会出现。
  20013: t('errorCode.20013'), // 传入的订单文件，不是.xlsx结尾，即非表格文件
  20018: t('errorCode.20018'), // 单个导入文件出现多个提单号数据
  20016: t('errorCode.20016'), // 单个导入文件出现多个目的口岸数据
  20023: t('errorCode.20023'), // 上传用户无目的口岸权限
  20011: t('errorCode.20011'), // 单个导入文件出现多个仓库数据值
  20002: t('errorCode.20002'), // 仓库不存在
  20019: t('errorCode.20019'), // 单个导入文件出现多个客户数据值
  401: t('errorCode.401'), // 用户不存在
  402: t('errorCode.402'), // 客户不存在
  20020: t('errorCode.20020'), // 客户不存在
  20028: t('errorCode.20028'), // 外箱号和客户组合数据重复
  20030: t('errorCode.20030'), // 参数值非预期
  20041: t('errorCode.20041'), // sku类型数据没有对应parcel数据
}

// 20038, 20021, 20020,20028,20030,20041 出现在details里面 不需要在以下变量里面
export const orderImportResErrCode = [
  '401',
  '402',
  '20024',
  '20017',
  '20013',
  '20018',
  '20016',
  '20023',
  '20011',
  '20002',
  '20019',
]
