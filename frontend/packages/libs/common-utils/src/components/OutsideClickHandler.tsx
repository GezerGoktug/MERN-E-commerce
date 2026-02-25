import { type ReactNode, useRef } from 'react'
import { useClickOutside } from "@forever/hook-kit"

const OutsideClickHandler = ({ children, onOutsideClick, disable = false, ...props }: { children: ReactNode, onOutsideClick: () => void, disable?: boolean }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(wrapperRef, onOutsideClick, disable);
  return (
    <div ref={wrapperRef} style={{ display: "contents" }} {...props}>{children}</div>
  )
}

export { OutsideClickHandler }