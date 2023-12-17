"use client";
import { useAuthContext } from "@/context/AuthContext";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const { handleLogin, handleLogout } = useAuthContext();

  const onLogin = async () => {
    await form.validateFields();
    try {
      setLoading(true);
      handleLogin(form.getFieldValue("username"));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex flex-col justify-center items-center p-8 rounded-md bg-slate-800">
      <Form
        form={form}
        labelCol={{
          className: "[&>label]:!text-white",
        }}
        layout="vertical"
      >
        <Form.Item label="Tên người dùng" name={"username"}>
          <Input placeholder="Nhập tên người dùng"></Input>
        </Form.Item>
        <Button
          loading={loading}
          onClick={onLogin}
          type="primary"
          className="bg-slate-950"
          block
        >
          Đăng nhập
        </Button>
      </Form>
    </div>
  );
}
