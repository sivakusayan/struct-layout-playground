import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
// I know that C++ is not C. But I had so much trouble setting up
// C syntax highlighting that I gave up. Please don't make me
// look into this....
import { cpp } from "@codemirror/lang-cpp";

function Playground() {
    return (
        <>
            <h1>Playground</h1>
            <CodeMirror theme="dark" extensions={cpp()} />
        </>
    );
}

export default Playground;
