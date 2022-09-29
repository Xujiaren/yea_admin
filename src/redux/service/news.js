import request from '../../util/net';

export function getNews({teacher_id,atype,keyword,page,pageSize,ctype}) {
	return request.get('/article/article', {
		teacher_id,atype,keyword,page,pageSize,ctype
	})
}
export function getNewsResult({articleId}) {
	return request.get('/article/article/result', {
		article_id:articleId
	})
}

export function getNewsDetail({articleId}) {
	return request.get('/article/article/'+articleId, {
		articleId
	})
}

export function actionNews({ article_id,action }) {
	return request.post('/article/article/'+article_id, {
        article_id,action
	})
}
export function publishNews({
        article_id, 
        teacher_id,
        category_id,
        article_img,
        flag,

        atype,
        ctype,
        content_id,
        media_id,
        

        ttype,
        images,
        tags,
        title,
        summary,
        content,
        sort_order,
        status,
        can_share,
        is_top,
        videos,
        
        link,
        is_vote,
        vote_id,
        vote_title,
        end_time,
        options,
        mtype,
        cttype,
        is_link,
        is_modify_vote
	}) {
	return request.post('/article/article/publish', {
                article_id, 
                teacher_id,
                category_id,
                article_img,
                atype,
                ctype,
                content_id,
                flag,

                ttype,
                images,
                tags,
                title,
                summary,
                content,
                sort_order,
                status,
                can_share,
                is_top,
                media_id,
                videos,

                link,
                is_vote,
                vote_id,
                vote_title,
                end_time,
                options,
                mtype,
                cttype,
                is_link,
                is_modify_vote
	})
}
