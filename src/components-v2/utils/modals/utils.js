// 
import React from 'react'
import styled from 'styled-components'

import Button from 'src/components/layout/Button'
import Paragraph from 'src/components/layout/Paragraph'
import { lg } from 'src/theme/variables'

const StyledParagraph = styled(Paragraph)`
  && {
    font-size: ${lg};
  }
`
const IconImg = styled.img`
  width: 20px;
  margin-right: 10px;
`
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const ModalTitle = ({ iconUrl, title }) => {
  return (
    <TitleWrapper>
      {iconUrl && <IconImg alt={title} src={iconUrl} />}
      <StyledParagraph noMargin weight="bolder">
        {title}
      </StyledParagraph>
    </TitleWrapper>
  )
}

const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`

export const ModalFooterConfirmation = ({
  cancelText,
  handleCancel,
  handleOk,
  okText,
}) => {
  return (
    <FooterWrapper>
      <Button minWidth={130} onClick={handleCancel}>
        {cancelText}
      </Button>
      <Button color="primary" minWidth={130} onClick={handleOk} variant="contained">
        {okText}
      </Button>
    </FooterWrapper>
  )
}
