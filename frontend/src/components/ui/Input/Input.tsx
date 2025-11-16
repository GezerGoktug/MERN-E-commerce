import clsx from "clsx";
import styles from "./Input.module.scss";
import { ElementType, InputHTMLAttributes } from "react";
import { IconType } from "react-icons";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface InputProps<T extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  rightIcon?: IconType;
  rightIconSize?: number;
  rightIconOnClick?: () => void;
  fields?: ControllerRenderProps<T>;
  customInput?: ElementType;
  inputClassName?: string;
  mask?: string;
  isAutoSize?: boolean;
}

const Input = <T extends FieldValues>({
  isAutoSize = false,
  size = "md",
  rightIcon: Icon,
  rightIconOnClick,
  rightIconSize = 20,
  className,
  inputClassName,
  fields,
  customInput: CustomInput,
  ...props
}: InputProps<T>) => {
  const Component = CustomInput || (isAutoSize ? "textarea" : "input");

  const resize = (el: HTMLInputElement | HTMLTextAreaElement) => {
    if (!el.value) {
      el.style.height = "16px";
      return;
    }
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }


  const handleOnInput = (e: React.ChangeEvent<HTMLInputElement>) => {    
    const el = e.target;
    if (el) resize(el);
  }

  return (
    <div
      className={clsx(
        styles.input_wrapper,
        styles[size],
        { [styles.isRightIcon]: Icon },
        className
      )}
    >
      <Component
        type="text"
        onInput={handleOnInput}
        className={clsx(inputClassName)}
        {...(isAutoSize ? { rows: 1 } : null)}
        {...props}
        {...fields}

      />
      {Icon && (
        <Icon
          onClick={rightIconOnClick}
          className={styles.input_right_icon}
          size={rightIconSize}
        />
      )}
    </div>
  );
};

export default Input;
