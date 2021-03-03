import { start } from 'qiankun'
import { Micro } from '../micro'

Micro.prototype.start = function () {
    if (this._isStarted) { return this }
    start(this.appOptions)
    return this
}
