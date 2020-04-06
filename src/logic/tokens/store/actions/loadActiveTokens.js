// 
import { List, Map } from 'immutable'

import saveTokens from './saveTokens'

import { makeToken } from 'src/logic/tokens/store/model/token'
import { getActiveTokens } from 'src/logic/tokens/utils/tokensStorage'
import { } from 'src/store/index'

const loadActiveTokens = () => async (dispatch) => {
  try {
    const tokens = await getActiveTokens()
    const tokenRecordsList = List(
      Object.values(tokens).map((token) => makeToken(token)),
    )

    dispatch(saveTokens(tokenRecordsList))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default loadActiveTokens
