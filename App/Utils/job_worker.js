// 同系統の処理をひとつずつ処理するためのワーカー
export default class JobWorker {
    constructor() {
        this.jobs = []
        this.activeJob = null
    }

    addJob(job) {
        this.jobs.push(job)
    }

    async processJob() {
        try {
            await this.activeJob.process.apply()
        } finally {
            this.activeJob = null
        }
    }

    async start() {
        try {
            this.activeJob = this.jobs.shift()
            while (this.activeJob) {
                await this.processJob()
                this.activeJob = this.jobs.shift()
            }
        } catch (e) {
            console.error('NETWORK WORKER DETECT AN ERROR!', e)
        }
        setTimeout(() => {
            this.start.apply(this)
        }, 50)
    }
}

