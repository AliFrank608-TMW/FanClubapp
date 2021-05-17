import { restClient } from './common.js'

// create_for_iosに相当
export async function loadIosVersion (params) {
    const result = await restClient.get('/ios_versions/load', null, params)
    return regsult
}

// ランキングを取得
export async function getRanking (params) {
    const result = await restClient.get('/ranking', null ,params)
    return result
}

// 各プロジェクトの詳細情報を取得
export async function getProject (params) {
    const result = await restClient.get(`/projects/${params}`, null ,params)
    return result
}

// ファンルーム開設
export async function newFanRoom (token, params) {
    const result = await restClient.post('/projects', token ,params)
    return result
}

// 各記事の詳細情報を取得
export async function getPost (token, params) {
    const result = await restClient.get(`/posts/${params}`, token ,params)
    return result
}

// 各プロジェクトの記事一覧を取得
export async function getProjectPostList (token, params) {
    const result = await restClient.get('/posts', token, params)
    return result
}

// 記事の投稿
export async function createPost (token, params) {
    const result = await restClient.post('/posts', token, params)
    return result
}

// 投稿の公開
export async function publishPost (token, params) {
    const result = await restClient.put(`/posts/${params}/publish`, token, {publish: true})
    return result
}

// 投稿の削除
export async function deletePost (token, params) {
    const result = await restClient.delete(`/posts/${params}`, token ,params)
    return result
}

// 記事 コメント投稿
export async function postComment (token, params) {
    const {post_id, comment} = params
    const result = await restClient.post(`/posts/${post_id}/comments`, token, {comment: comment})
    return result
}

// 記事 コメント削除
export async function deleteComment (token, params) {
    const {post_id, comment_id} = params
    const result = await restClient.delete(`/posts/${post_id}/comments/${comment_id}`, token, null)
    return result
}

// 記事 いいねする
export async function putGood (token, post_id) {
    const result = await restClient.put(`/posts/${post_id}/favorite`, token, null)
    return result
}

// 記事 いいね削除
export async function deleteGood (token, post_id) {
    const result = await restClient.delete(`/posts/${post_id}/favorite`, token, null)
    return result
}

// マイルーム プラン作成
export async function newPlan (token, params) {
    const result = await restClient.post('/plans', token, params.plan)
    return result
}

// マイルーム プラン更新
export async function planUpdate (token, params) {
    const result = await restClient.put(`/plans/${params.plan.id}`, token, params.plan)
    return result
}

// マイルーム 1つのプラン詳細
export async function planDetail (token, params) {
    const {project_id, plan_id} = params
    const result = await restClient.get(`/projects/${project_id}/plans/${plan_id}`, token ,params)
    return result
}

// マイルーム プランの削除
export async function deletePlan (token, params) {
    const result = await restClient.delete(`/plans/${params}`, token, params)
    return result
}

// プロジェクト一覧を取得
export async function getProjectList (token, params) {
    const result = await restClient.get('/projects', token, params)
    return result
}

// マイファンルームのデータを取得
export async function getVerify (token) {
    const result = await restClient.get('/auth/verify', token)
    return result
}

export async function getMyFanRoom (token, params) {
    // const result = await restClient.get(`/users/${params}`, token)
    const result = await restClient.get(`/users/${params}`, token)
    return result
}

// マイルーム情報の更新
export async function updateMyFunRoom (token, params) {
    const {project_id, updated_data} = params
    const result = await restClient.put(`/projects/${project_id}`, token, updated_data)
    return result
}

// カテゴリ一覧取得
export async function getCategoryList (token) {
    const result = await restClient.get('/projects/categories', token)
    return result
}

// マイルームの公開
export async function publish (token, params) {
    const result = await restClient.put(`/projects/${params}/publish`, token)
    return result
}

// マイルームの非公開
export async function unpublish (token, params) {
    const result = await restClient.put(`/projects/${params}/unpublish`, token)
    return result
}

// マイルームの投稿一覧を取得
export async function getPostList (token) {
    const result = await restClient.get('/projects/posts/my_posts', token)
    return result
}

// サポート先の一覧を取得
export async function getSupportList (token, params) {
    const result = await restClient.get(`/users/${params}/find_projects`, token, params)
    return result
}

// サポート先のサポートを停止する
export async function stopSupport (token, params) {
    const result = await restClient.delete(`/subscriptions/${params}`, token, params)
    return result
}

// 売上 直近100件を取得
export async function salesRecent (token, params) {
    const result = await restClient.get('/sales/recent', token, {pid: params})
    return result
}

// 売上 日別を取得
export async function salesDaily (token, params) {
    const result = await restClient.get('/sales/daily', token, {pid: params})
    return result
}

// 売上 日別を取得
export async function salesMonthly (token, params) {
    const result = await restClient.get('/sales/monthly', token, {pid: params})
    return result
}

// マイルームのサポーターを取得
export async function getBacker (token, params) {
    const result = await restClient.get(`/projects/${params}/backers`, token, null)
    return result
}

// マイルームのフォロワーを取得
export async function getFollower (token, params) {
    const result = await restClient.get(`/projects/${params}/followers`, token, null)
    return result
}

// マイルームのメンバー取得
export async function getMenberList (token, params) {
    const result = await restClient.get(`/projects/${params}/members`, token, null)
    return result
}

// マイルームにメンバー招待
export async function memberInvite (token, params) {
    const {project_id, email, role} = params
    const result = await restClient.post(`/projects/${project_id}/members/invite`, token, {email, role})
    return result
}

// バックナンバー 取得
export async function getBacknumber (token, params) {
    const result = await restClient.get('/post-packs', token, params)
    return result
}

// バックナンバー 購入済みのBNを取得
export async function getBoughtBacknumber (token) {
    const result = await restClient.get('/post-packs/bought-packs', token, null)
    return result
}

// バックナンバー 購入
export async function buyBacknumber (token, params) {
    const result = await restClient.put(`/post-packs/${params}/buy`, token, null)
    return result
}

// バックナンバー作成
export async function createBacknumber (token, params) {
    const result = await restClient.post('/post-packs', token, params)
    return result
}

// 特定のバックナンバーを取得
export async function backnumberFindById (token, params) {
    const result = await restClient.get(`/post-packs/${params}`, token, null)
    return result
}

// バックナンバー更新
export async function updateBacknumber (token, params) {
    const id = params.post_pack.id
    const result = await restClient.put(`/post-packs/${id}`, token, params)
    return result
}


// 自動バックナンバー状態を取得
export async function getBacknumberAuto (token, params) {
    const result = await restClient.get('/post-pack-automation-settings', token, params)
    return result
}

// 自動バックナンバー更新
export async function updateBacknumberAuto (token, params) {
    const result = await restClient.put('/post-pack-automation-settings', token, params)
    return result
}

// マイルームのメンバー権限更新
export async function updateMenber (token, params) {
    const {id, project_id} = params.member

    const result = await restClient.put(`/projects/${project_id}/members/${id}`, token, params)
    return result
}

// マイルームのメンバー削除
export async function deleteMember (token, params) {
    const {project_id, member_id} = params
    const result = await restClient.delete(`/projects/${project_id}/members/${member_id}`, token, null)
    return result
}

// 加入中のプランを取得
export async function getJoinedPlan (token) {
    const result = await restClient.get('/subscriptions', token, null)
    return result
}

// プランに加入
export async function joinPlan (token, plan_id) {
    const result = await restClient.post('/subscriptions', token, {plan_id: plan_id})
    return result
}

// ポイントチャージの一覧を取得
export async function getChargePoint (token) {
    const result = await restClient.get('/points', token, null)
    return result
}

// ポイントチャージ
export async function chargePoint (token, params) {
    const {receipt, point_id} = params
    const result = await restClient.post('/ios_purchase_points', token, {encoded_receipt: receipt, point_id: point_id})
    return result
}
