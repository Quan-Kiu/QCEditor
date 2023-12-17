import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import ReactCodeMirror, {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";

import { useEffect, useRef, useState } from "react";

type Props = ReactCodeMirrorProps;

const CodeEditor = (props: Props) => {
  const ref = useRef<ReactCodeMirrorRef>(null);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(props.value || "");

    return () => {};
  }, [props.value]);

  return (
    <div>
      <ReactCodeMirror
        ref={ref}
        className="editor-board"
        theme={tokyoNightStorm}
        {...props}
        value={value}
      />
    </div>
  );
};

export default CodeEditor;
