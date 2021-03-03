import { checkActivityFunctions } from 'single-spa'
import { Micro } from '../micro'

Micro.prototype.matchingApps = function () {
    let matching = checkActivityFunctions({
        pathname: location.pathname
    }) || []
    return matching
}
