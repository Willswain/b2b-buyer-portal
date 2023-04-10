import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

import {
  useRef,
  ReactElement,
  ReactNode,
  useContext,
} from 'react'

import {
  useMobile,
  useScrollBar,
} from '@/hooks'

import {
  GlobaledContext,
} from '@/shared/global'

import {
  B3Sping,
} from './spin/B3Sping'

import {
  CustomButton,
} from './button/CustomButton'

interface B3DialogProps<T> {
  customActions?: () => ReactElement
  isOpen: boolean,
  leftStyleBtn?: {[key: string]: string}
  rightStyleBtn?: {[key: string]: string}
  leftSizeBtn?: string
  rightSizeBtn?: string
  title?: string
  handleLeftClick?: () => void
  handRightClick?: (row?: T) => Promise<void> | void | undefined
  children: ReactNode
  loading?: boolean
  row?: T
  isShowBordered?: boolean
  showRightBtn?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  fullWidth?: boolean
  disabledSaveBtn?: boolean,
}

export const B3Dialog:<T> ({
  customActions,
  isOpen,
  leftStyleBtn,
  rightStyleBtn,
  title,
  handleLeftClick,
  handRightClick,
  children,
  loading,
  row,
  isShowBordered,
  showRightBtn,
  maxWidth,
  fullWidth,
  disabledSaveBtn,
}: B3DialogProps<T>) => ReactElement = ({
  customActions,
  isOpen,
  leftStyleBtn = {},
  rightStyleBtn = {},
  leftSizeBtn,
  rightSizeBtn,
  title,
  handleLeftClick,
  handRightClick,
  children,
  loading = false,
  row,
  isShowBordered = true,
  showRightBtn = true,
  maxWidth = 'sm',
  fullWidth = false,
  disabledSaveBtn = false,
}) => {
  const container = useRef<HTMLInputElement | null>(null)

  const [isMobile] = useMobile()

  const {
    state: {
      isAgenting,
    },
  } = useContext(GlobaledContext)

  const handleSaveClick = () => {
    if (handRightClick) {
      if (row) handRightClick(row)
      if (!row) handRightClick()
    }
  }

  const handleCloseClick = (reason?: string) => {
    if (reason === 'backdropClick') return
    if (handleLeftClick) handleLeftClick()
  }

  useScrollBar(isOpen)

  return (
    <Box>
      <Box
        ref={container}
      />

      <Dialog
        fullWidth={fullWidth}
        open={isOpen}
        container={container.current}
        onClose={(event: object, reason: string) => handleCloseClick(reason)}
        fullScreen={isMobile}
        maxWidth={maxWidth}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          title && (
          <DialogTitle
            sx={
              isShowBordered ? {
                borderBottom: '1px solid #D9DCE9',
                mb: 2,
              } : {}
            }
            id="alert-dialog-title"
          >
            {title}
          </DialogTitle>
          )
        }
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions
          sx={
            isShowBordered ? {
              borderTop: '1px solid #D9DCE9',
              marginBottom: (isAgenting && isMobile) ? '52px' : '0',
            } : {
              marginBottom: (isAgenting && isMobile) ? '52px' : '0',
            }
          }
        >
          {
            customActions ? customActions() : (
              <>
                <CustomButton
                  sx={{
                    ...leftStyleBtn,
                  }}
                  onClick={() => handleCloseClick('')}
                >
                  {leftSizeBtn || 'cancel'}

                </CustomButton>

                {
                  showRightBtn && (
                    <CustomButton
                      sx={{
                        ...rightStyleBtn,
                      }}
                      onClick={handleSaveClick}
                      autoFocus
                      disabled={disabledSaveBtn || loading}
                    >
                      <B3Sping
                        isSpinning={loading}
                        tip=""
                        size={16}
                      >
                        {rightSizeBtn || 'save'}
                      </B3Sping>
                    </CustomButton>
                  )
                }
              </>
            )
          }
        </DialogActions>
      </Dialog>
    </Box>

  )
}
