import * as storage from '../Utils/storage'
import * as api from '../API/app'

export const KEY_BOOT_COUNT = 'app/boot_count'
export const KEY_LAST_BOOT_TIME = 'app/last_boot_time'

export const UPDATE_BOOT_COUNT = 'app/UPDATE_BOOT_COUNT'
export const UPDATE_STATE = 'app/UPDATE_STATE'
export const UPDATE_LAST_BOOT_TIME = 'app/UPDATE_LAST_BOOT_TIME'

export const UPDATE_RANKING = 'app/UPDATE_RANKING'
export const UPDATE_PROJECT_DETAIL = 'app/UPDATE_PROJECT_DETAIL'
export const UPDATE_POST_DETAIL = 'app/UPDATE_POST_DETAIL'
export const UPDATE_MYROOM_SELECTED_CATEGORY = 'app/UPDATE_MYROOM_SELECTED_CATEGORY'
export const UPDATE_POST_GOOD = 'app/UPDATE_POST_GOOD'

const initialState = {
    boot_count: 0,
    state: null,
    last_boot_time: null,
    selected_category: 0,
    publish_status: null,

    ranking: {
        projects: [],
        posts: [],
    },
    project_detail: {
        project: {
            backer_count: 0,
            title: "",
            safe_introduction: "",
            header_image: {
                full: {
                    url: ""
                }
            },
            plans: [
                    {
                        backer_count: 0,
                        backers_limit: null,
                        created_at: '',
                        description: '',
                        id: 0,
                        price: 0,
                        project_id: 0,
                        title: '',
                        updated_at: '',
                    }
                ],
        }
    },
    post_can_read: true,
    is_good: false,
    post_detail: {
        post:{
            id: 1,
            project_id: 1,
            plan_id: 1,
            eyecatch_image: {
                url: '',
                standard: {
                    url: ''
                },
            },
            title: '記事タイトル',
            body: '',
            comment_count: 0,
            view_count: 38,
            favorite_count: 0,
            published: true,
            published_at: '',
            scheduled_at: '',
            hide: false,
            created_at: '',
            updated_at: '',
            magazine:{
                url: ''
            },
            recent_post_comments:[
                {
                    body: "テストコメントおおお",
                    created_at: "2019-02-15T09:58:31.000Z",
                    id: 1,
                    post_id: 2,
                    user: {
                        name: ''
                    },
                }
            ],
            project:{
                id: 1
            },
            category_id: 2,
            header_image: {
                url:'',
                full:{
                    url: ''
                },
            },
            short_introduction: '',
            introduction: '',
            backer_count: 0,
            follower_count:1,
            status:1,
        }
    },
}

// プロジェクト・記事のランキングを取得する
export function loadRanking () {
    return async function (dispatch, getState) {
        const result = await api.getRanking({test: true})
        dispatch({type: UPDATE_RANKING, result})
    }
}

// 各プロジェクトの詳細情報を取得する
export function loadProject(project_id) {
    return async function (dispatch, getState) {
        const result = await api.getProject(project_id)
        dispatch({type: UPDATE_PROJECT_DETAIL, result})
    }
}

// 各記事の詳細を取得する
export function loadPost(post_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getPost(token, post_id)
        dispatch({type: UPDATE_POST_DETAIL, result})
    }
}

// 各プロジェクトの記事一覧を取得する
export function getProjectPostList(project_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getProjectPostList(token, {project_id: project_id})
        return result
    }
}

// ファンルーム開設
export function newFanRoom(category_id, roomname) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.newFanRoom(token, {category_id: category_id, title: roomname})
        return result
    }
}

// マイルームの情報を取得
export function loadMyFanRoom(user_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getMyFanRoom(token, user_id)
        return result
    }
}

export function loadAuthVerify() {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getVerify(token)
        return result
    }
}

// カテゴリ一覧取得
export function loadCategoryList() {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getCategoryList(token)
        return result
    }
}

// マイルーム情報の更新
export function updateMyFunRoom(updatedData) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.updateMyFunRoom(token, updatedData)
        return result
    }
}

// マイルームのカテゴリー選択
export function setselectedCategory(category_id) {
    return async function (dispatch, getState) {
        dispatch({type: UPDATE_MYROOM_SELECTED_CATEGORY, result})
    }
}

// マイルームの公開
export function requestPublish(project_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.publish(token, project_id)
        return result
    }
}

// マイルームの非公開
export function requestUnpublish(project_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.unpublish(token, project_id)
        return result
    }
}

// 投稿
export function loadpostList() {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getPostList(token)
        return result
    }
}

// 投稿をPOSTする
export function sendPost(post_data) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.createPost(token, post_data)
        return result
    }
}

// 投稿を公開する
export function publishPost(post_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.publishPost(token, post_id)
        return result
    }
}

// 投稿の削除
export function requestDeletePost(post_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.deletePost(token, post_id)
        return result
    }
}


// 記事 コメント投稿
export function postComment(post_id, body) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.postComment(token, {post_id: post_id, comment: body})
        return result
    }
}

// 記事 コメント削除
export function deleteComment(post_id, comment_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.deleteComment(token, {post_id: post_id, comment_id: comment_id})
        return result
    }
}

// 記事 いいねする
export function putGood(post_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        await api.putGood(token, post_id)
        const result = true
        dispatch({type: UPDATE_POST_GOOD, result})
    }
}

// 記事 いいね削除
export function deleteGood(post_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        await api.deleteGood(token, post_id)
        const result = false
        dispatch({type: UPDATE_POST_GOOD, result})
    }
}

// マイルーム プラン作成
export function newPlan(plan) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.newPlan(token, plan)
        return result
    }
}

// マイルーム プラン更新
export function planUpdate(plan) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.planUpdate(token, plan)
        return result
    }
}

// マイルーム 1つのプラン詳細
export function loadPlanDetail(project_id, plan_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.planDetail(token, {project_id: project_id, plan_id: plan_id})
        return result
    }
}

// マイルーム プランの削除
export function requestDeletePlan(plan_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.deletePlan(token, plan_id)
        return result
    }
}

// プロジェクト一覧を取得する
export function loadProjects() {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getProjectList(token)
        return result
    }
}

// サポート先のプロジェクトを取得する
export function loadSupportList() {
    return async function (dispatch, getState) {
        const {user_id, token} = getState().auth
        const result = await api.getSupportList(token, user_id)
        return result
    }
}

// サポート先のサポートを停止する
export function loadStopSupport(plan_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.stopSupport(token, plan_id)
        return result
    }
}


// 売上 直近100件を取得する
export function loadSalesRecent(project_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.salesRecent(token, project_id)
        return result
    }
}

// 売上 日別を取得
export function loadSalesDaily(project_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.salesDaily(token, project_id)
        return result
    }
}

// 売上 月別を取得
export function loadSalesMonthly(project_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.salesMonthly(token, project_id)
        return result
    }
}

// マイルームのサポーターを取得
export function loadBacker(project_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getBacker(token, project_id)
        return result
    }
}

// マイルームのフォロワーを取得
export function loadFollowr(project_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getFollower(token, project_id)
        return result
    }
}

// マイルームのメンバーを取得
export function loadMenberList(project_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getMenberList(token, project_id)
        return result
    }
}

// マイルームのメンバーに招待
export function memberInvite(params) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.memberInvite(token, params)
        return result
    }
}

// マイルームのメンバー権限更新
export function updateMenber(params) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.updateMenber(token, params)
        return result
    }
}

// マイルームのメンバーを削除
export function deleteMember(params) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.deleteMember(token, params)
        return result
    }
}

// バックナンバー 取得
export function loadBacknumber(project_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getBacknumber(token, {project_id: project_id})
        return result
    }
}

// バックナンバー 購入済みのBNを取得
export function loadBoughtBacknumber() {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getBoughtBacknumber(token)
        return result
    }
}

// バックナンバー購入
export function buyBacknumber(backnumber_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.buyBacknumber(token, backnumber_id)
        return result
    }
}

// バックナンバー作成
export function createBacknumber(params) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.createBacknumber(token, params)
        return result
    }
}

// 特定のバックナンバーを取得
export function backnumberFindById(params) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.backnumberFindById(token, params)
        return result
    }
}

// バックナンバーの更新
export function updateBacknumber(params) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.updateBacknumber(token, params)
        return result
    }
}

// 自動バックナンバー状態を取得
export function loadBacknumberAuto(project_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getBacknumberAuto(token, {project_id: project_id})
        return result
    }
}

// 自動バックナンバー 更新
export function updateBacknumberAuto(params) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.updateBacknumberAuto(token, params)
        return result
    }
}

// 加入中のプランを取得
export function loadJoinedPlan() {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getJoinedPlan(token)

        return result
    }
}

// プランに加入
export function joinPlan(plan_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.joinPlan(token, plan_id)

        return result
    }
}

// ポイントチャージの一覧を取得
export function getChargePoint() {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.getChargePoint(token)

        return result
    }
}

// ポイントチャージ
export function chargePoint(params) {
    return async function (dispatch, getState) {
        const {receipt, point_id} = params
        const {token} = getState().auth
        const result = await api.chargePoint(token, {receipt: receipt, point_id: point_id})

        return result
    }
}

export function loadLastBootTime() {
    return async function (dispatch, getState) {
        const time = await storage.getItem(KEY_LAST_BOOT_TIME)
        dispatch({type: UPDATE_LAST_BOOT_TIME, time})
    }
}

export default function app(state = initialState, action) {
    switch (action.type) {
        case UPDATE_STATE: {
            return {
                ...state,
                state: action.state,
            }
        }
        case UPDATE_LAST_BOOT_TIME: {
            return {
                ...state,
                last_boot_time: action.time,
            }
        }
        case UPDATE_BOOT_COUNT: {
            return {
                ...state,
                boot_count: action.boot_count,
            }
        }

        case UPDATE_RANKING: {
            return {
                ...state,
                ranking: action.result,
            }
        }
        case UPDATE_PROJECT_DETAIL: {
            return {
                ...state,
                project_detail: action.result
            }
        }
        case UPDATE_POST_DETAIL: {
            return {
                ...state,
                post_can_read: action.result.can_read,
                post_detail: action.result,
                is_good: action.result.is_favorite,
                post_packs: action.result.post_packs,
            }
        }
        case UPDATE_MYROOM_SELECTED_CATEGORY: {
            return {
                ...state,
                selected_category: action.result
            }
        }
        case UPDATE_POST_GOOD: {
            return {
                ...state,
                is_good: action.result
            }
        }
    }
    return state
}
