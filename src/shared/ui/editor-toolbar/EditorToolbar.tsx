import React from "react";

interface ToolbarItem {
    title: string

    icon: React.ComponentType<any>

    action: () => void

    style?: React.CSSProperties
}

interface Props {
    toolbar: ToolbarItem[]
}

const EditorToolbar: React.FC<Props> = (
    {
        toolbar
    }
) => {

    return (

        <>
            {
                toolbar.map(
                    (
                        {
                            title,
                            icon: Icon,
                            action,
                            style
                        }
                    ) => (

                        <div
                            key={
                                title
                            }

                            title={
                                title
                            }

                            onClick={
                                action
                            }

                        >
                            <Icon
                                style={
                                    style
                                }
                            />
                        </div>
                    )
                )
            }
        </>
    );
};

export default EditorToolbar;