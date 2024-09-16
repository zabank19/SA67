import {
	Space,
	Button,
	Col,
	Row,
	Divider,
	Form,
	Input,
	Card,
	message,
	DatePicker,
	InputNumber,
	Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UsersInterface } from "../../../interfaces/IUser";
import { CreateUser } from "../../../services/https";
import { useNavigate, Link } from "react-router-dom";

function CustomerCreate() {
	const navigate = useNavigate();

	const [messageApi, contextHolder] = message.useMessage();

	const onFinish = async (values: UsersInterface) => {

		let res = await CreateUser(values);

		if (res.status == 201) {
			messageApi.open({
				type: "success",
				content: res.data.message,
			});
			setTimeout(function () {
				navigate("/customer");
			}, 2000);
		} else {
			messageApi.open({
				type: "error",
				content: res.data.error,
			});
		}
	};

	return (
		<div>
			{contextHolder}
			<Card>
				<h2>เพิ่มข้อมูล ผู้ดูแลระบบ</h2>
				<Divider />

				<Form
					name="basic"
					layout="vertical"
					onFinish={onFinish}
					autoComplete="off"
				>
					<Row gutter={[16, 0]}>
						<Col xs={24} sm={24} md={24} lg={24} xl={12}>
							<Form.Item
								label="ชื่อจริง"
								name="firstname"
								rules={[
									{
										required: true,
										message: "กรุณากรอกชื่อ !",
									},
								]}
							>
								<Input />
							</Form.Item>
						</Col>

						<Col xs={24} sm={24} md={24} lg={24} xl={12}>
							<Form.Item
								label="นามกสุล"
								name="lastname"
								rules={[
									{
										required: true,
										message: "กรุณากรอกนามสกุล !",
									},
								]}
							>
								<Input />
							</Form.Item>
						</Col>

						<Col xs={24} sm={24} md={24} lg={24} xl={12}>
							<Form.Item
								label="อีเมล"
								name="username"
								rules={[
									{
										type: "email",
										message: "รูปแบบอีเมลไม่ถูกต้อง !",
									},
									{
										required: true,
										message: "กรุณากรอกอีเมล !",
									},
								]}
							>
								<Input />
							</Form.Item>
						</Col>

						<Col xs={24} sm={24} md={24} lg={24} xl={12}>
							<Form.Item
								label="รหัสผ่าน"
								name="password"
								rules={[
									{
										required: true,
										message: "กรุณากรอกรหัสผ่าน !",
									},
								]}
							>
								<Input.Password />
							</Form.Item>
						</Col>

						<Col xs={24} sm={24} md={24} lg={24} xl={12}>
							<Form.Item
								label="วัน/เดือน/ปี เกิด"
								name="birthday"
								rules={[
									{
										required: true,
										message: "กรุณาเลือกวัน/เดือน/ปี เกิด !",
									},
								]}
							>
								<DatePicker style={{ width: "100%" }} />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={24} lg={24} xl={12}>
							<Form.Item
								label="อายุ"
								name="age"
								rules={[
									{
										required: true,
										message: "กรุณากรอกอายุ !",
									},
								]}
							>
								<InputNumber
									min={0}
									max={99}
									defaultValue={0}
									style={{ width: "100%" }}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={24} lg={24} xl={12}>
							<Form.Item
								label="เพศ"
								name="gender_id"
								rules={[
									{
										required: true,
										message: "กรุณาเลือกเพศ !",
									},
								]}
							>
								<Select
									defaultValue=""
									style={{ width: "100%" }}
									options={[
										{ value: "", label: "กรุณาเลือกเพศ", disabled: true },
										{ value: 1, label: "Male" },
										{ value: 2, label: "Female" },
									]}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Row justify="end">
						<Col style={{ marginTop: "40px" }}>
							<Form.Item>
								<Space>
									<Link to="/customer">
										<Button htmlType="button" style={{ marginRight: "10px" }}>
											ยกเลิก
										</Button>
									</Link>

									<Button
										type="primary"
										htmlType="submit"
										icon={<PlusOutlined />}
									>
										ยืนยัน
									</Button>
								</Space>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Card>
		</div>
	);
}

export default CustomerCreate;