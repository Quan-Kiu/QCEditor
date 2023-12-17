import MyLocalStorage from "@/utils/localstorage";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

type Props = {
  onResize: (value: number) => void;
  size: number;
  html: string;
  javascript: string;
  css: string;
};

export interface PagePreviewRef {
  setHtml(value: string): void;
  setCss(value: string): void;
  setJavascript(value: string): void;
}

const PagePreview = ({ size, onResize, html, javascript, css }: Props) => {
  return (
    <div className="page-preview relative">
      <div className="h-navbar-height flex justify-end bg-slate-950">
        <div className="resize-tool ">
          <select
            onChange={(e) => {
              const value = e.target.value;
              onResize(+value);
              MyLocalStorage.setPreviewSize(+value);
            }}
            value={size}
            className="bg-slate-950 text-xs outline-none h-full"
            name="size"
            id="size"
          >
            <option value="80">80%</option>
            <option value="60">60%</option>
            <option value="40">40%</option>
            <option value="20">20%</option>
            <option value="0">Tắt</option>
          </select>
        </div>
      </div>
      <iframe
        className="w-full h-preview-height overflow-y-scroll bg-white"
        srcDoc={`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
        ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
        ${javascript}
        </script>
      </body>
      </html>`}
        id="preview"
      ></iframe>
    </div>
  );
};

PagePreview.displayName = "Page Preview";

export default PagePreview;
