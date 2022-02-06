
export class FilterDto implements IEntity {
    startDate = null;
    endDate = null
    graphic = {};
    period = {};
    orderables = [
        {
            value: "",
            isAscending: true
        }
    ];

    public static Create(): FilterDto {
        const attributeFilter = new FilterDto();
        attributeFilter.makeDefaultOrder();
        return attributeFilter;
    }

    public makeDefaultOrder() {
        this.orderables = [];
        this.orderables.push({ value: 'InsertedDate', isAscending: true });
    }
}
