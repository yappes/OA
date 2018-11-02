import { InsertView } from "paas-web-utils/rules";
import EditPage from "../business/editPage.vue";
export default {
  name: "Purchase",
  components: { EditPage },
  data() {
    return {
      view: new InsertView()
    };
  },
  mounted() {
    this.view.render(557);
    // 实现数据求和
    this.view.addEventListener("created", (view) => {
      view.groups[1].addEventListener('created', (groupRow) => {
        console.log('groupRow', groupRow)
        let sum = (column, formModel) => {
          console.log('column', column)
          console.log('formModel', formModel)
          console.log('groupRow.columnMap', groupRow.columnMap)
          let NUM = formModel[groupRow.columnMap["NUM@PURDETAIL"].valKey] || 0;
          let PRICE = formModel[groupRow.columnMap["PRICE@PURDETAIL"].valKey] || 0;
          this.$set(formModel, groupRow.columnMap["T_MONEY@PURDETAIL"].valKey, Number(NUM) * Number(PRICE));
        };
        groupRow.columnMap["NUM@PURDETAIL"].addEventListener("change", sum);
        groupRow.columnMap["PRICE@PURDETAIL"].addEventListener("change", sum);
        groupRow.columnMap["T_MONEY@PURDETAIL"].addEventListener('change', () => {
          let sumRes = 0;
          for (const formModel of view.groups[1].formModel) {
            let T_MONEY = formModel[groupRow.columnMap["T_MONEY@PURDETAIL"].valKey] || 0;
            sumRes += Number(T_MONEY);
          }
          this.$set(view.groups[0].formModel, view.groups[0].columnMap['MONEY@PURCHASE'].valKey, sumRes);
        })
      })
    });
  },
  render(h) {
    return <EditPage view={this.view} />;
  }
};
