import { socketUtil } from "@/components/Editor/EditorPage";
import { isTextEqual } from "@/utils/text";
import { useCallback, useState } from "react";
import { SOCKET_ACTION } from "../../socketAction";
export enum LanguageEditor {
  JS = "Javascript",
  SASS = "SASS",
  HTML = "HTML",
}

export interface FileData {
  lang: LanguageEditor;
  label: string;
  isMain?: boolean;
  content: string;
}

const useFileCode = (dataDefault: FileData[]) => {
  const [files, setFiles] = useState<FileData[]>(dataDefault);

  const getMainFile = useCallback(
    (lang: LanguageEditor) => files.find((v) => v.lang == lang && v.isMain),
    [files]
  );

  const getSubFiles = useCallback(
    (lang: LanguageEditor) => files.filter((v) => v.lang == lang && !v.isMain),
    [files]
  );

  const isFileExist = useCallback(
    (checkFile: FileData) =>
      files.some((file) => isTextEqual(file.label, checkFile.label)),
    [files]
  );

  const addFile = useCallback((newFile: FileData) => {
    setFiles((prev) => [...prev, newFile]);
  }, []);

  const removeFile = useCallback((deleteFile: FileData) => {
    setFiles((prev) =>
      prev.filter((file) => !isTextEqual(file.label, deleteFile.label))
    );
  }, []);

  /**
   * @param {FileData} file file có đoạn code thay đổi
   * @return {string} đoạn mã đã được merge file phụ + file chính
   */
  const generatorFinalCode = useCallback(
    (file: FileData) => {
      const mainFile = getMainFile(file.lang);

      let finalCode = mainFile?.content || "";

      if (mainFile) {
        const subFiles = getSubFiles(file.lang);

        //TRuong hop là HTML => replace các đoạn khai báo chèn file tại file HTML chính thành đoạn code file tương ứng
        if (mainFile.lang == LanguageEditor.HTML) {
          subFiles.forEach((tab) => {
            finalCode = finalCode.replaceAll(
              `<!!${tab.label.toUpperCase()}/>`,
              tab.content
            );
          });
        } else {
          //Các ngôn ngữ khách chỉ cần nối chuỗi
          subFiles.forEach((tab) => {
            finalCode += `\n` + tab.content;
          });
        }
      }

      finalCode = finalCode.replaceAll(/<!![\w|-]+\/>/gm, "");

      return finalCode;
    },
    [getMainFile, getSubFiles]
  );

  return {
    files,
    setFiles,
    generatorFinalCode,
    getSubFiles,
    getMainFile,
    addFile,
    removeFile,
    isFileExist,
  };
};

export default useFileCode;
