export class PagedModel<T extends IEntity> {
    filteredCount!: Number;
    list!: T;
    pageIndex!: Number;
    pageSize!: Number;
    totalCount!: Number;
    totalPageCount!: Number;
}
