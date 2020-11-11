import React from "react";
import { storiesOf } from "@storybook/react";
import {
    Story,
    StoryReadme,
    StorySandboxCode,
    StorySandbox,
    StorySandboxExample
} from "@webiny/storybook-utils/Story";
import readme from "./../Dialog/README.md";
import { withKnobs, boolean } from "@storybook/addon-knobs";

import {
    Dialog,
    DialogButton,
    DialogAccept,
    DialogCancel,
    DialogActions,
    DialogTitle,
    DialogContent
} from ".";

const story = storiesOf("Components/Dialog", module);
story.addDecorator(withKnobs);

story.add(
    "usage",
    () => {
        const open = boolean("Open", false);

        return (
            <Story>
                <StoryReadme>{readme}</StoryReadme>
                <StorySandbox title={"dialog"}>
                    <StorySandboxExample title={"A list with all possible options"}>
                        Toggle <code>open</code> prop via the bottom knobs.
                        <br />
                        <br />
                        Note that instead of using <code>DialogFooter.Button</code> with{" "}
                        <code>accept</code> or <code>cancel</code> prop, you can use a shorter{" "}
                        <code>DialogAccept</code> and <code>DialogCancel</code> components
                        respectively.
                        <Dialog open={open}>
                            <DialogTitle>Delete confirmation</DialogTitle>
                            <DialogContent>Are you sure you want to delete?</DialogContent>
                            <DialogActions>
                                <DialogCancel onClick={() => console.log("Cancel")}>
                                    Cancel
                                </DialogCancel>
                                <DialogAccept onClick={() => console.log("Accept")}>
                                    OK
                                </DialogAccept>
                            </DialogActions>
                        </Dialog>
                    </StorySandboxExample>
                    <StorySandboxCode>
                        {`
                    <Dialog open={${open}}>
                        <DialogTitle>
                            Delete confirmation
                        </DialogTitle>
                        <DialogBody>Are you sure you want to delete?</DialogBody>
                        <DialogFooter>
                            <DialogCancel onClick={() => console.log("Cancel")}>Cancel</DialogCancel>
                            <DialogAccept onClick={() => console.log("Accept")}>OK</DialogAccept>
                        </DialogFooter>
                    </Dialog>
                    `}
                    </StorySandboxCode>
                </StorySandbox>
            </Story>
        );
    },
    {
        info: {
            propTables: [
                Dialog,
                DialogButton,
                DialogAccept,
                DialogCancel,
                DialogActions,
                DialogTitle,
                DialogContent
            ]
        }
    }
);
