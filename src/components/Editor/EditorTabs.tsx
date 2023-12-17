import useFileCode, { FileData, LanguageEditor } from "@/hooks/useFIleCode";
import myLocalStorage, { PREVIEW_DEFAULT_SIZE } from "@/utils/localstorage";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { sass } from "@codemirror/lang-sass";
import { Tabs, TabsProps, notification } from "antd";
import { debounce } from "lodash";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { SOCKET_ACTION } from "../../../socketAction";
import CodeEditor from "./CodeEditor";
import { initFiles, socketUtil } from "./EditorPage";
import NewFIleModal, { AppModalRef } from "./NewFIleModal";
import PagePreview from "./Preview/PagePreview";
import { useAppContext } from "@/context/AppContext";
import { useAuthContext } from "@/context/AuthContext";

type Props = {};

const EditorTabs = (props: Props) => {
  const {
    files,
    generatorFinalCode,
    isFileExist,
    getSubFiles,
    addFile,
    removeFile,
    setFiles,
  } = useFileCode([]);
  const newFileModal = useRef<AppModalRef>(null);
  const [fileActive, setFileActive] = useState<string>(LanguageEditor.HTML);
  const [previewSize, setPreviewSize] = useState(PREVIEW_DEFAULT_SIZE);
  const [htmlContent, setHtml] = useState("");
  const [cssContent, setCss] = useState("");
  const [javascriptContent, setJavascript] = useState("");
  const [isInit, setIsInit] = useState(false);
  const [pending, startTransaction] = useTransition();
  const { setLoading } = useAppContext();
  const { data } = useAuthContext();

  useEffect(() => {
    setPreviewSize(myLocalStorage.getPreviewSize());
  }, []);

  const onEditorChange = useCallback(
    (value: string, file: FileData) => {
      const selectLang = files.find((f) => f.label == file.label) as FileData;
      try {
        selectLang.content = value;

        const finalCode = generatorFinalCode(selectLang);

        startTransaction(() => {
          switch (selectLang.lang) {
            case LanguageEditor.HTML:
              setHtml(finalCode);
              break;
            case LanguageEditor.SASS:
              setCss(finalCode);
              break;
            case LanguageEditor.JS:
              setJavascript(finalCode);
              break;
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    [files, generatorFinalCode]
  );

  useEffect(() => {
    if (isInit) {
      initFiles.files.forEach((lang) => {
        onEditorChange(lang?.content, lang);
      });

      setIsInit(false);
      setLoading(false);
    }
    return () => {};
  }, [isInit]);

  useEffect(() => {
    if (data.isLoggedIn) {
      initFiles.setEvent((files) => {
        setFiles(files);
        setIsInit(true);
      });
    }
  }, [data.isLoggedIn]);

  useEffect(() => {
    if (!!socketUtil.socket) {
      socketUtil.socket.on(
        SOCKET_ACTION.CODE_CHANGED_TO_CLIENT,
        onEditorChange
      );
      socketUtil.socket.on(SOCKET_ACTION.ADD_FILE_TO_CLIENT, addFile);

      socketUtil.socket.on(SOCKET_ACTION.DELETE_FILE_TO_CLIENT, removeFile);
    }
    return () => {
      socketUtil.socket.off(SOCKET_ACTION.CODE_CHANGED_TO_CLIENT);
      socketUtil.socket.off(SOCKET_ACTION.ADD_FILE_TO_CLIENT);
      socketUtil.socket.off(SOCKET_ACTION.DELETE_FILE_TO_CLIENT);
    };
  }, [onEditorChange, socketUtil.socket]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOnEditorChange = useCallback(
    debounce((value: string, file: FileData) => {
      file.content = value;
      socketUtil.socket.emit(
        SOCKET_ACTION.CODE_CHANGED_TO_SERVER,
        value,
        file,
        files
      );
      onEditorChange(value, file);
    }, 0),
    [files]
  );

  const getLanguage = useCallback(
    (type: LanguageEditor) => {
      switch (type) {
        case LanguageEditor.HTML:
          return html({
            autoCloseTags: true,
            selfClosingTags: true,
            extraTags: getSubFiles(LanguageEditor.HTML).reduce(
              (prev, file) => ({
                ...prev,
                [`!!${file.label.toUpperCase()}/>`]: {},
              }),
              {}
            ),
          });
        case LanguageEditor.SASS:
          return sass({ indented: true });
        case LanguageEditor.JS:
          return javascript({ typescript: true });
      }
    },
    [getSubFiles]
  );

  const editorTabs: TabsProps["items"] = files.map((language) => ({
    label: (
      <div className="flex items-center gap-2">
        <Image
          width={20}
          height={20}
          src={`/${language.lang.toLowerCase()}-file.png`}
          alt=""
        ></Image>
        <div className="truncate w-[46px] text-center align-bottom">
          {language.label}
        </div>
      </div>
    ),
    closable: !language.isMain,
    key: language.label,
    children: (
      <CodeEditor
        indentWithTab={true}
        spellCheck={true}
        value={language.content}
        key={language.lang}
        onChange={(...data) => handleOnEditorChange(data[0], language)}
        extensions={[getLanguage(language.lang)]}
      />
    ),
  }));

  const handleDeleteFile = (fileName: string) => {
    //xóa giá trị trên preview page
    handleOnEditorChange(
      "",
      files.find((file) => file.label == fileName) as FileData
    );
    //xóa file khỏi dữ liệu
    const file = files.find((file) => file.label == fileName) as FileData;
    socketUtil.socket.emit(SOCKET_ACTION.DELETE_FILE_TO_SERVER, file);
    removeFile(file);
  };

  const getSizeClassName = useCallback(() => {
    if (previewSize == 0) {
      return {
        codeEditor: `w-screen md:w-code-editor-width`,
        preview: `w-0 mt-[32px] opacity-40 bg-slate-950 [&>.page-preview>iframe]:hidden`,
      };
    }
    const previewPart = (5 * previewSize) / 100;
    const codeEditorPart = 5 - previewPart;

    return {
      codeEditor: `w-${codeEditorPart}/5`,
      preview: `w-${previewPart}/5`,
    };
  }, [previewSize]);

  const widthClassName = useMemo(() => getSizeClassName(), [getSizeClassName]);

  return (
    <div className="flex w-screen md:w-code-editor-width ">
      <div className="w-4/5 w-1/5 w-2/5 w-3/5  hidden"></div>
      <Tabs
        activeKey={fileActive}
        onChange={(key) => setFileActive(key)}
        moreIcon={null}
        className={widthClassName.codeEditor}
        items={editorTabs}
        type="editable-card"
        onEdit={(key, action) => {
          if (action == "add") {
            newFileModal.current?.open();
          } else {
            handleDeleteFile(key as string);
          }
        }}
        size="small"
      ></Tabs>
      <div className={`preview ${widthClassName.preview}`}>
        <PagePreview
          html={htmlContent}
          javascript={javascriptContent}
          css={cssContent}
          size={previewSize}
          onResize={setPreviewSize}
        ></PagePreview>
      </div>
      <NewFIleModal
        onSubmit={(data) => {
          if (isFileExist(data)) {
            notification.error({ message: "File đã tồn tại" });
            throw new Error("");
          }
          const file: FileData = {
            lang: data.lang,
            isMain: false,
            content: "",
            label: data.label,
          };
          socketUtil.socket.emit(SOCKET_ACTION.ADD_FILE_TO_SERVER, file);

          addFile(file);
          setFileActive(file.label);
        }}
        ref={newFileModal}
      />
    </div>
  );
};

export default EditorTabs;
