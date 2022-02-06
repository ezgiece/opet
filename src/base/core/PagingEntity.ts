abstract class PagingEntity implements IEntity {
    constructor() {
        this.pageSize = 10;
        this.pageIndex = 1;
    }
    pageSize: number;
    pageIndex: number;

    ordination: Ordination[] | any;
}

