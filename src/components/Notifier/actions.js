// @flow
import removeSnackbar from '~/logic/notifications/store/actions/removeSnackbar'

export type Actions = {
  removeSnackbar: typeof removeSnackbar,
}

export default {
  removeSnackbar,
}
