import React from 'react'
import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import RPC from "../utils/web3RPC";
import Head from 'next/head';
import { Row, Col, Typography, Button, Spin, Card, Modal, Form, Input } from 'antd';
const { Title, Text } = Typography;
import Image from 'next/image';
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID ? process.env.NEXT_PUBLIC_CLIENT_ID : "";
import axios from 'axios';
type LoggedInUserInfo = {
    name: string | undefined;
    email: string | undefined;
    image: string | undefined;
    chainId: string | undefined;
    address: string | undefined;
    privateKey: string | undefined;

};

type UserInfo = {
    name: String | undefined;
    email: String | undefined;
    age: String | undefined;
    address: String | undefined;
    mobile: String | undefined;
}

const App = () => {
    const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
    const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

    const [loggedInUserInfo, setLoggedInUserInfo] = useState<LoggedInUserInfo | undefined>(undefined)

    const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined)
    // Modal for userDetails
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onFinish = (values: any) => {
        axios.post("/api/user/register", values).then(response => {
            console.log(response.data);
        }).then(() => {
            axios.get(`/api/user/email/${loggedInUserInfo?.email}`)
                .then((response) => {
                    setUserInfo(response.data.user)
                    setIsModalOpen(false)
                }).catch(err => {
                    console.log(err);
                })
        })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        const init = async () => {
            try {
                const web3auth = new Web3Auth({
                    clientId,
                    chainConfig: { // this is ethereum chain config, change if other chain(Solana, Polygon)
                        chainNamespace: CHAIN_NAMESPACES.EIP155,
                        chainId: "0x1",
                        rpcTarget: "https://rpc.ankr.com/eth",
                    },
                });
                setWeb3auth(web3auth);

                await web3auth.initModal();
                setProvider(web3auth.provider);


            } catch (error) {
                console.error(error);
            }
        }
        init();

    }, [])

    useEffect(() => {
        getUserInfo()
    }, [provider])

    // Modal control

    useEffect(() => {
        const getUserByEmailId = async () => {
            if (loggedInUserInfo && loggedInUserInfo.email) {
                axios.get(`/api/user/email/${loggedInUserInfo?.email}`)
                    .then((response) => {
                        if (response.data.user === null) {
                            showModal()
                        } else {
                            setUserInfo(response.data.user)
                        }
                    }).catch(err => {
                        console.log(err);
                    })

            }
        }
        getUserByEmailId();
    }, [loggedInUserInfo])



    const login = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        const web3authProvider = await web3auth.connect();
        setProvider(web3authProvider);
        getUserInfo();

    };

    const getUserInfo = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        if (!provider) {
            console.log("provider not initialized yet");
            return;
        }
        // User info
        const user = await web3auth.getUserInfo();

        const rpc = new RPC(provider);
        const chainId = await rpc.getChainId();
        const address = await rpc.getAccounts();
        const balance = await rpc.getBalance();
        const privateKey = await rpc.getPrivateKey();
        const loggedInUser: LoggedInUserInfo = {
            name: user.name,
            email: user.email,
            image: user.profileImage,
            chainId: chainId,
            address: address,
            privateKey: privateKey
        }
        setLoggedInUserInfo(loggedInUser)
    };


    const logout = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        await web3auth.logout();
        setProvider(null);
    };



    const loggedInView = (
        <>
            {/* Nav bar */}
            <Row style={{ padding: "1rem", backgroundColor: "#8b9bf7" }}>
                <Col xs={12} xl={12}>
                    <Text strong style={{ fontSize: 20, color: "#f5f6ff" }} >{loggedInUserInfo?.name}</Text>
                </Col>
                <Col xs={12} xl={12}>
                    <Button onClick={logout} type="dashed" style={{ float: "right", fontWeight: 500, color: "#031788" }}>
                        Logout
                    </Button>
                </Col>
            </Row>

            {/* Cards */}
            <Row gutter={[16, 16]} style={{ padding: "1rem" }}>
                <Col xs={24} md={12} xl={6}>
                    <Card hoverable style={{ height: 150, borderColor: "#031788" }} title="Email Address" >
                        <Text >
                            {loggedInUserInfo?.email}
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} md={12} xl={6}>
                    <Card hoverable style={{ height: 150, borderColor: "#031788" }} title="Chain Id" >
                        <Text >
                            {loggedInUserInfo?.chainId}
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} md={12} xl={6}>
                    <Card hoverable style={{ height: 150, borderColor: "#031788" }} title="Address" >
                        <Text >
                            {loggedInUserInfo?.address}
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} md={12} xl={6}>
                    <Card hoverable style={{ height: 150, borderColor: "#031788" }} title="Private key" >
                        <Text >
                            {loggedInUserInfo?.privateKey}
                        </Text>
                    </Card>
                </Col>
            </Row>

            {/* Other information */}
            {
                userInfo &&

                <Row style={{ padding: "1rem" }} justify="center">
                    <Col xs={24} md={12} xl={12}>
                        <Row justify="center">
                            <Title level={3} style={{ textAlign: "center" }}>
                                Data Fetch from mongodb
                            </Title>

                        </Row>
                        <Row>
                            <Text style={{ paddingBottom: "1rem", fontSize: 20 }}><b>Name: </b>{userInfo?.name}</Text>
                        </Row>
                        <Row>
                            <Text style={{ paddingBottom: "1rem", fontSize: 20 }}><b>Email: </b>{userInfo?.email}</Text>
                        </Row>
                        <Row>
                            <Text style={{ paddingBottom: "1rem", fontSize: 20 }}><b>Phone Number: </b>{userInfo?.mobile}</Text>
                        </Row>
                        <Row>
                            <Text style={{ paddingBottom: "1rem", fontSize: 20 }}><b>Address: </b>{userInfo?.address}</Text>
                        </Row>
                        <Row>
                            <Text style={{ paddingBottom: "1rem", fontSize: 20 }}><b>Age: </b>{userInfo?.age}</Text>
                        </Row>
                    </Col>
                </Row>
            }

            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer="">
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        initialValue={loggedInUserInfo?.email}
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Name"
                        name="name"
                        initialValue={loggedInUserInfo?.name}
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Age"
                        name="age"
                        rules={[{ required: true, message: 'Please input your age!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input your address!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Phone Number"
                        name="mobile"
                        rules={[{ required: true, message: 'Please input your mobile!' }]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit" style={{ float: "right" }}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )


    const unLoggedInView = (
        <Row justify="center" style={{ paddingTop: "1rem" }}>
            <Col xs={24} md={18} xl={12}>
                <Row justify="center">
                    <Image
                        src="/web3auth.png"
                        alt="Web3Auth"
                        width={350}
                        height={90}
                    />
                </Row>

                <Row justify="center" style={{ paddingTop: "10rem" }}>
                    <Col span={24}>
                        <Row justify="center">
                            <Title level={2} style={{ textAlign: "center" }}>
                                Create or logIn to your account
                            </Title>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Row justify="center" style={{ paddingTop: "3rem" }}>
                            <Button onClick={login} type="primary" size='large' shape='round'>
                                logIn Or SignUp
                            </Button>
                        </Row>
                    </Col>

                </Row>

            </Col>
        </Row>
    );

    return (
        <>
            <Head>
                <title>web3auth demo</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Row style={{ overflowX: "hidden" }}>
                {
                    web3auth ?
                        <Col span={24}>
                            {provider ? loggedInView : unLoggedInView}
                        </Col>
                        :
                        <Col span={24}>
                            <Row justify="center" style={{ paddingTop: "20rem" }}>
                                <Spin tip="Loading" size="large" />
                            </Row>
                        </Col>
                }
            </Row>

        </>
    )
}

export default App