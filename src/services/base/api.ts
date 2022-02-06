export const parseBody = (res: any) => {
    return res.data.Data;
}

export const bodyParserJs = res => {
    const data = res.data;

    data.List = data.list.map(x => ({
        Id: x.id,
        HasChilds: x.hasChilds,
        ...x
    }))

    data.TotalCount = data.totalCount

    return data;
}

export const composerBodyParserJs = res => {
    const data = res.data.Data;

    data.List = data.List.map(x => ({
        Id: x.Id,
        HasChilds: x.HasChilds,
        ...x
    }))

    return data;
}
