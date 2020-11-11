import * as React from "react";
import { Select as RmwcSelect, SelectProps as RmwcSelectProps } from "@rmwc/select";
import { FormElementMessage } from "@webiny/ui/FormElementMessage";
import { FormComponentProps } from "./../types";
import { css } from "emotion";
import classNames from "classnames";

type SelectProps = FormComponentProps &
    RmwcSelectProps & {
        // Component label.
        label?: string;

        // Is checkbox disabled?
        disabled?: boolean;

        // Description beneath the select.
        description?: string;

        // Placeholder text for the form control. Set to a blank string to create a non-floating placeholder label.
        placeholder?: string;

        // Makes the Select have a visual box.
        box?: string;

        // One or more <option> or <optgroup> elements.
        children?: Array<React.ReactElement<"option"> | React.ReactElement<"optgroup">>;

        // IconProps for the root element. By default, additional props spread to the native select element.
        rootProps?: Object;

        // A className for the root element.
        className?: string;
    };

const noLabel = css({
    "&.mdc-select": {
        height: 35,
        ".mdc-select__native-control": {
            paddingTop: 0
        },
        "&.mdc-select--box": {
            ".mdc-select__native-control": {
                height: 35,
                paddingTop: 5
            }
        }
    }
});

/**
 * Select component lets users choose a value from given set of options.
 */
const skipProps = ["validate"];

const getRmwcProps = props => {
    const newProps = {};
    Object.keys(props)
        .filter(name => !skipProps.includes(name))
        .forEach(name => (newProps[name] = props[name]));

    return newProps;
};

export const Select = (props: SelectProps) => {
    const { value, description, validation, ...other } = props;

    return (
        <React.Fragment>
            <RmwcSelect
                {...getRmwcProps(other)}
                value={value}
                className={classNames("webiny-ui-select", props.className, {
                    [noLabel]: !props.label
                })}
                onChange={e => {
                    props.onChange && props.onChange((e.target as any).value);
                }}
            />

            {validation.isValid === false && (
                <FormElementMessage error>{validation.message}</FormElementMessage>
            )}

            {validation.isValid !== false && description && (
                <FormElementMessage>{description}</FormElementMessage>
            )}
        </React.Fragment>
    );
};

Select.defaultProps = {
    validation: { isValid: null }
};

export default Select;
