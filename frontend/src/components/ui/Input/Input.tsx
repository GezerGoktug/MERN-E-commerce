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
  customInput?:ElementType;
  mask?:string;
}

const Input = <T extends FieldValues>({
  size = "md",
  rightIcon: Icon,
  rightIconOnClick,
  rightIconSize = 20,
  className,
  fields,
  customInput:CustomInput,
  ...props
}: InputProps<T>) => {
  const Component = CustomInput || "input";
  return (
    <div
      className={clsx(
        styles.input_wrapper,
        styles[size],
        { [styles.isRightIcon]: Icon },
        className
      )}
    >
      <Component type="text" {...props} {...fields} />
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
