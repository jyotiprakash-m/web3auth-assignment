import type { NextPage } from 'next';
import dynamic from "next/dynamic";
import 'antd/dist/antd.css';
const App = dynamic(
  () => {
    return import("../components/App");
  },
  { ssr: false }
);

const Home: NextPage = () => {
  return <App />;
}

export default Home