import * as React from "react";
import Downshift from "downshift";
import MaterialSpinner from "react-spinner-material";
import { Input } from "@webiny/ui/Input";
import { Chips, Chip } from "@webiny/ui/Chips";
import { getOptionValue, getOptionText, findInAliases } from "./utils";

import { ReactComponent as BaselineCloseIcon } from "./icons/baseline-close-24px.svg";
import classNames from "classnames";
import { Elevation } from "@webiny/ui/Elevation";
import { Typography } from "@webiny/ui/Typography";
import { autoCompleteStyle, suggestionList } from "./styles";

import { AutoCompleteBaseProps } from "./types";

export type MultiAutoCompleteProps = AutoCompleteBaseProps & {
    /**
     * Prevents adding the same item to the list twice.
     */
    unique: boolean;

    /**
     * Set if custom values (not from list of suggestions) are allowed.
     */
    allowFreeInput?: boolean;

    /* If true, will show a loading spinner on the right side of the input. */
    loading?: boolean;
};

type State = {
    inputValue: string;
};

function Spinner() {
    if (process.env.REACT_APP_ENV === "ssr") {
        return null;
    }

    return <MaterialSpinner size={24} spinnerColor={"#fa5723"} spinnerWidth={2} visible />;
}

export class MultiAutoComplete extends React.Component<MultiAutoCompleteProps, State> {
    static defaultProps = {
        valueProp: "id",
        textProp: "name",
        unique: true,
        options: [],
        useSimpleValues: false,
        renderItem(item: any) {
            return <Typography use={"body2"}>{getOptionText(item, this.props)}</Typography>;
        }
    };

    state = {
        inputValue: ""
    };

    /**
     * Helps us trigger some of the downshift's methods (eg. clearSelection) and helps us to avoid adding state.
     */
    downshift: any = React.createRef();

    assignedValueAfterClearing = {
        set: false,
        selection: null
    };

    getOptions() {
        const { unique, value, allowFreeInput, useSimpleValues, options } = this.props;

        const filtered = options.filter(item => {
            // We need to filter received options.
            // 1) If "unique" prop was passed, we don't want to show already picked options again.
            if (unique) {
                const values = value;
                if (Array.isArray(values)) {
                    if (
                        values.find(
                            value =>
                                getOptionValue(value, this.props) ===
                                getOptionValue(item, this.props)
                        )
                    ) {
                        return false;
                    }
                }
            }

            // 2) At the end, we want to show only options that are matched by typed text.
            if (!this.state.inputValue) {
                return true;
            }

            if (item.aliases) {
                return findInAliases(item, this.state.inputValue);
            }

            return getOptionText(item, this.props)
                .toLowerCase()
                .includes(this.state.inputValue.toLowerCase());
        });

        // If free input is allowed, prepend typed value to the list.
        if (allowFreeInput && this.state.inputValue) {
            if (useSimpleValues) {
                const existingValue = filtered.includes(this.state.inputValue);
                if (!existingValue) {
                    filtered.unshift(this.state.inputValue);
                }
            } else {
                const existingValue = filtered.find(
                    item => this.state.inputValue === getOptionText(item, this.props)
                );
                if (!existingValue) {
                    filtered.unshift({ [this.props.textProp]: this.state.inputValue });
                }
            }
        }

        return filtered;
    }

    /**
     * Renders options - based on user's input. It will try to match input text with available options.
     * @param options
     * @param isOpen
     * @param highlightedIndex
     * @param selectedItem
     * @param getMenuProps
     * @param getItemProps
     * @returns {*}
     */
    renderOptions({ options, isOpen, highlightedIndex, getMenuProps, getItemProps }: any) {
        if (!isOpen) {
            return null;
        }

        if (!options.length) {
            return (
                <Elevation z={1}>
                    <ul {...getMenuProps()}>
                        <li>
                            <Typography use={"body2"}>No results.</Typography>
                        </li>
                    </ul>
                </Elevation>
            );
        }

        const { renderItem } = this.props;
        return (
            <Elevation z={1}>
                <ul {...getMenuProps()}>
                    {options.map((item, index) => {
                        const itemValue = getOptionValue(item, this.props);

                        // Base classes.
                        const itemClassNames = {
                            [suggestionList]: true,
                            highlighted: highlightedIndex === index,
                            selected: false
                        };

                        // Render the item.
                        return (
                            <li
                                key={itemValue + index}
                                {...getItemProps({
                                    index,
                                    item,
                                    className: classNames(itemClassNames)
                                })}
                            >
                                {renderItem.call(this, item, index)}
                            </li>
                        );
                    })}
                </ul>
            </Elevation>
        );
    }

    /**
     * Once added, items can also be removed by clicking on the ✕ icon. This is the method that is responsible for
     * rendering selected items (we are using already existing "Chips" component).
     * @returns {*}
     */
    renderMultipleSelection() {
        const { value, onChange, disabled } = this.props;

        return (
            <React.Fragment>
                {Array.isArray(value) && value.length ? (
                    <Chips disabled={disabled}>
                        {value.map((item, index) => (
                            <Chip
                                label={getOptionText(item, this.props)}
                                key={`${getOptionValue(item, this.props)}-${index}`}
                                trailingIcon={<BaselineCloseIcon />}
                                onRemove={() => {
                                    // On removal, let's update the value and call "onChange" callback.
                                    if (onChange) {
                                        const newValue = [...value];
                                        newValue.splice(index, 1);
                                        onChange(newValue);
                                    }
                                }}
                            />
                        ))}
                    </Chips>
                ) : null}
            </React.Fragment>
        );
    }

    render() {
        const {
            props,
            props: {
                options: rawOptions, // eslint-disable-line
                allowFreeInput, // eslint-disable-line
                useSimpleValues, // eslint-disable-line
                unique,
                value,
                onChange,
                valueProp, // eslint-disable-line
                textProp, // eslint-disable-line
                onInput,
                validation = { isValid: null },
                ...otherInputProps
            }
        } = this;

        const options = this.getOptions();

        return (
            <div className={autoCompleteStyle}>
                <Downshift
                    defaultSelectedItem={null}
                    // @ts-ignore
                    className={autoCompleteStyle}
                    itemToString={item => item && getOptionText(item, props)}
                    ref={this.downshift}
                    onChange={selection => {
                        if (!this.assignedValueAfterClearing.set) {
                            this.assignedValueAfterClearing = {
                                set: true,
                                selection
                            };
                            this.downshift.current.clearSelection();
                            return;
                        }

                        if (this.assignedValueAfterClearing.set) {
                            this.assignedValueAfterClearing.set = false;
                            if (Array.isArray(value)) {
                                onChange &&
                                    onChange([...value, this.assignedValueAfterClearing.selection]);
                            } else {
                                onChange && onChange([this.assignedValueAfterClearing.selection]);
                            }
                        }
                    }}
                >
                    {/* "getInputProps" and "openMenu" are not needed in renderOptions method. */}
                    {({ getInputProps, openMenu, ...rest }) => (
                        <div>
                            <Input
                                {...getInputProps({
                                    ...otherInputProps,
                                    // @ts-ignore
                                    validation,
                                    rawOnChange: true,
                                    trailingIcon: this.props.loading && <Spinner />,
                                    onChange: e => e,
                                    onBlur: e => e,
                                    onKeyUp: (e: any) => {
                                        const inputValue = e.target.value || "";

                                        // Set current input value into state and trigger onInput if different.
                                        if (inputValue !== this.state.inputValue) {
                                            this.setState({ inputValue }, () => {
                                                onInput && onInput(inputValue);
                                            });
                                        }
                                    },
                                    onFocus: e => {
                                        openMenu();
                                        otherInputProps.onFocus && otherInputProps.onFocus(e);
                                    }
                                })}
                            />
                            {this.renderOptions({ ...rest, unique, options })}
                            {this.renderMultipleSelection()}
                        </div>
                    )}
                </Downshift>
            </div>
        );
    }
}
