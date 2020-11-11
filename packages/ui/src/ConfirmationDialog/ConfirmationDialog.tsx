import * as React from "react";
import noop from "lodash/noop";

import {
    Dialog,
    DialogButton,
    DialogCancel,
    DialogActions,
    DialogTitle,
    DialogContent
} from "./../Dialog";

import { CircularProgress } from "../Progress";

interface ChildrenRenderProp {
    showConfirmation: (onAccept?: Function, onCancel?: Function) => any;
}

interface ConfirmationCallbacks {
    onAccept: Function;
    onCancel: Function;
}

type Props = {
    // Title of confirmation dialog
    title?: React.ReactNode;

    // Message of confirmation dialog
    message?: React.ReactNode;

    // This element will be rendered during loading
    loading?: React.ReactNode;

    // For testing purposes
    "data-testid"?: string;

    // An element that will trigger the confirmation dialog.
    children: (props: ChildrenRenderProp) => React.ReactNode;

    // Is `Confirm` button disabled
    disableConfirm?: boolean;

    // Dialog component's custom in-line styles.
    style?: React.CSSProperties;
};

type State = {
    show: boolean;
    loading: boolean;
};

/**
 * Use ConfirmationDialog component to display a list of choices, once the handler is triggered.
 */
class ConfirmationDialog extends React.Component<Props, State> {
    static defaultProps = {
        title: "Confirmation",
        message: "Are you sure you want to continue?",
        loading: <CircularProgress />
    };

    __isMounted = false;

    callbacks: ConfirmationCallbacks = {
        onAccept: noop,
        onCancel: noop
    };

    state = {
        show: false,
        loading: false
    };

    componentDidMount() {
        this.__isMounted = true;
    }

    componentWillUnmount() {
        this.__isMounted = false;
    }

    showConfirmation = (onAccept?: Function, onCancel?: Function) => {
        this.callbacks = { onAccept, onCancel };
        this.setState({ show: true });
    };

    hideConfirmation = () => {
        this.setState({ show: false });
    };

    onAccept = async () => {
        const { onAccept } = this.callbacks;
        if (typeof onAccept === "function") {
            this.setState({ loading: true });
            await onAccept();
            if (this.__isMounted) {
                this.setState({ loading: false, show: false });
            }
        }
    };

    onCancel = async () => {
        const { onCancel } = this.callbacks;
        if (typeof onCancel === "function") {
            await onCancel();
        }
    };

    render() {
        return (
            <React.Fragment>
                <Dialog
                    style={this.props.style}
                    open={this.state.show}
                    onClose={this.hideConfirmation}
                    data-testid={this.props["data-testid"]}
                >
                    {this.state.loading ? this.props.loading : null}
                    <DialogTitle>{this.props.title}</DialogTitle>
                    <DialogContent>{this.props.message}</DialogContent>
                    <DialogActions>
                        <DialogCancel onClick={this.onCancel}>Cancel</DialogCancel>
                        <DialogButton
                            data-testid="confirmationdialog-confirm-action"
                            onClick={this.onAccept}
                            disabled={this.props.disableConfirm}
                        >
                            Confirm
                        </DialogButton>
                    </DialogActions>
                </Dialog>
                {this.props.children({
                    showConfirmation: this.showConfirmation
                })}
            </React.Fragment>
        );
    }
}

export { ConfirmationDialog };
