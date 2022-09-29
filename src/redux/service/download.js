import request from '../../util/net';

export function setDownloadList({
    content,
    files,
    code_type,
    ftype,
    parent_id,
    code_url,
    down_id,
    flag,
    img_url,
    name
}) {
    return request.get('/operate/source/publish', {
        content,
        files,
        code_type,
        ftype,
        parent_id,
        code_url,
        down_id,
        flag,
        img_url,
        name
    })
}
export function getDownloadList({
    keywords,
    page,
    pageSize,
    parent_id,
}) {
    return request.get('/operate/source/list', {
        keywords,
        page,
        pageSize,
        parent_id,
    })
}