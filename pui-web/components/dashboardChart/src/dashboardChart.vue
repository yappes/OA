<script>
export default {
  name: "puiDashboardChart",

  props: {
    dashboardData: {
      type: Object,
      default: () => {
        return {
          dataInfo: {
            chartData: {},
            chartSettings: {},
            chartType: null
          }
        }
      }
    }
  },

  render(createElement) {
    if(!this.dashboardData.dataInfo) {
      return;
    }
    let chartConfig = {
      data: this.dashboardData.dataInfo.chartData,
      settings: this.dashboardData.dataInfo.chartSettings,
      extend: {}
    }
    
    let component = null;
    if(this.dashboardData.dataInfo.chartType) {
      component = createElement(
        've-' + this.dashboardData.dataInfo.chartType,
        { props: {...chartConfig} }
      );
    } else {
      component = createElement('div');
    }

    return (
      <div class="pui-dashboard-chart">
        {component}
      </div>
    )
  }
};
</script>

<style lang="scss">
@import "./dashboardChart.scss";
</style>


