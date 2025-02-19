import { ReactNode } from "react";
import { createPortal } from "react-dom";

const Overlay = ({ children }: { children: ReactNode }) => {
  const overlay: HTMLElement | null = document.getElementById("overlay");
  return <>{overlay && createPortal(children, overlay)}</>;
  
};

export default Overlay;
