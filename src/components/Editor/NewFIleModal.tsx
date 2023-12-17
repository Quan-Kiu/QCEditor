import { Button, Form, Input, Select, Space } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import Popup from "reactjs-popup";
import { PopupProps } from "reactjs-popup/dist/types";
import { Rule } from "antd/es/form";
import { FileData, LanguageEditor } from "@/hooks/useFIleCode";
import MyLocalStorage from "@/utils/localstorage";

type Props = Omit<PopupProps, "children"> & {
  onSubmit: (data: FileData) => void;
};

export interface AppModalRef {
  open: () => void;
  close: () => void;
}

export const requireRule: Rule = {
  required: true,
  message: "Bắt buộc!",
};

const NewFIleModal = forwardRef(({ onSubmit, ...props }: Props, ref) => {
  const [form] = Form.useForm<FileData>();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    form.resetFields();
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      open: handleOpen,
      close: handleClose,
    }),
    []
  );

  const handleOnSubmit = async () => {
    await form.validateFields();
    try {
      onSubmit(form.getFieldsValue());
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Popup
      {...props}
      onClose={handleClose}
      closeOnDocumentClick={false}
      open={open}
    >
      <div className="bg-slate-800 border-gray-500 border text-white w-[350px] p-6">
        <h1 className="text-xl text-center mb-4">Tạo file mới</h1>
        <Form
          layout="vertical"
          labelCol={{
            className: "[&>label]:!text-white",
          }}
          form={form}
        >
          <Form.Item rules={[requireRule]} name={"lang"} label="Ngôn ngữ">
            <Select
              className="[&>div]:!rounded-none"
              placeholder="Chọn ngôn ngữ"
              options={Object.values(LanguageEditor).map((item) => ({
                value: item,
                label: item,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item rules={[requireRule]} name={"label"} label="Tên File">
            <Input className="rounded-none" placeholder="Nhập tên file"></Input>
          </Form.Item>
        </Form>
        <Space className="justify-end mt-4 w-full">
          <Button
            onClick={handleClose}
            className="bg-slate-800 text-white rounded-none"
          >
            Đóng
          </Button>
          <Button
            onClick={handleOnSubmit}
            className="bg-slate-950 text-white rounded-none"
          >
            Lưu
          </Button>
        </Space>
      </div>
    </Popup>
  );
});

NewFIleModal.displayName = "New File Modal";

export default NewFIleModal;
