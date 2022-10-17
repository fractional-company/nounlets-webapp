import classNames from 'classnames';
import { forwardRef, MouseEvent, MouseEventHandler, ReactNode } from 'react';
import IconSpinner from '../icons/IconSpinner';
import styles from './button.module.css';

type ButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

const Button = forwardRef((props: ButtonProps, ref: any) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (props.disabled || props.loading || props.onClick == null) {
      return;
    }

    props.onClick(event);
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={classNames(styles.button, { disabled: props.disabled, loading: props.loading }, props.className)}
    >
      {props.loading && <IconSpinner className="h-5 animate-spin" />}
      {!props.loading && props.children}
    </button>
  );
});
Button.displayName = 'Button';
export default Button;
// export default function Button(props: ButtonProps): JSX.Element {
//   const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
//     if (props.disabled || props.loading || props.onClick == null) {
//       return;
//     }

//     props.onClick(event);
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className={classNames(styles.button, { disabled: props.disabled, loading: props.loading }, props.className)}
//     >
//       {props.loading && <IconSpinner className="h-5 animate-spin" />}
//       {!props.loading && props.children}
//     </button>
//   );
// }
