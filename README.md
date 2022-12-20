# web3auth - assignment


## Set Up

> STEP:1 Clone this repository by following command

```sh
$ git clone https://github.com/jyotiprakash-m/web3auth-assignment.git
$ cd web3auth-assignment
```
> STEP:2 Then install all the dependencies using below command

```sh
$ npm install 

```
> STEP:3 SignUp / Login to [web3auth.io](https://dashboard.web3auth.io/) and Create a project


> Node : For local development and integration create a project on testnet environment . For production create another project with same name on mainnet environment . Make sure you whitelist the url of production build (required) 


> STEP:4 Create .env.local file in the root folder and provide the clientId of web3auth and mongodb connection url as below

```sh
MONGO_URI="***"
NEXT_PUBLIC_CLIENT_ID="**"
NEXT_PUBLIC_RPC_TARGET ="https://rpc.ankr.com/eth"

```

> STEP:5 Now you all set . To run the application use below command

```sh
$ npm run dev

```
## Referred article

> [web3auth integration with nextjs](https://web3auth.io/docs/integration-builder?lang=next&chain=eth&customAuthentication=no&whitelabel=no&evmFramework=web3&stepIndex=0)

## Live on
I host this application on vercel.com .

> [https://web3auth-assignment.vercel.app](https://web3auth-assignment.vercel.app)