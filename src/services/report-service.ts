
import staticFields from "@/models/staticFields.json";
import hourChartData from "@/models/hourChartData.json";
import dateChartData from "@/models/dateChartData.json";



export default {


    async GET_OVERVIEW_DATA(body: any) {

        return staticFields;
    },

    async GET_COUNT_DATA(body: any) {

        if (body.period === 1) {
            return hourChartData;
        }
        else {
            return dateChartData;
        }

    }
}