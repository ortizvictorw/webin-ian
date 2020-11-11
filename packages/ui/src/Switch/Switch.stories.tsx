import React from "react";
import { storiesOf } from "@storybook/react";
import {
    Story,
    StoryReadme,
    StorySandboxCode,
    StorySandbox,
    StorySandboxExample
} from "@webiny/storybook-utils/Story";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import readme from "./README.md";

import { Form } from "@webiny/form";
import { Switch } from "./Switch";

const story = storiesOf("Components/Switch", module);
story.addDecorator(withKnobs);

story.add(
    "usage",
    () => {
        const disabled = boolean("Disabled", false);

        return (
            <Story>
                <StoryReadme>{readme}</StoryReadme>
                <StorySandbox>
                    <StorySandboxExample title={"Simple switch with a label and description"}>
                        <Form data={{ rememberMe: true }}>
                            {({ Bind }) => (
                                <Bind name="rememberMe">
                                    <Switch
                                        label={"Remember me"}
                                        disabled={disabled}
                                        description={
                                            "You won't be logged out after you leave the app."
                                        }
                                    />
                                </Bind>
                            )}
                        </Form>
                    </StorySandboxExample>
                    <StorySandboxCode>
                        {`
                    <Form>
                        {({ Bind }) => (
                            <Bind name="rememberMe">
                                  <Switch
                                    label={"Remember me"}
                                    disabled={disabled}
                                    description={"You won't be logged out after you leave the app."}
                                />
                            </Bind>
                        )}
                    </Form>
                    `}
                    </StorySandboxCode>
                </StorySandbox>
            </Story>
        );
    },
    { info: { propTables: [Switch] } }
);
