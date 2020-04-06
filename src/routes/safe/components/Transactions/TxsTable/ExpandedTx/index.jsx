// 
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import { List } from 'immutable'
import React, { useState } from 'react'

import { formatDate } from '../columns'

import ApproveTxModal from './ApproveTxModal'
import OwnersColumn from './OwnersColumn'
import RejectTxModal from './RejectTxModal'
import TxDescription from './TxDescription'
import { styles } from './style'

import EtherScanLink from 'src/components/EtherscanLink'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Span from 'src/components/layout/Span'
import IncomingTxDescription from 'src/routes/safe/components/Transactions/TxsTable/ExpandedTx/IncomingTxDescription'
import { INCOMING_TX_TYPES } from 'src/routes/safe/store/models/incomingTransaction'
import { } from 'src/routes/safe/store/models/owner'
import { } from 'src/routes/safe/store/models/transaction'



const useStyles = makeStyles(styles)

const ExpandedTx = ({
  cancelTx,
  createTransaction,
  granted,
  nonce,
  owners,
  processTransaction,
  safeAddress,
  threshold,
  tx,
  userAddress,
}) => {
  const classes = useStyles()
  const [openModal, setOpenModal] = useState(null)
  const openApproveModal = () => setOpenModal('approveTx')
  const closeModal = () => setOpenModal(null)
  const thresholdReached = !INCOMING_TX_TYPES.includes(tx.type) && threshold <= tx.confirmations.size
  const canExecute = !INCOMING_TX_TYPES.includes(tx.type) && nonce === tx.nonce
  const cancelThresholdReached = !!cancelTx && threshold <= cancelTx.confirmations.size
  const canExecuteCancel = nonce === tx.nonce

  const openRejectModal = () => {
    if (!!cancelTx && nonce === cancelTx.nonce) {
      setOpenModal('executeRejectTx')
    } else {
      setOpenModal('rejectTx')
    }
  }

  return (
    <>
      <Block className={classes.expandedTxBlock}>
        <Row>
          <Col layout="column" xs={6}>
            <Block
              className={cn(classes.txDataContainer, INCOMING_TX_TYPES.includes(tx.type) && classes.incomingTxBlock)}
            >
              <Block align="left" className={classes.txData}>
                <Bold className={classes.txHash}>Hash:</Bold>
                {tx.executionTxHash ? <EtherScanLink cut={8} type="tx" value={tx.executionTxHash} /> : 'n/a'}
              </Block>
              <Paragraph noMargin>
                <Bold>Nonce: </Bold>
                <Span>{tx.nonce}</Span>
              </Paragraph>
              <Paragraph noMargin>
                <Bold>Fee: </Bold>
                {tx.fee ? tx.fee : 'n/a'}
              </Paragraph>
              {INCOMING_TX_TYPES.includes(tx.type) ? (
                <>
                  <Paragraph noMargin>
                    <Bold>Created: </Bold>
                    {formatDate(tx.executionDate)}
                  </Paragraph>
                </>
              ) : (
                <>
                  <Paragraph noMargin>
                    <Bold>Created: </Bold>
                    {formatDate(tx.submissionDate)}
                  </Paragraph>
                  {tx.executionDate && (
                    <Paragraph noMargin>
                      <Bold>Executed: </Bold>
                      {formatDate(tx.executionDate)}
                    </Paragraph>
                  )}
                  {tx.refundParams && (
                    <Paragraph noMargin>
                      <Bold>Refund: </Bold>
                      max. {tx.refundParams.fee} {tx.refundParams.symbol}
                    </Paragraph>
                  )}
                  {tx.operation === 1 && (
                    <Paragraph noMargin>
                      <Bold>Delegate Call</Bold>
                    </Paragraph>
                  )}
                  {tx.operation === 2 && (
                    <Paragraph noMargin>
                      <Bold>Contract Creation</Bold>
                    </Paragraph>
                  )}
                </>
              )}
            </Block>
            <Hairline />
            {INCOMING_TX_TYPES.includes(tx.type) ? <IncomingTxDescription tx={tx} /> : <TxDescription tx={tx} />}
          </Col>
          {!INCOMING_TX_TYPES.includes(tx.type) && (
            <OwnersColumn
              cancelThresholdReached={cancelThresholdReached}
              cancelTx={cancelTx}
              canExecute={canExecute}
              canExecuteCancel={canExecuteCancel}
              granted={granted}
              onTxConfirm={openApproveModal}
              onTxExecute={openApproveModal}
              onTxReject={openRejectModal}
              owners={owners}
              safeAddress={safeAddress}
              threshold={threshold}
              thresholdReached={thresholdReached}
              tx={tx}
              userAddress={userAddress}
            />
          )}
        </Row>
      </Block>
      {openModal === 'approveTx' && (
        <ApproveTxModal
          canExecute={canExecute}
          isOpen
          onClose={closeModal}
          processTransaction={processTransaction}
          safeAddress={safeAddress}
          threshold={threshold}
          thresholdReached={thresholdReached}
          tx={tx}
          userAddress={userAddress}
        />
      )}
      {openModal === 'rejectTx' && (
        <RejectTxModal
          createTransaction={createTransaction}
          isOpen
          onClose={closeModal}
          safeAddress={safeAddress}
          tx={tx}
        />
      )}
      {openModal === 'executeRejectTx' && (
        <ApproveTxModal
          canExecute={canExecuteCancel}
          isCancelTx
          isOpen
          onClose={closeModal}
          processTransaction={processTransaction}
          safeAddress={safeAddress}
          threshold={threshold}
          thresholdReached={cancelThresholdReached}
          tx={cancelTx}
          userAddress={userAddress}
        />
      )}
    </>
  )
}

export default ExpandedTx
