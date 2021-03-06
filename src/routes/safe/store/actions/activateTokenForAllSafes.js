// @flow
import { createAction } from 'redux-actions'

export const ACTIVATE_TOKEN_FOR_ALL_SAFES = 'ACTIVATE_TOKEN_FOR_ALL_SAFES'

const activateTokenForAllSafes = createAction<string, *>(ACTIVATE_TOKEN_FOR_ALL_SAFES)

export default activateTokenForAllSafes
