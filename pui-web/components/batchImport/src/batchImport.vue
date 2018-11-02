<template>
  <div class="pui-batch-import">
    <aui-collapse v-model="activeName" accordion>
      <aui-collapse-item title="上传文件" name="1">
        <div class="paragram-wrapper title">
          批量导入成员到 赞同科技
        </div>
        <div class="paragram-wrapper">
          <div class="paragram">
            一、请按照数据模板的格式准备要导入的数据。
            <br>注意事项：
            <ul class="attention">
              <li>1、模板中的表头名称不可更改，表头行不能删除 </li>
              <li>2、项目顺序可以调整，不需要的项目可以删减。</li>
              <li>3、其中客户名称，客户所有人为必填项，必须保留。</li>
              <li>4、导入文件请勿超过5mb</li>
            </ul>
          </div>
          <div class="paragram">二、导入的excel（文件格式：xls、xlsx）文件 <a>客户模板下载</a> 。
            <div class="select-file">
              <pui-btn :heightStr="'30px'" :padding="'0 10px'" :plain="true"><i class="pui-icon-jiahao"></i>请选择文件</pui-btn><span class="selectedfiles-name">未选择任何文件</span>
            </div>
          </div>
        </div>
        <div class="pui-batch-import__oper-wrapper">
          <pui-btn :heightStr="'34px'" :widthStr="'120px'" type="primary">下一步</pui-btn>
          <pui-btn :heightStr="'34px'" :widthStr="'120px'" :plain="true">取消</pui-btn>
        </div>
      </aui-collapse-item>
      <aui-collapse-item title="字段匹配" name="2">
        <div class="import-feild-tip">友情提示：系统只导入已经匹配的字段
        </div>
        <pui-form-layout :feildList="feilds"></pui-form-layout>
        <div class="pui-batch-import__oper-wrapper">
          <pui-btn :heightStr="'34px'" :widthStr="'120px'" :plain="true">上一步</pui-btn>
          <pui-btn :heightStr="'34px'" :widthStr="'120px'" type="primary">自动匹配</pui-btn>
          <pui-btn :heightStr="'34px'" :widthStr="'120px'" type="primary">下一步</pui-btn>
          <pui-btn :heightStr="'34px'" :widthStr="'120px'" :plain="true">取消</pui-btn>
        </div>
      </aui-collapse-item>
      <aui-collapse-item title="预览" name="3">
        <div class="import-feild-tip">
          友情提示：将要导入的字段
        </div>
        <pui-form-layout :feildList="feilds" :isDetail="true"></pui-form-layout>
        <div class="pui-batch-import__oper-wrapper">
          <pui-btn :heightStr="'34px'" :widthStr="'120px'" :plain="true">上一步</pui-btn>
          <pui-btn :heightStr="'34px'" :widthStr="'120px'" type="primary">导入</pui-btn>
          <pui-btn :heightStr="'34px'" :widthStr="'120px'" :plain="true">取消</pui-btn>
        </div>
      </aui-collapse-item>
      <aui-collapse-item title="结果" name="4">
        <div class="pui-batch-import__result-box">
          <div class="progress-text">批量导入成员到【赞同科技】数据上传100%</div>
          <aui-progress :percentage="100" status="success"></aui-progress>
          <div class="progress-detail-box">
            <div>共计用时：10秒</div>
            <div>成功上传数据：103条 </div>
            <div>未成功上传数据：2条<a class="download-exceptional-data">点击下载异常数据</a></div>
          </div>
        </div>
        <div class="pui-batch-import__oper-wrapper">
          <pui-btn :heightStr="'34px'" :widthStr="'120px'" type="primary">完成</pui-btn>
        </div>
      </aui-collapse-item>
    </aui-collapse>
  </div>
</template>
<script>
import renderdata from './data.ts'
export default {
  name: 'PuiBatchImport',
  data: function () {
    return Object.assign({}, renderdata, {
      activeName: '3'
    })
  }
}

</script>
<style lang='scss' scoped>
@import './batchImport.scss'

</style>
