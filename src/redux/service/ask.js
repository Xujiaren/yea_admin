import request from '../../util/net';

export function ask(keyword, page, pageSize, status) {
    return request.get('/ask/ask', {
        keyword: keyword,
        page: page,
        pageSize: pageSize,
        status: status,
    })
}

export function askInfo(ask_id) {
    return request.get('/ask/ask/' + ask_id, {

    })
}

export function askPublish({ask_id, category_id, title, content, flag, integral, is_share, pics, user_id}) {
    return request.post('/ask/ask/', {
        ask_id: ask_id,
        category_id: category_id,
        title: title,
        content: content,
        flag: flag,
        integral: integral,
        is_share: is_share,
        pics: pics,
        user_id: user_id,
    })
}

export function askComment(ask_id, page, pageSize) {
    return request.get('/ask/reply/' + ask_id, {
        page: page,
        pageSize: pageSize,
    })
}

export function askReply({ask_id, content,rtype}) {
    return request.post('/ask/reply/' + ask_id, {
        content: content,
        rtype:rtype,
    })
}

export function askOp({ask_ids, action}) {
    return request.post('/ask/ask/chosen', {
        ask_ids: ask_ids,
        action: action,
    })
}

export function askReview({ask_ids, action, reason}) {
    return request.post('/ask/ask/status', {
        ask_ids: ask_ids,
        action: action,
        reason: reason,
    })
}

export function reply(keyword, page, pageSize, status) {
    return request.get('/ask/reply', {
        keyword: keyword,
        page: page,
        pageSize: pageSize,
        status: status,
    })
}

export function replyOp({reply_ids, action}) {
    return request.post('/ask/reply/chosen', {
        reply_ids: reply_ids,
        action: action,
    })
}

export function replyReview({reply_ids, action, reason}) {
    return request.post('/ask/reply/status', {
        reply_ids: reply_ids,
        action: action,
        reason: reason,
    })
}