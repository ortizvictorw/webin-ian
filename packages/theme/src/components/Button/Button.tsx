import * as React from "react";
import * as R from "@rmwc/button";
import { Fab, FabProps } from "@rmwc/fab";
import { Icon, IconProps } from "../Icon/Icon";
import classNames from "classnames";
import { SyntheticEvent } from "react";

export type ButtonProps = {
    // Make button flat (only applicable to Primary button).
    flat?: boolean;

    // Make button smaller.
    small?: boolean;

    // onClick handler.
    onClick?: (event: React.MouseEvent<any, MouseEvent>) => void | null;

    // Label and optionally an icon (using Button.Icon component).
    children?: React.ReactNode;

    // Show ripple effect on button click. Default: true
    ripple?: boolean;

    className?: string;

    disabled?: boolean;

    style?: { [key: string]: any };

    // For testing purposes.
    "data-testid"?: string;
};

/**
 * Shows a default button, used typically when action is not of high priority.
 * @param props
 * @returns {*}
 * @constructor
 */
export const ButtonDefault = (props: ButtonProps) => {
    const { disabled, onClick, children, small, ripple = true, className = "", style } = props;

    return (
        <R.Button
            style={style}
            disabled={disabled}
            dense={small}
            onClick={onClick}
            ripple={ripple}
            className={classNames("webiny-ui-button", className)}
            data-testid={props["data-testid"]}
        >
            {children}
        </R.Button>
    );
};

/**
 * Shows primary button, eg. for submitting forms.
 * @param props
 * @returns {*}
 * @constructor
 */
export const ButtonPrimary = (props: ButtonProps) => {
    const {
        disabled,
        onClick,
        children,
        small = false,
        flat = false,
        ripple = true,
        style = null,
        className = null
    } = props;
    return (
        <R.Button
            raised={!flat}
            dense={small}
            disabled={disabled}
            unelevated={flat}
            ripple={ripple}
            onClick={onClick}
            style={style}
            className={classNames("webiny-ui-button webiny-ui-button--primary", className)}
            data-testid={props["data-testid"]}
        >
            {children}
        </R.Button>
    );
};

/**
 * Shows a secondary button - eg. for doing a reset on a form.
 * @param props
 * @returns {*}
 * @constructor
 */
export const ButtonSecondary = (props: ButtonProps) => {
    const {
        disabled,
        onClick,
        children,
        small = false,
        ripple = true,
        className = null,
        style = null
    } = props;

    return (
        <R.Button
            disabled={disabled}
            outlined
            dense={small}
            ripple={ripple}
            onClick={onClick}
            style={style}
            className={classNames("webiny-ui-button webiny-ui-button--secondary", className)}
            data-testid={props["data-testid"]}
        >
            {children}
        </R.Button>
    );
};

export type ButtonFloatingProps = ButtonProps &
    FabProps & {
        label?: React.ReactNode;
        icon?: React.ReactNode;
        onMouseDown?: (e: SyntheticEvent) => void;
        onMouseUp?: (e: SyntheticEvent) => void;
    };

/**
 * A floating button, shown on the side of the screen, typically used for creating new content or accessing settings.
 * @param props
 * @returns {*}
 * @constructor
 */
export const ButtonFloating = (props: ButtonFloatingProps) => {
    const {
        disabled,
        icon,
        onClick,
        small = false,
        label = false,
        ripple = true,
        className = null,
        ...rest
    } = props;
    return (
        <Fab
            data-testid={props["data-testid"]}
            disabled={disabled}
            mini={small}
            onClick={onClick}
            label={label}
            ripple={ripple}
            icon={icon}
            className={classNames("webiny-ui-button--floating", className)}
            {...rest}
        />
    );
};

/**
 * Shows an icon, suitable to be shown inside of a button.
 * @param props
 * @returns {*}
 * @constructor
 */
export const ButtonIcon = (props: IconProps) => <Icon {...props} />;
