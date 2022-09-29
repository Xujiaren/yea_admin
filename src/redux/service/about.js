import request from '../../util/net';

export function getAbout() {
	return request.get('/operate/about/all')
}
export function publishAbout({
	content,
    atype,
    article_id,
    article_imgs,
    ctype
}) {
	return request.post('/operate/about/publish', {
        content,
        atype,
        article_id,
        article_imgs
	})
}
