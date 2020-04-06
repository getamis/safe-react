// 
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'
import CallMade from '@material-ui/icons/CallMade'
import cn from 'classnames'
import classNames from 'classnames/bind'
import { List } from 'immutable'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { styles } from './style'

import Table from 'src/components/Table'
import { cellWidth } from 'src/components/Table/TableHead'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Img from 'src/components/layout/Img'
import Row from 'src/components/layout/Row'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addAddressBookEntry } from 'src/logic/addressBook/store/actions/addAddressBookEntry'
import { removeAddressBookEntry } from 'src/logic/addressBook/store/actions/removeAddressBookEntry'
import { updateAddressBookEntry } from 'src/logic/addressBook/store/actions/updateAddressBookEntry'
import { getAddressBookListSelector } from 'src/logic/addressBook/store/selectors'
import { isUserOwnerOnAnySafe } from 'src/logic/wallets/ethAddresses'
import CreateEditEntryModal from 'src/routes/safe/components/AddressBook/CreateEditEntryModal'
import DeleteEntryModal from 'src/routes/safe/components/AddressBook/DeleteEntryModal'
import {
  AB_ADDRESS_ID,
  ADDRESS_BOOK_ROW_ID,
  EDIT_ENTRY_BUTTON,
  REMOVE_ENTRY_BUTTON,
  SEND_ENTRY_BUTTON,
  generateColumns,
} from 'src/routes/safe/components/AddressBook/columns'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import OwnerAddressTableCell from 'src/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import RenameOwnerIcon from 'src/routes/safe/components/Settings/ManageOwners/assets/icons/rename-owner.svg'
import RemoveOwnerIcon from 'src/routes/safe/components/Settings/assets/icons/bin.svg'
import RemoveOwnerIconDisabled from 'src/routes/safe/components/Settings/assets/icons/disabled-bin.svg'
import { addressBookQueryParamsSelector, safesListSelector } from 'src/routes/safe/store/selectors'


const AddressBookTable = ({ classes }) => {
  const columns = generateColumns()
  const autoColumns = columns.filter((c) => !c.custom)
  const dispatch = useDispatch()
  const addressBook = useSelector(getAddressBookListSelector)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [editCreateEntryModalOpen, setEditCreateEntryModalOpen] = useState(false)
  const [deleteEntryModalOpen, setDeleteEntryModalOpen] = useState(false)
  const [sendFundsModalOpen, setSendFundsModalOpen] = useState(false)
  const entryAddressToEditOrCreateNew = useSelector(addressBookQueryParamsSelector)

  useEffect(() => {
    if (entryAddressToEditOrCreateNew) {
      setEditCreateEntryModalOpen(true)
    }
  }, [])

  useEffect(() => {
    if (entryAddressToEditOrCreateNew) {
      const key = addressBook.findKey((entry) => entry.address === entryAddressToEditOrCreateNew)
      if (key >= 0) {
        // Edit old entry
        const value = addressBook.get(key)
        setSelectedEntry({ entry: value, index: key })
      } else {
        // Create new entry
        setSelectedEntry({
          entry: {
            name: '',
            address: entryAddressToEditOrCreateNew,
            isNew: true,
          },
        })
      }
    }
  }, [addressBook])

  const safesList = useSelector(safesListSelector)

  const newEntryModalHandler = (entry) => {
    setEditCreateEntryModalOpen(false)
    dispatch(addAddressBookEntry(makeAddressBookEntry(entry)))
  }

  const editEntryModalHandler = (entry) => {
    setSelectedEntry(null)
    setEditCreateEntryModalOpen(false)
    dispatch(updateAddressBookEntry(makeAddressBookEntry(entry)))
  }

  const deleteEntryModalHandler = () => {
    const entryAddress = selectedEntry.entry.address
    setSelectedEntry(null)
    setDeleteEntryModalOpen(false)
    dispatch(removeAddressBookEntry(entryAddress))
  }

  return (
    <>
      <Row align="center" className={classes.message}>
        <Col end="sm" xs={12}>
          <ButtonLink
            onClick={() => {
              setSelectedEntry(null)
              setEditCreateEntryModalOpen(!editCreateEntryModalOpen)
            }}
            size="lg"
            testId="manage-tokens-btn"
          >
            + Create entry
          </ButtonLink>
        </Col>
      </Row>
      <Block className={classes.formContainer}>
        <TableContainer>
          <Table
            columns={columns}
            data={addressBook}
            defaultFixed
            defaultRowsPerPage={25}
            disableLoadingOnEmptyTable
            label="Owners"
            size={addressBook.size}
          >
            {(sortedData) =>
              sortedData.map((row, index) => {
                const userOwner = isUserOwnerOnAnySafe(safesList, row.address)
                const hideBorderBottom = index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom
                return (
                  <TableRow
                    className={cn(classes.hide, hideBorderBottom)}
                    data-testid={ADDRESS_BOOK_ROW_ID}
                    key={index}
                    tabIndex={-1}
                  >
                    {autoColumns.map((column) => (
                      <TableCell align={column.align} component="td" key={column.id} style={cellWidth(column.width)}>
                        {column.id === AB_ADDRESS_ID ? (
                          <OwnerAddressTableCell address={row[column.id]} showLinks />
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                    <TableCell component="td">
                      <Row align="end" className={classes.actions}>
                        <Img
                          alt="Edit entry"
                          className={classes.editEntryButton}
                          onClick={() => {
                            setSelectedEntry({
                              entry: { ...row, isOwnerAddress: userOwner },
                            })
                            setEditCreateEntryModalOpen(true)
                          }}
                          src={RenameOwnerIcon}
                          testId={EDIT_ENTRY_BUTTON}
                        />
                        <Img
                          alt="Remove entry"
                          className={userOwner ? classes.removeEntryButtonDisabled : classes.removeEntryButton}
                          onClick={() => {
                            if (!userOwner) {
                              setSelectedEntry({ entry: row })
                              setDeleteEntryModalOpen(true)
                            }
                          }}
                          src={userOwner ? RemoveOwnerIconDisabled : RemoveOwnerIcon}
                          testId={REMOVE_ENTRY_BUTTON}
                        />
                        <Button
                          className={classes.send}
                          color="primary"
                          onClick={() => {
                            setSelectedEntry({ entry: row })
                            setSendFundsModalOpen(true)
                          }}
                          size="small"
                          testId={SEND_ENTRY_BUTTON}
                          variant="contained"
                        >
                          <CallMade
                            alt="Send Transaction"
                            className={classNames(classes.leftIcon, classes.iconSmall)}
                          />
                          Send
                        </Button>
                      </Row>
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </Table>
        </TableContainer>
      </Block>
      <CreateEditEntryModal
        editEntryModalHandler={editEntryModalHandler}
        entryToEdit={selectedEntry}
        isOpen={editCreateEntryModalOpen}
        newEntryModalHandler={newEntryModalHandler}
        onClose={() => setEditCreateEntryModalOpen(false)}
      />
      <DeleteEntryModal
        deleteEntryModalHandler={deleteEntryModalHandler}
        entryToDelete={selectedEntry}
        isOpen={deleteEntryModalOpen}
        onClose={() => setDeleteEntryModalOpen(false)}
      />
      <SendModal
        activeScreenType="chooseTxType"
        isOpen={sendFundsModalOpen}
        onClose={() => setSendFundsModalOpen(false)}
        recipientAddress={selectedEntry && selectedEntry.entry ? selectedEntry.entry.address : undefined}
      />
    </>
  )
}

export default withStyles(styles)(AddressBookTable)
